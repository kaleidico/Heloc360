"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, Calculator } from "lucide-react"
import { DebtConsolidationResults } from "./debt-consolidation-results"

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

export function DebtConsolidationCalculator() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: "1", name: "Credit Card 1", balance: 5000, interestRate: 18.99, minimumPayment: 150 },
    { id: "2", name: "Credit Card 2", balance: 3000, interestRate: 22.99, minimumPayment: 90 },
  ])
  const [helocRate, setHelocRate] = useState<number>(7.5)
  const [helocTerm, setHelocTerm] = useState<number>(10)
  const [results, setResults] = useState<CalculationResults | null>(null)

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const addDebt = () => {
    const newDebt: Debt = {
      id: Date.now().toString(),
      name: `Debt ${debts.length + 1}`,
      balance: 0,
      interestRate: 0,
      minimumPayment: 0,
    }
    setDebts([...debts, newDebt])
  }

  const removeDebt = (id: string) => {
    if (debts.length > 1) {
      setDebts(debts.filter((debt) => debt.id !== id))
    }
  }

  const updateDebt = (id: string, field: keyof Debt, value: string | number) => {
    setDebts(
      debts.map((debt) =>
        debt.id === id
          ? {
              ...debt,
              [field]: field === "name" ? value : Number.parseFloat(value.toString()) || 0,
            }
          : debt,
      ),
    )
  }

  const calculateResults = () => {
    const totalBalance = debts.reduce((sum, debt) => sum + debt.balance, 0)
    const currentTotalPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0)

    // Calculate weighted average interest rate
    const weightedRate = debts.reduce((sum, debt) => sum + debt.balance * (debt.interestRate / 100), 0) / totalBalance

    // Calculate current total interest (assuming minimum payments)
    let currentTotalInterest = 0
    let currentPayoffMonths = 0

    debts.forEach((debt) => {
      const monthlyRate = debt.interestRate / 100 / 12
      const payment = debt.minimumPayment
      const balance = debt.balance

      if (payment > balance * monthlyRate) {
        const months = Math.log(1 + (balance * monthlyRate) / payment) / Math.log(1 + monthlyRate)
        const totalPaid = payment * months
        currentTotalInterest += totalPaid - balance
        currentPayoffMonths = Math.max(currentPayoffMonths, months)
      } else {
        // Minimum payment doesn't cover interest - set high values
        currentTotalInterest += balance * 2 // Rough estimate
        currentPayoffMonths = 360 // 30 years
      }
    })

    // Calculate HELOC payment and interest
    const helocMonthlyRate = helocRate / 100 / 12
    const helocMonths = helocTerm * 12
    const helocPayment =
      (totalBalance * helocMonthlyRate * Math.pow(1 + helocMonthlyRate, helocMonths)) /
      (Math.pow(1 + helocMonthlyRate, helocMonths) - 1)

    const helocTotalInterest = helocPayment * helocMonths - totalBalance

    const calculationResults: CalculationResults = {
      currentTotalPayment,
      helocPayment,
      monthlySavings: currentTotalPayment - helocPayment,
      currentTotalInterest,
      helocTotalInterest,
      totalInterestSavings: currentTotalInterest - helocTotalInterest,
      currentPayoffMonths,
      helocPayoffMonths: helocMonths,
      payoffTimeSavings: currentPayoffMonths - helocMonths,
      debts: [...debts],
      helocRate,
      helocTerm,
    }

    setResults(calculationResults)
  }

  const totalBalance = debts.reduce((sum, debt) => sum + debt.balance, 0)
  const totalMinPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0)
  const weightedAvgRate =
    totalBalance > 0 ? debts.reduce((sum, debt) => sum + debt.balance * debt.interestRate, 0) / totalBalance : 0

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Current Debts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Current Debts
              </CardTitle>
              <CardDescription>Enter your current high-interest debts to consolidate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {debts.map((debt, index) => (
                <div key={debt.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">Debt {index + 1}</Label>
                    {debts.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDebt(debt.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <Label htmlFor={`name-${debt.id}`} className="text-sm">
                        Debt Name
                      </Label>
                      <Input
                        id={`name-${debt.id}`}
                        value={debt.name}
                        onChange={(e) => updateDebt(debt.id, "name", e.target.value)}
                        placeholder="e.g., Credit Card"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`balance-${debt.id}`} className="text-sm">
                        Balance
                      </Label>
                      <Input
                        id={`balance-${debt.id}`}
                        type="number"
                        value={debt.balance || ""}
                        onChange={(e) => updateDebt(debt.id, "balance", e.target.value)}
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`rate-${debt.id}`} className="text-sm">
                        Interest Rate (%)
                      </Label>
                      <Input
                        id={`rate-${debt.id}`}
                        type="number"
                        step="0.01"
                        value={debt.interestRate || ""}
                        onChange={(e) => updateDebt(debt.id, "interestRate", e.target.value)}
                        placeholder="0.00"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Label htmlFor={`payment-${debt.id}`} className="text-sm">
                        Minimum Payment
                      </Label>
                      <Input
                        id={`payment-${debt.id}`}
                        type="number"
                        value={debt.minimumPayment || ""}
                        onChange={(e) => updateDebt(debt.id, "minimumPayment", e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button onClick={addDebt} variant="outline" className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Another Debt
              </Button>

              {/* Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Current Debt Summary</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Total Balance</div>
                    <div className="font-semibold text-lg">{formatCurrency(totalBalance)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Total Min. Payment</div>
                    <div className="font-semibold text-lg">{formatCurrency(totalMinPayment)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Avg. Interest Rate</div>
                    <div className="font-semibold text-lg">{weightedAvgRate.toFixed(2)}%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HELOC Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>HELOC Configuration</CardTitle>
              <CardDescription>Configure your potential HELOC terms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="heloc-rate">HELOC Interest Rate (%)</Label>
                <Input
                  id="heloc-rate"
                  type="number"
                  step="0.01"
                  value={helocRate}
                  onChange={(e) => setHelocRate(Number.parseFloat(e.target.value) || 0)}
                  placeholder="7.50"
                />
                <p className="text-sm text-gray-600 mt-1">Current HELOC rates typically range from 6% to 10%</p>
              </div>

              <div>
                <Label htmlFor="heloc-term">Repayment Term</Label>
                <Select value={helocTerm.toString()} onValueChange={(value) => setHelocTerm(Number.parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 years</SelectItem>
                    <SelectItem value="10">10 years</SelectItem>
                    <SelectItem value="15">15 years</SelectItem>
                    <SelectItem value="20">20 years</SelectItem>
                    <SelectItem value="30">30 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">HELOC Benefits</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Lower interest rates than credit cards</li>
                  <li>• Potential tax-deductible interest</li>
                  <li>• Fixed monthly payment</li>
                  <li>• Simplified debt management</li>
                </ul>
              </div>

              <Button onClick={calculateResults} className="w-full" size="lg">
                Calculate Savings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="xl:sticky xl:top-4 xl:self-start">
          {results ? (
            <DebtConsolidationResults results={results} />
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center text-gray-500">
                  <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">
                    Enter your debt information and click "Calculate Savings" to see your results
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
