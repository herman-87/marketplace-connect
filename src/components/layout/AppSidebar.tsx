import { useState } from "react";
import { SubscriptionSheet } from "@/components/subscription/SubscriptionSheet";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  Users,
  ClipboardList,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Lock,
  ArrowLeft,
  ShoppingBag,
  Wallet,
  BarChart3,
  Heart,
  PackageCheck,
  Package,
  ShoppingCart,
  UserCog,
  TrendingUp,
  Gauge,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { mockBusiness } from "@/data/businessMockData";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const compteItems: NavItem[] = [
  { title: "Mes Achats", href: "/mes-achats", icon: PackageCheck, badge: 2 },
  { title: "Wallet", href: "/wallet", icon: Wallet },
  { title: "Mes Dépenses", href: "/mes-depenses", icon: BarChart3 },
  { title: "Favoris", href: "/favoris", icon: Heart },
];

const gestionItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Mes Business", href: "/mes-business", icon: Store, badge: 2 },
  { title: "Collaborations", href: "/collaborations", icon: Users, badge: 1 },
  { title: "Commandes reçues", href: "/commandes", icon: ClipboardList, badge: 5 },
];

const bottomNavItems: NavItem[] = [
  { title: "Paramètres", href: "/parametres", icon: Settings },
];

function getBusinessItems(businessId: string): NavItem[] {
  return [
    { title: "Tableau de bord", href: `/business/${businessId}`, icon: Gauge },
    { title: "Produits", href: `/business/${businessId}/products`, icon: Package },
    { title: "Commandes boutique", href: `/business/${businessId}/orders`, icon: ShoppingCart, badge: 2 },
    { title: "Équipe", href: `/business/${businessId}/team`, icon: UserCog },
    { title: "Engagement", href: `/business/${businessId}/engagement`, icon: TrendingUp },
  ];
}

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPro } = useSubscription();

  // Detect if we're in a business context
  const businessMatch = location.pathname.match(/^\/business\/([^/]+)/);
  const businessId = businessMatch ? businessMatch[1] : null;
  const isBusinessContext = !!businessId;
  const businessName = isBusinessContext ? mockBusiness.name : null;

  const isActive = (href: string) => {
    // Exact match for business overview
    if (href.match(/^\/business\/[^/]+$/) && location.pathname === href) return true;
    if (href.match(/^\/business\/[^/]+$/)) return false;
    if (href === "/dashboard") return location.pathname === "/dashboard";
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
            <span className="font-medium text-sm">{item.title}</span>
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

  const CollapsibleGroup = ({ label, items, defaultOpen, locked }: { label: string; items: NavItem[]; defaultOpen?: boolean; locked?: boolean }) => {
    const hasActiveItem = items.some((item) => isActive(item.href));

    if (locked) {
      return collapsed ? (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={() => setSubscriptionOpen(true)}
              className="flex items-center justify-center w-full px-3 py-2.5 rounded-lg text-sidebar-foreground/40 hover:text-sidebar-foreground/60 transition-colors"
            >
              <Lock className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Espace Pro (verrouillé)</TooltipContent>
        </Tooltip>
      ) : (
        <button
          onClick={() => setSubscriptionOpen(true)}
          className="flex items-center justify-between w-full px-3 py-2 text-[10px] uppercase tracking-wider font-semibold text-sidebar-foreground/30 hover:text-sidebar-foreground/50 transition-colors"
        >
          <span>{label}</span>
          <Lock className="h-3 w-3" />
        </button>
      );
    }

    if (collapsed) {
      return (
        <div className="space-y-1">
          {items.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>
      );
    }

    return (
      <Collapsible defaultOpen={defaultOpen !== undefined ? defaultOpen : hasActiveItem}>
        <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-[10px] uppercase tracking-wider font-semibold text-sidebar-foreground/40 hover:text-sidebar-foreground/60 transition-colors">
          <span>{label}</span>
          <ChevronDown className="h-3 w-3 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          {items.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  const businessItems = businessId ? getBusinessItems(businessId) : [];

  return (
    <>
    <aside
      className={cn(
        "h-screen bg-sidebar sticky top-0 flex-col border-r border-sidebar-border transition-all duration-300 hidden lg:flex",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Store className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-sidebar-foreground">FastRelays</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center mx-auto">
            <Store className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Back to Marketplace */}
      <div className={cn("p-3 border-b border-sidebar-border", collapsed ? "flex justify-center" : "")}>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Link to="/marketplace">
              <Button
                variant="ghost"
                size={collapsed ? "icon" : "default"}
                className={cn(
                  "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 w-full",
                  !collapsed && "justify-start gap-2"
                )}
              >
                <ArrowLeft className="h-5 w-5 shrink-0" />
                {!collapsed && <span>Retour au Marketplace</span>}
              </Button>
            </Link>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Retour au Marketplace</TooltipContent>}
        </Tooltip>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 p-3 overflow-y-auto space-y-1">
        {/* Mon Compte Group - Always visible */}
        <CollapsibleGroup label="Mon Compte" items={compteItems} />

        <Separator className="my-3 bg-sidebar-border" />

        {isBusinessContext && isPro ? (
          <>
            <div className="border-l-2 border-primary pl-3 -mx-1">
              <CollapsibleGroup label={businessName || "Mon Business"} items={businessItems} defaultOpen={true} />
            </div>
            <Separator className="my-3 bg-sidebar-border" />
            <CollapsibleGroup label="Espace Pro" items={gestionItems} />
          </>
        ) : (
          <CollapsibleGroup label="Espace Pro" items={gestionItems} locked={!isPro} />
        )}
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
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.email || "Utilisateur"}
              </p>
              <p className="text-xs text-sidebar-muted truncate">
                Mon espace
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

    <SubscriptionSheet open={subscriptionOpen} onOpenChange={setSubscriptionOpen} />
    </>
  );
}
