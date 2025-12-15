import { Plus, Package, Users, Store, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  href: string;
}

const quickActions: QuickAction[] = [
  {
    title: "Nouveau Business",
    description: "Créez votre nouvelle boutique",
    icon: Store,
    gradient: "from-primary to-accent",
    href: "/mes-business/nouveau",
  },
  {
    title: "Ajouter un produit",
    description: "Publiez sur le marketplace",
    icon: Package,
    gradient: "from-accent to-success",
    href: "/mes-business",
  },
  {
    title: "Inviter un collaborateur",
    description: "Partagez la gestion",
    icon: Users,
    gradient: "from-info to-primary",
    href: "/mes-business",
  },
];

export function QuickActions() {
  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <h3 className="font-semibold text-foreground mb-4">Actions rapides</h3>
      
      <div className="space-y-3">
        {quickActions.map((action) => (
          <button
            key={action.title}
            className="w-full group flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-200"
          >
            <div
              className={cn(
                "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
                action.gradient
              )}
            >
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground">{action.title}</p>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
}
