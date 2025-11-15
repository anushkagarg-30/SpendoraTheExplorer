# Backend Integration Guide

This guide explains how to integrate the frontend with the backend API.

## Current State

The app currently uses **localStorage** for data persistence. To switch to the backend API, you'll need to update the following files:

## Integration Steps

### 1. Set Environment Variable

Add to `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Update Onboarding Form

**File**: `components/nyu-onboarding-form.tsx`

Replace the `handleComplete` function:

```typescript
const handleComplete = async () => {
  setIsLoading(true)
  try {
    // Save to backend instead of localStorage
    const response = await saveProfile({
      ...formData,
      user_id: formData.user_id || generateUserId(), // You'll need to generate/store user_id
    })
    
    // Store user_id for future requests
    localStorage.setItem('user_id', response.user_id)
    
    router.push('/home')
  } catch (error) {
    console.error('Failed to save profile:', error)
    // Fallback to localStorage or show error
    localStorage.setItem('budgetData', JSON.stringify(formData))
    router.push('/home')
  } finally {
    setIsLoading(false)
  }
}
```

### 3. Update Daily Check-in

**File**: `app/today/page.tsx`

Update `handleSpendingUpdate` and `handleFinishDay`:

```typescript
const handleSpendingUpdate = async (category: string, amount: number) => {
  const updated: DailyLog = {
    ...todayLog,
    date: today,
    [category]: amount,
  }
  setTodayLog(updated)
  generateSuggestions(updated)

  // Save to backend
  const userId = localStorage.getItem('user_id')
  if (userId) {
    try {
      await saveCheckin({
        user_id: userId,
        date: today,
        [category]: amount,
      })
    } catch (error) {
      console.error('Failed to save check-in:', error)
      // Fallback to localStorage
      const logs = localStorage.getItem('dailyLogs') || '[]'
      let dailyLogs = JSON.parse(logs) as DailyLog[]
      // ... existing localStorage code
    }
  }
}
```

### 4. Update Home Page

**File**: `app/home/page.tsx`

Load data from backend on mount:

```typescript
useEffect(() => {
  const loadData = async () => {
    const userId = localStorage.getItem('user_id')
    if (userId) {
      try {
        const profile = await getProfile(userId)
        setBudgetData(profile)
        
        const checkins = await getCheckins(userId)
        setDailyLogs(checkins.checkins)
      } catch (error) {
        console.error('Failed to load data:', error)
        // Fallback to localStorage
        const saved = localStorage.getItem('budgetData')
        if (saved) {
          setBudgetData(JSON.parse(saved))
        }
      }
    }
    setIsLoading(false)
  }
  
  loadData()
}, [])
```

### 5. Update Profile Page

**File**: `app/profile/page.tsx`

Similar updates to load and save profile data from backend.

## User ID Management

You'll need to implement user ID generation/storage. Options:

1. **Generate on first visit**: Create a UUID and store in localStorage
2. **Backend generates**: Send a request to backend to create user, get ID back
3. **Use authentication**: If you add auth later, use auth user ID

Example UUID generation:
```typescript
import { v4 as uuidv4 } from 'uuid'

const getOrCreateUserId = () => {
  let userId = localStorage.getItem('user_id')
  if (!userId) {
    userId = uuidv4()
    localStorage.setItem('user_id', userId)
  }
  return userId
}
```

## Error Handling

Always implement fallback to localStorage for:
- Offline scenarios
- Backend errors
- Development/testing

## Testing

1. Start backend server
2. Update `NEXT_PUBLIC_API_URL` in `.env.local`
3. Test each flow:
   - Onboarding → should save to backend
   - Daily check-in → should save to backend
   - Home page → should load from backend
   - Profile → should load from backend

## Migration Strategy

For existing users with localStorage data:

1. On first backend connection, check if user has localStorage data
2. If yes, migrate it to backend via POST /profile
3. Clear localStorage after successful migration

