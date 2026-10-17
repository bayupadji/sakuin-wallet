# Design System: Dompet Digital Dollar

A modern, minimalist, premium fintech experience inspired by the precision and craftsmanship of **Linear, Revolut, Wise, Ramp, and Apple Wallet**.

---

## 1. Design Direction & Character

- **Aesthetic**: Minimalist, elegant, restrained, and unmistakably financial.
- **Visual Personality**: High-trust, Swiss-style precision, calm surfaces, crisp hairline borders, and purposeful whitespace.
- **Core Tenet**: Clear financial data over visual noise. Every number, status, and button has an intentional reason to exist.
- **Anti-Patterns Rejected**:
  - No bloated multi-color gradients or neon glows.
  - No decorative AI capsule pills without real status.
  - No emoji as navigation icons.
  - No floating excessive blur or glassmorphism everywhere.

---

## 2. Design Tokens

### Spacing System (8px Grid)
- Base Unit: `4px` / `8px`
- Scales: `xs (4px)`, `sm (8px)`, `md (16px)`, `lg (24px)`, `xl (32px)`, `2xl (48px)`, `3xl (64px)`
- Tap Target Minimum: `44px` on all mobile and desktop controls.

### Color Tokens

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `background` | `#F8FAFC` (Slate 50) | `#090D14` (Obsidian) | App root canvas |
| `card` | `#FFFFFF` | `#111726` | Financial cards & modals |
| `foreground` | `#0F172A` (Slate 900) | `#F8FAFC` (Slate 50) | Primary typography (contrast > 12:1) |
| `muted-foreground` | `#64748B` (Slate 500) | `#94A3B8` (Slate 400) | Secondary labels (contrast > 4.5:1) |
| `border` | `#E2E8F0` (Slate 200) | `#1E293B` (Slate 800) | Hairline 1px dividers & cards |
| `accent` | `#0D9488` (Teal 600) | `#14B8A6` (Teal 500) | Primary financial CTA & active metrics |
| `destructive` | `#E11D48` (Rose 600) | `#F43F5E` (Rose 500) | Freeze card, errors, negative deltas |
| `warning` | `#D97706` (Amber 600) | `#F59E0B` (Amber 500) | Pending KYC, awaiting webhook |

### Typography Scale
- **Headings**: `var(--font-geist-sans)` with `font-bold` or `font-semibold`, `text-balance`.
- **Financial Values**: `var(--font-mono)` with `tabular-nums tracking-tight font-bold`.
- **Body & Labels**: `var(--font-geist-sans)`, `text-pretty`.

---

## 3. Financial Components Architecture

1. **Balance & Fund Summary**:
   - High-contrast, bold font-mono currency values (`$1,234.56`).
   - Tactile eye toggle for balance privacy with instant state feedback.
2. **Virtual Debit Card**:
   - Sleek Apple Wallet-inspired physical simulation: metallic obsidian card finish, contactless waves, EMV chip visual, masked card number, and live freeze/unfreeze status badge.
3. **Quick Action Group**:
   - Circular/pill action buttons for Top Up, Request Card, Receive Payment, and History.
4. **FX Rate & Exchange Ticker**:
   - Live USD/IDR conversion indicator with guaranteed 15-minute rate lock countdown.
5. **Activity Ledger**:
   - High-contrast transaction rows displaying merchant name, category icon, WIB date, and color-coded tabular amounts (`+$50.00` in teal, `-$12.00` in slate).
6. **Accessible States**:
   - Every view must provide: loading (skeleton), empty (clear cause and single action), error (cause + retry), and success.
