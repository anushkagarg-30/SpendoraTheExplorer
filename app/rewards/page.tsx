'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Zap, Award, Flame, Star } from 'lucide-react'

interface RewardTier {
  points: number
  reward: string
  description: string
  icon: string
}

export default function RewardsPage() {
  const [userPoints, setUserPoints] = useState(0)
  const [streak, setStreak] = useState(0)
  const [logsCount, setLogsCount] = useState(0)

  useEffect(() => {
    // Calculate points from daily logs
    const logs = localStorage.getItem('dailyLogs')
    if (logs) {
      const dailyLogs = JSON.parse(logs)
      setLogsCount(dailyLogs.length)
      // 10 points per day logged, 5 bonus points for staying under budget
      let points = dailyLogs.length * 10
      setUserPoints(points)
    }

    // Calculate streak
    const today = new Date()
    let currentStreak = 0
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)
      const dateStr = checkDate.toISOString().split('T')[0]
      const hasLog = dailyLogs?.some((log: any) => log.date === dateStr)
      if (hasLog) {
        currentStreak++
      } else if (i > 0) {
        break
      }
    }
    setStreak(currentStreak)
  }, [])

  const rewards: RewardTier[] = [
    {
      points: 500,
      reward: 'Digital Voucher',
      description: 'Save $10 on your next purchase',
      icon: '🎟️',
    },
    {
      points: 1000,
      reward: 'Weekly Coffee Card',
      description: 'Free coffee from your favorite cafe',
      icon: '☕',
    },
    {
      points: 2000,
      reward: 'NYU Mug',
      description: 'Exclusive branded mug (planned partnership)',
      icon: '☕',
    },
    {
      points: 5000,
      reward: 'Notebook Bundle',
      description: 'Premium notebook set + stickers',
      icon: '📓',
    },
  ]

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-primary/10 to-accent/5 p-4 pb-24">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="mt-4 mb-6">
            <h1 className="text-3xl font-bold text-primary mb-1">Rewards</h1>
            <p className="text-muted-foreground">Earn points for tracking your spending</p>
          </div>

          {/* Points Card */}
          <div className="bg-gradient-to-br from-primary to-dark-purple rounded-2xl p-6 text-white mb-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-white/80 text-sm mb-2">Your Points</p>
                <p className="text-5xl font-bold">{userPoints}</p>
              </div>
              <div className="w-20 h-20 bg-accent/30 rounded-full flex items-center justify-center">
                <Zap className="w-10 h-10 text-accent" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
              <div>
                <p className="text-white/70 text-xs mb-1">Days Logged</p>
                <p className="text-2xl font-semibold">{logsCount}</p>
              </div>
              <div>
                <p className="text-white/70 text-xs mb-1">Current Streak</p>
                <div className="flex items-center gap-1">
                  <Flame className="w-5 h-5 text-accent" />
                  <p className="text-2xl font-semibold">{streak}</p>
                </div>
              </div>
            </div>
          </div>

          {/* How to Earn */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-primary/10 mb-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-accent" />
              How You Earn Points
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="font-bold text-primary">10 pts</span>
                <span className="text-muted-foreground">Log your spending daily</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">5 pts</span>
                <span className="text-muted-foreground">Stay under your daily budget</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">50 pts</span>
                <span className="text-muted-foreground">Maintain a 7-day streak</span>
              </li>
            </ul>
          </div>

          {/* Rewards */}
          <h2 className="text-lg font-bold text-primary mb-4">Available Rewards</h2>
          <div className="space-y-3">
            {rewards.map((reward, idx) => {
              const canUnlock = userPoints >= reward.points
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    canUnlock
                      ? 'bg-accent/10 border-accent shadow-md'
                      : 'bg-muted border-muted'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{reward.icon}</span>
                      <div>
                        <h4 className={`font-semibold ${canUnlock ? 'text-primary' : 'text-muted-foreground'}`}>
                          {reward.reward}
                        </h4>
                        <p className="text-sm text-muted-foreground">{reward.description}</p>
                      </div>
                    </div>
                    <div
                      className={`text-right font-bold whitespace-nowrap ml-2 ${
                        canUnlock ? 'text-accent' : 'text-muted-foreground'
                      }`}
                    >
                      <div className="text-lg">{reward.points}</div>
                      <div className="text-xs">pts</div>
                    </div>
                  </div>
                  {canUnlock && (
                    <button className="w-full mt-3 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-dark-purple transition-all text-sm">
                      Unlock Now
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>
      <Navigation />
    </>
  )
}
