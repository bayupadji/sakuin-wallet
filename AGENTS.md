# AGENTS.md

Guidance for AI coding agents working on **Dompet Digital Dollar**, a USD digital wallet website. Source of truth for product behavior is the PRD (Indonesian). This file turns it into working rules for code.

## 1. Product in one paragraph

Customers in Indonesia hold a **USD balance**, request a **virtual debit card**, **top up** via Rupiah (QRIS, Virtual Account, or bank transfer through a third-party payment gateway, converted to USD immediately), **receive Rupiah payments** that are converted to USD, and view **transaction history**. An **admin dashboard** manages customers, reviews **KYC (ID card photo only, always approved manually by an admin)**, handles disputes, lets a reconciliation role view customer transactions, and monitors transaction and user traffic. Balance can only be spent **through the virtual card**.

## 2. Tech stack

| Layer | Choice |
| --- | --- |
| Frontend | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Client state | Zustand (UI state only) |
| Server state | TanStack Query |
| Backend | Supabase (BaaS): Auth, Edge Functions, Storage, Realtime |
| Database | Supabase Postgres with Row Level Security (RLS) |
| Third parties | Payment gateway (QRIS, VA, bank transfer; provider not chosen yet), UQPay (VISA Platinum virtual cards), Wise (FX rates, no margin), email service. WhatsApp notifications come later |

UI language is **Indonesian first**. English and other languages are future features. Keep all user-facing strings in one place (e.g. `src/shared/messages/id.ts`, with `en.ts` added later) so more languages can be added without touching components. Never hardcode strings deep inside components.

## 3. Commands

Assumes `pnpm`. Adjust if the scaffold uses something else.

```bash
pnpm install
pnpm dev                 # Next.js dev server
pnpm build
pnpm lint
pnpm typecheck           # tsc --noEmit
pnpm test                # unit tests
supabase start           # local Supabase stack
supabase db reset        # re-apply migrations and seed
supabase migration new <name>
supabase gen types typescript --local > src/shared/infrastructure/types/database.ts
supabase functions serve
```

Run `pnpm lint && pnpm typecheck && pnpm test` before finishing any task.

## 4. Architecture: Feature-Driven Layering

Code is organized **by feature first, then by layer inside each feature**. Every feature owns its screens, use cases, business rules, and data access, so a change to one feature stays inside one folder. Cross-feature code lives in `shared/`.

Features: `auth`, `wallet`, `kyc`, `card`, `top-up`, `receive-payment`, `transactions` (history), `disputes`, `notifications`, `admin` (customer management, traffic and user monitoring).

Reconciliation views of customer transactions (read only) live in `transactions/presentation/admin/`. Notification channels are adapters in `notifications/infrastructure/channels/` (web realtime, email; WhatsApp is added later without changing use cases).

### Layers inside every feature

| Layer | Responsibility | Contains |
| --- | --- | --- |
| **presentation** | What the user sees and touches | React components, forms, view-only logic |
| **application** | Use cases and client-side orchestration | TanStack Query hooks, services (use cases), Zustand stores |
| **domain** | Business rules, framework-free | Entities, rule functions, repository interfaces, typed errors |
| **infrastructure** | Talking to the outside world | Supabase repository implementations, Edge Function callers, mappers |

### Dependency rules

```
presentation  ->  application  ->  domain  <-  infrastructure     (inside a feature)
app/  ->  features/*/index.ts  ->  shared/                          (across the codebase)
```

1. **Inside a feature**, dependencies point inward to `domain`. `domain` imports nothing from React, Next.js, Supabase, or other layers. `presentation` never imports `infrastructure` or calls Supabase directly. `infrastructure` implements the interfaces declared in `domain` and maps database rows to domain entities.
2. Each feature wires its services to its repository implementations in `application/container.ts`.
3. **Across features**, import only through the other feature's public API: `features/<name>/index.ts`. No deep imports such as `features/wallet/domain/...` from another feature. Avoid circular dependencies between features.
4. If two features need the same code, move it to `shared/` instead of importing sideways. If it knows about one feature's business, keep it in that feature.
5. `shared/` never imports from `features/`. `app/` (routing) imports only feature public APIs and `shared/`, and holds no business logic.
6. **Customer and admin screens are separate.** Code in `presentation/customer/` and `presentation/admin/` never imports from the other side. Anything both need goes in the feature's `presentation/common/` or in `shared/`. Admin routes live only under `app/(admin)/admin/`, and are protected by middleware (role plus 2FA) **and** by RLS, never by hiding links.
7. Enforce all of this with ESLint import-boundary rules (e.g. `eslint-plugin-boundaries` or `no-restricted-imports`). Boundary violations fail lint.

### Folder structure

```
src/
  app/                              # Next.js routing only; pages compose feature components
    (public)/                       #   landing, customer sign in, sign up
    (customer)/                     #   customer pages, own layout (wallet, card, top-up, receive, history, account)
    (admin)/admin/                  #   admin pages, own layout and sign in (customers, KYC review, disputes, monitoring)
    api/                            #   thin route handlers, no business logic
  features/
    <feature>/                      # e.g. wallet, kyc, card, top-up, receive-payment, ...
      presentation/
        customer/                   #   customer-facing components and forms
        admin/                      #   admin-facing components (e.g. KYC review queue)
        common/                     #   used by both sides (e.g. TransactionStatusBadge)
      application/
        queries/                    #   TanStack Query hooks and query keys (keys.ts)
        mutations/                  #   mutation hooks
        services/                   #   use cases (topUp, requestCard, submitKyc, reviewKyc, openDispute)
        stores/                     #   Zustand stores (UI state only)
        container.ts                #   wires services to repository implementations
      domain/
        entities/                   #   Wallet, Transaction, Card, KycSubmission, Dispute, ...
        rules/                      #   KYC status transitions, fee calculation (the product has no limits)
        repository.ts               #   repository interface(s) for this feature
        errors.ts                   #   typed domain errors
      infrastructure/
        repository.supabase.ts      #   Supabase implementation of the repository
        edge.ts                     #   typed callers for this feature's Edge Functions
        mappers.ts                  #   database row <-> domain entity
      index.ts                      # PUBLIC API of the feature (the only allowed import point)
  shared/
    domain/                         # cross-feature value objects: Money (cents), FxRate, Currency, Nik, base errors
    infrastructure/
      supabase/                     #   browser client, server client, middleware helper
      edge-client.ts                #   base helper for invoking Edge Functions
      types/database.ts             #   generated Supabase types (infrastructure code only)
    application/                    # QueryClient setup, providers
    presentation/
      ui/                           #   primitives (Button, Input, Dialog, Skeleton, EmptyState)
      layouts/                      #   CustomerLayout and AdminLayout shells
    messages/                       # user-facing strings (Indonesian first, i18n ready)
    config/                         # env access, constants
    utils/                          # format helpers with no business meaning
supabase/
  migrations/                       # SQL, one concern per file
  functions/                        # Edge Functions, layered too (see below)
  seed.sql
```

Create only the layer folders a feature actually needs. A small feature may have just `presentation` and `application`. The `domain` and `infrastructure` folders appear as soon as there are rules or data access to put there.

### Typical flows

- **Read:** page in `app/(customer)/` -> `WalletOverview` component (`wallet/presentation`) -> `useWalletQuery` (`wallet/application`) -> `WalletRepository` interface (`wallet/domain`) -> Supabase implementation (`wallet/infrastructure`) -> row mapped to a `Wallet` entity.
- **Top up:** form (`top-up/presentation`) -> `useTopUpMutation` (`top-up/application`) -> `topUpService` checks rules from `top-up/domain` (KYC approved via the `kyc` public API, fee calculation) -> `top-up/infrastructure/edge.ts` -> Edge Function. The browser never changes balance itself.
- **Cross-feature:** the wallet screen shows KYC status by importing `useKycStatus` from `@/features/kyc`, never from `@/features/kyc/application/...`.

### Layering inside Edge Functions

Each function in `supabase/functions/<name>` follows the same idea: `index.ts` (handler: parse, auth, validate) -> `service.ts` (use case, business rules) -> `repository.ts` and `gateway.ts` (database and third-party calls). Shared rule code that must match the frontend lives in `supabase/functions/_shared/domain`, and money rules stay identical on both sides, with the **server as the authority**.

## 5. Modules and phases

Phase assignment follows the PRD roadmap (KYC pulled into Phase 1).

| Phase | Modules |
| --- | --- |
| 1 | Main Wallet, Sign up / Sign in / Sign out, KYC submission (ID card photo), KYC review (admin) |
| 2 | Virtual Debit Card, Top Up USD Balance, Receive Rupiah Payments, Transaction History, Transaction Notifications |
| 3 | Rest of Account and Security (transaction PIN, profile and settings) |
| 4 | Admin Dashboard (customers, disputes, traffic and user monitoring), Security Notifications, Notification Settings. The reconciliation transaction view (DA-07) is recommended with Phase 2 |

Do not build features from a later phase unless asked. Use feature flags for anything not yet released.

Approved sub-features marked "proposed" in the earlier PRD draft are now in scope, **except** these future features, which must not be built yet: DU-04 (recent transactions on the wallet), TU-05 (top-up receipt download), RT-04 (history export). Also future: WhatsApp notifications and languages other than Indonesian.

## 6. Money rules (never break these)

1. **Store money as integer cents** (`bigint`). Never use floating point for amounts. Rupiah amounts are integers in IDR.
2. **Balance changes only through Postgres functions or Edge Functions** running server side. The browser never writes to `wallets`, `ledger_entries`, or `transactions`.
3. **Ledger is append-only.** Wallet balance is derived from ledger entries. Never update or delete a ledger row. Corrections are new entries.
4. **Every money request carries an idempotency key.** Repeated clicks or repeated webhooks must not change the balance twice.
5. **Credit balance only after a verified gateway webhook** (verify signature). Never trust the client to say a payment succeeded.
6. Post ledger entries in **one database transaction**: lock the wallet row, insert the entry, update the balance, set the transaction status.
7. **FX rate is locked 15 minutes** from when the payer opens the payment page. After that, recompute and show the new amount before payment. Rate comes from Wise, stored in the `fx_rates` table and fetched by an Edge Function. **There is no margin**: the customer rate equals the Wise reference rate.
8. Use one rounding rule everywhere (round to the nearest cent).
9. Store timestamps in **UTC**, display in **WIB (Asia/Jakarta)**.
10. Formats: dollar `$1,234.56`, rupiah `Rp1.500.000`. Always show currency, rate, fee, and final total before a payment is confirmed.
11. Transaction statuses: `pending`, `success`, `failed`, `expired`, `refunded`. Only `success` and `refunded` change balance.
12. **Top up is paid in Rupiah and converted to USD immediately** after the gateway confirms payment. Methods: QRIS, VA, bank transfer. The rate rule for VA and bank transfer paid long after the order was created is undecided (see section 13).
13. **A top-up payer can be anyone.** The payer needs no account and the payer name need not match the customer. Credit always goes to the account that owns the top-up order. Store payer name and payment source from gateway data when available.
14. **The product has no limits** (top up, balance, receiving). Gateway and card issuer technical limits still apply; show them as clear messages. A customer may set optional card limits for themselves (KD-04).
15. **Fees** exist for top up and for transactions, but amounts are not decided. Read them from the `fee_config` table, never hardcode. Always show each fee before confirmation.

## 7. KYC rules

- KYC uses **one document only: ID card (KTP) photo**. No selfie, no liveness.
- Status flow: `not_verified` -> `in_review` -> `approved` | `rejected` | `reupload_required`.
- **Approval is always manual** by an admin (`kyc_reviewer` or `super_admin`). Never auto-approve, and never expose a code path that sets `approved` from the customer side.
- Customers who are not `approved` can view the wallet but **cannot** top up, request a card, or receive payments.
- Client-side checks before upload: JPG or PNG, max 5 MB, sharpness and size check.
- Store the photo in a **private** Supabase Storage bucket. Only KYC reviewers and super admins get short-lived signed URLs. Log every access in `audit_logs`.
- Encrypt the ID number (NIK) at column level, mask it in lists, one NIK per account (unique index).
- Rejected users may resubmit, maximum 3 times (assumption, confirm with product).

## 8. Security rules

- **RLS enabled on every table.** Customers read only their own rows (`user_id = auth.uid()`). Admin roles come from JWT claims and have separate policies.
- Roles: `customer`, `super_admin`, `kyc_reviewer`, `dispute_agent`, `analyst`, `reconciliation`. Analysts never see ID card photos. `reconciliation` reads transaction data only (read only, no ID photos, no full card data).
- The `service_role` key exists **only** in Edge Functions and server code. Never ship it to the browser or commit it.
- Secrets in environment variables. Provide `.env.example`, never commit `.env*`.
- Admin pages require 2FA (TOTP) and are protected in Next.js middleware **and** by RLS. Middleware alone is not enough.
- Never store full card numbers or CVV. Keep only the issuer reference and last 4 digits. Show card details only after re-authentication (password in Phase 2, transaction PIN once available in Phase 3) and hide them again after 30 seconds.
- Rate limit sign in, sign up, password reset. Lock after 5 failed attempts.
- Every admin action and every status change that moves money writes to `audit_logs` (actor, action, entity, before, after, IP).
- Do not log personal data (ID number, photo paths, card data) in application logs.

## 9. Frontend conventions

- **TanStack Query owns server data** (wallet, transactions, cards, KYC status, admin lists). Define query keys per feature in `application/queries/keys.ts`. Invalidate related keys after mutations. Do not copy server data into Zustand.
- **Zustand is for UI state only** (modals, selected filters, sidebar, balance hidden toggle, multi-step form progress). Keep stores small and per feature.
- Prefer Server Components for reading data that does not need interactivity; use Client Components for interactive parts. Mark with `'use client'` only when needed.
- Mutations that touch money call an Edge Function or RPC, never write tables directly. Show pending state, disable the submit button, and reuse the idempotency key on retry.
- Build **mobile first** (360 px, 768 px, 1280 px). Admin dashboard is optimized for desktop.
- Every data screen needs four states: **loading** (skeleton), **empty** (message plus primary action), **error** (cause plus "Try again"), **success**. Keep filters when an error happens.
- Tailwind only. Put design tokens (colors, spacing, radius) in the Tailwind config. Reuse primitives in `src/shared/presentation/ui` before creating new ones. Avoid decorative UI, one primary action per screen.
- Supabase clients: one browser client, one server client (cookies), created in `src/shared/infrastructure/supabase`. Components and hooks never import them; they go through each feature's repositories and Edge Function callers. Generated types in `src/shared/infrastructure/types/database.ts` stay inside infrastructure code and are mapped to domain entities.

## 10. UX and accessibility

- Meet **WCAG 2.1 AA**: text contrast 4.5:1, full keyboard operation, visible focus, labels and error messages tied to inputs, touch targets at least 44 px, never rely on color alone.
- UI copy is Indonesian. Button labels are verbs: "Top Up", "Ajukan Kartu", "Kirim KTP", "Bekukan Kartu".
- Error copy states the cause and the next step, for example: "Foto KTP kurang jelas. Ambil ulang di tempat terang tanpa pantulan."
- Confirm destructive or sensitive actions (freeze card, suspend account) with a short dialog.
- No dark patterns: fees are never hidden, no misleading buttons.

## 11. Supabase conventions

- All schema changes go through **migrations** in `supabase/migrations`. Never edit the database by hand.
- Name tables in `snake_case`, plural. Keep these core tables: `profiles`, `kyc_submissions`, `wallets`, `ledger_entries`, `transactions`, `payment_requests`, `fx_rates`, `fee_config`, `cards`, `disputes`, `dispute_events`, `notifications`, `notification_preferences`, `audit_logs`.
- Each new table ships with its RLS policies in the same migration, plus an index for each foreign key and common filter.
- Money functions are `SECURITY DEFINER` with a fixed `search_path`, and validate the caller.
- Edge Functions: one per concern (`create-topup`, `create-payment-request`, `gateway-webhook`, `fetch-fx-rate`, `issue-card`). Validate input, verify webhook signatures, return typed errors.
- Use Realtime for in-app notifications. Use `pg_cron` or a scheduled function to expire pending transactions and payment requests, and to run the daily ledger reconciliation.

## 12. Testing

- Unit test money helpers (cents conversion, rounding, FX calculation).
- Test database functions with pgTAP or SQL tests: ledger posting, idempotency, double webhook, underpayment, overpayment, payment after expiry.
- Test RLS: a customer cannot read another customer's rows, an analyst cannot read ID photos, a reviewer cannot touch disputes, `reconciliation` can read transactions but cannot write or read ID photos.
- Test that a customer can never set KYC to `approved`, and that a top up paid under a different payer name credits the owning account exactly once.
- Component tests for the four screen states on critical flows (top up, receive payment, KYC upload).
- A reconciliation check (ledger total equals wallet balance) must pass in CI.

## 13. Open decisions (do not invent answers)

If a task depends on one of these, ask or leave a clearly marked `TODO(decision)`:

- Fee amounts (top up fee, transaction fee). Which transactions pay the transaction fee. Fees for receiving payments and card issuance have not been discussed.
- Whether the "anyone can pay" rule (section 6, rule 13) also applies to Rupiah payment requests (Receive Payments). Current rule: the payer of a payment request must be a registered user with a virtual card. Whether that payer must be KYC approved is also open.
- FX rate for VA and bank transfer top ups paid long after the order was created: lock at order time, or use the rate when payment arrives.
- Which payment gateway is used, and how bank transfers are matched (dedicated VA, unique code, or manual).
- Whether the top-up amount is entered in USD or Rupiah (the draft shows both).
- Withdrawals to bank accounts and transfers between users: cannot be confirmed yet. Do not build.

Decided: top up via QRIS, VA, or bank transfer, converted to USD immediately; card issuer UQPay with VISA Platinum; FX from Wise with no margin; no limits; KYC approval always manual; Indonesian UI first; transaction notifications by web and email.

## 14. Out of scope

Physical cards, withdrawals to bank accounts, transfers between users, currencies other than USD for balances, native mobile apps, selfie or liveness KYC, loans or investments, WhatsApp notifications, languages other than Indonesian, and the future features DU-04, TU-05, and RT-04.

## 15. Working agreement for agents

- Make the smallest change that completes the task. Do not refactor unrelated code.
- Do not add dependencies without a reason; prefer what is already in the stack.
- Do not weaken RLS, skip signature checks, or bypass the ledger to make something work.
- If the PRD and the code disagree, say so and ask before choosing.
- Describe what you changed and how you verified it (commands run, tests added).