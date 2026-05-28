// Equity + borrowing-power calculator. Pure functions, no side effects.
// Used by the inline readout that surfaces after Step 1 validates.
//
// Borrowing power assumes 85% combined LTV — the typical max for a
// stand-alone HELOC. Real lender caps vary; this is a "rough estimate"
// number, and the spec §7 helper text already frames it as such
// ("Your best guess from Zillow or your last appraisal is fine —
// we'll firm this up later.").

const MAX_CLTV = 0.85

export interface EquityNumbers {
  equity: number
  borrowingPower: number
}

export function computeEquity({
  homeValue,
  mortgageBalance,
}: {
  homeValue: number
  mortgageBalance: number
}): EquityNumbers {
  const equity = Math.max(0, homeValue - mortgageBalance)
  const borrowingPower = Math.max(0, Math.floor(homeValue * MAX_CLTV) - mortgageBalance)
  return { equity, borrowingPower }
}

export function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}
