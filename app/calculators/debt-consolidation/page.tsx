import type { Metadata } from "next"
import { DebtConsolidationCalculator } from "@/components/calculators/debt-consolidation-calculator"
import SEOHead from "@/components/seo-head"

export const metadata: Metadata = {
  title: "Debt Consolidation Savings Calculator | HELOC360",
  description:
    "Calculate potential savings by consolidating high-interest debt with a HELOC. See monthly payment reductions and total interest savings over time.",
  keywords: "debt consolidation calculator, HELOC savings, debt payoff calculator, interest savings",
}

export default function DebtConsolidationCalculatorPage() {
  return (
    <>
      <SEOHead
        title="Debt Consolidation Savings Calculator"
        description="Calculate potential savings by consolidating high-interest debt with a HELOC. See monthly payment reductions and total interest savings over time."
        canonical="/calculators/debt-consolidation"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Debt Consolidation Savings Calculator</h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                See how much you could save by consolidating high-interest debt with a HELOC
              </p>
              <div className="bg-blue-800/30 rounded-lg p-6 text-left max-w-2xl mx-auto">
                <h3 className="font-semibold mb-3">Calculate Your Potential Savings:</h3>
                <ul className="space-y-2 text-blue-100">
                  <li>• Monthly payment reduction</li>
                  <li>• Total interest savings over time</li>
                  <li>• Payoff timeline comparison</li>
                  <li>• Visual charts showing your savings</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <DebtConsolidationCalculator />
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="bg-gray-100 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Important Disclaimers</h2>
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="prose max-w-none">
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Educational Tool Only:</strong> This calculator is for educational purposes and provides
                    estimates only. Actual results may vary based on your specific financial situation, credit profile,
                    and market conditions.
                  </p>

                  <p className="text-sm text-gray-600 mb-4">
                    <strong>HELOC Risks:</strong> Your home serves as collateral for a HELOC. Failure to repay could
                    result in foreclosure. Interest rates are typically variable and may increase over time, affecting
                    your monthly payments.
                  </p>

                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Tax Considerations:</strong> HELOC interest may be tax-deductible if funds are used to buy,
                    build, or substantially improve your home. Consult a tax professional for advice specific to your
                    situation.
                  </p>

                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Additional Costs:</strong> HELOCs may include closing costs, annual fees, early termination
                    fees, and other charges not reflected in this calculator. These costs can affect your overall
                    savings.
                  </p>

                  <p className="text-sm text-gray-600">
                    <strong>Professional Advice:</strong> Consider consulting with a financial advisor or tax
                    professional before making debt consolidation decisions. This calculator does not constitute
                    financial advice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
