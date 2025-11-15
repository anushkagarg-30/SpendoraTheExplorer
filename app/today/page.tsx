'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { SpendingInput } from '@/components/spending-input'
import { VioletCoach } from '@/components/violet-coach'
import { CheckCircle2, AlertCircle, TrendingDown, Sparkles } from 'lucide-react'

interface DailyLog {
  date: string
  groceries?: number
  eating_out?: number
  coffee?: number
  transport?: number
  other?: number
  cooking?: boolean
}

interface BudgetData {
  groceries_budget?: number
  transport_cost?: number
  coffee_cost?: number
  coffee_per_week?: number
}

export default function TodayPage() {
  const [budgetData, setBudgetData] = useState<BudgetData>({})
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null)
  const [activeInput, setActiveInput] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null)
  const [showViolet, setShowViolet] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    // Load budget data
    const saved = localStorage.getItem('budgetData')
    if (saved) {
      setBudgetData(JSON.parse(saved))
    }

    // Load today's log
    const logs = localStorage.getItem('dailyLogs') || '[]'
    const dailyLogs = JSON.parse(logs) as DailyLog[]
    const existingLog = dailyLogs.find((log) => log.date === today)
    setTodayLog(existingLog || { date: today })

    generateSuggestions(existingLog || { date: today })
  }, [])

  const generateSuggestions = (log: DailyLog) => {
    const newSuggestions: string[] = []
    const spentEatingOut = log.eating_out || 0
    const groceriesBudget = budgetData.groceries_budget || 250

    if (spentEatingOut > groceriesBudget * 0.3 && !(log.cooking === true)) {
      newSuggestions.push('You still have groceries at home. Try cooking instead of ordering out to save money!')
    }

    const monthlyCoffee = (budgetData.coffee_per_week || 5) * (budgetData.coffee_cost || 6) * 4
    if ((log.coffee || 0) > monthlyCoffee * 0.5) {
      newSuggestions.push('Coffee spending is adding up. Consider brewing at home tomorrow!')
    }

    setSuggestions(newSuggestions)
  }

  const handleSpendingUpdate = (category: string, amount: number) => {
    const updated: DailyLog = {
      ...todayLog,
      date: today,
      [category]: amount,
    }
    setTodayLog(updated)
    generateSuggestions(updated)

    // Save to localStorage
    const logs = localStorage.getItem('dailyLogs') || '[]'
    let dailyLogs = JSON.parse(logs) as DailyLog[]
    const index = dailyLogs.findIndex((log) => log.date === today)
    if (index >= 0) {
      dailyLogs[index] = updated
    } else {
      dailyLogs.push(updated)
    }
    localStorage.setItem('dailyLogs', JSON.stringify(dailyLogs))
    setActiveInput(null)
  }

  const generateAISuggestion = async () => {
    if (!todayLog) return

    try {
      const logs = localStorage.getItem('dailyLogs') || '[]'
      const dailyLogs = JSON.parse(logs) as DailyLog[]
      const totalSpent = dailyLogs.reduce((sum, log) => {
        return sum + (log.groceries || 0) + (log.eating_out || 0) + (log.coffee || 0) + (log.transport || 0) + (log.other || 0)
      }, 0)

      const today = new Date()
      const daysPassed = today.getDate()
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
      const daysRemaining = daysInMonth - daysPassed

      const groceriesSpent = dailyLogs.reduce((sum, log) => sum + (log.groceries || 0), 0)
      const eatingOutSpent = dailyLogs.reduce((sum, log) => sum + (log.eating_out || 0), 0)
      const coffeeSpent = dailyLogs.reduce((sum, log) => sum + (log.coffee || 0), 0)
      const transportSpent = dailyLogs.reduce((sum, log) => sum + (log.transport || 0), 0)

      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userMessage: "Based on my spending today and remaining budget, give me one specific actionable suggestion for the rest of the week to stay on track.",
          profile: budgetData,
          budgets: budgetData,
          monthStats: {
            totalSpent,
            daysPassed,
            daysRemaining,
            groceriesSpent,
            eatingOutSpent,
            coffeeSpent,
            transportSpent,
            shoppingSpent: 0,
          },
        }),
      })

      const data = await response.json()
      setAiSuggestion(data.reply || null)
    } catch (error) {
      console.error('Error generating AI suggestion:', error)
    }
  }

  const handleFinishDay = async () => {
    if (todayLog) {
      const logs = localStorage.getItem('dailyLogs') || '[]'
      let dailyLogs = JSON.parse(logs) as DailyLog[]
      const index = dailyLogs.findIndex((log) => log.date === today)
      if (index >= 0) {
        dailyLogs[index] = { ...todayLog, cooking: true }
      } else {
        dailyLogs.push({ ...todayLog, cooking: true })
      }
      localStorage.setItem('dailyLogs', JSON.stringify(dailyLogs))
      
      // Generate AI suggestion
      await generateAISuggestion()
    }
  }

  const dailyTarget = 50
  const todaySpent = (todayLog?.groceries || 0) + (todayLog?.eating_out || 0) + (todayLog?.coffee || 0) + (todayLog?.transport || 0)
  const remaining = Math.max(dailyTarget - todaySpent, 0)

  const spendingCategories = [
    { key: 'groceries', label: 'Groceries', icon: '🛒', color: 'from-green-400 to-green-600' },
    { key: 'eating_out', label: 'Eating Out', icon: '🍽️', color: 'from-red-400 to-red-600' },
    { key: 'coffee', label: 'Coffee & Snacks', icon: '☕', color: 'from-amber-400 to-amber-600' },
    { key: 'transport', label: 'Transport', icon: '🚕', color: 'from-blue-400 to-blue-600' },
  ]

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-primary/10 to-accent/5 p-4 pb-24">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="mt-4 mb-6">
            <h1 className="text-3xl font-bold text-primary mb-1">Today's Spending</h1>
            <p className="text-muted-foreground">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Daily Target Card */}
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-6 mb-6 border-2 border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Daily Target</p>
                <p className="text-3xl font-bold text-primary">${dailyTarget.toFixed(0)}</p>
              </div>
              <TrendingDown className="w-12 h-12 text-accent" />
            </div>
            <div className="bg-white/50 rounded-lg p-3">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-foreground">Spent: ${todaySpent.toFixed(2)}</span>
                <span className={`font-bold ${remaining > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  ${remaining.toFixed(2)} left
                </span>
              </div>
              <div className="w-full bg-primary/20 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${todaySpent > dailyTarget ? 'bg-red-500' : 'bg-primary'}`}
                  style={{ width: `${Math.min((todaySpent / dailyTarget) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Spending Categories */}
          <h2 className="text-lg font-bold text-primary mb-4">Log Your Spending</h2>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {spendingCategories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveInput(cat.key)}
                className={`p-4 rounded-xl font-semibold transition-all flex flex-col items-center gap-2 ${
                  todayLog?.[cat.key as keyof DailyLog]
                    ? 'bg-white border-2 border-primary shadow-md'
                    : 'bg-white/50 border-2 border-primary/20 hover:border-primary/40'
                }`}
              >
                <div className="text-3xl">{cat.icon}</div>
                <div className="text-sm text-foreground">{cat.label}</div>
                {todayLog?.[cat.key as keyof DailyLog] && (
                  <div className="text-lg font-bold text-primary">${Number(todayLog[cat.key as keyof DailyLog]).toFixed(2)}</div>
                )}
              </button>
            ))}
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-3 mb-6">
              {suggestions.map((suggestion, idx) => (
                <div key={idx} className="bg-amber-50 border-l-4 border-accent rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{suggestion}</p>
                </div>
              ))}
            </div>
          )}

          {/* AI Suggestion from Violet */}
          {aiSuggestion && (
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/30 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-primary mb-1">AI Suggestion from Violet:</p>
                  <p className="text-sm text-foreground">{aiSuggestion}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <button
                onClick={() => setActiveInput('other')}
                className="flex-1 py-3 px-4 rounded-lg font-semibold bg-muted text-primary hover:bg-primary/20 transition-all"
              >
                Other Expenses
              </button>
              <button
                onClick={handleFinishDay}
                className="flex-1 py-3 px-4 rounded-lg font-semibold bg-primary text-white hover:bg-dark-purple transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Finish Day
              </button>
            </div>
            
            {/* Ask Violet Button */}
            <button
              onClick={() => setShowViolet(true)}
              className="w-full py-3 px-4 rounded-lg font-semibold bg-gradient-to-r from-primary to-dark-purple text-white hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Ask Violet
            </button>
          </div>
        </div>
      </main>

      {activeInput && (
        <SpendingInput
          category={spendingCategories.find((c) => c.key === activeInput)?.label || 'Other'}
          icon={spendingCategories.find((c) => c.key === activeInput)?.icon || '💰'}
          onSave={(amount) => handleSpendingUpdate(activeInput, amount)}
          onClose={() => setActiveInput(null)}
        />
      )}

      {showViolet && (
        <VioletCoach
          onClose={() => setShowViolet(false)}
          profile={budgetData}
          budgets={budgetData}
          monthStats={{
            totalSpent: (todayLog?.groceries || 0) + (todayLog?.eating_out || 0) + (todayLog?.coffee || 0) + (todayLog?.transport || 0),
            daysPassed: new Date().getDate(),
            daysRemaining: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate(),
            groceriesSpent: todayLog?.groceries || 0,
            eatingOutSpent: todayLog?.eating_out || 0,
            coffeeSpent: todayLog?.coffee || 0,
            transportSpent: todayLog?.transport || 0,
            shoppingSpent: 0,
          }}
        />
      )}

      <Navigation />
    </>
  )
}
