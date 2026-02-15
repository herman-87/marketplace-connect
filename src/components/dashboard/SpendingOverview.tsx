import { Card, CardContent } from "@/components/ui/card";
import { StatsCard } from "./StatsCard";
import {
  ShoppingBag,
  TrendingUp,
  CreditCard,
  ShoppingCart,
  Smartphone,
  Watch,
} from "lucide-react";

const monthlySpending = [
  { month: "Août", amount: 125 },
  { month: "Sep", amount: 210 },
  { month: "Oct", amount: 180 },
  { month: "Nov", amount: 290 },
  { month: "Déc", amount: 350 },
  { month: "Jan", amount: 245 },
];

const categorySpending = [
  { label: "Mode", amount: 119.97, icon: ShoppingBag, percentage: 42 },
  { label: "High-Tech", amount: 95.00, icon: Smartphone, percentage: 33 },
  { label: "Accessoires", amount: 72.50, icon: Watch, percentage: 25 },
];

export function SpendingOverview() {
  const totalThisMonth = 244.47;
  const maxAmount = Math.max(...monthlySpending.map((m) => m.amount));

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatsCard
          title="Ce mois"
          value="244,47 €"
          icon={<CreditCard className="h-4 w-4 md:h-5 md:w-5 text-foreground" />}
          trend={{ value: -15, isPositive: false }}
        />
        <StatsCard
          title="Commandes"
          value="8"
          icon={<ShoppingCart className="h-4 w-4 md:h-5 md:w-5 text-foreground" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Moy. / commande"
          value="30,56 €"
          icon={<TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-foreground" />}
          className="col-span-2 md:col-span-1"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Chart */}
        <Card>
          <CardContent className="p-4 md:p-5">
            <h3 className="font-medium text-foreground mb-4">Dépenses mensuelles</h3>
            <div className="flex items-end gap-2 h-32">
              {monthlySpending.map((month, i) => (
                <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md bg-primary/20 hover:bg-primary/40 transition-colors relative group"
                    style={{ height: `${(month.amount / maxAmount) * 100}%` }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {month.amount} €
                    </div>
                    {i === monthlySpending.length - 1 && (
                      <div className="absolute inset-0 bg-primary/60 rounded-t-md" />
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground">{month.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardContent className="p-4 md:p-5">
            <h3 className="font-medium text-foreground mb-4">Par catégorie</h3>
            <div className="space-y-4">
              {categorySpending.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div key={cat.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-muted">
                          <Icon className="w-3.5 h-3.5 text-foreground" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{cat.label}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{cat.amount.toFixed(2)} €</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
