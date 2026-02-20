<script lang="ts">
  import type { BotStats } from "$lib/data";

  let { stats }: { stats: BotStats } = $props();

  let net = $derived(Number(stats.net_balance));
</script>

<div class="section">
  <div class="section-label">Bot Performance</div>
  <div class="card">
    <div class="perf-grid">
      <div class="perf-card">
        <div class="label">Compute Costs</div>
        <div class="value">${Number(stats.total_compute_cost).toFixed(4)}</div>
        <div class="sub">USD</div>
      </div>
      <div class="perf-card">
        <div class="label">Gas Costs</div>
        <div class="value">${Number(stats.total_gas_cost).toFixed(4)}</div>
        <div class="sub">USD</div>
      </div>
      <div class="perf-card">
        <div class="label">Total Revenue</div>
        <div class="value positive">${Number(stats.total_revenue).toFixed(4)}</div>
        <div class="sub">USD</div>
      </div>
      <div class="perf-card">
        <div class="label">Net Balance</div>
        <div class="value" class:positive={net >= 0} class:negative={net < 0}>
          {net >= 0 ? "+$" : "-$"}{Math.abs(net).toFixed(4)}
        </div>
        <div class="sub">Revenue - Costs</div>
      </div>
      <div class="perf-card">
        <div class="label">Self-Sustaining</div>
        <div class="value">
          {#if stats.is_self_sustaining}
            <span class="sustainability-badge yes">YES</span>
          {:else}
            <span class="sustainability-badge no">NO</span>
          {/if}
        </div>
      </div>
      <div class="perf-card">
        <div class="label">Autonomous Actions</div>
        <div class="value">{stats.autonomous_actions || 0}</div>
        <div class="sub">{stats.transactions_executed || 0} txs executed</div>
      </div>
    </div>
  </div>
</div>
