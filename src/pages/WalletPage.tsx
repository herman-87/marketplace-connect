import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ArrowDownToLine, ArrowUpFromLine, Wallet as WalletIcon, Inbox } from "lucide-react";
import { formatPrice } from "@/lib/tax";
import { wallets as allWallets, type WalletAccount, type WalletTransaction } from "@/data/walletData";
import { WalletSelector } from "@/components/wallet/WalletSelector";
import { TransactionRow } from "@/components/wallet/TransactionRow";
import { TransactionDetailSheet } from "@/components/wallet/TransactionDetailSheet";

export default function WalletPage() {
  const wallets = allWallets;
  const [selectedId, setSelectedId] = useState(wallets[0].id);
  const [selectedTx, setSelectedTx] = useState<WalletTransaction | null>(null);

  const wallet = useMemo(
    () => wallets.find((w) => w.id === selectedId) ?? wallets[0],
    [wallets, selectedId]
  );

  const total = useMemo(() => wallets.reduce((s, w) => s + w.balance, 0), [wallets]);
  const currency = wallet.currency;

  const handleDeposit = (w: WalletAccount) => toast.success(`Dépôt — ${w.name}`);
  const handleWithdraw = (w: WalletAccount) => toast.success(`Retrait — ${w.name}`);

  return (
    <AppLayout title="Wallet" subtitle="Vos portefeuilles personnels et business en un seul endroit.">
      <div className="animate-fade-in space-y-5 md:space-y-6">
        {/* Header summary */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <WalletIcon className="w-4 h-4" />
                  Solde total
                </p>
                <p className="text-3xl md:text-4xl font-bold text-foreground mt-1">
                  {formatPrice(total, currency)}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {wallets.length} portefeuille{wallets.length > 1 ? "s" : ""} géré
                {wallets.length > 1 ? "s" : ""}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Wallet selector */}
        <WalletSelector wallets={wallets} selectedId={selectedId} onSelect={setSelectedId} />

        {/* Actions on the selected wallet */}
        <div className="flex flex-wrap items-center gap-2">
          <Button className="h-9 gap-1.5 text-xs" onClick={() => handleDeposit(wallet)}>
            <ArrowDownToLine className="w-3.5 h-3.5" /> Dépôt
          </Button>
          <Button variant="outline" className="h-9 gap-1.5 text-xs" onClick={() => handleWithdraw(wallet)}>
            <ArrowUpFromLine className="w-3.5 h-3.5" /> Retrait
          </Button>
          <span className="text-xs text-muted-foreground">sur {wallet.name}</span>
        </div>

        {/* Recent transactions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium text-foreground">Transactions récentes</h2>
            {wallet.transactions.length > 0 && (
              <Button asChild variant="ghost" className="h-8 text-xs">
                <Link to={`/wallet/${wallet.id}/transactions`}>Voir tout</Link>
              </Button>
            )}
          </div>
          <Card>
            <CardContent className="p-0 divide-y divide-border">
              {wallet.transactions.length === 0 ? (
                <div className="p-8 text-center">
                  <Inbox className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">Aucune transaction</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ce portefeuille n'a pas encore d'activité. Faites un dépôt pour démarrer.
                  </p>
                  <Button className="mt-4 h-9 gap-1.5" onClick={() => handleDeposit(wallet)}>
                    <ArrowDownToLine className="w-4 h-4" /> Faire un dépôt
                  </Button>
                </div>
              ) : (
                wallet.transactions
                  .slice(0, 5)
                  .map((tx) => (
                    <TransactionRow key={tx.id} tx={tx} currency={currency} onSelect={setSelectedTx} />
                  ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <TransactionDetailSheet
        tx={selectedTx}
        currency={currency}
        onOpenChange={(open) => !open && setSelectedTx(null)}
      />
    </AppLayout>
  );
}
