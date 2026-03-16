import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  History,
  CreditCard,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  type: "credit" | "debit";
  label: string;
  amount: number;
  date: string;
  method: "card" | "mobile_money" | "refund";
}

const mockTransactions: Transaction[] = [
  { id: "t1", type: "credit", label: "Rechargement", amount: 50.00, date: "Aujourd'hui", method: "card" },
  { id: "t2", type: "debit", label: "Commande RestauFast", amount: -25.80, date: "Aujourd'hui", method: "mobile_money" },
  { id: "t3", type: "credit", label: "Remboursement TechStore", amount: 12.50, date: "Hier", method: "refund" },
  { id: "t4", type: "debit", label: "Commande ModeBoutique", amount: -119.97, date: "12 Jan", method: "card" },
  { id: "t5", type: "debit", label: "Commande Saveurs d'Afrique", amount: -15.90, date: "10 Jan", method: "mobile_money" },
];

const methodIcons = {
  card: CreditCard,
  mobile_money: Smartphone,
  refund: ArrowDownLeft,
};

export function WalletSection() {
  const balance = 142.83;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Balance Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Wallet className="w-4 h-4" />
                Solde disponible
              </p>
              <p className="text-3xl md:text-4xl font-bold text-foreground mt-1">
                {balance.toFixed(2)} €
              </p>
            </div>
            <Button className="gap-1.5">
              <Plus className="w-4 h-4" />
              Recharger
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="cursor-pointer hover:border-foreground transition-all">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <CreditCard className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <p className="font-medium text-sm text-foreground">Carte bancaire</p>
              <p className="text-xs text-muted-foreground">•••• 4532</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/30 transition-all">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Smartphone className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <p className="font-medium text-sm text-foreground">Mobile Money</p>
              <p className="text-xs text-muted-foreground">+33 6 •• •• 42</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-foreground flex items-center gap-1.5">
            <History className="w-4 h-4" />
            Historique des transactions
          </h3>
        </div>
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {mockTransactions.map((tx) => {
              const MethodIcon = methodIcons[tx.method];
              return (
                <div key={tx.id} className="flex items-center gap-3 p-3 md:p-4 hover:bg-muted/50 transition-colors">
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                    tx.type === "credit" ? "bg-success/10" : "bg-muted"
                  )}>
                    {tx.type === "credit" ? (
                      <ArrowDownLeft className="w-4 h-4 text-success" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{tx.label}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MethodIcon className="w-3 h-3" />
                      <span>{tx.date}</span>
                    </div>
                  </div>
                  <p className={cn(
                    "font-semibold text-sm shrink-0",
                    tx.type === "credit" ? "text-success" : "text-foreground"
                  )}>
                    {tx.type === "credit" ? "+" : ""}{tx.amount.toFixed(2)} €
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
