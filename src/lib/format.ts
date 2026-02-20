export function formatUsdc(raw: bigint): string {
  const n = Number(raw) / 1e6;
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatEth(wei: bigint): string {
  const whole = wei / 10n ** 18n;
  const frac = wei % 10n ** 18n;
  return whole.toString() + "." + frac.toString().padStart(18, "0").slice(0, 6);
}

export function formatHedge(raw: bigint): string {
  const n = Number(raw) / 1e18;
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

export function truncAddr(addr: string): string {
  if (!addr || addr.length < 12) return addr || "--";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}
