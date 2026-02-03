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
  { id: "repas", name: "Repas", icon: UtensilsCrossed, count: 342, color: "bg-orange-500/15 text-orange-600 dark:text-orange-400" },
  { id: "mode", name: "Mode", icon: Shirt, count: 156, color: "bg-pink-500/15 text-pink-600 dark:text-pink-400" },
  { id: "tech", name: "High-Tech", icon: Smartphone, count: 89, color: "bg-blue-500/15 text-blue-600 dark:text-blue-400" },
  { id: "maison", name: "Maison", icon: Home, count: 124, color: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  { id: "beaute", name: "Beauté", icon: Sparkles, count: 67, color: "bg-purple-500/15 text-purple-600 dark:text-purple-400" },
  { id: "auto", name: "Auto", icon: Car, count: 45, color: "bg-slate-500/15 text-slate-600 dark:text-slate-400" },
  { id: "sport", name: "Sport", icon: Dumbbell, count: 78, color: "bg-green-500/15 text-green-600 dark:text-green-400" },
  { id: "autres", name: "Autres", icon: ShoppingBag, count: 234, color: "bg-teal-500/15 text-teal-600 dark:text-teal-400" },
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
                "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center",
                "group-hover:scale-110 transition-transform",
                category.color.split(' ')[0]
              )}>
                <Icon className={cn("w-5 h-5 sm:w-6 sm:h-6", category.color.split(' ').slice(1).join(' '))} />
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
