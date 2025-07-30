"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import HomeEquityResults from "./home-equity-results"
import { Calculator, Home, DollarSign, Percent } from "lucide-react"

interface HomeEquityData {
  homeValue: number
  mortgageBalance: number
  desiredLTV: number
}

export default function HomeEquityEstimatorCalculator() {
  const [homeData, setHomeData] = useState<HomeEquityData>({
    homeValue: 0,
    mortgageBalance: 0,
    desiredLTV: 80,
  })

  const [showResults, setShowResults] = useState(false)

  const handleInputChange = (field: keyof HomeEquityData, value: string | number) => {
    const numValue = typeof value === "string" ? Number.parseFloat(value.replace(/,/g, "")) || 0 : value
    setHomeData((prev) => ({
      ...prev,
      [field]: numValue,
    }))
  }

  const calculations = useMemo(() => {
    const { homeValue, mortgageBalance, desiredLTV } = homeData

    if (homeValue <= 0) {
      return null
    }

    // Basic calculations
    const currentEquity = homeValue - mortgageBalance
    const equityPercentage = homeValue > 0 ? (currentEquity / homeValue) * 100 : 0
    const maxLoanAmount = homeValue * (desiredLTV / 100) - mortgageBalance
    const availableCredit = Math.max(0, maxLoanAmount)

    // LTV calculations
    const currentLTV = homeValue > 0 ? (mortgageBalance / homeValue) * 100 : 0
    const afterHELOCBalance = mortgageBalance + availableCredit
    const afterHELOCLTV = homeValue > 0 ? (afterHELOCBalance / homeValue) * 100 : 0

    // Estimated monthly payment (assuming 7% rate, 10-year term for estimation)
    const estimatedRate = 0.07 / 12 // 7% annual rate
    const estimatedTermMonths = 120 // 10 years
    const monthlyPaymentEstimate =
      availableCredit > 0
        ? (availableCredit * estimatedRate * Math.pow(1 + estimatedRate, estimatedTermMonths)) /
          (Math.pow(1 + estimatedRate, estimatedTermMonths) - 1)
        : 0

    return {
      homeValue,
      mortgageBalance,
      currentEquity,
      equityPercentage,
      availableCredit,
      currentLTV,
      afterHELOCLTV,
      desiredLTV,
      monthlyPaymentEstimate,
    }
  }, [homeData])

  const handleCalculate = () => {
    if (homeData.homeValue > 0) {
      setShowResults(true)
    }
  }

  const isValid = homeData.homeValue > 0

  return (
    <div className="grid xl:grid-cols-5 gap-8">
      {/* Calculator Form */}
      <div className="xl:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Home Equity Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Home Value */}
            <div className="space-y-2">
              <Label htmlFor="homeValue" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Current Home Value
              </Label>
              <Input
                id="homeValue"
                type="number"
                placeholder="Enter your home's current value"
                value={homeData.homeValue === 0 ? "" : homeData.homeValue.toString()}
                onChange={(e) => handleInputChange("homeValue", e.target.value)}
                onBlur={(e) => handleInputChange("homeValue", e.target.value)}
                className="text-lg"
              />
              <p className="text-sm text-gray-500">
                Estimate based on recent sales, online tools, or professional appraisal
              </p>
            </div>

            {/* Mortgage Balance */}
            <div className="space-y-2">
              <Label htmlFor="mortgageBalance" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Remaining Mortgage Balance
              </Label>
              <Input
                id="mortgageBalance"
                type="number"
                placeholder="Enter your remaining mortgage balance"
                value={homeData.mortgageBalance === 0 ? "" : homeData.mortgageBalance.toString()}
                onChange={(e) => handleInputChange("mortgageBalance", e.target.value)}
                onBlur={(e) => handleInputChange("mortgageBalance", e.target.value)}
                className="text-lg"
              />
              <p className="text-sm text-gray-500">Check your latest mortgage statement for the current balance</p>
            </div>

            {/* Desired LTV */}
            <div className="space-y-2">
              <Label htmlFor="desiredLTV" className="flex items-center gap-2">
                <Percent className="h-4 w-4" />
                Maximum Loan-to-Value Ratio
              </Label>
              <Select
                value={homeData.desiredLTV.toString()}
                onValueChange={(value) => handleInputChange("desiredLTV", Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="70">70% (Conservative)</SelectItem>
                  <SelectItem value="75">75% (Moderate)</SelectItem>
                  <SelectItem value="80">80% (Standard)</SelectItem>
                  <SelectItem value="85">85% (Aggressive)</SelectItem>
                  <SelectItem value="90">90% (Maximum)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">Most lenders allow 80-90% LTV for HELOCs</p>
            </div>

            {/* Current Equity Summary */}
            {homeData.homeValue > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Quick Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Home Value:</span>
                    <span className="font-medium text-blue-900">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(homeData.homeValue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Mortgage Balance:</span>
                    <span className="font-medium text-blue-900">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(homeData.mortgageBalance)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-blue-200 pt-1">
                    <span className="text-blue-700 font-medium">Current Equity:</span>
                    <span className="font-bold text-blue-900">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(homeData.homeValue - homeData.mortgageBalance)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <Button onClick={handleCalculate} disabled={!isValid} className="w-full" size="lg">
              Calculate Home Equity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <div className="xl:col-span-3">
        {showResults && calculations ? (
          <HomeEquityResults calculations={calculations} />
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center text-gray-500">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter your home information to see equity calculations</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
