<script lang="ts">
  import { truncAddr } from "$lib/format";

  let { hasError = false, wallet = "" }: { hasError?: boolean; wallet?: string } = $props();
</script>

<header>
  <div class="container header-inner">
    <div class="header-title">
      <div class="dot" class:error={hasError}></div>
      <h1>ClawVault</h1>
    </div>
    {#if wallet}
      <div class="agent-address">
        Viewing: <a
          class="hash-link"
          href="https://sepolia.etherscan.io/address/{wallet}"
          target="_blank"
          rel="noopener">{truncAddr(wallet)}</a
        >
      </div>
    {/if}
  </div>
</header>
