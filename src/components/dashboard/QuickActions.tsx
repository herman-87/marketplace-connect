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
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="font-medium text-foreground mb-3">Actions rapides</h3>
      
      <div className="space-y-1">
        {quickActions.map((action) => (
          <button
            key={action.title}
            className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors"
          >
            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
              <action.icon className="w-4 h-4 text-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-foreground">{action.title}</p>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}
