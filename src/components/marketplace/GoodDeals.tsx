import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Tag, 
  ArrowRight, 
  Sparkles,
  Gift,
  Truck,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";

const deals = [
  {
    id: "1",
    title: "Livraison offerte",
    description: "Sur votre première commande",
    code: "BIENVENUE",
    icon: Truck,
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    validUntil: "31 Jan",
  },
  {
    id: "2",
    title: "-15% sur la mode",
    description: "Toute la catégorie Mode",
    code: "MODE15",
    icon: Tag,
    gradient: "from-pink-500/20 to-purple-500/20",
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-500",
    validUntil: "15 Fév",
  },
  {
    id: "3",
    title: "Menu offert",
    description: "Pour 2 menus achetés",
    code: "MENU3FOR2",
    icon: Gift,
    gradient: "from-orange-500/20 to-red-500/20",
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-500",
    validUntil: "28 Jan",
  },
  {
    id: "4",
    title: "Cashback 10%",
    description: "Sur les achats High-Tech",
    code: "TECHBACK",
    icon: CreditCard,
    gradient: "from-blue-500/20 to-indigo-500/20",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    validUntil: "10 Fév",
  },
];

export function GoodDeals() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-warning/10">
            <Sparkles className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Bons Plans
            </h2>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Codes promo et offres exclusives
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-1">
          Tous les codes
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {deals.map((deal) => {
          const Icon = deal.icon;
          return (
            <Card 
              key={deal.id} 
              className={cn(
                "group p-4 bg-gradient-to-br border-0 hover:shadow-lg transition-all duration-300 cursor-pointer",
                deal.gradient
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2.5 rounded-xl",
                  deal.iconBg
                )}>
                  <Icon className={cn("w-5 h-5", deal.iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">
                    {deal.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {deal.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    Code promo
                  </p>
                  <Badge 
                    variant="outline" 
                    className="mt-1 font-mono text-xs bg-card border-dashed"
                  >
                    {deal.code}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">
                    Valide jusqu'au
                  </p>
                  <p className="text-xs font-medium text-foreground">
                    {deal.validUntil}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
