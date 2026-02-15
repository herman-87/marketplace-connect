import { Link, useLocation, useParams } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Users, Heart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const getNavItems = (businessId: string) => [
  { title: "Vue d'ensemble", href: `/business/${businessId}`, icon: LayoutDashboard, exact: true },
  { title: "Produits", href: `/business/${businessId}/products`, icon: Package },
  { title: "Commandes", href: `/business/${businessId}/orders`, icon: ShoppingCart },
  { title: "Équipe", href: `/business/${businessId}/team`, icon: Users },
  { title: "Engagement", href: `/business/${businessId}/engagement`, icon: Heart },
  { title: "Paramètres", href: `/business/${businessId}/settings`, icon: Settings },
];

export function BusinessMobileNav() {
  const { id } = useParams();
  const location = useLocation();

  if (!id) return null;

  const navItems = getNavItems(id);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return location.pathname === href;
    return location.pathname === href;
  };

  return (
    <div className="lg:hidden -mx-4 px-0 mb-4">
      <ScrollArea className="w-full">
        <div className="flex gap-1.5 px-4 pb-2">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.title}
              </Link>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="h-1" />
      </ScrollArea>
    </div>
  );
}
