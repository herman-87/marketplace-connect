import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  History,
  Wallet as WalletIcon,
  Inbox,
} from "lucide-react";
import { formatPrice } from "@/lib/tax";
import { wallets as allWallets, type WalletTransaction } from "@/data/walletData";
import { WalletSelector } from "@/components/wallet/WalletSelector";
import { TransactionRow } from "@/components/wallet/TransactionRow";
import { TransactionDetailSheet } from "@/components/wallet/TransactionDetailSheet";

const quickActions = [
  { key: "deposit", label: "Dépôt", icon: ArrowDownToLine },
  { key: "withdraw", label: "Retrait", icon: ArrowUpFromLine },
  { key: "transfer", label: "Transfert", icon: ArrowLeftRight },
  { key: "history", label: "Historique", icon: History },
] as const;

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

  const monthIn = wallet.transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const monthOut = wallet.transactions.filter((t) => t.amount < 0).reduce((s, t) => s - t.amount, 0);
  const pending = wallet.transactions.filter((t) => t.status === "pending").length;

  const run = (label: string) => toast.success(`${label} — ${wallet.name}`);

  return (
    <AppLayout title="Wallet" subtitle="Vos portefeuilles personnels et business en un seul endroit.">
      <div className="animate-fade-in space-y-5 md:space-y-6">
        {/* Header summary */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 md:p-6 space-y-4">
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {quickActions.map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  variant={key === "deposit" ? "default" : "outline"}
                  className="h-10 gap-1.5 text-sm"
                  onClick={() => run(label)}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Wallet selector */}
        <WalletSelector wallets={wallets} selectedId={selectedId} onSelect={setSelectedId} />

        {/* Wallet details */}
        <Card>
          <CardContent className="p-4 md:p-6 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Solde actuel</p>
                <p className="text-xl font-bold text-foreground">{formatPrice(wallet.balance, currency)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Solde disponible</p>
                <p className="text-xl font-bold text-foreground">
                  {formatPrice(wallet.available ?? wallet.balance, currency)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Entrées / Sorties</p>
                <p className="text-sm font-medium text-success">+{formatPrice(monthIn, currency)}</p>
                <p className="text-sm font-medium text-foreground">−{formatPrice(monthOut, currency)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">En attente</p>
                <p className="text-xl font-bold text-foreground">{pending}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
              <Button className="h-9 gap-1.5 text-xs md:text-sm" onClick={() => run("Dépôt")}>
                <ArrowDownToLine className="w-4 h-4" /> Dépôt
              </Button>
              <Button variant="outline" className="h-9 gap-1.5 text-xs md:text-sm" onClick={() => run("Retrait")}>
                <ArrowUpFromLine className="w-4 h-4" /> Retrait
              </Button>
              <Button variant="outline" className="h-9 gap-1.5 text-xs md:text-sm" onClick={() => run("Transfert")}>
                <ArrowLeftRight className="w-4 h-4" /> Transfert
              </Button>
              <Button variant="outline" className="h-9 gap-1.5 text-xs md:text-sm" onClick={() => run("Historique complet")}>
                <History className="w-4 h-4" /> Historique
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent transactions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium text-foreground">Transactions récentes</h2>
            {wallet.transactions.length > 0 && (
              <Button
                variant="ghost"
                className="h-8 text-xs"
                onClick={() => run("Historique complet")}
              >
                Voir tout
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
                  <Button className="mt-4 h-9 gap-1.5" onClick={() => run("Dépôt")}>
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
