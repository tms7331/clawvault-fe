import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { generatePlan } from "$lib/plan-engine";
import { env } from "$env/dynamic/private";

// Base Sepolia USDC address
const BASE_SEPOLIA_USDC = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
const FACILITATOR_URL = "https://x402.org/facilitator";
// $0.01 USDC = 10000 base units (6 decimals)
const MAX_AMOUNT_REQUIRED = "10000";

export const POST: RequestHandler = async ({ request }) => {
  const payToAddress = env.CLAWVAULT_PAY_TO_ADDRESS || "0x0000000000000000000000000000000000000000";
  const paymentHeader = request.headers.get("X-PAYMENT");

  // If no payment header, return 402 with payment instructions
  if (!paymentHeader) {
    return json(
      {
        x402Version: 1,
        accepts: [
          {
            scheme: "exact",
            network: "eip155:84532",
            maxAmountRequired: MAX_AMOUNT_REQUIRED,
            asset: BASE_SEPOLIA_USDC,
            payTo: payToAddress,
            extra: {
              name: "ClawVault Advisory",
              description:
                "AI-generated savings plan with personalized allocation strategy",
            },
          },
        ],
      },
      { status: 402 }
    );
  }

  // Verify payment with facilitator
  let verifyResult;
  try {
    const verifyRes = await fetch(`${FACILITATOR_URL}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payment: paymentHeader,
        payTo: payToAddress,
        maxAmountRequired: MAX_AMOUNT_REQUIRED,
        asset: BASE_SEPOLIA_USDC,
        network: "eip155:84532",
      }),
    });

    if (!verifyRes.ok) {
      return json(
        { error: "Payment verification failed" },
        { status: 402 }
      );
    }

    verifyResult = await verifyRes.json();
    if (!verifyResult.valid) {
      return json(
        { error: "Invalid payment", details: verifyResult },
        { status: 402 }
      );
    }
  } catch (err: any) {
    return json(
      { error: "Payment verification error: " + err.message },
      { status: 500 }
    );
  }

  // Parse request body and generate plan
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { goal } = body;
  if (!goal || typeof goal !== "string") {
    return json(
      { error: "Missing 'goal' field in request body" },
      { status: 400 }
    );
  }

  const plan = generatePlan(goal);

  // Settle payment with facilitator (fire-and-forget)
  fetch(`${FACILITATOR_URL}/settle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      payment: paymentHeader,
      payTo: payToAddress,
      maxAmountRequired: MAX_AMOUNT_REQUIRED,
      asset: BASE_SEPOLIA_USDC,
      network: "eip155:84532",
    }),
  }).catch(() => {});

  // Track x402 revenue in Supabase (fire-and-forget)
  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY) {
    trackX402Revenue(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY).catch(() => {});
  }

  return json(plan);
};

async function trackX402Revenue(
  supabaseUrl: string,
  serviceKey: string
): Promise<void> {
  // Increment x402 revenue in bot_stats
  // Using the Supabase REST API to upsert
  const amountUsdc = Number(MAX_AMOUNT_REQUIRED) / 1e6;

  await fetch(`${supabaseUrl}/rest/v1/rpc/increment_x402_revenue`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
    body: JSON.stringify({ amount: amountUsdc }),
  });
}
