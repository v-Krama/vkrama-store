-- Verification tokens for email verification and password reset

CREATE TABLE IF NOT EXISTS verification_tokens (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK(type IN ('email_verify', 'password_reset')),
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_email ON verification_tokens(email);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_type ON verification_tokens(type);
