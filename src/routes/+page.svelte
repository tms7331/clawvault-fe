<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { DEFAULTS, setRpcUrl } from "$lib/rpc";
  import { fetchAllData, fetchBotStats, type DashboardData, type BotStats } from "$lib/data";
  import Header from "$lib/components/Header.svelte";
  import Landing from "$lib/components/Landing.svelte";
  import VaultPosition from "$lib/components/VaultPosition.svelte";
  import WalletBalances from "$lib/components/WalletBalances.svelte";
  import HedgeTokens from "$lib/components/HedgeTokens.svelte";
  import BotPerformance from "$lib/components/BotPerformance.svelte";
  import VaultParameters from "$lib/components/VaultParameters.svelte";
  import Footer from "$lib/components/Footer.svelte";

  const SUPABASE_URL = "https://omvxhyfxqktwydkgtxgn.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_AHsWx19RSGRYuK8YvucYrw_p-IG6vcL";
  const REFRESH_SEC = 30;

  // State
  let state: "landing" | "loading" | "dashboard" = $state("landing");
  let data: DashboardData | null = $state(null);
  let botStats: BotStats | null = $state(null);
  let hasError = $state(false);
  let errorMessage = $state("");
  let countdown = $state(REFRESH_SEC);

  function getParams() {
    const p = page.url.searchParams;
    return {
      wallet: p.get("wallet") || "",
      rpc: p.get("rpc") || DEFAULTS.rpc,
      usdc: p.get("usdc") || DEFAULTS.usdc,
      vault: p.get("vault") || DEFAULTS.vault,
      router: p.get("router") || DEFAULTS.router,
      rehedge: p.get("rehedge") || DEFAULTS.rehedge,
      sphedge: p.get("sphedge") || DEFAULTS.sphedge,
      bondhedge: p.get("bondhedge") || DEFAULTS.bondhedge,
    };
  }

  let params = $derived(getParams());

  async function refresh() {
    if (!params.wallet) return;
    try {
      data = await fetchAllData(params);
      hasError = false;
      fetchBotStats(params.wallet, SUPABASE_URL, SUPABASE_ANON_KEY).then(
        (s) => {
          if (s) botStats = s;
        }
      );
    } catch (err: any) {
      console.warn("Refresh failed:", err);
      hasError = true;
    }
  }

  onMount(() => {
    if (!params.wallet) {
      state = "landing";
      return;
    }

    state = "loading";
    setRpcUrl(params.rpc);

    fetchAllData(params)
      .then((d) => {
        data = d;
        state = "dashboard";
        fetchBotStats(params.wallet, SUPABASE_URL, SUPABASE_ANON_KEY).then(
          (s) => {
            if (s) botStats = s;
          }
        );
      })
      .catch((err: any) => {
        hasError = true;
        errorMessage = "Failed to read from chain: " + err.message;
      });

    const interval = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        countdown = REFRESH_SEC;
        refresh();
      }
    }, 1000);

    return () => clearInterval(interval);
  });
</script>

<Header {hasError} wallet={params.wallet} />

<main class="container">
  {#if state === "landing"}
    <Landing />
  {:else if state === "loading"}
    <div class="loading-overlay">
      <div class="spinner"></div>
      <div class="loading-text">Reading onchain data...</div>
      {#if errorMessage}
        <div class="error-text">{errorMessage}</div>
      {/if}
    </div>
  {:else if state === "dashboard" && data}
    <VaultPosition {data} />
    <WalletBalances {data} />
    <HedgeTokens {data} />
    {#if botStats}
      <BotPerformance stats={botStats} />
    {/if}
    <VaultParameters {data} />
  {/if}
</main>

<Footer countdown={state === "dashboard" ? countdown : 0} />
