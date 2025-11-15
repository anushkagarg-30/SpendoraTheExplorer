interface BudgetCardProps {
  category: string
  spent: number
  budget: number
  icon: string
}

export function BudgetCard({ category, spent, budget, icon }: BudgetCardProps) {
  const percentage = Math.min((spent / budget) * 100, 100)
  const isOver = spent > budget

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-primary/10">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{icon}</div>
          <div>
            <h4 className="font-semibold text-foreground text-sm">{category}</h4>
            <p className={`text-xs ${isOver ? 'text-red-500' : 'text-muted-foreground'}`}>
              ${spent.toFixed(0)} / ${budget.toFixed(0)}
            </p>
          </div>
        </div>
        <div className={`text-sm font-bold ${isOver ? 'text-red-500' : 'text-primary'}`}>
          {percentage.toFixed(0)}%
        </div>
      </div>
      <div className="w-full bg-primary/10 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${isOver ? 'bg-red-500' : 'bg-primary'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
