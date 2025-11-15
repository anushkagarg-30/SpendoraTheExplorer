# Spendora - The Explorer

A budget tracking and spending management app for NYC students, especially designed for NYU students. Track your daily expenses, manage your budget, and get AI-powered suggestions to optimize your spending.

## 🚀 Features

- **Onboarding Flow**: Multi-step form to set up your budget profile
- **Daily Spending Tracking**: Log groceries, eating out, coffee, transport, and more
- **Budget Dashboard**: Visual overview of your spending vs. budget
- **AI Suggestions**: Get personalized budget tips powered by OpenAI
- **Profile Management**: View and edit your budget settings
- **Rewards System**: Earn points for consistent budget tracking

## 📁 Project Structure

```
spendora/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Splash/landing page
│   ├── onboarding/        # Onboarding flow
│   ├── home/              # Dashboard
│   ├── today/             # Daily spending log
│   ├── profile/           # User profile
│   └── rewards/           # Rewards page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── api/                  # Next.js API routes
│   └── ai-suggestions/   # AI suggestion endpoint
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
├── backend/              # Backend API (to be added)
└── public/               # Static assets
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI)
- **AI**: Vercel AI SDK (OpenAI)
- **Package Manager**: pnpm
- **State Management**: React Hooks + localStorage (currently)

## 📋 Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)
- OpenAI API key (for AI features)

## 🔧 Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd spendora
```

### 2. Install dependencies

```bash
pnpm install
# or
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# OpenAI API Key for AI suggestions
OPENAI_API_KEY=your_openai_api_key_here

# Backend API URL (when backend is ready)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Get your OpenAI API key from: https://platform.openai.com/api-keys

### 4. Run the development server

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔌 Backend API Integration

The backend API provides the following endpoints:

### Endpoints

- `POST /profile` - Save onboarding/budget data
- `GET /profile/{user_id}` - Retrieve user profile
- `POST /checkin` - Log daily spending
- `GET /checkin/{user_id}` - Get all check-ins for a user
- `GET /health` - Health check

### API Client

The project includes an API client utility (`lib/api-client.ts`) that can be used to connect to the backend. Update the `NEXT_PUBLIC_API_URL` environment variable to point to your backend server.

### Current State

Currently, the app uses **localStorage** for data persistence. To integrate with the backend:

1. Update the API client configuration in `lib/api-client.ts`
2. Replace localStorage calls with API calls in:
   - `components/nyu-onboarding-form.tsx` (onboarding data)
   - `app/today/page.tsx` (daily check-ins)
   - `app/home/page.tsx` (fetching user data)
   - `app/profile/page.tsx` (profile data)

## 📝 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🗂️ Backend Setup

The backend code will be added to the `backend/` directory. See `backend/README.md` for backend-specific setup instructions.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## 📄 License

[Add your license here]

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

