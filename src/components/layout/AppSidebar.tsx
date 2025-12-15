import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  Users,
  ShoppingBag,
  ClipboardList,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Mes Business", href: "/mes-business", icon: Store, badge: 2 },
  { title: "Collaborations", href: "/collaborations", icon: Users, badge: 1 },
  { title: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { title: "Commandes", href: "/commandes", icon: ClipboardList, badge: 5 },
];

const bottomNavItems: NavItem[] = [
  { title: "Paramètres", href: "/parametres", icon: Settings },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href);
    const content = (
      <Link
        to={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
          active
            ? "bg-sidebar-accent text-sidebar-primary"
            : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        )}
      >
        {active && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full gradient-primary" />
        )}
        <item.icon className={cn("h-5 w-5 shrink-0", active && "text-sidebar-primary")} />
        {!collapsed && (
          <>
            <span className="font-medium">{item.title}</span>
            {item.badge && (
              <Badge
                variant="secondary"
                className="ml-auto bg-sidebar-primary/20 text-sidebar-primary border-0 text-xs"
              >
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {item.title}
            {item.badge && (
              <Badge variant="secondary" className="text-xs">
                {item.badge}
              </Badge>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar sticky top-0 flex flex-col border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Store className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-sidebar-foreground">MultiShop</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center mx-auto">
            <Store className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        {bottomNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        {/* User Profile */}
        <div
          className={cn(
            "flex items-center gap-3 p-2 rounded-lg mt-2",
            collapsed ? "justify-center" : ""
          )}
        >
          <Avatar className="h-9 w-9 border-2 border-sidebar-accent">
            <AvatarImage src="" />
            <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground text-sm">
              JD
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                Jean Dupont
              </p>
              <p className="text-xs text-sidebar-muted truncate">
                jean@example.com
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-card border border-border shadow-md hover:bg-muted"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>
    </aside>
  );
}
