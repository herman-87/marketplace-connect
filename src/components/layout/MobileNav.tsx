import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  Users,
  ShoppingBag,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Business", href: "/mes-business", icon: Store, badge: 2 },
  { title: "Collab", href: "/collaborations", icon: Users },
  { title: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { title: "Commandes", href: "/commandes", icon: ClipboardList, badge: 5 },
];

export function MobileNav() {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 py-2 px-1 rounded-lg transition-colors relative",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <item.icon className={cn("h-5 w-5", active && "text-primary")} />
                {item.badge && (
                  <Badge className="absolute -top-1.5 -right-2 h-4 min-w-[16px] p-0 flex items-center justify-center text-[9px] gradient-primary border-0">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className={cn("text-[10px] font-medium", active && "text-primary")}>
                {item.title}
              </span>
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full gradient-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
