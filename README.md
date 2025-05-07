# Crypto Social Venture

A social platform for crypto trading and community building with AI-powered trading bots.

## Features

- Trading bot creation and management
- Virtual and real trading options
- AI-powered strategies
- Analytics dashboard
- Backtesting capabilities

## Deployment Options

### Option 1: Deploy to Vercel (Recommended)

The project is configured for easy deployment to Vercel:

1. Create an account on [Vercel](https://vercel.com/)
2. Make sure you have pushed your code to GitHub, GitLab, or BitBucket
3. Connect Vercel to your repository:
   - Go to the Vercel dashboard
   - Click "Add New"
   - Select "Project"
   - Import your repository
4. Vercel will automatically detect the configuration
5. Click "Deploy"

**OR use the Vercel CLI:**

```bash
# Login to Vercel
vercel login

# Deploy to development
vercel

# Deploy to production
vercel --prod
```

### Option 2: Deploy to Render (Full-stack Application)

1. Create an account on [Render](https://render.com/)
2. Connect your GitHub repository
3. Create a new Web Service
4. Select your repository
5. Render will automatically detect the `render.yaml` configuration
6. Click "Deploy"

### Option 3: Deploy to Netlify (Frontend Only)

1. Create an account on [Netlify](https://www.netlify.com/)
2. Run `netlify login` in your terminal
3. Run `netlify deploy` to test your deployment
4. Run `netlify deploy --prod` when ready for production

## Development

### Prerequisites

- Node.js 18 or higher
- npm 

### Setup

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev
```

## License

MIT 