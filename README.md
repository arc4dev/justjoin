# 🎮 Pokemon Trainer Registration App for JustJoin.it as recruitment task

## Kilka słów o implementacji ode mnie (po polsku :))

Przygotowując to zadanie, skupiłem się na na tym, aby aplikacja nie tylko realizowała wymagania, ale była w pełni **production-ready**.

- **Struktura feature-based** - standard w dużych projektach.
- **Fuzzy Search** z Fuse.js, **debounce** i caching razem z **React Query**(albo tanstack jak kto lubi).
- **MUI theme** - w sumie pierwszy raz z niego korzystałem, zazwyczaj uzywam TailwindaCSS lub Radix UI, ale chciałem pokazać, że potrafię się dostosować do preferowanego przez Was stacka. (mam nadzieję, że nie popełniłem jakichś kardynalnych błędów).
- **In-memory rate limiting** - dodałem prosty in-memory rate limiter na poziomie API Routes przy searchu Pokemona. Normalnie w produkcji użyłbym do tego Redis'a, ale na potrzeby tego zadania uznałem, że to wystarczy.
- **Wszystko co napisałem, jest przetestowane** - zarówno jednostkowo (Vitest), jak i E2E (Playwright). Fajną rolę pełni tutaj AI, bo kiedyś było to mozolne, a teraz tak na prawdę łatwiej zrobić bezpieczną aplikacje :) AI moze nam je wygenerować, poza tym widzi więcej edge case'ów. win-win.
- **Dodałem lekkie animacje z Framer Motion** (teraz motion.dev), żeby podnieść UX i nadać aplikacji trochę bardziej nowoczesny szlif mimo retro stylistyki.
- W kodzie zazwyczaj cenię sobię czytelność, więc staram się numerować kroki w funkcjach, dodawać komenatrze w kluczowych miejscach, np. w opisach funkcji. W dużych projektach jest to tym bardziej ważne, ale lubię to robić nawet w mniejszych. Lepiej wtedy myślę.
- **Aplikację można uruchomić w Dockerze**, przygotowałem konfigurację dla dev (z hot-reloadem) oraz production.
- A i, normalnie commituje co funkcjonalność (zgodnie z Conventional Commits), ale tutaj pozwolilem sobie na jeden commit jak za czasów juniora.

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
