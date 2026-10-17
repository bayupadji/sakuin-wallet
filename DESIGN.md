# Design Direction: Dompet Digital Dollar

Visual foundation and design system rules for Dompet Digital Dollar.
Created under **antislop** (DURING mode) and **Modern Fintech Minimalist** principles.

---

## 1. Brand Identity & Personality

- **Identity**: Secure, friction-free USD digital wallet for Indonesian digital workers, freelancers, and businesses.
- **Personality**: Precise, trustworthy, calm, and institutional without being bureaucratic.
- **Core Principle**: Form follows financial clarity. Every element exists to provide clarity on balance, FX exchange rates, fees, and transaction states.

---

## 2. Design Dials

| Dial | Level (1-3) | Meaning |
| --- | --- | --- |
| **ENERGY** | 2 | Restrained, clean surfaces with crisp typography and intentional accents. No loud or random visual noise. |
| **RHYTHM** | 2 | Balanced grid rhythm. Clear separation between account overview, quick actions, and data ledger. |
| **MOTION** | 1 | Functional micro-interactions only (state changes, feedback <= 150ms). Zero looping decorative pulses or gratuitous floating animations. |

---

## 3. Color System (Strict Max 2-3 Cores + 1 Primary Accent)

### Neutrals (Base)
- Light Surface: `#FFFFFF` (pure surface), `#F8FAFC` (slate-50 background)
- Borders & Dividers: `#E2E8F0` (slate-200), `#CBD5E1` (slate-300)
- Text Hierarchy:
  - Primary text: `#0F172A` (slate-900, contrast > 12:1)
  - Secondary text: `#475569` (slate-600, contrast > 5.5:1, passes WCAG AA 4.5:1)
  - Muted text: `#64748B` (slate-500, contrast > 4.6:1 against white)

### Dark Mode Parity
- Dark Surface: `#0B0F17` (deep slate base), `#151D2A` (card surface)
- Dark Borders: `#1E293B` (slate-800)
- Dark Text:
  - Primary text: `#F8FAFC` (slate-50)
  - Secondary text: `#94A3B8` (slate-400, contrast > 6:1)

### Accents (Purpose-Bound)
- **Primary Financial Accent**: Emerald / Teal (`#0D9488` / Tailwind `teal-600`, dark mode `#14B8A6` / `teal-500`). Used strictly for primary action CTA, active wallet balance highlights, and success verification badges.
- **Alert / Destructive**: Crimson (`#E11D48` / `rose-600`). Used strictly for errors, freeze card, and negative ledger adjustments.
- **Pending / In Review**: Amber (`#D97706` / `amber-600`). Used for pending KYC or awaiting gateway webhook.

*Rules:*
- No generic blue-to-purple or neon gradients.
- Gradients are banned except for subtle linear debit card simulation.
- Glow effects are never used as primary affordances.

---

## 4. Typography & Numbers

- **UI Sans**: `var(--font-geist-sans)`, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif.
- **Financial Monospace**: `var(--font-geist-mono)`, 'SFMono-Regular', Consolas, monospace.
- **Formatting Rules**:
  - All currency numbers **MUST** use `tabular-nums` to prevent horizontal jitter during updates.
  - Dollar amounts formatted as `$1,234.56` (stored strictly as integer cents in database/domain).
  - Rupiah amounts formatted as `Rp 1.500.000` (stored strictly as integer IDR).
  - Headings use `text-balance`, body paragraphs use `text-pretty`.

---

## 5. Component & Interaction Constraints

- **Touch Targets**: Minimum 44px x 44px for every interactive element on mobile and desktop.
- **Focus Rings**: Never use `outline: none` without a clear ring. Always use `focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2`.
- **Destructive Actions**: Always require explicit confirmation modal (`AlertDialog` / Dialog).
- **Icons**: Vector SVG only (Lucide Icons). Decorative icons beside text must have `aria-hidden="true"`. Standalone icon buttons must have explicit `aria-label`.
- **Card Elevation**: Flat 1px border (`border-slate-200 dark:border-slate-800`) by default; subtle shadow (`shadow-xs` / `shadow-sm`) only for interactive hovering or popovers.
- **States Requirement**: Every financial data component must support:
  1. `loading`: Structural skeleton loader matching layout height.
  2. `empty`: Clear explanation of why no records exist with a single primary action button.
  3. `error`: Explicit failure reason and a "Try again" retry trigger.
  4. `success`: Clear data presentation with localized WIB timestamps.
