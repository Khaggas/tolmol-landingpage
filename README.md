# Tolmol — Landing Page

Marketing page for Tolmol, a cross-store price comparison product (Pakistan, PKR). Single-page Next.js app with a 4-step narrative, animated hero, and inline waitlist capture.

## Stack

- **Next.js 15** (App Router, React 19)
- **TypeScript**
- **Tailwind CSS 3**
- **Framer Motion** — entrance reveals, typewriter cycle, count-up animations
- **Lenis** — smooth scroll
- **lucide-react** — icons

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Scripts

| Command         | What it does                          |
| --------------- | ------------------------------------- |
| `npm run dev`   | Start dev server with HMR             |
| `npm run build` | Production build                      |
| `npm run start` | Run the production build              |
| `npm run lint`  | ESLint (Next.js config)               |

## Structure

```
app/
  layout.tsx     # Root layout, font setup, metadata
  page.tsx       # Hero, 4 step sections, waitlist form
  globals.css    # Tailwind layers + a few custom utilities
tailwind.config.ts
```
