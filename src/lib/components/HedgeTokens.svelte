<script lang="ts">
  import { formatHedge, formatUsdc } from "$lib/format";
  import type { DashboardData } from "$lib/data";

  let { data }: { data: DashboardData } = $props();
</script>

<div class="section">
  <div class="section-label">Hedge Token Holdings</div>
  <div class="hedge-grid">
    <div class="card hedge-card">
      <div class="token-symbol">RE-HEDGE</div>
      <div class="token-balance">{formatHedge(data.reBal)}</div>
      <div class="token-value">${formatUsdc(data.reValueUsdc)}</div>
      <div class="token-price">Price: ${formatUsdc(data.rePrice)}</div>
    </div>
    <div class="card hedge-card">
      <div class="token-symbol" style="color:var(--warning);">SP-HEDGE</div>
      <div class="token-balance">{formatHedge(data.spBal)}</div>
      <div class="token-value">${formatUsdc(data.spValueUsdc)}</div>
      <div class="token-price">Price: ${formatUsdc(data.spPrice)}</div>
    </div>
    <div class="card hedge-card">
      <div class="token-symbol" style="color:var(--bond);">BOND-HEDGE</div>
      <div class="token-balance">{formatHedge(data.bondBal)}</div>
      <div class="token-value">${formatUsdc(data.bondValueUsdc)}</div>
      <div class="token-price">Price: ${formatUsdc(data.bondPrice)}</div>
    </div>
  </div>
</div>
