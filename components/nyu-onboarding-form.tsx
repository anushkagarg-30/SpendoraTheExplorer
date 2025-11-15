'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react'
import Image from 'next/image'

interface BudgetData {
  mode?: string
  name?: string
  international?: boolean
  school?: string
  program?: string
  duration?: string
  campus?: string
  livingType?: string
  rent?: number
  roommates?: number
  neighborhood?: string
  utilities_split?: boolean
  wifi?: number
  electricity?: number
  gas?: number
  phone_provider?: string
  phone_cost?: boolean
  phone_yearly?: boolean
  cooking_per_week?: number
  eating_out_per_week?: number
  avg_meal_cost?: number
  transport_days?: number
  transport_modes?: string[]
  transport_unlimited?: boolean
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
  subtitle?: string
  component: React.ReactNode
}

export function NYUOnboardingForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<BudgetData>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('budgetData')
    if (saved) {
      setFormData(JSON.parse(saved))
    }
    const mode = localStorage.getItem('userMode')
    if (mode) {
      setFormData(prev => ({ ...prev, mode }))
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
    localStorage.setItem('budgetData', JSON.stringify(formData))
    localStorage.setItem('onboardingComplete', 'true')
    await new Promise(resolve => setTimeout(resolve, 300))
    router.push('/home')
  }

  const schools = ['Tandon', 'CAS', 'Stern', 'GSAS', 'Gallatin', 'Tisch', 'Steinhardt', 'School of Medicine', 'Other']
  const programs = ['MS Computer Science', 'MS Computer Engineering', 'BS Business', 'MS Finance', 'MS Data Science', 'Other']
  const durations = ['<3 months', '3-12 months', '>1 year']
  const livingTypes = ['Shared room', 'Private room', 'Private + attached washroom']
  const providers = ['US Mobile', 'Mint', 'Verizon', 'T-Mobile', 'Other']
  const transports = ['Subway', 'Bus', 'Uber/Taxi', 'Walk']

  const steps: Step[] = [
    {
      id: 0,
      title: 'Welcome to NYC!',
      subtitle: 'Let\'s set up your budget',
      component: (
        <div className="text-center space-y-6">
          <div className="relative w-48 h-48 mx-auto">
            <Image
              src="/college-character.jpg"
              alt="College student adventure"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground mb-2">
              {formData.mode === 'current'
                ? "You're already here! Let's explore your spending."
                : "Planning your NYC adventure? Let's budget for it!"}
            </p>
            <p className="text-sm text-muted-foreground">
              Answer a few questions to get personalized budget insights
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 1,
      title: 'Basic Profile',
      subtitle: 'Tell us about yourself',
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
            <label className="block text-sm font-semibold mb-3">International student?</label>
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
          <div>
            <label className="block text-sm font-semibold mb-2">School</label>
            <select
              value={formData.school || ''}
              onChange={(e) => updateFormData('school', e.target.value)}
              className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select school</option>
              {schools.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Program</label>
            <select
              value={formData.program || ''}
              onChange={(e) => updateFormData('program', e.target.value)}
              className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select program</option>
              {programs.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">How long in NYC?</label>
            <select
              value={formData.duration || ''}
              onChange={(e) => updateFormData('duration', e.target.value)}
              className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select duration</option>
              {durations.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Accommodation',
      subtitle: 'Where will you live?',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Living type</label>
            <select
              value={formData.livingType || ''}
              onChange={(e) => updateFormData('livingType', e.target.value)}
              className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select type</option>
              {livingTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
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
            <label className="block text-sm font-semibold mb-2">Number of roommates</label>
            <input
              type="number"
              value={formData.roommates || ''}
              onChange={(e) => updateFormData('roommates', Number(e.target.value))}
              placeholder="2"
              className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Neighborhood (optional)</label>
            <input
              type="text"
              value={formData.neighborhood || ''}
              onChange={(e) => updateFormData('neighborhood', e.target.value)}
              placeholder="e.g., Astoria, Williamsburg"
              className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Utilities',
      subtitle: 'What\'s your share?',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-3">Split utilities with roommates?</label>
            <div className="flex gap-3">
              {[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' },
              ].map((option) => (
                <button
                  key={String(option.value)}
                  onClick={() => updateFormData('utilities_split', option.value)}
                  className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all ${
                    formData.utilities_split === option.value
                      ? 'bg-primary text-white'
                      : 'bg-muted text-primary border border-primary/30'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Wi-Fi (your share) per month ($)</label>
            <input
              type="number"
              value={formData.wifi || ''}
              onChange={(e) => updateFormData('wifi', Number(e.target.value))}
              placeholder="30"
              className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Electricity (your share) per month ($)</label>
            <input
              type="number"
              value={formData.electricity || ''}
              onChange={(e) => updateFormData('electricity', Number(e.target.value))}
              placeholder="25"
              className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Gas/Heating (your share) per month ($)</label>
            <input
              type="number"
              value={formData.gas || ''}
              onChange={(e) => updateFormData('gas', Number(e.target.value))}
              placeholder="10"
              className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: 'Mobile Plan',
      subtitle: 'Stay connected',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Provider</label>
            <select
              value={formData.phone_provider || ''}
              onChange={(e) => updateFormData('phone_provider', e.target.value)}
              className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select provider</option>
              {providers.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Plan Cost</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={formData.phone_cost || ''}
                onChange={(e) => updateFormData('phone_cost', Number(e.target.value))}
                placeholder="30"
                className="flex-1 px-4 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <select
                value={formData.phone_yearly ? 'yearly' : 'monthly'}
                onChange={(e) => updateFormData('phone_yearly', e.target.value === 'yearly')}
                className="px-3 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="monthly">Per month</option>
                <option value="yearly">Per year</option>
              </select>
            </div>
            {formData.phone_cost && (
              <p className="text-xs text-muted-foreground mt-1">
                ≈ ${(formData.phone_yearly ? formData.phone_cost / 12 : formData.phone_cost).toFixed(2)}/month
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: 'Food & Groceries',
      subtitle: 'Fuel your body & mind',
      component: (
        <div className="space-y-4">
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
            <label className="block text-sm font-semibold mb-2">Meals eaten out per week</label>
            <input
              type="number"
              value={formData.eating_out_per_week || ''}
              onChange={(e) => updateFormData('eating_out_per_week', Number(e.target.value))}
              placeholder="5"
              className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Average cost per outside meal ($)</label>
            <input
              type="number"
              value={formData.avg_meal_cost || ''}
              onChange={(e) => updateFormData('avg_meal_cost', Number(e.target.value))}
              placeholder="12"
              className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {formData.cooking_per_week && formData.eating_out_per_week && (
            <div className="bg-accent/20 p-3 rounded-lg">
              <p className="text-sm text-foreground">
                💡 Monthly estimate: ${((formData.eating_out_per_week * formData.avg_meal_cost * 4) + (formData.cooking_per_week * 3 * 4)).toFixed(0)}/month for food
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 6,
      title: 'Transport',
      subtitle: 'Getting around the city',
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
            <label className="block text-sm font-semibold mb-3">Transport modes (select all that apply)</label>
            <div className="space-y-2">
              {transports.map((mode) => (
                <label key={mode} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.transport_modes?.includes(mode) || false}
                    onChange={(e) => {
                      const modes = formData.transport_modes || []
                      const updated = e.target.checked
                        ? [...modes, mode]
                        : modes.filter((m) => m !== mode)
                      updateFormData('transport_modes', updated)
                    }}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">{mode}</span>
                </label>
              ))}
            </div>
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
            <p className="text-xs text-muted-foreground mt-1">
              NYC MetroCard unlimited: $133/month
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: 'Lifestyle',
      subtitle: 'Coffee, shopping & fun',
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
          <div>
            <label className="block text-sm font-semibold mb-2">Party nights per month</label>
            <input
              type="number"
              value={formData.party_per_month || ''}
              onChange={(e) => updateFormData('party_per_month', Number(e.target.value))}
              placeholder="4"
              className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Average spending per party night ($)</label>
            <input
              type="number"
              value={formData.party_cost || ''}
              onChange={(e) => updateFormData('party_cost', Number(e.target.value))}
              placeholder="30"
              className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      ),
    },
    {
      id: 8,
      title: 'Budget Summary',
      subtitle: 'Your monthly breakdown',
      component: (
        <div className="space-y-4">
          <div className="bg-primary/10 p-4 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="font-semibold">Rent</span>
              <span>${formData.rent || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Utilities</span>
              <span>${((formData.wifi || 0) + (formData.electricity || 0) + (formData.gas || 0))}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Phone</span>
              <span>${formData.phone_yearly ? (formData.phone_cost || 0) / 12 : formData.phone_cost || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Food (eat out)</span>
              <span>${(formData.eating_out_per_week || 0) * (formData.avg_meal_cost || 0) * 4}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Coffee/Snacks</span>
              <span>${((formData.coffee_per_week || 0) * (formData.coffee_cost || 0) * 4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Shopping</span>
              <span>${formData.shopping_monthly || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Transport</span>
              <span>${formData.transport_cost || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Entertainment</span>
              <span>${(formData.party_per_month || 0) * (formData.party_cost || 0)}</span>
            </div>
            <div className="border-t-2 border-primary pt-3 flex justify-between font-bold text-lg">
              <span>Total Monthly</span>
              <span className="text-primary">
                ${(
                  (formData.rent || 0) +
                  (formData.wifi || 0) +
                  (formData.electricity || 0) +
                  (formData.gas || 0) +
                  (formData.phone_yearly ? (formData.phone_cost || 0) / 12 : formData.phone_cost || 0) +
                  ((formData.eating_out_per_week || 0) * (formData.avg_meal_cost || 0) * 4) +
                  ((formData.coffee_per_week || 0) * (formData.coffee_cost || 0) * 4) +
                  (formData.shopping_monthly || 0) +
                  (formData.transport_cost || 0) +
                  ((formData.party_per_month || 0) * (formData.party_cost || 0))
                ).toFixed(0)}
              </span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              That's approximately <span className="font-semibold text-primary">
              ${(
                ((formData.rent || 0) +
                  (formData.wifi || 0) +
                  (formData.electricity || 0) +
                  (formData.gas || 0) +
                  (formData.phone_yearly ? (formData.phone_cost || 0) / 12 : formData.phone_cost || 0) +
                  ((formData.eating_out_per_week || 0) * (formData.avg_meal_cost || 0) * 4) +
                  ((formData.coffee_per_week || 0) * (formData.coffee_cost || 0) * 4) +
                  (formData.shopping_monthly || 0) +
                  (formData.transport_cost || 0) +
                  ((formData.party_per_month || 0) * (formData.party_cost || 0))) / 30
              ).toFixed(0)}</span> per day
            </p>
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
            <h2 className="text-2xl font-bold text-primary">
              {steps[currentStep].id === 0 ? 'Welcome' : `Step ${currentStep} of ${steps.length - 1}`}
            </h2>
            <div className="text-sm text-muted-foreground">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </div>
          </div>
          <div className="w-full bg-primary/20 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
          <h3 className="text-2xl font-bold text-primary mb-1">{steps[currentStep].title}</h3>
          {steps[currentStep].subtitle && (
            <p className="text-sm text-muted-foreground mb-6">{steps[currentStep].subtitle}</p>
          )}
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
