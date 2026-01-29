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
  { 
    id: "repas", 
    name: "Repas", 
    icon: UtensilsCrossed, 
    count: 342,
    gradient: "from-orange-500/20 to-red-500/20",
    iconColor: "text-orange-500"
  },
  { 
    id: "mode", 
    name: "Mode", 
    icon: Shirt, 
    count: 156,
    gradient: "from-pink-500/20 to-purple-500/20",
    iconColor: "text-pink-500"
  },
  { 
    id: "tech", 
    name: "High-Tech", 
    icon: Smartphone, 
    count: 89,
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-500"
  },
  { 
    id: "maison", 
    name: "Maison", 
    icon: Home, 
    count: 124,
    gradient: "from-emerald-500/20 to-green-500/20",
    iconColor: "text-emerald-500"
  },
  { 
    id: "beaute", 
    name: "Beauté", 
    icon: Sparkles, 
    count: 67,
    gradient: "from-violet-500/20 to-purple-500/20",
    iconColor: "text-violet-500"
  },
  { 
    id: "auto", 
    name: "Auto", 
    icon: Car, 
    count: 45,
    gradient: "from-slate-500/20 to-gray-500/20",
    iconColor: "text-slate-500"
  },
  { 
    id: "sport", 
    name: "Sport", 
    icon: Dumbbell, 
    count: 78,
    gradient: "from-amber-500/20 to-yellow-500/20",
    iconColor: "text-amber-500"
  },
  { 
    id: "autres", 
    name: "Autres", 
    icon: ShoppingBag, 
    count: 234,
    gradient: "from-primary/20 to-accent/20",
    iconColor: "text-primary"
  },
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
                "bg-gradient-to-br border border-border",
                "hover:shadow-md hover:scale-105 transition-all duration-200",
                category.gradient
              )}
            >
              <div className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-card flex items-center justify-center",
                "group-hover:scale-110 transition-transform"
              )}>
                <Icon className={cn("w-5 h-5 sm:w-6 sm:h-6", category.iconColor)} />
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
