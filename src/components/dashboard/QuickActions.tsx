import { Package, Users, Store, ArrowRight } from "lucide-react";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const quickActions: QuickAction[] = [
  {
    title: "Nouveau Business",
    description: "Créez votre nouvelle boutique",
    icon: Store,
    href: "/mes-business/nouveau",
  },
  {
    title: "Ajouter un produit",
    description: "Publiez sur le marketplace",
    icon: Package,
    href: "/mes-business",
  },
  {
    title: "Inviter un collaborateur",
    description: "Partagez la gestion",
    icon: Users,
    href: "/mes-business",
  },
];

export function QuickActions() {
  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <h3 className="font-semibold text-foreground mb-4">Actions rapides</h3>
      
      <div className="space-y-2">
        {quickActions.map((action) => (
          <button
            key={action.title}
            className="w-full group flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <action.icon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-foreground">{action.title}</p>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
}
