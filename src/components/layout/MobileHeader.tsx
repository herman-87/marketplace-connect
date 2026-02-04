import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Search, Store, X, Menu, Settings, LogOut, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CartSheet } from "@/components/cart/CartSheet";
import { useFavorites } from "@/contexts/FavoritesContext";
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

export function MobileHeader({ title, subtitle, unreadCount, onNotificationsClick }: MobileHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { favoritesCount } = useFavorites();

  return (
    <header className="h-14 bg-card/95 backdrop-blur-md border-b border-border sticky top-0 z-40 lg:hidden">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left - Logo/Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Store className="w-4 h-4 text-primary-foreground" />
                </div>
                <SheetTitle className="font-bold text-lg">MultiShop</SheetTitle>
              </div>
            </SheetHeader>
            
            {/* User Profile */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">Jean Dupont</p>
                  <p className="text-xs text-muted-foreground truncate">jean@example.com</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="p-4 space-y-1">
              <Link to="/parametres" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <Settings className="h-5 w-5" />
                <span>Paramètres</span>
              </Link>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                <LogOut className="h-5 w-5" />
                <span>Déconnexion</span>
              </button>
            </div>

            {/* Theme Toggle */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
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
              <div className="w-6 h-6 rounded-md gradient-primary flex items-center justify-center">
                <Store className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">MultiShop</span>
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
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {favoritesCount > 0 && (
                  <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[9px] border-0">
                    {favoritesCount}
                  </Badge>
                )}
              </Button>
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
  );
}
