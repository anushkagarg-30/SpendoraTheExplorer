# Backend API

This directory contains the backend API for Spendora.

## API Endpoints

### Profile Management

#### POST /profile
Save onboarding/budget data for a user.

**Request Body:**
```json
{
  "user_id": "string",
  "name": "string",
  "school": "string",
  "program": "string",
  "rent": number,
  "wifi": number,
  "electricity": number,
  "groceries_budget": number,
  "transport_cost": number,
  "coffee_cost": number,
  "coffee_per_week": number,
  "shopping_monthly": number,
  // ... other budget fields
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile saved successfully",
  "user_id": "string"
}
```

#### GET /profile/{user_id}
Retrieve user profile data.

**Response:**
```json
{
  "user_id": "string",
  "name": "string",
  "school": "string",
  // ... all profile fields
}
```

### Check-in (Daily Spending)

#### POST /checkin
Log daily spending for a user.

**Request Body:**
```json
{
  "user_id": "string",
  "date": "YYYY-MM-DD",
  "groceries": number,
  "eating_out": number,
  "coffee": number,
  "transport": number,
  "other": number,
  "cooking": boolean
}
```

**Response:**
```json
{
  "success": true,
  "message": "Check-in saved successfully",
  "checkin_id": "string"
}
```

#### GET /checkin/{user_id}
Get all check-ins for a user.

**Response:**
```json
{
  "user_id": "string",
  "checkins": [
    {
      "date": "YYYY-MM-DD",
      "groceries": number,
      "eating_out": number,
      "coffee": number,
      "transport": number,
      "other": number,
      "cooking": boolean
    }
  ]
}
```

### Health Check

#### GET /health
Check if the API is running.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Environment Variables

Create a `.env` file in the backend directory with your configuration:

```env
PORT=8000
DATABASE_URL=your_database_url
# ... other environment variables
```

## Setup Instructions

[Add backend-specific setup instructions here]

## Running the Backend

[Add commands to run the backend server here]

