'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface VioletCoachProps {
  onClose: () => void
  profile?: any
  budgets?: any
  monthStats?: any
}

export function VioletCoach({ onClose, profile, budgets, monthStats }: VioletCoachProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Violet, your budgeting coach. I can help you understand your spending, answer questions about your budget, and give you personalized tips. What would you like to know?",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userMessage,
          profile: profile || {},
          budgets: budgets || {},
          monthStats: monthStats || {},
        }),
      })

      const data = await response.json()
      
      // Handle rate limit errors
      if (response.status === 429 && data.retryAfter) {
        const reply = data.reply || "I'm getting too many requests. Please wait a moment and try again."
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
        return
      }

      const reply = data.reply || "I'm having trouble right now. Please try again!"

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch (error) {
      console.error('Error calling Violet Coach:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please check your internet connection and try again!",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const quickQuestions = [
    "Can I afford to go out this weekend?",
    "How can I reduce my Uber expenses?",
    "I overspent this week—what should I do?",
    "What's my biggest spending category?",
  ]

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-dark-purple text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Ask Violet</h2>
              <p className="text-xs text-white/80">Your Budgeting Coach</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Summary Sidebar */}
        <div className="bg-gradient-to-b from-primary/5 to-accent/5 p-4 border-b">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <p className="text-muted-foreground">Monthly Budget</p>
              <p className="font-bold text-primary">${((budgets?.rent || 0) + (budgets?.groceries_budget || 0) + (budgets?.transport_cost || 0) + ((budgets?.coffee_per_week || 0) * (budgets?.coffee_cost || 0) * 4) + (budgets?.shopping_monthly || 0)).toFixed(0)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Spent This Month</p>
              <p className="font-bold text-primary">${monthStats?.totalSpent?.toFixed(0) || 0}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Days Left</p>
              <p className="font-bold text-primary">{monthStats?.daysRemaining || 0}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div className="bg-muted rounded-2xl p-4">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(q)}
                  className="text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Violet anything about your budget..."
              className="flex-1 px-4 py-3 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-primary text-white hover:bg-dark-purple px-6"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

