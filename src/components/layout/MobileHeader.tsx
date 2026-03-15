import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Bell, Search, Store, X, Menu, Settings, LogOut, Heart, 
  PackageCheck, Wallet, BarChart3, LayoutDashboard, Users, 
  ClipboardList, Lock, ChevronDown, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CartSheet } from "@/components/cart/CartSheet";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
import { SubscriptionSheet } from "@/components/subscription/SubscriptionSheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileHeaderProps {
  title?: string;
  subtitle?: string;
  unreadCount: number;
  onNotificationsClick: () => void;
}

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
  { title: "Vue d'ensemble", href: "/dashboard", icon: LayoutDashboard },
  { title: "Mes Business", href: "/mes-business", icon: Store, badge: 2 },
  { title: "Collaborations", href: "/collaborations", icon: Users, badge: 1 },
  { title: "Commandes reçues", href: "/commandes", icon: ClipboardList, badge: 5 },
];

export function MobileHeader({ title, subtitle, unreadCount, onNotificationsClick }: MobileHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const { favoritesCount } = useFavorites();
  const { isPro } = useSubscription();
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(href);
  };

  const NavLink = ({ item, onClick }: { item: NavItem; onClick?: () => void }) => {
    const active = isActive(item.href);
    return (
      <Link
        to={item.href}
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative",
          active
            ? "bg-muted border-l-[3px] border-foreground text-foreground font-bold rounded-l-none"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        <item.icon className={cn("h-5 w-5 shrink-0", active && "text-foreground")} />
        <span className="font-medium text-sm">{item.title}</span>
        {item.badge && (
          <Badge
            variant="secondary"
            className="ml-auto bg-muted text-foreground border-0 text-xs"
          >
            {item.badge}
          </Badge>
        )}
      </Link>
    );
  };

  const CollapsibleGroup = ({ label, items, defaultOpen, locked }: { label: string; items: NavItem[]; defaultOpen?: boolean; locked?: boolean }) => {
    const hasActiveItem = items.some((item) => isActive(item.href));

    if (locked) {
      return (
        <button
          onClick={() => {
            setMenuOpen(false);
            setSubscriptionOpen(true);
          }}
          className="flex items-center justify-between w-full px-3 py-2 text-xs uppercase tracking-wider font-semibold text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        >
          <span>{label}</span>
          <Lock className="h-3.5 w-3.5" />
        </button>
      );
    }

    return (
      <Collapsible defaultOpen={defaultOpen !== undefined ? defaultOpen : hasActiveItem}>
        <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-xs uppercase tracking-wider font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <span>{label}</span>
          <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1 mt-1">
          {items.map((item) => (
            <NavLink key={item.href} item={item} onClick={() => setMenuOpen(false)} />
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <>
      <header className="h-14 bg-card/95 backdrop-blur-md border-b border-border sticky top-0 z-40 lg:hidden">
        <div className="flex items-center justify-between h-full px-4">
          {/* Left - Logo/Menu */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0 flex flex-col">
              <SheetHeader className="p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                    <Store className="w-4 h-4 text-background" />
                  </div>
                  <SheetTitle className="font-bold text-lg">FastRelays</SheetTitle>
                </div>
              </SheetHeader>
              
              {/* User Profile */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-border">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-muted text-foreground">
                      {user?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {user?.email || "Utilisateur"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">Mon espace</p>
                  </div>
                </div>
              </div>

              {/* Back to Marketplace */}
              <div className="p-3 border-b border-border">
                <Link 
                  to="/marketplace" 
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span className="font-medium text-sm">Retour au Marketplace</span>
                </Link>
              </div>

              {/* Navigation Groups */}
              <ScrollArea className="flex-1 p-3">
                <div className="space-y-2">
                  <CollapsibleGroup label="Mon Compte" items={compteItems} defaultOpen />
                  
                  <Separator className="my-3" />
                  
                  <CollapsibleGroup label="Espace Pro" items={gestionItems} locked={!isPro} />
                </div>
              </ScrollArea>

              {/* Bottom Section */}
              <div className="p-3 border-t border-border space-y-1">
                <Link 
                  to="/parametres" 
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Settings className="h-5 w-5" />
                  <span className="font-medium text-sm">Paramètres</span>
                </Link>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium text-sm">Déconnexion</span>
                </button>
                
                {/* Theme Toggle */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 mt-2">
                  <span className="text-sm text-muted-foreground">Thème</span>
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Center - Title or Logo */}
          <div className="flex-1 min-w-0 text-center px-2">
            {title ? (
              <h1 className="text-base font-semibold text-foreground truncate">{title}</h1>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <div className="w-6 h-6 rounded-md bg-foreground flex items-center justify-center">
                  <Store className="w-3.5 h-3.5 text-background" />
                </div>
                <span className="font-bold text-foreground">FastRelays</span>
              </div>
            )}
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {searchOpen ? (
              <div className="absolute inset-x-0 top-0 h-14 bg-card z-50 flex items-center px-4 gap-2">
                <Input
                  placeholder="Rechercher..."
                  className="flex-1"
                  autoFocus
                />
                <Button variant="ghost" size="icon" onClick={() => setSearchOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
                  <Search className="h-5 w-5" />
                </Button>
                <Link to="/favoris">
                  <Button variant="ghost" size="icon" className="relative">
                    <Heart className="h-5 w-5" />
                    {favoritesCount > 0 && (
                      <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[9px] border-0">
                        {favoritesCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <CartSheet />
                <Button variant="ghost" size="icon" className="relative" onClick={onNotificationsClick}>
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[9px] border-0">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <SubscriptionSheet open={subscriptionOpen} onOpenChange={setSubscriptionOpen} />
    </>
  );
}
