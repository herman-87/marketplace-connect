import { wallets, type WalletTransaction, type TxType, type TxStatus } from "@/data/walletData";

/**
 * Mock implementation of:
 *   GET /accounts/{accountId}/transactions
 *   params: page, size, field, direction, status, type, start, end
 */

export type ApiStatus = "PENDING" | "SUCCESS" | "FAILED";
export type ApiType = "DEPOSIT" | "WITHDRAWAL" | "INTERNAL";
export type SortField = "DATE" | "AMOUNT";
export type SortDirection = "ASC" | "DESC";

export const apiStatusLabels: Record<ApiStatus, string> = {
  PENDING: "Pending",
  SUCCESS: "Completed",
  FAILED: "Failed",
};

export const apiTypeLabels: Record<ApiType, string> = {
  DEPOSIT: "Deposit",
  WITHDRAWAL: "Withdrawal",
  INTERNAL: "Internal Transfer",
};

export const statusToApi: Record<TxStatus, ApiStatus> = {
  completed: "SUCCESS",
  pending: "PENDING",
  failed: "FAILED",
};

export const typeToApi: Record<TxType, ApiType> = {
  deposit: "DEPOSIT",
  withdrawal: "WITHDRAWAL",
  transfer: "INTERNAL",
  payment: "INTERNAL",
  refund: "INTERNAL",
};

export interface TransactionQuery {
  page: number; // 0-based
  size: number;
  field: SortField;
  direction: SortDirection;
  status?: ApiStatus;
  type?: ApiType;
  start?: string; // ISO date
  end?: string; // ISO date
}

export interface TransactionPage {
  content: WalletTransaction[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/* ---------- Dataset: seeded volume so pagination is meaningful ---------- */

const counterparties = [
  "Commande #CMD-2451",
  "Urban Style Shop",
  "RestauFast",
  "TechStore Abidjan",
  "Compte bancaire •••• 8891",
  "PawaPay +225 07 •• •• 42",
  "Client M. Kouassi",
  "Saveurs d'Afrique",
];
const methods = ["Mobile Money", "Carte bancaire", "Virement", "Transfert interne"];
const types: TxType[] = ["deposit", "withdrawal", "transfer", "payment", "refund"];
const statuses: TxStatus[] = ["completed", "completed", "completed", "pending", "failed"];

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const generated: Record<string, WalletTransaction[]> = {};

function datasetFor(accountId: string): WalletTransaction[] {
  if (generated[accountId]) return generated[accountId];
  const wallet = wallets.find((w) => w.id === accountId);
  const base = wallet?.transactions ?? [];
  if (!wallet || base.length === 0) {
    generated[accountId] = base;
    return base;
  }
  const rand = seeded(accountId.length * 7919 + 13);
  const extra: WalletTransaction[] = Array.from({ length: 120 }, (_, i) => {
    const type = types[Math.floor(rand() * types.length)];
    const status = statuses[Math.floor(rand() * statuses.length)];
    const magnitude = Math.round(rand() * 45000) / 100 + 3;
    const outgoing = type === "withdrawal" || (type !== "deposit" && rand() > 0.55);
    const date = new Date(Date.parse("2026-07-21T00:00:00Z") - i * 8_640_000 - Math.floor(rand() * 5_000_000));
    return {
      id: `${accountId}-g${i}`,
      type,
      amount: outgoing ? -magnitude : magnitude,
      date: date.toISOString(),
      status,
      counterparty: counterparties[Math.floor(rand() * counterparties.length)],
      method: methods[Math.floor(rand() * methods.length)],
      reference: `TX-${88000 + Math.floor(rand() * 2000)}`,
    };
  });
  generated[accountId] = [...base, ...extra];
  return generated[accountId];
}

export async function fetchAccountTransactions(
  accountId: string,
  query: TransactionQuery
): Promise<TransactionPage> {
  await new Promise((r) => setTimeout(r, 450));

  const wallet = wallets.find((w) => w.id === accountId);
  if (!wallet) throw new Error("Compte introuvable");

  let rows = datasetFor(accountId);

  if (query.status) rows = rows.filter((t) => statusToApi[t.status] === query.status);
  if (query.type) rows = rows.filter((t) => typeToApi[t.type] === query.type);
  if (query.start) {
    const s = new Date(query.start).setHours(0, 0, 0, 0);
    rows = rows.filter((t) => new Date(t.date).getTime() >= s);
  }
  if (query.end) {
    const e = new Date(query.end).setHours(23, 59, 59, 999);
    rows = rows.filter((t) => new Date(t.date).getTime() <= e);
  }

  const dir = query.direction === "ASC" ? 1 : -1;
  rows = [...rows].sort((a, b) =>
    query.field === "AMOUNT"
      ? (Math.abs(a.amount) - Math.abs(b.amount)) * dir
      : (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir
  );

  const totalElements = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / query.size));
  const page = Math.min(query.page, totalPages - 1);
  const content = rows.slice(page * query.size, page * query.size + query.size);

  return { content, page, size: query.size, totalElements, totalPages };
}
