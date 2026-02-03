import { cn } from "@/lib/utils";
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  Shirt, 
  Smartphone, 
  Home, 
  Sparkles,
  Car,
  Dumbbell
} from "lucide-react";

const categories = [
  { id: "repas", name: "Repas", icon: UtensilsCrossed, count: 342 },
  { id: "mode", name: "Mode", icon: Shirt, count: 156 },
  { id: "tech", name: "High-Tech", icon: Smartphone, count: 89 },
  { id: "maison", name: "Maison", icon: Home, count: 124 },
  { id: "beaute", name: "Beauté", icon: Sparkles, count: 67 },
  { id: "auto", name: "Auto", icon: Car, count: 45 },
  { id: "sport", name: "Sport", icon: Dumbbell, count: 78 },
  { id: "autres", name: "Autres", icon: ShoppingBag, count: 234 },
];

export function CategoryShowcase() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Explorez par catégorie
        </h2>
        <button className="text-sm text-primary hover:underline">
          Voir tout
        </button>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              className={cn(
                "group flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl",
                "bg-card border border-border",
                "hover:border-primary/30 hover:bg-muted/50 transition-all duration-200"
              )}
            >
              <div className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center",
                "group-hover:bg-primary/20 transition-colors"
              )}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-foreground text-center">
                {category.name}
              </span>
              <span className="text-[10px] text-muted-foreground hidden sm:block">
                {category.count} articles
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
