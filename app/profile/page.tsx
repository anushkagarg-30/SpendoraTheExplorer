'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Edit2, LogOut, Trash2 } from 'lucide-react'

interface BudgetData {
  name?: string
  international?: boolean
  school?: string
  program?: string
  rent?: number
  wifi?: number
  electricity?: number
  groceries_budget?: number
  transport_cost?: number
  coffee_per_week?: number
  coffee_cost?: number
  shopping_monthly?: number
}

export default function ProfilePage() {
  const router = useRouter()
  const [budgetData, setBudgetData] = useState<BudgetData>({})
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('budgetData')
    if (saved) {
      setBudgetData(JSON.parse(saved))
    }
  }, [])

  const handleReset = () => {
    if (confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
      localStorage.removeItem('budgetData')
      localStorage.removeItem('dailyLogs')
      localStorage.removeItem('onboardingComplete')
      localStorage.removeItem('userMode')
      router.push('/')
    }
  }

  const handleEditSetup = () => {
    router.push('/onboarding')
  }

  const monthlyRent = budgetData.rent || 0
  const monthlyUtilities = (budgetData.wifi || 0) + (budgetData.electricity || 0)
  const monthlyGroceries = budgetData.groceries_budget || 0
  const monthlyCoffee = ((budgetData.coffee_per_week || 0) * (budgetData.coffee_cost || 0) * 4)
  const monthlyTransport = budgetData.transport_cost || 0
  const monthlyShopping = budgetData.shopping_monthly || 0

  const totalBudget =
    monthlyRent + monthlyUtilities + monthlyGroceries + monthlyCoffee + monthlyTransport + monthlyShopping

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-primary/10 to-accent/5 p-4 pb-24">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="mt-4 mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-1">Profile</h1>
              <p className="text-muted-foreground">{budgetData.name || 'Explorer'}</p>
            </div>
            <button
              onClick={handleEditSetup}
              className="p-2 rounded-lg bg-primary text-white hover:bg-dark-purple transition-all"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-primary/10 mb-6">
            <h3 className="font-semibold text-foreground mb-4">User Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-semibold text-foreground">{budgetData.name || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">International Student</p>
                <p className="font-semibold text-foreground">{budgetData.international ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">School</p>
                <p className="font-semibold text-foreground">{budgetData.school || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Budget Summary */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-primary/10 mb-6">
            <h3 className="font-semibold text-foreground mb-4">Monthly Budget Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Rent</span>
                <span className="font-semibold text-foreground">${monthlyRent.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Utilities</span>
                <span className="font-semibold text-foreground">${monthlyUtilities.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Groceries</span>
                <span className="font-semibold text-foreground">${monthlyGroceries.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Coffee & Snacks</span>
                <span className="font-semibold text-foreground">${monthlyCoffee.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Transport</span>
                <span className="font-semibold text-foreground">${monthlyTransport.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Shopping</span>
                <span className="font-semibold text-foreground">${monthlyShopping.toFixed(0)}</span>
              </div>
              <div className="border-t border-primary/20 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-primary">Total Monthly</span>
                  <span className="font-bold text-primary text-lg">${totalBudget.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleEditSetup}
              className="w-full py-3 px-4 rounded-lg font-semibold bg-primary text-white hover:bg-dark-purple transition-all flex items-center justify-center gap-2"
            >
              <Edit2 className="w-5 h-5" />
              Edit Budget Setup
            </button>
            <button
              onClick={handleReset}
              className="w-full py-3 px-4 rounded-lg font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-all flex items-center justify-center gap-2 border border-red-200"
            >
              <Trash2 className="w-5 h-5" />
              Delete All Data
            </button>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center text-xs text-muted-foreground">
            <p>Spendora the Explorer v1.0</p>
            <p>Your personal spending guide</p>
          </div>
        </div>
      </main>
      <Navigation />
    </>
  )
}
