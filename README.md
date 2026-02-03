# 🎮 Pokemon Trainer Registration App for JustJoin.it as recruitment task

I've built it with focus on code quality, performance, and user experience. I'll expand on that later in this README. (TODO)

## Features

- **Fuzzy Pokemon Search** - Autocomplete with Fuse.js (typo tolerance)
- **Real-time Validation** - Client & server-side with Zod schemas
- **Retro Design** - IBM VGA font, MUI 6 components, smooth animations
- **Live Preview** - Shows Pokemon sprite, types, and stats from PokeAPI
- **Rate Limiting** - 60 requests/min per IP for API protection (in-memory)
- **Server Components** - Next.js 16 App Router with React 19
- **Fully Tested** - Unit, integration, and E2E tests

## Technologies used to build

- **Next.js 16** - Framework with App Router
- **React 19** - UI with Server Components
- **MUI 6** - Component library
- **Zod** - Type-safe validation
- **React Hook Form** - Form management
- **TanStack Query** - Data fetching & caching
- **Fuse.js** - Fuzzy search
- **use-debounce** - Request debouncing
- **Vitest** - Unit testing
- **Playwright** - E2E testing

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers (for E2E tests)
npx playwright install
```

## Getting Started

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Testing

```bash
# Run all unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run all tests
npm test && npm run test:e2e

```

### Build

```bash
# Create production build
npm run build

# Start production server
npm start
```

### Docker

#### Development (with hot reload)

```bash
# Start development environment
docker compose up

# Open http://localhost:3000
# Changes in files will auto-reload :)
```

#### Production

```bash
# Build production image
docker build -t pokemon-trainer-justjoin-app .

# Run production container
docker run -p 3000:3000 pokemon-trainer-justjoin-app

# Open http://localhost:3000
```
