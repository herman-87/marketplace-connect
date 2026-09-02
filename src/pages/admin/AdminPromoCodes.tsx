import { useMemo, useState } from "react";
import { Copy, Plus, Power, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
import {
  PromoCodeStatus,
  PromoCodeType,
  promoStatusLabels,
  promoTypeLabels,
} from "@/data/adminData";

const emptyForm = {
  code: "",
  description: "",
  type: "percentage" as PromoCodeType,
  value: 10,
  minOrder: 0,
  usageLimit: 100,
  scope: "Toute la plateforme",
  startAt: new Date().toISOString().slice(0, 10),
  endAt: "",
  status: "active" as PromoCodeStatus,
};

function valueLabel(type: PromoCodeType, value: number) {
  if (type === "percentage") return `-${value}%`;
  if (type === "amount") return `-${value.toLocaleString("fr-FR")} XAF`;
  return "Livraison offerte";
}

export default function AdminPromoCodes() {
  const { promoCodes, createPromoCode, updatePromoCode, deletePromoCode } = useAdminAuth();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PromoCodeStatus>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | PromoCodeType>("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(
    () =>
      promoCodes.filter((p) => {
        const q = query.trim().toLowerCase();
        const matchQuery =
          !q || [p.code, p.description, p.scope].some((v) => v.toLowerCase().includes(q));
        return (
          matchQuery &&
          (statusFilter === "all" || p.status === statusFilter) &&
          (typeFilter === "all" || p.type === typeFilter)
        );
      }),
    [promoCodes, query, statusFilter, typeFilter],
  );

  const totalUses = promoCodes.reduce((s, p) => s + p.usageCount, 0);
  const activeCount = promoCodes.filter((p) => p.status === "active").length;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) {
      toast.error("Le code est requis");
      return;
    }
    if (promoCodes.some((p) => p.code.toLowerCase() === form.code.trim().toLowerCase())) {
      toast.error("Ce code existe déjà");
      return;
    }
    if (!form.endAt) {
      toast.error("Date de fin requise");
      return;
    }
    createPromoCode({ ...form, code: form.code.trim().toUpperCase() });
    toast.success("Code promo créé");
    setForm(emptyForm);
    setOpen(false);
  };

  return (
    <AdminLayout title="Codes promos" subtitle="Création, suivi et désactivation des codes de réduction">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Codes", value: promoCodes.length },
          { label: "Actifs", value: activeCount },
          { label: "Utilisations", value: totalUses },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un code..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
          <SelectTrigger className="h-10 sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {(Object.keys(promoTypeLabels) as PromoCodeType[]).map((t) => (
              <SelectItem key={t} value={t}>{promoTypeLabels[t]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
          <SelectTrigger className="h-10 sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {(Object.keys(promoStatusLabels) as PromoCodeStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{promoStatusLabels[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="h-10" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Nouveau code
        </Button>
      </div>

      <div className="space-y-2">
        {filtered.map((p) => {
          const pct = p.usageLimit > 0 ? Math.min(100, (p.usageCount / p.usageLimit) * 100) : 0;
          return (
            <Card key={p.id}>
              <CardContent className="p-4 flex flex-col lg:flex-row lg:items-center gap-3">
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-mono font-semibold truncate">{p.code}</p>
                    <Badge variant="outline" className="text-[10px]">{promoTypeLabels[p.type]}</Badge>
                    <Badge variant="outline" className="text-[10px]">{valueLabel(p.type, p.value)}</Badge>
                    <Badge
                      variant={p.status === "active" ? "default" : "outline"}
                      className="text-[10px]"
                    >
                      {promoStatusLabels[p.status]}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{p.description}</p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {p.scope} · min. {p.minOrder.toLocaleString("fr-FR")} XAF · {p.startAt} → {p.endAt}
                  </p>
                </div>

                <div className="lg:w-40 space-y-1">
                  <p className="text-[11px] text-muted-foreground">
                    {p.usageCount} / {p.usageLimit} utilisations
                  </p>
                  <Progress value={pct} className="h-1.5" />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      navigator.clipboard?.writeText(p.code);
                      toast.success("Code copié");
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => {
                      const next = p.status === "disabled" ? "active" : "disabled";
                      updatePromoCode(p.id, { status: next });
                      toast.success(next === "active" ? "Code réactivé" : "Code désactivé");
                    }}
                  >
                    <Power className="h-3.5 w-3.5 mr-1" />
                    {p.status === "disabled" ? "Réactiver" : "Désactiver"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      deletePromoCode(p.id);
                      toast.success("Code supprimé");
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-10">Aucun code promo trouvé.</p>
        )}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Nouveau code promo</SheetTitle>
            <SheetDescription>Le code sera immédiatement disponible sur la plateforme.</SheetDescription>
          </SheetHeader>
          <form onSubmit={submit} className="space-y-4 mt-6">
            <div className="space-y-1.5">
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="PROMO10"
                className="font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="desc">Description</Label>
              <Input
                id="desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="10% sur la première commande"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm({ ...form, type: v as PromoCodeType })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(promoTypeLabels) as PromoCodeType[]).map((t) => (
                      <SelectItem key={t} value={t}>{promoTypeLabels[t]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="value">Valeur</Label>
                <Input
                  id="value"
                  type="number"
                  min={0}
                  disabled={form.type === "shipping"}
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="min">Montant min. (XAF)</Label>
                <Input
                  id="min"
                  type="number"
                  min={0}
                  value={form.minOrder}
                  onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="limit">Limite d'usage</Label>
                <Input
                  id="limit"
                  type="number"
                  min={1}
                  value={form.usageLimit}
                  onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="scope">Périmètre</Label>
              <Input
                id="scope"
                value={form.scope}
                onChange={(e) => setForm({ ...form, scope: e.target.value })}
                placeholder="Toute la plateforme ou nom de boutique"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="start">Début</Label>
                <Input
                  id="start"
                  type="date"
                  value={form.startAt}
                  onChange={(e) => setForm({ ...form, startAt: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="end">Fin *</Label>
                <Input
                  id="end"
                  type="date"
                  value={form.endAt}
                  onChange={(e) => setForm({ ...form, endAt: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Statut</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v as PromoCodeStatus })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(promoStatusLabels) as PromoCodeStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>{promoStatusLabels[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">Créer le code</Button>
          </form>
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
}
