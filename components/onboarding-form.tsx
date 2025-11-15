'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface BudgetData {
  name?: string
  international?: boolean
  school?: string
  program?: string
  duration?: string
  campus?: string
  rent?: number
  roommates?: number
  neighborhood?: string
  wifi?: number
  electricity?: number
  gas?: number
  utilities_split?: boolean
  phone_provider?: string
  phone_cost?: number
  groceries_budget?: number
  cooking_per_week?: number
  eating_out_per_week?: number
  avg_meal_cost?: number
  transport_days?: number
  transport_modes?: string[]
  transport_cost?: number
  coffee_per_week?: number
  coffee_cost?: number
  shopping_monthly?: number
  party_per_month?: number
  party_cost?: number
}

interface Step {
  id: number
  title: string
  component: React.ReactNode
}

export function OnboardingForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<BudgetData>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('budgetData')
    if (saved) {
      setFormData(JSON.parse(saved))
    }
  }, [])

  const updateFormData = (field: string, value: any) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    localStorage.setItem('budgetData', JSON.stringify(updated))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    // Save to localStorage (in real app, would post to API)
    localStorage.setItem('budgetData', JSON.stringify(formData))
    localStorage.setItem('onboardingComplete', 'true')
    await new Promise(resolve => setTimeout(resolve, 300))
    router.push('/home')
  }

  const steps: Step[] = [
    {
      id: 1,
      title: 'Basic Profile',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Name (optional)</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => updateFormData('name', e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-3">Are you an international student?</label>
            <div className="flex gap-3">
              {[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' },
              ].map((option) => (
                <button
                  key={String(option.value)}
                  onClick={() => updateFormData('international', option.value)}
                  className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all ${
                    formData.international === option.value
                      ? 'bg-primary text-white'
                      : 'bg-muted text-primary border border-primary/30'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Accommodation',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Monthly Rent ($)</label>
            <input
              type="number"
              value={formData.rent || ''}
              onChange={(e) => updateFormData('rent', Number(e.target.value))}
              placeholder="1200"
              className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Number of Roommates</label>
            <input
              type="number"
              value={formData.roommates || ''}
              onChange={(e) => updateFormData('roommates', Number(e.target.value))}
              placeholder="2"
              className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Utilities',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Wi-Fi per month ($)</label>
            <input
              type="number"
              value={formData.wifi || ''}
              onChange={(e) => updateFormData('wifi', Number(e.target.value))}
              placeholder="30"
              className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Electricity per month ($)</label>
            <input
              type="number"
              value={formData.electricity || ''}
              onChange={(e) => updateFormData('electricity', Number(e.target.value))}
              placeholder="25"
              className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: 'Groceries Budget',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Monthly Groceries Budget ($)</label>
            <input
              type="number"
              value={formData.groceries_budget || ''}
              onChange={(e) => updateFormData('groceries_budget', Number(e.target.value))}
              placeholder="250"
              className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Meals cooked at home per week</label>
            <input
              type="number"
              value={formData.cooking_per_week || ''}
              onChange={(e) => updateFormData('cooking_per_week', Number(e.target.value))}
              placeholder="10"
              className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Average cost per meal outside ($)</label>
            <input
              type="number"
              value={formData.avg_meal_cost || ''}
              onChange={(e) => updateFormData('avg_meal_cost', Number(e.target.value))}
              placeholder="12"
              className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: 'Transport',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Days per week to campus</label>
            <input
              type="number"
              value={formData.transport_days || ''}
              onChange={(e) => updateFormData('transport_days', Number(e.target.value))}
              placeholder="5"
              className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Monthly Transport Budget ($)</label>
            <input
              type="number"
              value={formData.transport_cost || ''}
              onChange={(e) => updateFormData('transport_cost', Number(e.target.value))}
              placeholder="80"
              className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: 'Lifestyle',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Coffee/snacks per week</label>
            <input
              type="number"
              value={formData.coffee_per_week || ''}
              onChange={(e) => updateFormData('coffee_per_week', Number(e.target.value))}
              placeholder="5"
              className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Average coffee cost ($)</label>
            <input
              type="number"
              value={formData.coffee_cost || ''}
              onChange={(e) => updateFormData('coffee_cost', Number(e.target.value))}
              placeholder="6"
              className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Monthly shopping budget ($)</label>
            <input
              type="number"
              value={formData.shopping_monthly || ''}
              onChange={(e) => updateFormData('shopping_monthly', Number(e.target.value))}
              placeholder="80"
              className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-accent/5 p-4 pb-20">
      <div className="max-w-md mx-auto">
        {/* Progress */}
        <div className="mb-8 mt-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-primary">Step {currentStep + 1} of {steps.length}</h2>
            <div className="text-sm text-muted-foreground">{Math.round(((currentStep + 1) / steps.length) * 100)}%</div>
          </div>
          <div className="w-full bg-primary/20 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-2xl font-bold text-primary mb-6">{steps[currentStep].title}</h3>
          {steps[currentStep].component}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 bg-muted text-primary hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={currentStep === steps.length - 1 ? handleComplete : handleNext}
            disabled={isLoading}
            className="flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 bg-primary text-white hover:bg-dark-purple disabled:opacity-50 transition-all"
          >
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
            {currentStep !== steps.length - 1 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
