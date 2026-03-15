import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  Users,
  ClipboardList,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { SubscriptionSheet } from "@/components/subscription/SubscriptionSheet";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Business", href: "/mes-business", icon: Store, badge: 2 },
  { title: "Collab", href: "/collaborations", icon: Users },
  { title: "Commandes", href: "/commandes", icon: ClipboardList, badge: 5 },
];

const proHrefs = ["/mes-business", "/collaborations", "/commandes"];

export function MobileNav() {
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isPro } = useSubscription();

  const isActive = (href: string) => {
    if (href === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(href);
  };

  const handleClick = (e: React.MouseEvent, href: string) => {
    if (!isPro && proHrefs.includes(href)) {
      e.preventDefault();
      setSubscriptionOpen(true);
    }
  };

  return (
    <>
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const locked = !isPro && proHrefs.includes(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={(e) => handleClick(e, item.href)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 py-2 px-1 rounded-lg transition-colors relative",
                locked
                  ? "text-muted-foreground/50"
                  : active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <item.icon className={cn("h-5 w-5", active && !locked && "text-foreground")} />
                {locked ? (
                  <Lock className="absolute -top-1.5 -right-2 h-3 w-3 text-muted-foreground" />
                ) : item.badge ? (
                  <Badge className="absolute -top-1.5 -right-2 h-4 min-w-[16px] p-0 flex items-center justify-center text-[9px] bg-muted text-foreground border-0">
                    {item.badge}
                  </Badge>
                ) : null}
              </div>
              <span className={cn("text-[10px] font-medium", active && !locked && "text-foreground font-semibold")}>
                {item.title}
              </span>
              {active && !locked && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-foreground" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
    <SubscriptionSheet open={subscriptionOpen} onOpenChange={setSubscriptionOpen} />
    </>
  );
}
