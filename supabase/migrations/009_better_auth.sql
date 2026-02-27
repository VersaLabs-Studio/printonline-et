-- PrintOnline.et v2.0 — Migration 009: better-auth Tables
-- Creates the core tables required by better-auth:
-- user, session, account, verification
-- These tables are managed by better-auth and should not be modified manually.
-- ── User table ──────────────────────────────────────────────────
-- Core user table for better-auth
-- Extended with custom fields: phone, tin_number, company_name, role
CREATE TABLE IF NOT EXISTS "user" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    email_verified BOOLEAN NOT NULL DEFAULT false,
    image TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Custom fields for PrintOnline.et
    phone TEXT,
    tin_number TEXT,
    company_name TEXT,
    role TEXT NOT NULL DEFAULT 'customer'
);
CREATE INDEX IF NOT EXISTS idx_user_email ON "user"(email);
-- ── Session table ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "session" (
    id TEXT PRIMARY KEY,
    expires_at TIMESTAMPTZ NOT NULL,
    token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_session_token ON "session"(token);
CREATE INDEX IF NOT EXISTS idx_session_user_id ON "session"(user_id);
-- ── Account table ───────────────────────────────────────────────
-- Stores credentials (email/password) and OAuth provider links
CREATE TABLE IF NOT EXISTS "account" (
    id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    access_token TEXT,
    refresh_token TEXT,
    id_token TEXT,
    access_token_expires_at TIMESTAMPTZ,
    refresh_token_expires_at TIMESTAMPTZ,
    scope TEXT,
    password TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_account_user_id ON "account"(user_id);
CREATE INDEX IF NOT EXISTS idx_account_provider ON "account"(provider_id, account_id);
-- ── Verification table ──────────────────────────────────────────
-- Used for email verification, password reset tokens, etc.
CREATE TABLE IF NOT EXISTS "verification" (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_verification_identifier ON "verification"(identifier);
-- ── RLS Policies for better-auth tables ─────────────────────────
-- These tables are accessed via service_role key (through better-auth),
-- so we enable RLS but rely on the service_role bypass.
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "verification" ENABLE ROW LEVEL SECURITY;
-- Service role can do everything (better-auth uses service_role key via DATABASE_URL)
-- No public access policies needed — all auth operations go through the API route