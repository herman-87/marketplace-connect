// Mock password reset token store (prototype).
// Aligns with API spec:
//   POST /public/auth/forgot-password        { email }              -> 204
//   GET  /public/auth/reset-password/validate?token=uuid            -> 200 | 400
//   POST /public/auth/reset-password         { token, password }    -> 204

const STORAGE_KEY = "fastrelays.password-reset-tokens";
const TTL_MS = 60 * 60 * 1000; // 1h

type TokenRecord = { email: string; createdAt: number };
type Store = Record<string, TokenRecord>;

function read(): Store {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function write(store: Store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function uuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function forgotPassword(email: string): Promise<{ token: string }> {
  const store = read();
  const token = uuid();
  store[token] = { email, createdAt: Date.now() };
  write(store);
  await new Promise((r) => setTimeout(r, 400));
  return { token };
}

export async function validateResetToken(
  token: string
): Promise<{ valid: boolean; email?: string }> {
  const store = read();
  const rec = store[token];
  await new Promise((r) => setTimeout(r, 200));
  if (!rec) return { valid: false };
  if (Date.now() - rec.createdAt > TTL_MS) {
    delete store[token];
    write(store);
    return { valid: false };
  }
  return { valid: true, email: rec.email };
}

export async function resetPassword(token: string, _password: string): Promise<void> {
  const { valid } = await validateResetToken(token);
  if (!valid) throw new Error("Token invalide ou expiré");
  const store = read();
  delete store[token]; // one-time use
  write(store);
  await new Promise((r) => setTimeout(r, 400));
}
