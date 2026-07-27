import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatPrice } from "@/lib/tax";
import { cn } from "@/lib/utils";
import { txStatusLabels, txTypeLabels, type WalletTransaction } from "@/data/walletData";
import { formatTxDate } from "./TransactionRow";

interface Props {
  tx: WalletTransaction | null;
  currency: string;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetailSheet({ tx, currency, onOpenChange }: Props) {
  const incoming = (tx?.amount ?? 0) > 0;
  return (
    <Sheet open={!!tx} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Détail de la transaction</SheetTitle>
        </SheetHeader>
        {tx && (
          <div className="mt-6 space-y-4">
            <div className="text-center py-4 rounded-xl bg-muted/50">
              <p className={cn("text-3xl font-bold", incoming ? "text-success" : "text-foreground")}>
                {incoming ? "+" : "−"}
                {formatPrice(Math.abs(tx.amount), currency)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{txTypeLabels[tx.type]}</p>
            </div>
            <dl className="divide-y divide-border text-sm">
              {[
                ["Statut", txStatusLabels[tx.status]],
                ["Date", formatTxDate(tx.date)],
                ["Contrepartie", tx.counterparty ?? "—"],
                ["Méthode", tx.method ?? "—"],
                ["Référence", tx.reference ?? "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between py-3 gap-4">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-medium text-foreground text-right truncate">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
