"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts"
import { Home, DollarSign, Percent, CreditCard, AlertTriangle } from "lucide-react"

interface HomeEquityCalculations {
  homeValue: number
  mortgageBalance: number
  currentEquity: number
  equityPercentage: number
  availableCredit: number
  currentLTV: number
  afterHELOCLTV: number
  desiredLTV: number
  monthlyPaymentEstimate: number
}

interface HomeEquityResultsProps {
  calculations: HomeEquityCalculations
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatPercentage = (percentage: number) => {
  return `${percentage.toFixed(1)}%`
}

export default function HomeEquityResults({ calculations }: HomeEquityResultsProps) {
  const {
    homeValue,
    mortgageBalance,
    currentEquity,
    equityPercentage,
    availableCredit,
    currentLTV,
    afterHELOCLTV,
    desiredLTV,
    monthlyPaymentEstimate,
  } = calculations

  // Data for equity breakdown pie chart
  const equityData = [
    {
      name: "Current Equity",
      value: currentEquity,
      color: "#10b981",
    },
    {
      name: "Mortgage Balance",
      value: mortgageBalance,
      color: "#ef4444",
    },
  ]

  // Data for LTV comparison bar chart
  const ltvData = [
    {
      name: "Current LTV",
      value: currentLTV,
      color: "#3b82f6",
    },
    {
      name: "After HELOC LTV",
      value: afterHELOCLTV,
      color: "#f59e0b",
    },
    {
      name: "Maximum LTV",
      value: desiredLTV,
      color: "#ef4444",
    },
  ]

  // Data for available credit visualization
  const creditData = [
    {
      name: "Available HELOC Credit",
      value: availableCredit,
      color: "#10b981",
    },
    {
      name: "Used Equity (Mortgage)",
      value: mortgageBalance,
      color: "#ef4444",
    },
    {
      name: "Remaining Equity Buffer",
      value: Math.max(0, homeValue - mortgageBalance - availableCredit),
      color: "#6b7280",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Equity</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{formatCurrency(currentEquity)}</p>
                <p className="text-xs text-gray-500">{formatPercentage(equityPercentage)} of home value</p>
              </div>
              <Home className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available HELOC Credit</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{formatCurrency(availableCredit)}</p>
                <p className="text-xs text-gray-500">At {desiredLTV}% LTV</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current LTV Ratio</p>
                <p className="text-xl sm:text-2xl font-bold text-orange-600">{formatPercentage(currentLTV)}</p>
                <p className="text-xs text-gray-500">Mortgage vs. home value</p>
              </div>
              <Percent className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Est. Monthly Payment</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-600">
                  {formatCurrency(monthlyPaymentEstimate)}
                </p>
                <p className="text-xs text-gray-500">7% rate, 10-year term</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        {/* Equity Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Home Equity Breakdown</CardTitle>
            <p className="text-sm text-gray-600">Distribution of your home's value</p>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                equity: {
                  label: "Current Equity",
                  color: "#10b981",
                },
                mortgage: {
                  label: "Mortgage Balance",
                  color: "#ef4444",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <Pie
                    data={equityData}
                    cx="50%"
                    cy="45%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                    labelLine={false}
                    fontSize={12}
                  >
                    {equityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), ""]}
                    contentStyle={{ fontSize: "12px" }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* LTV Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Loan-to-Value Ratio Comparison</CardTitle>
            <p className="text-sm text-gray-600">Current vs. potential LTV ratios</p>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                current: {
                  label: "Current LTV",
                  color: "#3b82f6",
                },
                after: {
                  label: "After HELOC LTV",
                  color: "#f59e0b",
                },
                maximum: {
                  label: "Maximum LTV",
                  color: "#ef4444",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ltvData} margin={{ top: 20, right: 30, left: 40, bottom: 40 }}>
                  <XAxis dataKey="name" fontSize={10} angle={-45} textAnchor="end" height={60} />
                  <YAxis fontSize={10} width={60} label={{ value: "LTV %", angle: -90, position: "insideLeft" }} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value: number) => [`${value.toFixed(1)}%`, ""]}
                  />
                  <Bar dataKey="value" fill={(entry) => entry.color} radius={[4, 4, 0, 0]}>
                    {ltvData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Home Equity Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-semibold">Metric</th>
                  <th className="text-right py-2 font-semibold">Current</th>
                  <th className="text-right py-2 font-semibold">After HELOC</th>
                  <th className="text-center py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b">
                  <td className="py-3">Home Value</td>
                  <td className="text-right py-3 font-medium">{formatCurrency(homeValue)}</td>
                  <td className="text-right py-3 font-medium">{formatCurrency(homeValue)}</td>
                  <td className="text-center py-3">
                    <Badge variant="secondary">Unchanged</Badge>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Total Debt</td>
                  <td className="text-right py-3 font-medium">{formatCurrency(mortgageBalance)}</td>
                  <td className="text-right py-3 font-medium">{formatCurrency(mortgageBalance + availableCredit)}</td>
                  <td className="text-center py-3">
                    <Badge variant="outline" className="whitespace-nowrap">
                      +{formatCurrency(availableCredit)}
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Equity Remaining</td>
                  <td className="text-right py-3 font-medium">{formatCurrency(currentEquity)}</td>
                  <td className="text-right py-3 font-medium">
                    {formatCurrency(homeValue - mortgageBalance - availableCredit)}
                  </td>
                  <td className="text-center py-3">
                    <Badge variant="destructive" className="whitespace-nowrap">
                      -{formatCurrency(availableCredit)}
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">LTV Ratio</td>
                  <td className="text-right py-3 font-medium">{formatPercentage(currentLTV)}</td>
                  <td className="text-right py-3 font-medium">{formatPercentage(afterHELOCLTV)}</td>
                  <td className="text-center py-3">
                    <Badge
                      variant={afterHELOCLTV <= desiredLTV ? "default" : "destructive"}
                      className="whitespace-nowrap"
                    >
                      {afterHELOCLTV <= desiredLTV ? "Within Limits" : "Exceeds Limit"}
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      {afterHELOCLTV > 85 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              High LTV Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-orange-700 space-y-2">
              <p>
                <strong>Warning:</strong> Your loan-to-value ratio after taking a HELOC would be{" "}
                {formatPercentage(afterHELOCLTV)}, which is considered high risk.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Higher interest rates may apply</li>
                <li>Less equity cushion for market downturns</li>
                <li>Potential difficulty refinancing in the future</li>
                <li>Consider borrowing less or improving home value first</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
