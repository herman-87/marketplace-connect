import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { BusinessStatus } from "@/data/adminData";

const statusLabels: Record<BusinessStatus, string> = {
  published: "Publiée",
  unpublished: "Dépubliée",
  pending: "En attente",
  blocked: "Bloquée",
};

export default function AdminBusinesses() {
  const { businesses, updateBusiness } = useAdminAuth();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BusinessStatus>("all");

  const filtered = useMemo(
    () =>
      businesses.filter((b) => {
        const q = query.trim().toLowerCase();
        const matchQuery = !q || [b.name, b.owner, b.category].some((v) => v.toLowerCase().includes(q));
        return matchQuery && (statusFilter === "all" || b.status === statusFilter);
      }),
    [businesses, query, statusFilter],
  );

  return (
    <AdminLayout title="Boutiques" subtitle="Validation, publication et blocage des boutiques">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une boutique..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
          <SelectTrigger className="h-10 sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {(Object.keys(statusLabels) as BusinessStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {filtered.map((b) => (
          <Card key={b.id}>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{b.name}</p>
                  <Badge variant="outline" className="text-[10px]">{statusLabels[b.status]}</Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {b.category} · {b.owner}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {b.products} produits · {b.orders} commandes · créée le {b.createdAt}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {b.status !== "published" && (
                  <Button
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => {
                      updateBusiness(b.id, { status: "published" });
                      toast.success("Boutique publiée");
                    }}
                  >
                    Publier
                  </Button>
                )}
                {b.status === "published" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => {
                      updateBusiness(b.id, { status: "unpublished" });
                      toast.success("Boutique dépubliée");
                    }}
                  >
                    Dépublier
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => {
                    updateBusiness(b.id, { status: b.status === "blocked" ? "unpublished" : "blocked" });
                    toast.success(b.status === "blocked" ? "Boutique débloquée" : "Boutique bloquée");
                  }}
                >
                  {b.status === "blocked" ? "Débloquer" : "Bloquer"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-10">Aucune boutique trouvée.</p>
        )}
      </div>
    </AdminLayout>
  );
}
