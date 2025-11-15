# Violet Coach - AI Budgeting Assistant

## Overview

Violet Coach is an AI-powered budgeting assistant integrated into Spendora. It helps students understand their spending patterns, answer budget-related questions, and provides personalized financial advice.

## Features Implemented

### 1. Chat Interface ("Ask Violet")
- **Location**: Accessible from Home and Today pages via "Ask Violet" button
- **Features**:
  - Full chat interface with message history
  - Quick summary sidebar showing monthly budget, spent amount, and days remaining
  - Quick question suggestions for common queries
  - Real-time AI responses powered by OpenAI GPT-4o-mini

### 2. Inline AI Suggestions
- **Location**: Today page, after clicking "Finish Day"
- **Feature**: Automatically generates personalized suggestions based on:
  - Today's spending
  - Remaining monthly budget
  - Spending patterns
  - Days left in the month

### 3. Data Flow

```
Frontend (User Question)
    ↓
/api/coach (Next.js API Route)
    ↓
OpenAI GPT-4o-mini (LLM)
    ↓
/api/coach (Processes response)
    ↓
Frontend (Displays answer)
```

## API Endpoint

### POST /api/coach

**Request Body:**
```json
{
  "userMessage": "Can I afford to go out this weekend?",
  "profile": {
    "name": "John",
    "school": "Tandon",
    "program": "MS Computer Science",
    "international": true
  },
  "budgets": {
    "rent": 1200,
    "groceries_budget": 250,
    "transport_cost": 80,
    "coffee_per_week": 5,
    "coffee_cost": 6
  },
  "monthStats": {
    "totalSpent": 450,
    "daysPassed": 15,
    "daysRemaining": 15,
    "groceriesSpent": 120,
    "eatingOutSpent": 80,
    "coffeeSpent": 60,
    "transportSpent": 40
  }
}
```

**Response:**
```json
{
  "reply": "Based on your spending so far..."
}
```

## Prompt Engineering

The prompt includes:
- User profile (school, program, international status)
- Complete monthly budget breakdown
- Current month spending statistics
- Days passed and remaining
- User's specific question

The LLM is instructed to:
- Be friendly and encouraging
- Use simple language
- Provide concrete, actionable advice
- Reference specific numbers from their budget
- Be empathetic and understanding

## Privacy Considerations

- **No Personal Identifiers**: Only budget numbers and anonymous lifestyle info are sent
- **No Bank Details**: No financial account information is transmitted
- **User Control**: Users can choose when to interact with Violet
- **Future Improvements**: Can further anonymize data (e.g., "international grad student" instead of specific school)

## Example Questions Violet Can Answer

1. "Can I afford to go out this weekend if I stay in today?"
2. "How can I reduce my Uber expenses without feeling too restricted?"
3. "What does it mean if my food is 45% of my total budget?"
4. "I overspent this week—how do I balance it next week?"
5. "What's my biggest spending category?"
6. "Based on my spending today, what should I do for the rest of the week?"

## UI Components

### VioletCoach Component
- **File**: `components/violet-coach.tsx`
- **Props**:
  - `onClose`: Function to close the chat
  - `profile`: User profile data
  - `budgets`: Budget configuration
  - `monthStats`: Current month spending statistics

### Integration Points
- **Home Page**: "Ask Violet" button below "Log Today's Spending"
- **Today Page**: 
  - "Ask Violet" button in action section
  - Inline AI suggestion after "Finish Day"

## Future Enhancements

1. **FAQ Mode**: Answer general budgeting questions
   - "What's a good rule of thumb for food vs rent?"
   - "How do I plan for a big one-time cost like a flight?"

2. **Aggregated Insights**: Learn from anonymous student data
   - "Students similar to you spend around $X–Y on food"

3. **Weekly Recaps**: Generate weekly spending summaries
   - "This week your main overspend was Uber at $40. If you reduce it to $20 next week, you will be back on track."

4. **Proactive Suggestions**: Push notifications for budget alerts

5. **Multi-language Support**: Support for international students

## Technical Details

- **LLM Provider**: OpenAI GPT-4o-mini (via Vercel AI SDK)
- **Model**: Cost-effective, fast responses
- **Error Handling**: Graceful fallbacks with user-friendly error messages
- **Loading States**: Visual feedback during AI processing

## Testing

To test Violet Coach:
1. Complete onboarding to set up budget
2. Log some daily spending
3. Click "Ask Violet" button
4. Try asking questions like:
   - "Can I afford to order food tomorrow?"
   - "How am I doing this month?"
   - "What should I focus on to save money?"

## Environment Variables

Ensure `OPENAI_API_KEY` is set in `.env.local`:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

