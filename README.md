# MindSpace

MindSpace is a comprehensive study and focus application built with Next.js that helps students enhance their learning experience through AI-powered features, focus tools, and progress tracking.

## Project Overview

MindSpace offers several key features:
- **AI Coach**: Personalized study assistance and guidance
- **Focus Mode**: Ambient sounds and focus-enhancing tools
- **Study Plans**: Create and manage custom study plans
- **Progress Tracking**: Monitor your learning journey
- **Interactive Quizzes**: Test your knowledge with AI-generated quizzes

## Project Structure

```
mindspace/
├── public/                 # Static assets
│   ├── sounds/            # Ambient sound files
│   └── ...                # Other static assets
├── src/
│   ├── app/               # Next.js app router pages
│   │   ├── ai-coach/      # AI coaching feature
│   │   ├── focus/        # Focus mode feature
│   │   ├── progress/     # Progress tracking
│   │   └── study-plans/  # Study plans management
│   ├── components/        # Reusable React components
│   └── utils/            # Utility functions and helpers
├── .env.local            # Environment variables
├── next.config.ts        # Next.js configuration
├── package.json          # Project dependencies
└── tailwind.config.ts    # Tailwind CSS configuration
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini API
- **Type Safety**: TypeScript
- **Audio Features**: Web Audio API
