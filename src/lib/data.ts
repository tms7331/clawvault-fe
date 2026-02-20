import {
  SEL,
  ethGetBalance,
  callBalanceOf,
  callUsers,
  callPendingYield,
  callGetPrice,
  callNoArgs,
} from "./rpc";

export interface DashboardParams {
  wallet: string;
  rpc: string;
  usdc: string;
  vault: string;
  router: string;
  rehedge: string;
  sphedge: string;
  bondhedge: string;
}

export interface DashboardData {
  ethBal: bigint;
  usdcBal: bigint;
  deposits: bigint;
  pendingYield: bigint;
  reBal: bigint;
  spBal: bigint;
  bondBal: bigint;
  rePrice: bigint;
  spPrice: bigint;
  bondPrice: bigint;
  reValueUsdc: bigint;
  spValueUsdc: bigint;
  bondValueUsdc: bigint;
  totalHedgeUsdc: bigint;
  totalPortfolio: bigint;
  agentAddr: string;
  feeBps: number;
  yieldBps: number;
  vaultUsdcBal: bigint;
}

export interface BotStats {
  total_compute_cost: number;
  total_gas_cost: number;
  total_revenue: number;
  net_balance: number;
  is_self_sustaining: boolean;
  autonomous_actions: number;
  transactions_executed: number;
}

function hexToBI(hex: string): bigint {
  if (!hex || hex === "0x") return 0n;
  return BigInt(hex);
}

export async function fetchAllData(
  params: DashboardParams
): Promise<DashboardData> {
  const w = params.wallet;

  const [
    ethBal,
    usdcBal,
    userInfo,
    pendingYieldVal,
    reBal,
    spBal,
    bondBal,
    rePrice,
    spPrice,
    bondPrice,
    agentWalletHex,
    feeBpsHex,
    yieldBpsHex,
    vaultUsdcBal,
  ] = await Promise.all([
    ethGetBalance(w),
    callBalanceOf(params.usdc, w),
    callUsers(params.vault, w),
    callPendingYield(params.vault, w),
    callBalanceOf(params.rehedge, w),
    callBalanceOf(params.sphedge, w),
    callBalanceOf(params.bondhedge, w),
    callGetPrice(params.router, params.rehedge),
    callGetPrice(params.router, params.sphedge),
    callGetPrice(params.router, params.bondhedge),
    callNoArgs(params.vault, SEL.agentWallet),
    callNoArgs(params.vault, SEL.managementFeeBps),
    callNoArgs(params.vault, SEL.annualYieldBps),
    callBalanceOf(params.usdc, params.vault),
  ]);

  const reValueUsdc = (reBal * rePrice) / 10n ** 18n;
  const spValueUsdc = (spBal * spPrice) / 10n ** 18n;
  const bondValueUsdc = (bondBal * bondPrice) / 10n ** 18n;

  const totalHedgeUsdc = reValueUsdc + spValueUsdc + bondValueUsdc;
  const totalPortfolio =
    userInfo.deposits + pendingYieldVal + totalHedgeUsdc + usdcBal;

  const agentAddr = "0x" + agentWalletHex.slice(26);
  const feeBps = Number(hexToBI(feeBpsHex));
  const yieldBps = Number(hexToBI(yieldBpsHex));

  return {
    ethBal,
    usdcBal,
    deposits: userInfo.deposits,
    pendingYield: pendingYieldVal,
    reBal,
    spBal,
    bondBal,
    rePrice,
    spPrice,
    bondPrice,
    reValueUsdc,
    spValueUsdc,
    bondValueUsdc,
    totalHedgeUsdc,
    totalPortfolio,
    agentAddr,
    feeBps,
    yieldBps,
    vaultUsdcBal,
  };
}

export async function fetchBotStats(
  agentAddress: string,
  supabaseUrl: string,
  supabaseAnonKey: string
): Promise<BotStats | null> {
  if (!supabaseUrl || !supabaseAnonKey || !agentAddress) return null;
  try {
    const res = await fetch(
      supabaseUrl +
        "/rest/v1/bot_stats?agent_address=eq." +
        encodeURIComponent(agentAddress) +
        "&select=*",
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: "Bearer " + supabaseAnonKey,
        },
      }
    );
    if (!res.ok) return null;
    const rows = await res.json();
    return rows.length > 0 ? rows[0] : null;
  } catch {
    return null;
  }
}
