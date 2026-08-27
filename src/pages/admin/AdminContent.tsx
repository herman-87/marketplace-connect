import { useMemo, useState } from "react";
import { Check, Search, Trash2, X } from "lucide-react";
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
import { ContentKind, ContentStatus, contentKindLabels } from "@/data/adminData";

const statusLabels: Record<ContentStatus, string> = {
  published: "Publié",
  pending: "En attente",
  rejected: "Rejeté",
};

export default function AdminContent() {
  const { content, updateContent, deleteContent } = useAdminAuth();
  const [query, setQuery] = useState("");
  const [kindFilter, setKindFilter] = useState<"all" | ContentKind>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | ContentStatus>("all");

  const filtered = useMemo(
    () =>
      content.filter((c) => {
        const q = query.trim().toLowerCase();
        const matchQuery = !q || [c.title, c.business].some((v) => v.toLowerCase().includes(q));
        return (
          matchQuery &&
          (kindFilter === "all" || c.kind === kindFilter) &&
          (statusFilter === "all" || c.status === statusFilter)
        );
      }),
    [content, query, kindFilter, statusFilter],
  );

  return (
    <AdminLayout title="Contenus" subtitle="Modération des produits, promotions et avis">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un contenu..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <Select value={kindFilter} onValueChange={(v) => setKindFilter(v as typeof kindFilter)}>
          <SelectTrigger className="h-10 sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {(Object.keys(contentKindLabels) as ContentKind[]).map((k) => (
              <SelectItem key={k} value={k}>{contentKindLabels[k]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
          <SelectTrigger className="h-10 sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {(Object.keys(statusLabels) as ContentStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {filtered.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium truncate">{c.title}</p>
                  <Badge variant="outline" className="text-[10px]">{contentKindLabels[c.kind]}</Badge>
                  <Badge variant="outline" className="text-[10px]">{statusLabels[c.status]}</Badge>
                  {c.reports > 0 && (
                    <Badge variant="destructive" className="text-[10px]">{c.reports} signalement(s)</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{c.business} · {c.createdAt}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="h-8 text-xs"
                  disabled={c.status === "published"}
                  onClick={() => {
                    updateContent(c.id, { status: "published", reports: 0 });
                    toast.success("Contenu approuvé");
                  }}
                >
                  <Check className="h-3.5 w-3.5 mr-1" /> Approuver
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  disabled={c.status === "rejected"}
                  onClick={() => {
                    updateContent(c.id, { status: "rejected" });
                    toast.success("Contenu rejeté");
                  }}
                >
                  <X className="h-3.5 w-3.5 mr-1" /> Rejeter
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    deleteContent(c.id);
                    toast.success("Contenu supprimé");
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-10">Aucun contenu trouvé.</p>
        )}
      </div>
    </AdminLayout>
  );
}
