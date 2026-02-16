import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  ShoppingBag, 
  Shirt, 
  Smartphone, 
  Home, 
  Sparkles,
  Car,
  Dumbbell,
  Watch
} from "lucide-react";

const categories = [
  { id: "mode", name: "Mode", icon: Shirt, count: 156, bgClass: "bg-[hsl(340,75%,55%,0.15)]" },
  { id: "tech", name: "High-Tech", icon: Smartphone, count: 89, bgClass: "bg-[hsl(210,90%,55%,0.15)]" },
  { id: "accessoires", name: "Accessoires", icon: Watch, count: 210, bgClass: "bg-[hsl(24,85%,55%,0.15)]" },
  { id: "maison", name: "Maison", icon: Home, count: 124, bgClass: "bg-[hsl(160,65%,45%,0.15)]" },
  { id: "beaute", name: "Beauté", icon: Sparkles, count: 67, bgClass: "bg-[hsl(320,70%,60%,0.15)]" },
  { id: "auto", name: "Auto", icon: Car, count: 45, bgClass: "bg-[hsl(220,60%,50%,0.15)]" },
  { id: "sport", name: "Sport", icon: Dumbbell, count: 78, bgClass: "bg-[hsl(150,70%,45%,0.15)]" },
  { id: "autres", name: "Autres", icon: ShoppingBag, count: 234, bgClass: "bg-[hsl(270,60%,55%,0.15)]" },
];

export function CategoryShowcase() {
  const navigate = useNavigate();

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Explorez par catégorie
        </h2>
        <button
          className="text-sm text-primary hover:underline"
          onClick={() => navigate("/marketplace/trending")}
        >
          Voir tout
        </button>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => navigate(`/marketplace/trending?category=${encodeURIComponent(category.name)}`)}
              className={cn(
                "group flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl",
                "bg-card border border-border",
                "hover:border-border/60 hover:shadow-md transition-all duration-200"
              )}
            >
              <div className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center",
                "transition-transform group-hover:scale-110",
                category.bgClass
              )}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
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
