<script lang="ts">
  let { countdown = 0 }: { countdown?: number } = $props();
</script>

<footer>
  <div class="container">
    <div>
      Powered by <a href="https://openclaw.ai" target="_blank" rel="noopener"
        >OpenClaw</a
      >
      &middot; ERC-8021 Builder Codes &middot; Ethereum Sepolia
    </div>
    {#if countdown > 0}
      <div class="refresh-timer">Auto-refresh in {countdown}s</div>
    {/if}
  </div>
</footer>
