<script lang="ts">
  import { DEFAULTS } from "$lib/rpc";

  let walletInput = $state("");
  let showConfig = $state(false);
  let cfgRpc = $state("");
  let cfgUsdc = $state("");
  let cfgVault = $state("");
  let cfgRouter = $state("");
  let cfgRehedge = $state("");
  let cfgSphedge = $state("");
  let cfgBondhedge = $state("");

  function navigateToWallet() {
    const wallet = walletInput.trim();
    if (!wallet || !wallet.startsWith("0x")) {
      alert("Please enter a valid wallet address starting with 0x");
      return;
    }
    const p = new URLSearchParams();
    p.set("wallet", wallet);

    const fields: [string, string][] = [
      ["rpc", cfgRpc],
      ["usdc", cfgUsdc],
      ["vault", cfgVault],
      ["router", cfgRouter],
      ["rehedge", cfgRehedge],
      ["sphedge", cfgSphedge],
      ["bondhedge", cfgBondhedge],
    ];
    for (const [key, val] of fields) {
      if (val.trim()) p.set(key, val.trim());
    }

    window.location.search = p.toString();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") navigateToWallet();
  }
</script>

<div class="landing">
  <h2>Portfolio Tracker</h2>
  <p>
    Enter your wallet address to view your ClawVault portfolio, vault deposits,
    hedge token holdings, and pending yield - all read directly from the
    blockchain.
  </p>
  <div class="landing-form">
    <input
      type="text"
      bind:value={walletInput}
      placeholder="0x... wallet address"
      spellcheck="false"
      onkeydown={handleKeydown}
    />
    <button onclick={navigateToWallet}>View Portfolio</button>
  </div>
  <div class="landing-hint">
    Or pass via URL: <code>?wallet=0x...&rpc=http://127.0.0.1:8545</code>
  </div>
  <div
    class="config-toggle"
    role="button"
    tabindex="0"
    onclick={() => (showConfig = !showConfig)}
    onkeydown={(e) => e.key === "Enter" && (showConfig = !showConfig)}
  >
    Advanced: Configure contract addresses
  </div>
  {#if showConfig}
    <div class="config-panel show">
      <label>RPC URL</label>
      <input type="text" bind:value={cfgRpc} placeholder={DEFAULTS.rpc} />
      <label>USDC Address</label>
      <input type="text" bind:value={cfgUsdc} placeholder="0x..." />
      <label>ClawVault Address</label>
      <input type="text" bind:value={cfgVault} placeholder="0x..." />
      <label>HedgeRouter Address</label>
      <input type="text" bind:value={cfgRouter} placeholder="0x..." />
      <label>RE-HEDGE Address</label>
      <input type="text" bind:value={cfgRehedge} placeholder="0x..." />
      <label>SP-HEDGE Address</label>
      <input type="text" bind:value={cfgSphedge} placeholder="0x..." />
      <label>BOND-HEDGE Address</label>
      <input type="text" bind:value={cfgBondhedge} placeholder="0x..." />
    </div>
  {/if}
</div>
