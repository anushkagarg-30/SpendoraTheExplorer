import { generateText } from 'ai'

export async function POST(req: Request) {
  try {
    const { budgetData, category } = await req.json()

    const prompt = `You are a friendly financial advisor for college students in NYC. Based on the following budget data, provide ONE specific, actionable suggestion for the "${category}" category to help them save money or spend smarter.

Budget Data:
- Rent: $${budgetData.rent || 0}/month
- Utilities: $${(budgetData.wifi || 0) + (budgetData.electricity || 0) + (budgetData.gas || 0)}/month
- Phone: $${budgetData.phone_cost || 0}/month
- Transport Days/Week: ${budgetData.transport_days || 0}
- Transport Budget: $${budgetData.transport_cost || 0}/month
- Cooking at Home: ${budgetData.cooking_per_week || 0} meals/week
- Eating Out: ${budgetData.eating_out_per_week || 0} meals/week
- Coffee/Snacks: ${budgetData.coffee_per_week || 0}x/week @ $${budgetData.coffee_cost || 0}
- Shopping: $${budgetData.shopping_monthly || 0}/month
- Party Nights: ${budgetData.party_per_month || 0}/month @ $${budgetData.party_cost || 0}

Keep the suggestion short (1-2 sentences), practical, and encouraging. Be specific to NYC student life.`

    const { text } = await generateText({
      model: 'openai/gpt-4o-mini',
      prompt,
    })

    return Response.json({ suggestion: text })
  } catch (error) {
    console.error('AI suggestion error:', error)
    return Response.json(
      { error: 'Failed to generate suggestion' },
      { status: 500 }
    )
  }
}
