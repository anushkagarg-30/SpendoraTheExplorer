'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { BudgetCard } from '@/components/budget-card'
import { Compass, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface BudgetData {
  name?: string
  rent?: number
  wifi?: number
  electricity?: number
  groceries_budget?: number
  transport_cost?: number
  coffee_cost?: number
  coffee_per_week?: number
  shopping_monthly?: number
}

interface DailyLog {
  date: string
  groceries?: number
  eating_out?: number
  coffee?: number
  transport?: number
  other?: number
}

export default function HomePage() {
  const [budgetData, setBudgetData] = useState<BudgetData>({})
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load data from localStorage
    const saved = localStorage.getItem('budgetData')
    if (saved) {
      setBudgetData(JSON.parse(saved))
    }

    const logs = localStorage.getItem('dailyLogs')
    if (logs) {
      setDailyLogs(JSON.parse(logs))
    }

    setIsLoading(false)
  }, [])

  const calculateMonthlySpent = (category: keyof DailyLog) => {
    return dailyLogs.reduce((sum, log) => sum + (log[category] || 0), 0)
  }

  const monthlyGroceries = budgetData.groceries_budget || 250
  const monthlyTransport = budgetData.transport_cost || 80
  const monthlyCoffee = (budgetData.coffee_per_week || 5) * (budgetData.coffee_cost || 6) * 4
  const monthlyShopping = budgetData.shopping_monthly || 80
  const monthlyRent = budgetData.rent || 1200
  const monthlyUtilities = (budgetData.wifi || 30) + (budgetData.electricity || 25)

  const spentGroceries = calculateMonthlySpent('groceries')
  const spentEatingOut = calculateMonthlySpent('eating_out')
  const spentCoffee = calculateMonthlySpent('coffee')
  const spentTransport = calculateMonthlySpent('transport')

  const totalBudget = monthlyRent + monthlyUtilities + monthlyGroceries + monthlyCoffee + monthlyTransport + monthlyShopping
  const totalSpent = spentGroceries + spentEatingOut + spentCoffee + spentTransport

  const name = budgetData.name || 'Explorer'

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-accent/5 flex items-center justify-center">
        <Compass className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-primary/10 to-accent/5 p-4 pb-24">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="mt-4 mb-6">
            <h1 className="text-3xl font-bold text-primary mb-1">Hey, {name}!</h1>
            <p className="text-muted-foreground">Welcome to your spending dashboard</p>
          </div>

          {/* Summary Card */}
          <div className="bg-gradient-to-br from-primary to-dark-purple rounded-2xl p-6 text-white mb-6 shadow-lg">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-white/80 text-sm mb-1">Estimated Monthly Cost</p>
                <p className="text-4xl font-bold">${totalBudget.toFixed(0)}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Compass className="w-8 h-8 text-accent" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-white/70 text-xs mb-1">Daily Target</p>
                <p className="text-xl font-semibold">${(totalBudget / 30).toFixed(0)}</p>
              </div>
              <div>
                <p className="text-white/70 text-xs mb-1">Spent This Month</p>
                <p className="text-xl font-semibold">${totalSpent.toFixed(0)}</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-primary/10 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <p className="text-sm font-semibold text-foreground">Remaining This Month</p>
              </div>
              <p className={`text-xl font-bold ${totalBudget - totalSpent >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                ${Math.max(totalBudget - totalSpent, 0).toFixed(0)}
              </p>
            </div>
          </div>

          {/* Category Breakdown */}
          <h2 className="text-lg font-bold text-primary mb-4">Category Breakdown</h2>
          <div className="space-y-3 mb-6">
            <BudgetCard category="Groceries" spent={spentGroceries} budget={monthlyGroceries} icon="🛒" />
            <BudgetCard category="Eating Out" spent={spentEatingOut} budget={monthlyGroceries * 0.5} icon="🍽️" />
            <BudgetCard category="Coffee & Snacks" spent={spentCoffee} budget={monthlyCoffee} icon="☕" />
            <BudgetCard category="Transport" spent={spentTransport} budget={monthlyTransport} icon="🚕" />
            <BudgetCard category="Rent" spent={0} budget={monthlyRent} icon="🏠" />
            <BudgetCard category="Utilities" spent={0} budget={monthlyUtilities} icon="💡" />
          </div>

          {/* CTA */}
          <Link href="/today">
            <button className="w-full bg-accent text-dark-purple py-4 px-6 rounded-xl font-bold hover:bg-yellow-400 transition-all shadow-lg hover:shadow-xl text-lg">
              Log Today's Spending
            </button>
          </Link>
        </div>
      </main>
      <Navigation />
    </>
  )
}
