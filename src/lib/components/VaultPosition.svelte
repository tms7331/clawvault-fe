<script lang="ts">
  import { formatUsdc } from "$lib/format";
  import type { DashboardData } from "$lib/data";

  let { data }: { data: DashboardData } = $props();
</script>

<div class="section">
  <div class="section-label">Vault Position</div>
  <div class="card yield-card">
    <div class="metrics-row">
      <div class="metric-box">
        <div class="label">Deposited</div>
        <div class="value">{formatUsdc(data.deposits)}</div>
        <div class="sub">USDC</div>
      </div>
      <div class="metric-box">
        <div class="label">Pending Yield</div>
        <div class="value positive">+{formatUsdc(data.pendingYield)}</div>
        <div class="sub">USDC (unharvested)</div>
      </div>
      <div class="metric-box">
        <div class="label">Total Portfolio</div>
        <div class="value">{formatUsdc(data.totalPortfolio)}</div>
        <div class="sub">USDC equivalent</div>
      </div>
    </div>
  </div>
</div>
