'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function SplashPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleStart = (mode: string) => {
    if (isClient) {
      localStorage.setItem('userMode', mode)
      router.push('/onboarding')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary/10 to-accent/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="w-40 h-40 relative">
            <Image
              src="/logo.png"
              alt="Spendora the Explorer"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Title and Tagline */}
        <h1 className="text-4xl font-bold text-primary mb-2">Spendora</h1>
        <p className="text-lg font-semibold text-dark-purple mb-6">The Explorer</p>
        <p className="text-base text-foreground/70 mb-12 leading-relaxed">
          Explore your spendings before they explode you
        </p>

        {/* CTA Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => handleStart('current')}
            className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-dark-purple transition-all shadow-lg hover:shadow-xl"
          >
            I'm already in NYC
          </button>
          <button
            onClick={() => handleStart('incoming')}
            className="w-full bg-accent text-dark-purple py-3 px-6 rounded-lg font-semibold hover:bg-yellow-400 transition-all shadow-lg hover:shadow-xl"
          >
            I'm planning to come
          </button>
        </div>

        {/* Footer */}
        <p className="mt-12 text-xs text-muted-foreground">
          Your personal spending guide
        </p>
      </div>
    </main>
  )
}
