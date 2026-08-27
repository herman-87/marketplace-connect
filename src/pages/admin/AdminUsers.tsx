import { useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { PlatformUserStatus } from "@/data/adminData";

const statusLabels: Record<PlatformUserStatus, string> = {
  active: "Actif",
  suspended: "Suspendu",
  pending: "En attente",
};

export default function AdminUsers() {
  const { users, createUser, updateUser, deleteUser } = useAdminAuth();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PlatformUserStatus>("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", status: "active" as PlatformUserStatus, isPro: false });

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        const q = query.trim().toLowerCase();
        const matchQuery = !q || [u.name, u.email, u.phone].some((v) => v.toLowerCase().includes(q));
        const matchStatus = statusFilter === "all" || u.status === statusFilter;
        return matchQuery && matchStatus;
      }),
    [users, query, statusFilter],
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Nom et email requis");
      return;
    }
    createUser(form);
    toast.success("Compte utilisateur créé");
    setForm({ name: "", email: "", phone: "", status: "active", isPro: false });
    setOpen(false);
  };

  return (
    <AdminLayout title="Utilisateurs" subtitle="Création et gestion des comptes utilisateurs">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un utilisateur..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
          <SelectTrigger className="h-10 sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="suspended">Suspendu</SelectItem>
          </SelectContent>
        </Select>
        <Button className="h-10" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Nouveau compte
        </Button>
      </div>

      <div className="space-y-2">
        {filtered.map((u) => (
          <Card key={u.id}>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{u.name}</p>
                  {u.isPro && <Badge variant="secondary" className="text-[10px]">Pro</Badge>}
                </div>
                <p className="text-xs text-muted-foreground truncate">{u.email} · {u.phone || "—"}</p>
                <p className="text-[11px] text-muted-foreground">Inscrit le {u.createdAt}</p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={u.status} onValueChange={(v) => updateUser(u.id, { status: v as PlatformUserStatus })}>
                  <SelectTrigger className="h-8 text-xs w-36"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(statusLabels) as PlatformUserStatus[]).map((s) => (
                      <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => updateUser(u.id, { isPro: !u.isPro })}
                >
                  {u.isPro ? "Retirer Pro" : "Passer Pro"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    deleteUser(u.id);
                    toast.success("Compte supprimé");
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-10">Aucun utilisateur trouvé.</p>
        )}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Nouveau compte utilisateur</SheetTitle>
            <SheetDescription>Les comptes sont créés uniquement par les administrateurs.</SheetDescription>
          </SheetHeader>
          <form onSubmit={submit} className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="u-name">Nom complet *</Label>
              <Input id="u-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="u-email">Email *</Label>
              <Input id="u-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="u-phone">Téléphone</Label>
              <Input id="u-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Statut initial</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as PlatformUserStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(statusLabels) as PlatformUserStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">Créer le compte</Button>
          </form>
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
}
