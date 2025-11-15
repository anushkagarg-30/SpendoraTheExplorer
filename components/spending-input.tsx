import { useState } from 'react'
import { X } from 'lucide-react'

interface SpendingInputProps {
  category: string
  icon: string
  onSave: (amount: number) => void
  onClose: () => void
}

export function SpendingInput({ category, icon, onSave, onClose }: SpendingInputProps) {
  const [amount, setAmount] = useState('')

  const handleSave = () => {
    if (amount && Number(amount) > 0) {
      onSave(Number(amount))
      setAmount('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="bg-white w-full rounded-t-2xl p-6 animate-in slide-in-from-bottom">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{icon}</span>
            <h3 className="text-xl font-bold text-primary">{category}</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2 text-foreground">How much did you spend?</label>
          <div className="flex items-center">
            <span className="text-2xl font-bold text-accent mr-2">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              autoFocus
              className="flex-1 text-3xl font-bold bg-transparent outline-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-lg font-semibold bg-muted text-primary hover:bg-primary/20 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 px-4 rounded-lg font-semibold bg-primary text-white hover:bg-dark-purple transition-all"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
