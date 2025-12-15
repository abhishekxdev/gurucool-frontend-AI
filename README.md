# GuruCool AI

An AI-powered professional development platform for teachers and schools.

## Getting Started

### Prerequisites

- Node.js v20 or higher
- Bun (recommended) or npm/yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd gurucoolai
```

2. Install dependencies

```bash
bun install
```

3. Create `.env.local` file

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

4. Run development server

```bash
bun dev
```

Open [http://localhost:3003](http://localhost:3003) in your browser.

## Available Scripts

```bash
bun dev          # Start development server
bun build        # Build for production
bun start        # Start production server
bun lint         # Run ESLint
```

## Project Structure

```
app/                 # Next.js App Router
├── (public)/        # Public routes (auth)
└── dashboard/       # Protected dashboard routes

components/          # React components
├── ui/              # shadcn/ui components
└── ...              # Feature components

lib/                 # Utility functions and API layer
hooks/               # Custom React hooks
types/               # TypeScript types
```

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- React Hook Form + Zod
- Sonner (toast notifications)

## License

Private and proprietary.
