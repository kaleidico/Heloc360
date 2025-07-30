"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingDown, TrendingUp, Clock, DollarSign } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface Debt {
  id: string
  name: string
  balance: number
  interestRate: number
  minimumPayment: number
}

interface CalculationResults {
  currentTotalPayment: number
  helocPayment: number
  monthlySavings: number
  currentTotalInterest: number
  helocTotalInterest: number
  totalInterestSavings: number
  currentPayoffMonths: number
  helocPayoffMonths: number
  payoffTimeSavings: number
  debts: Debt[]
  helocRate: number
  helocTerm: number
}

interface DebtConsolidationResultsProps {
  results: CalculationResults
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658"]

export function DebtConsolidationResults({ results }: DebtConsolidationResultsProps) {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatMonths = (months: number): string => {
    const years = Math.floor(months / 12)
    const remainingMonths = Math.floor(months % 12)
    if (years === 0) return `${remainingMonths} months`
    if (remainingMonths === 0) return `${years} years`
    return `${years} years, ${remainingMonths} months`
  }

  // Chart data
  const paymentComparisonData = [
    {
      name: "Current Payments",
      amount: results.currentTotalPayment,
    },
    {
      name: "HELOC Payment",
      amount: results.helocPayment,
    },
  ]

  const debtBreakdownData = results.debts.map((debt, index) => ({
    name: debt.name,
    value: debt.balance,
    color: COLORS[index % COLORS.length],
  }))

  // Generate cumulative savings data over time
  const savingsOverTimeData = []
  const monthlySavings = results.monthlySavings
  for (let month = 1; month <= Math.min(results.helocPayoffMonths, 120); month += 6) {
    savingsOverTimeData.push({
      month,
      cumulativeSavings: monthlySavings * month,
    })
  }

  const chartConfig = {
    amount: {
      label: "Amount",
      color: "hsl(var(--chart-1))",
    },
    cumulativeSavings: {
      label: "Cumulative Savings",
      color: "hsl(var(--chart-2))",
    },
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Savings</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">{formatCurrency(results.monthlySavings)}</div>
            <p className="text-xs text-muted-foreground">
              {results.monthlySavings > 0 ? "Lower monthly payment" : "Higher monthly payment"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interest Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {formatCurrency(results.totalInterestSavings)}
            </div>
            <p className="text-xs text-muted-foreground">Over the life of the loan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payoff Time Reduction</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-blue-600">
              {results.payoffTimeSavings > 0 ? formatMonths(results.payoffTimeSavings) : "No reduction"}
            </div>
            <p className="text-xs text-muted-foreground">Faster debt freedom</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Improvement</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {(
                results.debts.reduce((sum, debt) => sum + debt.balance * debt.interestRate, 0) /
                  results.debts.reduce((sum, debt) => sum + debt.balance, 0) -
                results.helocRate
              ).toFixed(2)}
              %
            </div>
            <p className="text-xs text-muted-foreground">Average rate reduction</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        {/* Monthly Payment Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Payment Comparison</CardTitle>
            <CardDescription>Current payments vs. HELOC payment</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    fontSize={12}
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} fontSize={12} tick={{ fontSize: 12 }} />
                  <ChartTooltip
                    content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />}
                  />
                  <Bar dataKey="amount" fill="var(--color-amount)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Debt Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Debt Breakdown</CardTitle>
            <CardDescription>Distribution of your debts by balance</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={debtBreakdownData}
                    cx="50%"
                    cy="45%"
                    labelLine={false}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {debtBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    fontSize={10}
                    wrapperStyle={{ paddingTop: "5px", fontSize: "10px" }}
                    formatter={(value) => <span style={{ fontSize: "10px" }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cumulative Savings Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cumulative Savings Over Time</CardTitle>
          <CardDescription>How your monthly savings add up over the loan term</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={savingsOverTimeData} margin={{ top: 20, right: 30, left: 40, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={10} tick={{ fontSize: 10 }} height={30} />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  fontSize={10}
                  tick={{ fontSize: 10 }}
                  width={60}
                />
                <ChartTooltip
                  content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />}
                  labelFormatter={(label) => `Month ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="cumulativeSavings"
                  stroke="var(--color-cumulativeSavings)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-cumulativeSavings)", strokeWidth: 1, r: 3 }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Detailed Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detailed Comparison</CardTitle>
          <CardDescription>Side-by-side analysis of your current situation vs. HELOC consolidation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Metric</th>
                  <th className="text-left p-3 font-medium">Current Debts</th>
                  <th className="text-left p-3 font-medium">HELOC Consolidation</th>
                  <th className="text-left p-3 font-medium">Difference</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium">Monthly Payment</td>
                  <td className="p-3">{formatCurrency(results.currentTotalPayment)}</td>
                  <td className="p-3">{formatCurrency(results.helocPayment)}</td>
                  <td className="p-3">
                    <Badge
                      variant={results.monthlySavings > 0 ? "default" : "destructive"}
                      className="whitespace-nowrap"
                    >
                      {results.monthlySavings > 0 ? "-" : "+"}
                      {formatCurrency(Math.abs(results.monthlySavings))}
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Total Interest</td>
                  <td className="p-3">{formatCurrency(results.currentTotalInterest)}</td>
                  <td className="p-3">{formatCurrency(results.helocTotalInterest)}</td>
                  <td className="p-3">
                    <Badge
                      variant={results.totalInterestSavings > 0 ? "default" : "destructive"}
                      className="whitespace-nowrap"
                    >
                      {results.totalInterestSavings > 0 ? "-" : "+"}
                      {formatCurrency(Math.abs(results.totalInterestSavings))}
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Payoff Time</td>
                  <td className="p-3">{formatMonths(results.currentPayoffMonths)}</td>
                  <td className="p-3">{formatMonths(results.helocPayoffMonths)}</td>
                  <td className="p-3">
                    <Badge
                      variant={results.payoffTimeSavings > 0 ? "default" : "destructive"}
                      className="whitespace-nowrap"
                    >
                      {results.payoffTimeSavings > 0 ? "-" : "+"}
                      {formatMonths(Math.abs(results.payoffTimeSavings))}
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
