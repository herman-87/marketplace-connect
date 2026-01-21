import { ReactNode, useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { MobileNav } from "./MobileNav";
import { MobileHeader } from "./MobileHeader";
import { Bell, Search, X, ShoppingBag, Heart, UserPlus, Package, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

// Mock notifications
const mockNotifications = [
  {
    id: "1",
    type: "order" as const,
    title: "Nouvelle commande",
    message: "Sophie Laurent a commandé 2x Poulet Yassa",
    time: "Il y a 5 min",
    read: false,
  },
  {
    id: "2",
    type: "like" as const,
    title: "Nouveau like",
    message: "Pierre Moreau a aimé votre Thieboudienne",
    time: "Il y a 15 min",
    read: false,
  },
  {
    id: "3",
    type: "follower" as const,
    title: "Nouveau follower",
    message: "Claire Bernard suit maintenant votre boutique",
    time: "Il y a 1 heure",
    read: false,
  },
  {
    id: "4",
    type: "product" as const,
    title: "Produit approuvé",
    message: "Votre produit 'Mafé' a été publié sur le marketplace",
    time: "Il y a 2 heures",
    read: true,
  },
  {
    id: "5",
    type: "order" as const,
    title: "Commande livrée",
    message: "La commande #ord-004 a été marquée comme livrée",
    time: "Hier",
    read: true,
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "order":
      return <ShoppingBag className="h-4 w-4" />;
    case "like":
      return <Heart className="h-4 w-4" />;
    case "follower":
      return <UserPlus className="h-4 w-4" />;
    case "product":
      return <Package className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case "order":
      return "bg-blue-500/10 text-blue-600";
    case "like":
      return "bg-rose-500/10 text-rose-500";
    case "follower":
      return "bg-emerald-500/10 text-emerald-600";
    case "product":
      return "bg-violet-500/10 text-violet-600";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function AppLayout({ children, title, subtitle }: AppLayoutProps) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const NotificationsContent = () => (
    <>
      <SheetHeader className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <SheetTitle className="text-lg font-semibold">
            Notifications
          </SheetTitle>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-primary hover:text-primary/80"
            >
              <Check className="h-3 w-3 mr-1" />
              Tout marquer comme lu
            </Button>
          )}
        </div>
      </SheetHeader>

      <ScrollArea className="h-[calc(100vh-80px)]">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Bell className="h-12 w-12 mb-4 opacity-20" />
            <p className="text-sm">Aucune notification</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer relative group ${
                  !notification.read ? "bg-primary/5" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex gap-3">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(
                      notification.type
                    )}`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm text-foreground">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.time}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </>
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AppSidebar />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <MobileHeader 
          title={title}
          subtitle={subtitle}
          unreadCount={unreadCount}
          onNotificationsClick={() => setNotificationsOpen(true)}
        />

        {/* Desktop Header */}
        <header className="h-16 bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10 hidden lg:flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            {title && (
              <div>
                <h1 className="text-xl font-semibold text-foreground">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                className="w-64 pl-9 bg-muted/50 border-0 focus-visible:ring-1"
              />
            </div>

            <ThemeToggle />

            <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] gradient-primary border-0">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:w-[400px] p-0">
                <NotificationsContent />
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Mobile Notifications Sheet */}
        <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <SheetContent side="right" className="w-full sm:w-[400px] p-0 lg:hidden">
            <NotificationsContent />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 xl:p-8 pb-20 lg:pb-8">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>
    </div>
  );
}
