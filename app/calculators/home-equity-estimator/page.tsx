import type { Metadata } from "next"
import dynamic from "next/dynamic"
import SEOHead from "@/components/seo-head"

const HomeEquityEstimatorCalculator = dynamic(
  () => import("@/components/calculators/home-equity-estimator-calculator"),
  {
    loading: () => <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
  }
)

export const metadata: Metadata = {
  title: "Home Equity Estimator Calculator | HELOC360",
  description:
    "Calculate your home equity and potential HELOC borrowing power. Get instant estimates based on your home value, mortgage balance, and loan-to-value ratios.",
  keywords:
    "home equity calculator, HELOC calculator, home value estimator, loan to value calculator, equity calculator",
  openGraph: {
    title: "Home Equity Estimator Calculator | HELOC360",
    description:
      "Calculate your home equity and potential HELOC borrowing power. Get instant estimates based on your home value, mortgage balance, and loan-to-value ratios.",
    type: "website",
  },
}

export default function HomeEquityEstimatorPage() {
  return (
    <>
      <SEOHead
        title="Home Equity Estimator Calculator | HELOC360"
        description="Calculate your home equity and potential HELOC borrowing power. Get instant estimates based on your home value, mortgage balance, and loan-to-value ratios."
        keywords="home equity calculator, HELOC calculator, home value estimator, loan to value calculator, equity calculator"
      />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Home Equity Estimator</h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Calculate your current home equity and discover how much you could potentially borrow with a HELOC. Get
                instant estimates based on your home's current value and existing mortgage balance.
              </p>
            </div>

            {/* Calculator */}
            <HomeEquityEstimatorCalculator />

            {/* Educational Content */}
            <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Home Equity</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">What is Home Equity?</h3>
                  <p className="text-gray-600 mb-4">
                    Home equity is the difference between your home's current market value and the amount you still owe
                    on your mortgage. It represents the portion of your home that you truly "own."
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">How HELOCs Work</h3>
                  <p className="text-gray-600">
                    A Home Equity Line of Credit (HELOC) allows you to borrow against your home's equity. Most lenders
                    allow you to borrow up to 80-90% of your home's value, minus your existing mortgage balance.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Benefits of Home Equity</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Access to large amounts of credit at competitive rates</li>
                    <li>• Flexible borrowing - use only what you need</li>
                    <li>• Potential tax advantages for home improvements</li>
                    <li>• Lower interest rates compared to credit cards</li>
                    <li>• Build wealth through home appreciation</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Disclaimers</h3>
              <div className="text-sm text-yellow-700 space-y-2">
                <p>
                  <strong>Estimates Only:</strong> This calculator provides estimates based on the information you
                  provide. Actual home values, equity amounts, and HELOC terms may vary significantly.
                </p>
                <p>
                  <strong>Professional Appraisal Required:</strong> Lenders require professional appraisals to determine
                  actual home value. Your estimate may differ from an appraised value.
                </p>
                <p>
                  <strong>Lending Criteria:</strong> HELOC approval depends on multiple factors including credit score,
                  income, debt-to-income ratio, and lender-specific requirements.
                </p>
                <p>
                  <strong>Market Fluctuations:</strong> Home values can fluctuate due to market conditions, local
                  factors, and economic changes, affecting your actual equity.
                </p>
                <p>
                  <strong>Risk Warning:</strong> Your home serves as collateral for a HELOC. Failure to repay could
                  result in foreclosure. Consult with financial professionals before making borrowing decisions.
                </p>
                <p>
                  <strong>Tax Implications:</strong> Consult a tax professional regarding potential tax benefits or
                  implications of home equity borrowing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
