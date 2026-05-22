# Frontend conventions

## Theme

Defined in `tailwind.config.ts` and `app/globals.css`. **Treat these as the only colors.**

| Token | Value | Use |
| --- | --- | --- |
| `ink` | `#030712` | Body text, primary buttons, footer brand, dark accents |
| `cyanline` | `#2563eb` | The one accent. Logo background tile, "best" highlight, focus rings, links |
| `violet` | `#1e40af` | Reserved for gradient ends only (see `globals.css` body radial gradient) |
| `mist` | `#f8fbff` | Currently unused; available for a soft surface variant if needed |
| `volt` | `#ffffff` | Pure white surface |
| `slate-*` (Tailwind) | — | Borders, secondary text, disabled states |

### Rules

- **Monochromatic discipline.** Don't reach for emerald/amber/rose/etc. for status. Errors use `text-ink` + bold copy; success is the cyanline check. If you genuinely need a new visual signal, raise it before adding a color.
- **One accent at a time.** A section either highlights with `cyanline` *or* with `ink`, not both. Look at `BestVisual` for the right pattern.
- **Surfaces.** Cards are `bg-white` + `border-slate-200` + `shadow-form`. Inset fields are `bg-slate-50` + `border-slate-200`.

### Typography

- Font: `Plus Jakarta Sans` via `next/font/google`, loaded in `app/layout.tsx`, exposed as the Tailwind `font-sans` family through the `--font-jakarta` CSS variable.
- Headlines: `font-semibold tracking-tight`, often `leading-[1.04]–[1.08]`.
- Body: default Jakarta with `font-feature-settings: "ss01" on, "cv01" on` (in `globals.css`).
- Numbers in tables/cards: `tabular-nums`.

## Page anatomy

`app/page.tsx` is a single composed page. Each section is a function component in that same file. Order matters — it's the narrative.

```
Header        fixed top, backdrop blur, brand + "Join waitlist" CTA
Hero          big typewriter headline (cycles HEADLINES), tagline,
              two CTAs, large search input that seeds the waitlist
StepSection × 4
  1  Search once. Anywhere.            → SearchVisual
  2  See every store side by side.     → ResultsVisual
  3  Price gaps become obvious.        → CompareVisual
  4  The best option, highlighted.     → BestVisual
WaitlistSection  Email + optional product + honeypot, POSTs to /api/waitlist
Footer           Brand, copyright, nav links
```

### Adding a new section

- Reuse `StepSection` if it's "label + title + text + visual." Pass `reverse` to flip the visual side.
- For something genuinely different, mirror the visual structure of `SearchVisual` etc.: outer `relative`, blurred glow behind, white card with `shadow-form` in front.
- Animate entrance with the existing `fadeUp` + `stagger` variants and a `whileInView` viewport — don't roll your own.

## Animation

| Pattern | How |
| --- | --- |
| Entrance reveal | `motion.div` with `variants={stagger}` parent + `variants={fadeUp}` children, `whileInView` |
| Typewriter | `useTypewriterCycle(items, active)` — handles type/hold/delete cycle, respects `useReducedMotion` |
| Count-up | See `SavingsCallout` — `useMotionValue` + `animate` + `useTransform` with `Math.round` |
| Bars / progress | `motion.div` with `initial={{ scaleX: 0 }}` + `whileInView={{ scaleX: 1 }}`, `origin-left` |

**Always** respect `useReducedMotion()` — every animated hook in `page.tsx` already does.

## Smooth scroll

Lenis is initialized in the root `Page` component. It's disabled automatically when the user prefers reduced motion. Don't add a second smooth-scroll library.

## Forms

- Validate on the client *and* the server. Client validation is for UX, server is authoritative.
- Always include a honeypot input on any new form (`pointer-events-none absolute -left-[9999px]`).
- Show one of three states explicitly: idle, loading (spinner), submitted (full-card success).
- Errors live below the submit button as `role="alert"`.

## Accessibility checklist for new UI

- Headings are in order (one `h1`, then `h2`s, no skipping).
- Decorative blurs/gradients use `aria-hidden`.
- Interactive elements have a focus ring (Tailwind's default `focus-visible` + the `focus-within` rings on form fields).
- Color is never the only signal — pair the cyanline highlight with a label or icon.
- Reduced motion is respected (see above).

## Performance

- Bundle is intentionally lean. Before adding a runtime dep, check if Framer Motion or a small hook can do it.
- Heavy visuals (the 4 step cards) should stay inside `whileInView` so they don't all paint at once on first load.
- Static metadata routes (`icon.tsx`, `opengraph-image.tsx`) are prerendered at build — they don't cost a request.
