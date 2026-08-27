import { useState } from "react";
import { Plus } from "lucide-react";
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
import { AdminRole, adminRoleLabels } from "@/data/adminData";

export default function AdminAdmins() {
  const { admins, admin, createAdmin, toggleAdmin } = useAdminAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "MODERATOR" as AdminRole });

  const isSuper = admin?.role === "SUPER_ADMIN";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
      toast.error("Nom, email et mot de passe (6+ caractères) requis");
      return;
    }
    createAdmin(form);
    toast.success("Administrateur créé");
    setForm({ name: "", email: "", password: "", role: "MODERATOR" });
    setOpen(false);
  };

  return (
    <AdminLayout title="Administrateurs" subtitle="Comptes du backoffice et rôles">
      <div className="flex justify-end">
        <Button className="h-10" disabled={!isSuper} onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Nouvel administrateur
        </Button>
      </div>
      {!isSuper && (
        <p className="text-xs text-muted-foreground">
          Seul un super admin peut créer ou désactiver des comptes administrateurs.
        </p>
      )}

      <div className="space-y-2">
        {admins.map((a) => (
          <Card key={a.id}>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{a.name}</p>
                  <Badge variant="outline" className="text-[10px]">{adminRoleLabels[a.role]}</Badge>
                  {!a.active && <Badge variant="destructive" className="text-[10px]">Désactivé</Badge>}
                </div>
                <p className="text-xs text-muted-foreground truncate">{a.email} · créé le {a.createdAt}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                disabled={!isSuper || a.id === admin?.id}
                onClick={() => toggleAdmin(a.id)}
              >
                {a.active ? "Désactiver" : "Réactiver"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Nouvel administrateur</SheetTitle>
            <SheetDescription>Accès au backoffice, indépendant des comptes utilisateurs.</SheetDescription>
          </SheetHeader>
          <form onSubmit={submit} className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="a-name">Nom complet *</Label>
              <Input id="a-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="a-email">Email *</Label>
              <Input id="a-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="a-pass">Mot de passe *</Label>
              <Input id="a-pass" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Rôle</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as AdminRole })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(adminRoleLabels) as AdminRole[]).map((r) => (
                    <SelectItem key={r} value={r}>{adminRoleLabels[r]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">Créer l'administrateur</Button>
          </form>
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
}
