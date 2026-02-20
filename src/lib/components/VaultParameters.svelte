<script lang="ts">
  import { formatUsdc, truncAddr } from "$lib/format";
  import type { DashboardData } from "$lib/data";

  let { data }: { data: DashboardData } = $props();
</script>

<div class="section">
  <div class="section-label">Vault Parameters</div>
  <div class="card">
    <div class="vault-info">
      <div class="vault-stat">
        <div class="label">Annual Yield</div>
        <div class="value positive">{(data.yieldBps / 100).toFixed(1)}%</div>
      </div>
      <div class="vault-stat">
        <div class="label">Management Fee</div>
        <div class="value">{(data.feeBps / 100).toFixed(1)}%</div>
      </div>
      <div class="vault-stat">
        <div class="label">Agent Wallet</div>
        <div class="value" style="font-size:0.8rem;">
          <a
            class="hash-link"
            href="https://sepolia.etherscan.io/address/{data.agentAddr}"
            target="_blank"
            rel="noopener">{truncAddr(data.agentAddr)}</a
          >
        </div>
      </div>
      <div class="vault-stat">
        <div class="label">Vault USDC Balance</div>
        <div class="value">{formatUsdc(data.vaultUsdcBal)}</div>
      </div>
    </div>
  </div>
</div>
