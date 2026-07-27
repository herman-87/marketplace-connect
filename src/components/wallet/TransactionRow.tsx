import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/tax";
import { ArrowDownLeft, ArrowUpRight, ChevronRight } from "lucide-react";
import { txStatusLabels, txTypeLabels, type WalletTransaction } from "@/data/walletData";

const statusStyles: Record<WalletTransaction["status"], string> = {
  completed: "bg-success/10 text-success",
  pending: "bg-muted text-muted-foreground",
  failed: "bg-destructive/10 text-destructive",
};

export function formatTxDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface Props {
  tx: WalletTransaction;
  currency: string;
  onSelect: (tx: WalletTransaction) => void;
}

export function TransactionRow({ tx, currency, onSelect }: Props) {
  const incoming = tx.amount > 0;
  return (
    <button
      type="button"
      onClick={() => onSelect(tx)}
      className="w-full flex items-center gap-3 p-3 md:p-4 text-left hover:bg-muted/50 transition-colors"
    >
      <div
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
          incoming ? "bg-success/10" : "bg-muted"
        )}
      >
        {incoming ? (
          <ArrowDownLeft className="w-4 h-4 text-success" />
        ) : (
          <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground truncate">{txTypeLabels[tx.type]}</p>
          <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full shrink-0", statusStyles[tx.status])}>
            {txStatusLabels[tx.status]}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {formatTxDate(tx.date)}
          {tx.counterparty ? ` · ${tx.counterparty}` : ""}
        </p>
      </div>
      <p className={cn("font-semibold text-sm shrink-0", incoming ? "text-success" : "text-foreground")}>
        {incoming ? "+" : "−"}
        {formatPrice(Math.abs(tx.amount), currency)}
      </p>
      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
    </button>
  );
}
