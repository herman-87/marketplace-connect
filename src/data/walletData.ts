export type WalletKind = "personal" | "business";

export type TxType = "deposit" | "withdrawal" | "transfer" | "payment" | "refund";
export type TxStatus = "completed" | "pending" | "failed";

export interface WalletTransaction {
  id: string;
  type: TxType;
  amount: number; // positive = in, negative = out
  date: string; // ISO
  status: TxStatus;
  counterparty?: string;
  reference?: string;
  method?: string;
}

export interface WalletAccount {
  id: string;
  name: string;
  kind: WalletKind;
  balance: number;
  available?: number;
  currency: string;
  transactions: WalletTransaction[];
}

export const txTypeLabels: Record<TxType, string> = {
  deposit: "Dépôt",
  withdrawal: "Retrait",
  transfer: "Transfert",
  payment: "Paiement",
  refund: "Remboursement",
};

export const txStatusLabels: Record<TxStatus, string> = {
  completed: "Terminé",
  pending: "En attente",
  failed: "Échoué",
};

export const wallets: WalletAccount[] = [
  {
    id: "personal",
    name: "Portefeuille personnel",
    kind: "personal",
    balance: 142.83,
    available: 132.83,
    currency: "EUR",
    transactions: [
      { id: "p1", type: "deposit", amount: 50, date: "2026-07-27T09:12:00Z", status: "completed", counterparty: "Carte •••• 4532", method: "Carte bancaire", reference: "TX-90112" },
      { id: "p2", type: "payment", amount: -25.8, date: "2026-07-27T08:02:00Z", status: "completed", counterparty: "RestauFast", method: "Mobile Money", reference: "TX-90108" },
      { id: "p3", type: "refund", amount: 12.5, date: "2026-07-26T17:40:00Z", status: "completed", counterparty: "TechStore", method: "Remboursement", reference: "TX-90077" },
      { id: "p4", type: "withdrawal", amount: -40, date: "2026-07-25T11:20:00Z", status: "pending", counterparty: "PawaPay +225 07 •• •• 42", method: "Mobile Money", reference: "TX-90031" },
      { id: "p5", type: "payment", amount: -119.97, date: "2026-07-22T14:05:00Z", status: "completed", counterparty: "ModeBoutique", method: "Carte bancaire", reference: "TX-89903" },
    ],
  },
  {
    id: "biz-urban",
    name: "Urban Style Shop",
    kind: "business",
    balance: 3820.4,
    available: 3120.4,
    currency: "EUR",
    transactions: [
      { id: "b1", type: "payment", amount: 249.9, date: "2026-07-27T10:30:00Z", status: "completed", counterparty: "Commande #CMD-2451", method: "Mobile Money", reference: "TX-90130" },
      { id: "b2", type: "withdrawal", amount: -1500, date: "2026-07-26T09:00:00Z", status: "pending", counterparty: "Compte bancaire •••• 8891", method: "Virement", reference: "TX-90065" },
      { id: "b3", type: "payment", amount: 89.5, date: "2026-07-25T16:12:00Z", status: "completed", counterparty: "Commande #CMD-2448", method: "Carte bancaire", reference: "TX-90020" },
      { id: "b4", type: "refund", amount: -34.9, date: "2026-07-24T12:44:00Z", status: "failed", counterparty: "Client M. Kouassi", method: "Mobile Money", reference: "TX-89988" },
    ],
  },
  {
    id: "biz-saveurs",
    name: "Saveurs d'Afrique",
    kind: "business",
    balance: 615.2,
    available: 615.2,
    currency: "EUR",
    transactions: [
      { id: "s1", type: "payment", amount: 42.3, date: "2026-07-27T07:55:00Z", status: "completed", counterparty: "Commande #CMD-2450", method: "Mobile Money", reference: "TX-90121" },
      { id: "s2", type: "transfer", amount: -200, date: "2026-07-23T15:30:00Z", status: "completed", counterparty: "Urban Style Shop", method: "Transfert interne", reference: "TX-89950" },
    ],
  },
  {
    id: "biz-tech",
    name: "TechStore Abidjan",
    kind: "business",
    balance: 0,
    available: 0,
    currency: "EUR",
    transactions: [],
  },
];
