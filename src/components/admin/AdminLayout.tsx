import { ReactNode } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Building2,
  FileStack,
  LogOut,
  ShieldCheck,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { adminRoleLabels } from "@/data/adminData";

const navItems = [
  { title: "Vue d'ensemble", href: "/admin", icon: BarChart3 },
  { title: "Utilisateurs", href: "/admin/users", icon: Users },
  { title: "Boutiques", href: "/admin/businesses", icon: Building2 },
  { title: "Contenus", href: "/admin/content", icon: FileStack },
  { title: "Administrateurs", href: "/admin/admins", icon: ShieldCheck },
];

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const { admin, signOut } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!admin) return <Navigate to="/admin/login" replace />;

  const isActive = (href: string) =>
    href === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-sidebar">
        <div className="h-16 flex items-center gap-2 px-4 border-b border-border">
          <div className="h-8 w-8 rounded-lg bg-foreground text-background flex items-center justify-center">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold">Backoffice</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">FastRelays</p>
          </div>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive(item.href)
                  ? "bg-muted font-semibold text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-border space-y-2">
          <div className="text-xs">
            <p className="font-medium truncate">{admin.name}</p>
            <p className="text-muted-foreground truncate">{admin.email}</p>
          </div>
          <Badge variant="outline" className="text-[10px]">{adminRoleLabels[admin.role]}</Badge>
          <Button
            variant="outline"
            size="sm"
            className="w-full h-8 text-xs"
            onClick={() => {
              signOut();
              navigate("/admin/login");
            }}
          >
            <LogOut className="h-3.5 w-3.5 mr-1" /> Déconnexion
          </Button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 border-b border-border flex items-center justify-between px-4 md:px-6">
          <div className="min-w-0">
            <h1 className="text-lg md:text-xl font-bold truncate">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden h-8 text-xs"
            onClick={() => {
              signOut();
              navigate("/admin/login");
            }}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </header>

        <nav className="md:hidden flex gap-1 overflow-x-auto border-b border-border px-2 py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-1.5 text-xs",
                isActive(item.href)
                  ? "bg-muted font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <main className="flex-1 p-4 md:p-6 space-y-6">{children}</main>
      </div>
    </div>
  );
}
