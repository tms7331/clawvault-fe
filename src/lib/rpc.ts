// Function selectors (precomputed keccak256 4-byte selectors)
export const SEL = {
  balanceOf: "0x70a08231",
  users: "0xa87430ba",
  pendingYield: "0xc7bf1980",
  getPrice: "0x41976e09",
  agentWallet: "0x3f6dfdbc",
  managementFeeBps: "0x3813c35a",
  annualYieldBps: "0xf3a75db9",
};

export const DEFAULTS = {
  rpc: "https://ethereum-sepolia-rpc.publicnode.com",
  usdc: "0x0e233Cb8B535dE5fB9AF47516Df02F5b0DB46EBD",
  vault: "0xfa448Bc02f6001Ec3c0433F29eD55d04d994bD76",
  router: "0x349C43fFf432059c968aE81F297136FAA0E2e342",
  rehedge: "0x14a47990A725E5Bfdb56773aF5650bd4cf6613fD",
  sphedge: "0xfEc612566550F6908A20bC39Cb548181470bfb2a",
  bondhedge: "0xa312664238ea24BEE9289629bB231d6DD1Fc982F",
};

function padAddress(addr: string): string {
  return "0x" + addr.replace("0x", "").toLowerCase().padStart(64, "0");
}

function hexToBI(hex: string): bigint {
  if (!hex || hex === "0x") return 0n;
  return BigInt(hex);
}

let rpcUrl = "";
let rpcId = 1;

export function setRpcUrl(url: string) {
  rpcUrl = url;
}

export async function rpcCall(method: string, params: any[]): Promise<any> {
  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method, params, id: rpcId++ }),
  });
  const json = await res.json();
  if (json.error)
    throw new Error(json.error.message || JSON.stringify(json.error));
  return json.result;
}

export async function ethGetBalance(addr: string): Promise<bigint> {
  const result = await rpcCall("eth_getBalance", [addr, "latest"]);
  return hexToBI(result);
}

export async function ethCall(to: string, data: string): Promise<string> {
  const result = await rpcCall("eth_call", [{ to, data }, "latest"]);
  return result;
}

export async function callBalanceOf(
  token: string,
  wallet: string
): Promise<bigint> {
  const data = SEL.balanceOf + padAddress(wallet).slice(2);
  const result = await ethCall(token, data);
  return hexToBI(result);
}

export async function callUsers(
  vault: string,
  wallet: string
): Promise<{ deposits: bigint; pendingYield: bigint; lastDripTimestamp: bigint }> {
  const data = SEL.users + padAddress(wallet).slice(2);
  const result = await ethCall(vault, data);
  const hex = result.slice(2);
  return {
    deposits: hexToBI("0x" + hex.slice(0, 64)),
    pendingYield: hexToBI("0x" + hex.slice(64, 128)),
    lastDripTimestamp: hexToBI("0x" + hex.slice(128, 192)),
  };
}

export async function callPendingYield(
  vault: string,
  wallet: string
): Promise<bigint> {
  const data = SEL.pendingYield + padAddress(wallet).slice(2);
  const result = await ethCall(vault, data);
  return hexToBI(result);
}

export async function callGetPrice(
  router: string,
  token: string
): Promise<bigint> {
  const data = SEL.getPrice + padAddress(token).slice(2);
  const result = await ethCall(router, data);
  return hexToBI(result);
}

export async function callNoArgs(
  contract: string,
  sel: string
): Promise<string> {
  const result = await ethCall(contract, sel);
  return result;
}
