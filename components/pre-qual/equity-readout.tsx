import { computeEquity, formatUsd } from "@/lib/pre-qual/equity"

interface EquityReadoutProps {
  homeValue: number
  mortgageBalance: number
}

export function EquityReadout({ homeValue, mortgageBalance }: EquityReadoutProps) {
  const { equity, borrowingPower } = computeEquity({ homeValue, mortgageBalance })

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-xl border border-brand-mint/40 bg-brand-mint/10 p-5"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-green mb-3">
        Your rough estimate
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-ink-500 mb-1">Equity in your home</p>
          <p className="text-2xl font-bold text-ink-900">{formatUsd(equity)}</p>
        </div>
        <div>
          <p className="text-xs text-ink-500 mb-1">Estimated borrowing power</p>
          <p className="text-2xl font-bold text-brand-green">{formatUsd(borrowingPower)}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-ink-500 leading-relaxed">
        Based on a typical 85% combined loan-to-value. Real lender caps vary —
        the advisor will firm this up on the call.
      </p>
    </div>
  )
}
