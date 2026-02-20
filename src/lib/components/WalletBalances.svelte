<script lang="ts">
  import { formatEth, formatUsdc } from "$lib/format";
  import type { DashboardData } from "$lib/data";

  let { data }: { data: DashboardData } = $props();

  let ethUsd = $derived(
    (Number(data.ethBal) / 1e18) * 2500
  );
</script>

<div class="section">
  <div class="section-label">Wallet Balances</div>
  <div class="balances-grid">
    <div class="card balance-card">
      <div class="balance-icon eth">ETH</div>
      <div class="balance-info">
        <div class="token-name">Ether</div>
        <div class="token-amount">{formatEth(data.ethBal)}</div>
        <div class="token-usd">
          ~${ethUsd.toLocaleString("en-US", { maximumFractionDigits: 2 })}
        </div>
      </div>
    </div>
    <div class="card balance-card">
      <div class="balance-icon usdc">USDC</div>
      <div class="balance-info">
        <div class="token-name">USD Coin</div>
        <div class="token-amount">{formatUsdc(data.usdcBal)}</div>
        <div class="token-usd">${formatUsdc(data.usdcBal)}</div>
      </div>
    </div>
  </div>
</div>
