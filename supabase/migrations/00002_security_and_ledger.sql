-- Migration: 00002_security_and_ledger.sql
-- Description: Audit remediation - RLS privilege escalation fix, NIK hash/masked columns,
-- append-only double-entry ledger, server-only settlement RPC, FX rates, fee config, cards, and promo banners.

-- 1. Extend user_role enum with reconciliation role (AGENTS.md Section 8)
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'reconciliation';

-- 2. Private schema for non-recursive RLS role lookups (supabase-postgres-best-practices)
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_any_role(allowed_roles public.user_role[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = (SELECT auth.uid())
      AND p.role = ANY(allowed_roles)
  );
$$;

REVOKE ALL ON FUNCTION private.has_any_role(public.user_role[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_any_role(public.user_role[]) TO authenticated, service_role;

-- 3. Harden profiles RLS & prevent privilege escalation on role column
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK (
    (SELECT auth.uid()) = id
    AND role = (SELECT p.role FROM public.profiles p WHERE p.id = (SELECT auth.uid()))
  );

CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING ((SELECT private.has_any_role(ARRAY['super_admin', 'kyc_reviewer', 'analyst']::public.user_role[])));

CREATE OR REPLACE FUNCTION private.prevent_profile_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF current_setting('request.jwt.claim.role', true) IS DISTINCT FROM 'service_role'
       AND NOT private.has_any_role(ARRAY['super_admin']::public.user_role[]) THEN
      RAISE EXCEPTION 'Forbidden: customers cannot modify profile role';
    END IF;
  END IF;
  NEW.updated_at := timezone('utc', now());
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.prevent_profile_role_escalation() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_prevent_profile_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_profile_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION private.prevent_profile_role_escalation();

-- 4. Harden wallets RLS (non-recursive + reconciliation read access)
DROP POLICY IF EXISTS "Users can read own wallet" ON public.wallets;
DROP POLICY IF EXISTS "Admins can view all wallets" ON public.wallets;

CREATE POLICY "Users can read own wallet"
  ON public.wallets FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Admins can view all wallets"
  ON public.wallets FOR SELECT
  TO authenticated
  USING ((SELECT private.has_any_role(ARRAY['super_admin', 'analyst', 'reconciliation']::public.user_role[])));

-- 5. KYC hardening: separate encrypted NIK, masked display NIK, and deterministic HMAC hash for 1-NIK-per-account
ALTER TABLE public.kyc_submissions
  ADD COLUMN IF NOT EXISTS nik_masked TEXT,
  ADD COLUMN IF NOT EXISTS nik_hash TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_kyc_unique_active_nik_hash
  ON public.kyc_submissions (nik_hash)
  WHERE nik_hash IS NOT NULL AND status IN ('in_review', 'approved');

CREATE INDEX IF NOT EXISTS idx_kyc_reviewed_by ON public.kyc_submissions (reviewed_by);

CREATE OR REPLACE FUNCTION private.enforce_kyc_attempt_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_count INT;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM public.kyc_submissions
  WHERE user_id = NEW.user_id;

  IF v_count >= 3 THEN
    RAISE EXCEPTION 'Maximum KYC submission attempts (3) exceeded';
  END IF;

  NEW.attempt_count := v_count + 1;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.enforce_kyc_attempt_limit() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_enforce_kyc_attempt_limit ON public.kyc_submissions;
CREATE TRIGGER trg_enforce_kyc_attempt_limit
  BEFORE INSERT ON public.kyc_submissions
  FOR EACH ROW EXECUTE FUNCTION private.enforce_kyc_attempt_limit();

DROP POLICY IF EXISTS "Users can view own KYC submissions" ON public.kyc_submissions;
DROP POLICY IF EXISTS "Users can insert own KYC submission" ON public.kyc_submissions;
DROP POLICY IF EXISTS "KYC Reviewers and Super Admins can view all KYC submissions" ON public.kyc_submissions;
DROP POLICY IF EXISTS "KYC Reviewers and Super Admins can update KYC review" ON public.kyc_submissions;

CREATE POLICY "Users can view own KYC submissions"
  ON public.kyc_submissions FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own KYC submission"
  ON public.kyc_submissions FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.uid()) = user_id
    AND status = 'in_review'
    AND reviewed_by IS NULL
    AND reviewed_at IS NULL
  );

CREATE POLICY "KYC Reviewers and Super Admins can view all KYC submissions"
  ON public.kyc_submissions FOR SELECT
  TO authenticated
  USING ((SELECT private.has_any_role(ARRAY['super_admin', 'kyc_reviewer']::public.user_role[])));

CREATE POLICY "KYC Reviewers and Super Admins can update KYC review"
  ON public.kyc_submissions FOR UPDATE
  TO authenticated
  USING ((SELECT private.has_any_role(ARRAY['super_admin', 'kyc_reviewer']::public.user_role[])))
  WITH CHECK ((SELECT private.has_any_role(ARRAY['super_admin', 'kyc_reviewer']::public.user_role[])));

-- 6. FX Rates Table (Wise zero-margin reference rate, locked 15 minutes)
CREATE TABLE IF NOT EXISTS public.fx_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_currency TEXT NOT NULL CHECK (base_currency = 'USD'),
  target_currency TEXT NOT NULL CHECK (target_currency = 'IDR'),
  rate NUMERIC(18, 6) NOT NULL CHECK (rate > 0),
  source TEXT NOT NULL DEFAULT 'wise',
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  locked_until TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_fx_rates_lookup
  ON public.fx_rates (base_currency, target_currency, locked_until DESC);

ALTER TABLE public.fx_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read FX rates"
  ON public.fx_rates FOR SELECT
  TO anon, authenticated
  USING (true);

-- 7. Fee Config Table (AGENTS.md Rule 15: never hardcode fees; TODO(decision) on final amounts)
CREATE TABLE IF NOT EXISTS public.fee_config (
  code TEXT PRIMARY KEY,
  fee_type TEXT NOT NULL CHECK (fee_type IN ('flat_idr', 'bps')),
  fee_value BIGINT NOT NULL CHECK (fee_value >= 0),
  description TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.fee_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read fee config"
  ON public.fee_config FOR SELECT
  TO anon, authenticated
  USING (true);

INSERT INTO public.fee_config (code, fee_type, fee_value, description)
VALUES
  ('topup_va', 'flat_idr', 4500, 'TODO(decision): Biaya kanal Virtual Account IDR'),
  ('topup_qris', 'bps', 70, 'TODO(decision): Biaya MDR QRIS 0.70% (70 bps)')
ON CONFLICT (code) DO NOTHING;

-- 8. Transactions Table (Server-writable only; browser never writes directly)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  type TEXT NOT NULL CHECK (type IN ('topup', 'card', 'receive')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'expired', 'refunded')),
  title TEXT NOT NULL,
  merchant TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  amount_usd_cents BIGINT NOT NULL CHECK (amount_usd_cents > 0),
  amount_idr BIGINT NOT NULL CHECK (amount_idr >= 0),
  fx_rate NUMERIC(18, 6) NOT NULL CHECK (fx_rate > 0),
  fee_idr BIGINT NOT NULL DEFAULT 0 CHECK (fee_idr >= 0),
  channel TEXT NOT NULL,
  reference_id TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  ledger_sequence TEXT NOT NULL DEFAULT 'LDG-PENDING',
  payer_name TEXT,
  payment_source TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_created
  ON public.transactions (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_status
  ON public.transactions (status);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own transactions"
  ON public.transactions FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Authorized staff can read all transactions"
  ON public.transactions FOR SELECT
  TO authenticated
  USING ((SELECT private.has_any_role(ARRAY['super_admin', 'analyst', 'reconciliation']::public.user_role[])));

-- 9. Append-Only Ledger Entries Table (AGENTS.md Rule 3 & Rule 6)
CREATE TABLE IF NOT EXISTS public.ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_no BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE,
  wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE RESTRICT,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('credit', 'debit')),
  amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
  balance_after_cents BIGINT NOT NULL CHECK (balance_after_cents >= 0),
  idempotency_key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_ledger_wallet_seq
  ON public.ledger_entries (wallet_id, sequence_no DESC);
CREATE INDEX IF NOT EXISTS idx_ledger_user_id
  ON public.ledger_entries (user_id);
CREATE INDEX IF NOT EXISTS idx_ledger_transaction_id
  ON public.ledger_entries (transaction_id);

CREATE OR REPLACE FUNCTION private.prevent_ledger_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  RAISE EXCEPTION 'Immutable ledger: ledger_entries rows cannot be updated or deleted';
END;
$$;

REVOKE ALL ON FUNCTION private.prevent_ledger_mutation() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_prevent_ledger_mutation ON public.ledger_entries;
CREATE TRIGGER trg_prevent_ledger_mutation
  BEFORE UPDATE OR DELETE ON public.ledger_entries
  FOR EACH ROW EXECUTE FUNCTION private.prevent_ledger_mutation();

ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own ledger entries"
  ON public.ledger_entries FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Authorized staff can read all ledger entries"
  ON public.ledger_entries FOR SELECT
  TO authenticated
  USING ((SELECT private.has_any_role(ARRAY['super_admin', 'analyst', 'reconciliation']::public.user_role[])));

-- 10. Atomic Gateway Webhook Settlement Function (service_role ONLY)
CREATE OR REPLACE FUNCTION public.post_gateway_topup_settlement(
  p_transaction_id UUID,
  p_webhook_idempotency_key TEXT,
  p_payer_name TEXT DEFAULT NULL,
  p_payment_source TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_tx public.transactions%ROWTYPE;
  v_wallet public.wallets%ROWTYPE;
  v_new_balance BIGINT;
  v_seq BIGINT;
  v_ledger_code TEXT;
BEGIN
  IF p_webhook_idempotency_key IS NULL OR btrim(p_webhook_idempotency_key) = '' THEN
    RAISE EXCEPTION 'Webhook idempotency key is required';
  END IF;

  -- Lock transaction row first
  SELECT * INTO v_tx
  FROM public.transactions
  WHERE id = p_transaction_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transaction % not found', p_transaction_id;
  END IF;

  -- Idempotent early return if already settled
  IF v_tx.status = 'success' THEN
    SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_tx.user_id;
    RETURN jsonb_build_object(
      'already_settled', true,
      'transaction_id', v_tx.id,
      'ledger_sequence', v_tx.ledger_sequence,
      'balance_cents', v_wallet.balance_cents
    );
  END IF;

  IF v_tx.status <> 'pending' THEN
    RAISE EXCEPTION 'Cannot settle transaction in status %', v_tx.status;
  END IF;

  IF v_tx.expires_at IS NOT NULL AND v_tx.expires_at < timezone('utc', now()) THEN
    UPDATE public.transactions
    SET status = 'expired', updated_at = timezone('utc', now())
    WHERE id = v_tx.id;
    RAISE EXCEPTION 'Transaction % has expired', v_tx.id;
  END IF;

  -- Lock wallet row (AGENTS.md Rule 6)
  SELECT * INTO v_wallet
  FROM public.wallets
  WHERE user_id = v_tx.user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Wallet for user % not found', v_tx.user_id;
  END IF;

  IF v_wallet.is_frozen THEN
    RAISE EXCEPTION 'Wallet % is frozen', v_wallet.id;
  END IF;

  v_new_balance := v_wallet.balance_cents + v_tx.amount_usd_cents;

  INSERT INTO public.ledger_entries (
    wallet_id,
    user_id,
    transaction_id,
    entry_type,
    amount_cents,
    balance_after_cents,
    idempotency_key
  )
  VALUES (
    v_wallet.id,
    v_tx.user_id,
    v_tx.id,
    'credit',
    v_tx.amount_usd_cents,
    v_new_balance,
    p_webhook_idempotency_key
  )
  RETURNING sequence_no INTO v_seq;

  v_ledger_code := 'LDG-' || to_char(timezone('utc', now()), 'YYYY') || '-' || lpad(v_seq::TEXT, 6, '0');

  UPDATE public.wallets
  SET balance_cents = v_new_balance,
      updated_at = timezone('utc', now())
  WHERE id = v_wallet.id;

  UPDATE public.transactions
  SET status = 'success',
      ledger_sequence = v_ledger_code,
      payer_name = COALESCE(p_payer_name, payer_name),
      payment_source = COALESCE(p_payment_source, payment_source),
      updated_at = timezone('utc', now())
  WHERE id = v_tx.id;

  INSERT INTO public.audit_logs (
    actor_id,
    action,
    entity,
    entity_id,
    before_state,
    after_state
  )
  VALUES (
    v_tx.user_id,
    'TOPUP_SETTLED',
    'wallet',
    v_wallet.id::TEXT,
    jsonb_build_object('balance_cents', v_wallet.balance_cents, 'tx_status', 'pending'),
    jsonb_build_object('balance_cents', v_new_balance, 'tx_status', 'success', 'ledger_sequence', v_ledger_code)
  );

  RETURN jsonb_build_object(
    'already_settled', false,
    'transaction_id', v_tx.id,
    'ledger_sequence', v_ledger_code,
    'balance_cents', v_new_balance
  );
END;
$$;

REVOKE ALL ON FUNCTION public.post_gateway_topup_settlement(UUID, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.post_gateway_topup_settlement(UUID, TEXT, TEXT, TEXT) TO service_role;

-- 11. Virtual Debit Cards Table (AGENTS.md Rule 8: never store full PAN or CVV)
CREATE TABLE IF NOT EXISTS public.cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  issuer_card_ref TEXT NOT NULL,
  cardholder_name TEXT NOT NULL,
  last4 TEXT NOT NULL CHECK (char_length(last4) = 4),
  expiry TEXT NOT NULL,
  issuing_country TEXT NOT NULL DEFAULT 'Singapura (MAS)',
  is_frozen BOOLEAN NOT NULL DEFAULT false,
  monthly_limit_cents BIGINT NOT NULL DEFAULT 200000 CHECK (monthly_limit_cents >= 0),
  online_transactions BOOLEAN NOT NULL DEFAULT true,
  non_3ds_transactions BOOLEAN NOT NULL DEFAULT true,
  atm_withdrawals BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT unique_user_virtual_card UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_cards_user_id ON public.cards (user_id);

ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own card"
  ON public.cards FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own card controls"
  ON public.cards FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK (
    (SELECT auth.uid()) = user_id
    AND issuer_card_ref = (SELECT c.issuer_card_ref FROM public.cards c WHERE c.id = id)
    AND last4 = (SELECT c.last4 FROM public.cards c WHERE c.id = id)
  );

CREATE POLICY "Super admins can view cards"
  ON public.cards FOR SELECT
  TO authenticated
  USING ((SELECT private.has_any_role(ARRAY['super_admin']::public.user_role[])));

-- 12. Promo Banners Table (Replaces localStorage-only CMS persistence)
CREATE TABLE IF NOT EXISTS public.promo_banners (
  id TEXT PRIMARY KEY,
  badge TEXT NOT NULL,
  title TEXT NOT NULL,
  headline TEXT NOT NULL DEFAULT '',
  subtitle TEXT NOT NULL DEFAULT '',
  cta_label TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('link', 'topup', 'receive', 'card', 'custom', 'custom_url')),
  href TEXT,
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL DEFAULT '',
  accent_theme TEXT NOT NULL DEFAULT 'teal' CHECK (accent_theme IN ('teal', 'emerald', 'cyan', 'amber', 'violet')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 1,
  promo_code TEXT,
  valid_until TEXT,
  steps TEXT[] NOT NULL DEFAULT '{}',
  terms TEXT[] NOT NULL DEFAULT '{}',
  click_count BIGINT NOT NULL DEFAULT 0,
  view_count BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_promo_banners_active_order
  ON public.promo_banners (is_active, display_order ASC);

ALTER TABLE public.promo_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active promo banners"
  ON public.promo_banners FOR SELECT
  TO anon, authenticated
  USING (is_active = true OR (SELECT private.has_any_role(ARRAY['super_admin']::public.user_role[])));

CREATE POLICY "Super admins manage promo banners"
  ON public.promo_banners FOR ALL
  TO authenticated
  USING ((SELECT private.has_any_role(ARRAY['super_admin']::public.user_role[])))
  WITH CHECK ((SELECT private.has_any_role(ARRAY['super_admin']::public.user_role[])));

-- Harden audit_logs index & RLS
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs (created_at DESC);

DROP POLICY IF EXISTS "Super Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Super Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING ((SELECT private.has_any_role(ARRAY['super_admin']::public.user_role[])));
