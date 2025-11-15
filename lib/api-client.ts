/**
 * API Client for Backend Integration
 * 
 * This utility provides functions to interact with the backend API.
 * Update NEXT_PUBLIC_API_URL in .env.local to point to your backend server.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface ProfileData {
  user_id?: string
  name?: string
  school?: string
  program?: string
  rent?: number
  wifi?: number
  electricity?: number
  gas?: number
  groceries_budget?: number
  transport_cost?: number
  coffee_cost?: number
  coffee_per_week?: number
  shopping_monthly?: number
  phone_cost?: number
  phone_provider?: string
  [key: string]: any
}

interface CheckinData {
  user_id: string
  date: string
  groceries?: number
  eating_out?: number
  coffee?: number
  transport?: number
  other?: number
  cooking?: boolean
}

/**
 * Save user profile/onboarding data
 */
export async function saveProfile(data: ProfileData): Promise<{ success: boolean; user_id?: string; message?: string }> {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error saving profile:', error)
    throw error
  }
}

/**
 * Get user profile data
 */
export async function getProfile(userId: string): Promise<ProfileData> {
  try {
    const response = await fetch(`${API_URL}/profile/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching profile:', error)
    throw error
  }
}

/**
 * Save daily check-in (spending log)
 */
export async function saveCheckin(data: CheckinData): Promise<{ success: boolean; checkin_id?: string; message?: string }> {
  try {
    const response = await fetch(`${API_URL}/checkin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error saving check-in:', error)
    throw error
  }
}

/**
 * Get all check-ins for a user
 */
export async function getCheckins(userId: string): Promise<{ user_id: string; checkins: CheckinData[] }> {
  try {
    const response = await fetch(`${API_URL}/checkin/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching check-ins:', error)
    throw error
  }
}

/**
 * Health check
 */
export async function healthCheck(): Promise<{ status: string; timestamp?: string }> {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error checking health:', error)
    throw error
  }
}

