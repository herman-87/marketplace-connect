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
    validUntil: "31 Jan",
  },
  {
    id: "2",
    title: "-15% sur la mode",
    description: "Toute la catégorie Mode",
    code: "MODE15",
    icon: Tag,
    validUntil: "15 Fév",
  },
  {
    id: "3",
    title: "Menu offert",
    description: "Pour 2 menus achetés",
    code: "MENU3FOR2",
    icon: Gift,
    validUntil: "28 Jan",
  },
  {
    id: "4",
    title: "Cashback 10%",
    description: "Sur les achats High-Tech",
    code: "TECHBACK",
    icon: CreditCard,
    validUntil: "10 Fév",
  },
];

export function GoodDeals() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
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
              className="group p-4 bg-card border border-border hover:border-primary/30 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
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

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    Code promo
                  </p>
                  <Badge 
                    variant="outline" 
                    className="mt-1 font-mono text-xs bg-muted border-dashed"
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
