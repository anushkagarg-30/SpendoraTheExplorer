# Contributing to Spendora

Thank you for your interest in contributing to Spendora!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Install dependencies: `pnpm install`
4. Create a feature branch: `git checkout -b feature/your-feature-name`
5. Make your changes
6. Test your changes
7. Commit and push: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Backend Integration

If you're adding backend code:

1. Add your backend code to the `backend/` directory
2. Update `backend/README.md` with setup instructions
3. Ensure your endpoints match the API specification in `backend/README.md`
4. Test the integration using the API client in `lib/api-client.ts`

## Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic

## Testing

Before submitting a PR, please:

- Test all affected features
- Ensure the app builds without errors: `pnpm build`
- Check for linting errors: `pnpm lint`

## Backend Endpoints

The backend should implement these endpoints:

- `POST /profile` - Save onboarding data
- `GET /profile/{user_id}` - Get user profile
- `POST /checkin` - Log daily spending
- `GET /checkin/{user_id}` - Get all check-ins
- `GET /health` - Health check

See `backend/README.md` for detailed API specifications.

