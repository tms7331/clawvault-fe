/**
 * Pure plan generation logic — standalone copy of the agent's allocation engine.
 * Used by the x402 advisory endpoint to generate plans without importing agent code.
 */

interface AllocationResult {
  stable: number;
  realEstateHedge: number;
  equityHedge: number;
  bondHedge: number;
  weth: number;
  cbEth: number;
}

export function parseTimeline(goal: string): number {
  const patterns = [
    /(\d+)\s*-\s*(\d+)\s*years?/i,
    /(\d+)\s*years?/i,
    /next\s*(\d+)/i,
  ];

  for (const pattern of patterns) {
    const match = goal.match(pattern);
    if (match) {
      if (match[2]) {
        return (parseInt(match[1]) + parseInt(match[2])) / 2;
      }
      return parseInt(match[1]);
    }
  }

  if (/short.?term|soon|immedia/i.test(goal)) return 1;
  if (/medium.?term/i.test(goal)) return 5;
  if (/long.?term|retire/i.test(goal)) return 15;

  return 5;
}

export function determineRiskLevel(
  years: number
): "low" | "medium" | "medium-high" | "high" {
  if (years < 2) return "low";
  if (years < 5) return "medium";
  if (years < 10) return "medium-high";
  return "high";
}

export function computeAllocation(
  years: number,
  goal: string
): AllocationResult {
  let allocation: AllocationResult;

  if (years < 2) {
    allocation = { stable: 60, realEstateHedge: 5, equityHedge: 5, bondHedge: 10, weth: 10, cbEth: 10 };
  } else if (years < 5) {
    allocation = { stable: 35, realEstateHedge: 10, equityHedge: 10, bondHedge: 10, weth: 20, cbEth: 15 };
  } else if (years < 10) {
    allocation = { stable: 20, realEstateHedge: 10, equityHedge: 15, bondHedge: 5, weth: 30, cbEth: 20 };
  } else {
    allocation = { stable: 10, realEstateHedge: 10, equityHedge: 15, bondHedge: 5, weth: 35, cbEth: 25 };
  }

  if (/house|home|real\s*estate|property|apartment|condo/i.test(goal)) {
    allocation.realEstateHedge += 10;
    allocation.stable -= 10;
  }

  if (/safe|conservat|low\s*risk|preserv/i.test(goal)) {
    allocation.bondHedge += 10;
    allocation.equityHedge -= 10;
  }

  if (/grow|aggress|high\s*return|maxim/i.test(goal)) {
    allocation.equityHedge += 10;
    allocation.stable -= 10;
  }

  for (const key of Object.keys(allocation) as (keyof AllocationResult)[]) {
    allocation[key] = Math.max(0, Math.min(100, allocation[key]));
  }

  // Normalize to ensure allocations sum to 100
  const total = Object.values(allocation).reduce((sum, v) => sum + v, 0);
  if (total !== 100 && total > 0) {
    const scale = 100 / total;
    for (const key of Object.keys(allocation) as (keyof AllocationResult)[]) {
      allocation[key] = Math.round(allocation[key] * scale);
    }
    const newTotal = Object.values(allocation).reduce((sum, v) => sum + v, 0);
    allocation.stable += 100 - newTotal;
  }

  return allocation;
}

export function generatePlan(goal: string) {
  const years = parseTimeline(goal);
  const riskLevel = determineRiskLevel(years);
  const allocation = computeAllocation(years, goal);

  const timeline =
    years < 2
      ? "< 2 years"
      : years < 5
        ? "2-5 years"
        : years < 10
          ? "5-10 years"
          : "10+ years";

  return { timeline, riskLevel, allocation, goal };
}
