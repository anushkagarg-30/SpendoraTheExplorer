import { generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

export async function POST(req: Request) {
  try {
    // Parse request body with error handling
    let requestData
    try {
      requestData = await req.json()
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError)
      return Response.json(
        { 
          error: 'Invalid request data', 
          reply: "I'm having trouble understanding your request. Please try again!"
        },
        { status: 400 }
      )
    }

    const { userMessage, profile = {}, budgets = {}, monthStats = {} } = requestData

    // Validate required fields
    if (!userMessage || typeof userMessage !== 'string') {
      console.error('Invalid userMessage:', userMessage)
      return Response.json(
        { 
          error: 'Missing user message', 
          reply: "I didn't receive your question. Please try asking again!"
        },
        { status: 400 }
      )
    }

    // Check if API key is available (OpenRouter key)
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('API key not set (check OPENROUTER_API_KEY or OPENAI_API_KEY)')
      return Response.json(
        { 
          error: 'API key not configured', 
          reply: "I'm having trouble connecting right now. Please check the server configuration."
        },
        { status: 500 }
      )
    }

    // Create OpenAI client configured for OpenRouter
    // OpenRouter uses OpenAI-compatible API at https://openrouter.ai/api/v1
    const openai = createOpenAI({
      apiKey: apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
      fetch: async (url, options) => {
        // Add OpenRouter required headers
        const headers = new Headers(options?.headers)
        headers.set('HTTP-Referer', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
        headers.set('X-Title', 'Spendora - The Explorer')
        
        return fetch(url, {
          ...options,
          headers,
        })
      },
    })

    console.log('Request received:', {
      userMessage: userMessage.substring(0, 50) + '...',
      hasProfile: !!profile,
      hasBudgets: !!budgets,
      hasMonthStats: !!monthStats,
    })

    // Build comprehensive prompt for Violet Coach
    const prompt = `You are Violet, a friendly and encouraging budgeting assistant for NYU students in NYC. You help students understand their spending patterns and make smart financial decisions.

USER PROFILE:
- International: ${profile?.isInternational || profile?.international || 'Not specified'}
- School: ${profile?.school || 'Not specified'}
- Program: ${profile?.program || 'Not specified'}
- Name: ${profile?.name || 'Student'}

MONTHLY BUDGET:
- Rent: $${budgets?.rent || 0}
- Groceries: $${budgets?.groceries_budget || budgets?.groceries || 0}
- Eating out: $${(budgets?.eating_out_per_week || 0) * (budgets?.avg_meal_cost || 0) * 4 || 0}
- Coffee: $${(budgets?.coffee_per_week || 0) * (budgets?.coffee_cost || 0) * 4 || 0}
- Transport: $${budgets?.transport_cost || 0}
- Shopping: $${budgets?.shopping_monthly || 0}
- Party: $${(budgets?.party_per_month || 0) * (budgets?.party_cost || 0) || 0}
- Utilities: $${((budgets?.wifi || 0) + (budgets?.electricity || 0) + (budgets?.gas || 0)) || 0}

CURRENT MONTH STATUS:
- Total spent so far: $${monthStats?.totalSpent || 0}
- Days passed this month: ${monthStats?.daysPassed || 0}
- Days remaining: ${monthStats?.daysRemaining || 0}
- Groceries spent: $${monthStats?.groceriesSpent || 0}
- Eating out spent: $${monthStats?.eatingOutSpent || 0}
- Coffee spent: $${monthStats?.coffeeSpent || 0}
- Transport spent: $${monthStats?.transportSpent || 0}
- Shopping spent: $${monthStats?.shoppingSpent || 0}

The student just asked: "${userMessage}"

Give a short, practical, and encouraging answer (2-4 sentences). Use simple language. Suggest concrete next steps. Be empathetic and understanding. Reference specific numbers from their budget when relevant.`

    console.log('Calling OpenRouter with prompt length:', prompt.length)
    
    // OpenRouter: Use model name directly (gpt-4o-mini) when using OpenAI-compatible endpoint
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
    })

    console.log('OpenRouter response received, length:', text?.length || 0)

    return Response.json({ reply: text })
  } catch (error: any) {
    console.error('Violet Coach error:', error)
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    })

    // Handle rate limit errors specifically
    if (error?.message?.includes('Rate limit') || error?.message?.includes('rate limit')) {
      return Response.json(
        { 
          error: 'Rate limit exceeded', 
          reply: "I'm getting too many requests right now. Please wait a moment and try again in about 20 seconds. If this happens often, you may need to add a payment method to your OpenAI account to increase the rate limit.",
          retryAfter: 20
        },
        { status: 429 }
      )
    }

    // Handle API key errors
    if (error?.message?.includes('API key') || error?.message?.includes('authentication')) {
      return Response.json(
        { 
          error: 'Authentication failed', 
          reply: "I'm having trouble connecting to the AI service. Please check the API key configuration."
        },
        { status: 401 }
      )
    }

    return Response.json(
      { 
        error: 'Failed to get response from Violet Coach', 
        reply: error?.message || "I'm having trouble right now. Please try again in a moment!",
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    )
  }
}

