# Merge — Design System

Source files inspected:

- [tailwind.config.ts](frontend/tailwind.config.ts#L1-L60)
- [globals.css](frontend/src/app/globals.css#L1-L250)
- [layout.tsx](frontend/src/app/layout.tsx#L1-L220)
- [components/ui/Button.tsx](frontend/src/components/ui/Button.tsx#L1-L200)
- [components/ui/Input.tsx](frontend/src/components/ui/Input.tsx#L1-L200)
- [components/landing/Navbar.tsx](frontend/src/components/landing/Navbar.tsx#L1-L200)

This document is a machine- and designer-readable extraction of the platform's visual tokens, styles, and component defaults.

---

## 1. Color Palette (Light Mode & Dark Mode)

All semantic Tailwind tokens map to CSS variables (`tailwind.config.ts` maps tokens to `var(--...)`). The authoritative token values are defined under `.light` and `.dark` in `globals.css`.

Key variables (name — Light → Dark):

- `--primary`: #2f1a58 → #9b5de5
- `--secondary`: #8c6dc9 → #a78bfa
- `--accent`: #e69a29 → #fbbf24
- `--destructive`: #eb5252 → #e54545
- `--success`: #10b981 → #34d399
- `--info`: #3b82f6 → #60a5fa

Text & semantic text colors:

- `--heading`: #111827 → #f0ecf9
- `--para`: #3a424d → #c8c2d6
- `--para-muted`: #6b7280 → #8b83a6
- `--button`: #374151 → #f0ecf9
- `--toast-bg`: #ffffff → #0b0915

Background & surfaces:

- `--background`: #f7f6f6 → #13101e
- `--main-background`: #f3f3f3 → #0b0915
- `--card`: (light: not explicitly set) → #1a1530 (dark)
- `--popover`: (light: not explicitly set) → #1a1530 (dark)
- `--muted`: (light: not explicitly set) → #110e1c (dark)

Borders & inputs:

- `--light-border`: #e5e7eb → #26203e
- `--border`: (light: not explicitly set) → #2a2445 (dark)
- `--input`: (light: not explicitly set) → #1e1836 (dark)

Notes on referenced tokens (present but not defined in `globals.css`):

- `--chart-1`..`--chart-5` — referenced by components, no values declared in `globals.css`.
- `--sidebar`, `--sidebar-*` tokens — referenced but not explicitly set in the scanned file.

Tailwind token mapping (see [tailwind.config.ts](frontend/tailwind.config.ts#L1-L60)):

- `primary: var(--primary)`
- `secondary: var(--secondary)`
- `accent: var(--accent)`
- `destructive: var(--destructive)`
- `heading: var(--heading)`
- `para: var(--para)`
- `para-muted: var(--para-muted)`
- `button: var(--button)`
- `background: var(--background)`
- `main-background: var(--main-background)`
- `light-border: var(--light-border)`

Gradients (common patterns):

- `bg-gradient-to-r from-primary to-secondary`
- `bg-gradient-to-br from-primary via-secondary to-accent`
- Subtle tints such as `from-primary/5 to-secondary/5` and `from-primary/10 to-secondary/10` are used for soft backgrounds and cards.

---

## 2. Typography

Font families & sources:

- `Inter` is imported via Google Fonts in `globals.css`:
  - @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap...')
- `Roboto` and `Raleway` are loaded using `next/font` in [layout.tsx](frontend/src/app/layout.tsx#L1-L120) and exposed as CSS variables:
  - `--font-roboto` (weights: 100,300,400,500,700,900)
  - `--font-raleway` (weights: 100..900)

Usage:

- Body default: `font-family: 'Inter', var(--font-roboto);` (see `globals.css`).
- Components use Tailwind classes `font-roboto` and `font-raleway` which use those variables.

Font size scale (observed classes and explicit values):

- `text-xs` — 0.75rem (12px)
- `text-sm` — 0.875rem (14px)
- `text-base` — 1rem (16px)
- `text-lg` — 1.125rem (18px)
- `text-xl` — 1.25rem (20px)
- `text-2xl` — 1.5rem (24px)
- `text-3xl` — 1.875rem (30px)
- `text-4xl` — 2.25rem (36px)
- `text-5xl` — 3rem (48px)
- `text-6xl` — 3.75rem (60px)

Explicit override example:

- `.ai-markdown-body { font-size: 0.9375rem; /* 15px */ line-height: 1.75; }` ([globals.css](frontend/src/app/globals.css#L180-L206)).

Font weights used (classes observed): `font-medium`, `font-semibold`, `font-bold`, `font-black`.

Line-height & letter spacing:

- `line-height` custom: `1.75` for markdown body. Headings use `leading-tight` / `leading-[1.1]` in hero titles.
- Letter spacing utilities used: `tracking-tight`, `tracking-tighter`, `tracking-wider`.

Special text styles:

- Gradient text and gradient backgrounds frequently implemented via Tailwind `bg-gradient-to-*` utilities applied to elements or decorative shapes.

---

## 3. Spacing & Layout

Container & padding:

- Main container usage: `max-w-7xl` with `px-6` (1.5rem / 24px) and `lg:px-8` (2rem / 32px). Navbar uses `mx-auto max-w-7xl px-6 lg:px-8` ([Navbar.tsx](frontend/src/components/landing/Navbar.tsx#L1-L80)).

Spacing scale: Tailwind default spacing scale used widely (examples: `p-1`, `p-2.5`, `p-3`, `p-4`, `p-5`, `p-6`, `p-8`, `py-24`).

Breakpoints (Tailwind defaults):

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Grid system:

- CSS Grid is used for the landing and feature layouts with responsive `col-span-*`. Flexbox is the dominant pattern for navbars, lists, and header sections.

---

## 4. Border & Shape

Radius (root tokens):

- `--radius`: 0.625rem (10px) — defined in `.light` and `.dark`.
- Derived:
  - `--radius-sm`: calc(var(--radius) - 4px) → 6px
  - `--radius-md`: calc(var(--radius) - 2px) → 8px
  - `--radius-lg`: var(--radius) → 10px
  - `--radius-xl`: calc(var(--radius) + 4px) → 14px

Common Tailwind radii used:

- `rounded-md` — 0.375rem (6px)
- `rounded-lg` — 0.5rem (8px)
- `rounded-xl` — 0.75rem (12px)
- `rounded-2xl` — 1rem (16px)
- `rounded-3xl` — 1.5rem (24px)

Borders:

- `border` (1px) and `border-2` (2px) commonly used; color is typically `var(--light-border)`.
- Occasional `border-[0.5px]` in specific cards.

Shadows:

- Tailwind shadows: `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`.
- Explicit CSS example: `box-shadow: 0 4px 6px rgba(0,0,0,0.1)` used in suggestion menu ([globals.css](frontend/src/app/globals.css#L110-L116)).
- Color-tinted shadows used: `shadow-primary/5` etc., creating soft colored glows.

---

## 5. Component Styles (exact values)

Primary Button (`components/ui/Button.tsx` defaults):

- Base: `flex items-center justify-center gap-2 whitespace-nowrap rounded-md sm:text-sm text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-w-[120px]`
- `variant="default"`:
  - Background: `bg-primary/90` → uses `--primary` at 90% opacity (visual: near-solid primary)
  - Text color: `text-white`
  - Border-radius: `rounded-md` → 0.375rem (6px)
  - Padding / size: default size → `h-9` (2.25rem / 36px), `px-4` (1rem / 16px), `min-w-[120px]` (120px)
  - Hover: `hover:bg-primary/90` (color remains primary at 90% or slightly darker)
  - Font-weight: `font-medium` (~500)

Secondary / Outline / Ghost buttons:

- `secondary`: `bg-secondary text-white shadow-sm hover:bg-secondary/80`
- `outline`: `border bg-secondary/5 text-main-bg hover:bg-secondary/15`
- `ghost`: `hover:bg-accent hover:text-accent-foreground`
- `destructive`: `bg-destructive text-white shadow-sm hover:bg-destructive/90`

Input / Form fields (`components/ui/Input.tsx`):

- Height: `h-10` → 2.5rem (40px)
- Background: `bg-transparent` (but many inputs use `bg-main-background` in containers)
- Border: `border-2` (2px solid) default `border-light-border` (#e5e7eb light / #26203e dark)
- Border-radius: `rounded-md` → 0.375rem (6px)
- Focus: `focus:ring-[2px] focus:ring-secondary/70` (2px focus ring using `--secondary` at 70% opacity)
- Error state: `border-red-300` / `focus:border-red-400`

Card / Panel:

- Background: `var(--background)` or `var(--card)` (dark)
- Border: `1px solid var(--light-border)`
- Border-radius: often `rounded-2xl` (1rem / 16px) or `rounded-xl` (0.75rem)
- Shadow: `shadow-sm`, `shadow-md`, or `shadow-xl` depending on elevation

Badge / Tag examples:

- Small inline badge: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20` (rounded-full)

Navbar (landing):

- Fixed header with translucent overlay: uses a stacked approach — an absolutely positioned overlay `bg-background/80 dark:bg-main-background/80` with animated opacity and `backdrop-filter` blur via framer-motion (see [Navbar.tsx](frontend/src/components/landing/Navbar.tsx#L1-L80)).
- CTA button: `rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90`.

Sidebar:

- Desktop sidebar: `md:w-60 lg:w-64 flex-col border-r border-light-border bg-background`
- Active item: `hover:bg-secondary/10` and `text-primary` for selected/active states. Many items use `rounded-md`/`rounded-lg` and `transition-all duration-200`.

---

## 6. Animation & Transitions

- Default durations frequently used: `duration-200` (200ms), `duration-300` (300ms), `duration-500` (500ms).
- Easing: `ease-in-out`, `ease-out`, `ease-in` used across components.
- Keyframes:
  - `@keyframes fadeIn { from { opacity: 0.6 } to { opacity: 1 } }` — used by `.ai-markdown-body` with `animation: fadeIn 0.15s ease-in;` ([globals.css](frontend/src/app/globals.css#L196-L204)).
- Common hover/focus patterns:
  - `transition-all duration-200` and `transition-colors duration-200` for interactive elements
  - `hover:shadow-md`, `hover:scale-[1.02]`, `hover:translate-y-0.5` for micro-interactions
- Framer Motion is used for header and CTA interactions (scale on hover/tap and animated backdrop blur).

---

## 7. Dark Mode Implementation

- Tailwind configuration: `darkMode: "class"` ([tailwind.config.ts](frontend/tailwind.config.ts#L1-L10)).
- ThemeProvider: NextThemes `ThemeProvider attribute="class" defaultTheme="light"` in [layout.tsx](frontend/src/app/layout.tsx#L1-L120).
- CSS switching method: `.light { ... }` and `.dark { ... }` define the variable values; the app toggles these modes by applying `light` or `dark` classes at the root (and Tailwind `dark:` utilities are also used). This means the implementation uses both CSS variable swapping and Tailwind `dark:` variants.

Root-level snippets (from `globals.css`):

- `.light { --primary: #2f1a58; --accent: #e69a29; --secondary: #8c6dc9; --heading: #111827; --para: #3a424d; --para-muted: #6b7280; --button: #374151; --radius: 0.625rem; --background: #f7f6f6; --main-background: #f3f3f3; --light-border: #e5e7eb; --destructive: #eb5252; --success: #10b981; --info: #3b82f6; --toast-bg: #ffffff; }
- `.dark { --primary: #9b5de5; --accent: #fbbf24; --secondary: #a78bfa; --heading: #f0ecf9; --para: #c8c2d6; --para-muted: #8b83a6; --button: #f0ecf9; --radius: 0.625rem; --background: #13101e; --main-background: #0b0915; --border: #2a2445; --card: #1a1530; --input: #1e1836; --muted: #110e1c; --popover: #1a1530; --destructive: #e54545; --success: #34d399; --info: #60a5fa; --light-border: #26203e; --toast-bg: #0b0915; }

---

## 8. Special / Unique Design Patterns

- Glassmorphism / Frosted-glass: `backdrop-blur-sm` / `backdrop-blur-md` combined with translucent backgrounds (e.g., `bg-white/60 dark:bg-card/60 backdrop-blur-xl`) used in hero cards and overlays.
- Gradients: extensive usage of `bg-gradient-to-*` with `from-primary`, `via-secondary`, `to-accent` on badges, cards, and decorative shapes.
- Glow effects: color-tinted shadows like `shadow-primary/5` and blurred gradient circles (`blur-3xl`) for soft glow backgrounds.
- Brand motifs: primary purple (#2f1a58 light / #9b5de5 dark), warm accent amber, and rounded card geometry with subtle gradients.

---

## References (exact files)

- [tailwind.config.ts](frontend/tailwind.config.ts#L1-L60)
- [globals.css](frontend/src/app/globals.css#L1-L250)
- [layout.tsx](frontend/src/app/layout.tsx#L1-L220)
- [components/ui/Button.tsx](frontend/src/components/ui/Button.tsx#L1-L200)
- [components/ui/Input.tsx](frontend/src/components/ui/Input.tsx#L1-L200)
- [components/landing/Navbar.tsx](frontend/src/components/landing/Navbar.tsx#L1-L200)

---

If you want a companion `tokens.json` (Light/Dark key-value map) or a ready-to-drop `:root` + `.dark` CSS snippet, tell me which format and I'll add it to the repo.
