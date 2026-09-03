import { useMemo, useState } from "react";
import { AlertTriangle, Check, Eye, EyeOff, Search, ShieldAlert, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ContentModerationDialog } from "@/components/admin/ContentModerationDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
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
  AdminContentItem,
  ContentKind,
  ContentSeverity,
  ContentStatus,
  contentKindLabels,
  severityLabels,
} from "@/data/adminData";

const statusLabels: Record<ContentStatus, string> = {
  published: "Publié",
  pending: "En attente",
  rejected: "Rejeté",
  hidden: "Masqué",
};

export default function AdminContent() {
  const { content, moderateContent, dismissReports, addModerationNote, deleteContent } = useAdminAuth();
  const [query, setQuery] = useState("");
  const [kindFilter, setKindFilter] = useState<"all" | ContentKind>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | ContentStatus>("all");
  const [severityFilter, setSeverityFilter] = useState<"all" | ContentSeverity>("all");
  const [onlyReported, setOnlyReported] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [dialog, setDialog] = useState<{ mode: "rejected" | "hidden"; ids: string[] } | null>(null);
  const [detail, setDetail] = useState<AdminContentItem | null>(null);
  const [note, setNote] = useState("");

  const filtered = useMemo(
    () =>
      content.filter((c) => {
        const q = query.trim().toLowerCase();
        const matchQuery =
          !q || [c.title, c.business, c.author ?? ""].some((v) => v.toLowerCase().includes(q));
        return (
          matchQuery &&
          (kindFilter === "all" || c.kind === kindFilter) &&
          (statusFilter === "all" || c.status === statusFilter) &&
          (severityFilter === "all" || c.severity === severityFilter) &&
          (!onlyReported || c.reports > 0)
        );
      }),
    [content, query, kindFilter, statusFilter, severityFilter, onlyReported],
  );

  const stats = [
    { label: "À modérer", value: content.filter((c) => c.status === "pending").length },
    { label: "Signalés", value: content.filter((c) => c.reports > 0).length },
    { label: "Masqués", value: content.filter((c) => c.status === "hidden").length },
    { label: "Rejetés", value: content.filter((c) => c.status === "rejected").length },
  ];

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const openDetail = (c: AdminContentItem) => {
    setDetail(c);
    setNote(c.moderationNote ?? "");
  };

  const approve = (ids: string[]) => {
    moderateContent(ids, "published");
    setSelected([]);
    toast.success(ids.length > 1 ? `${ids.length} contenus approuvés` : "Contenu approuvé");
  };

  const current = detail ? content.find((c) => c.id === detail.id) ?? detail : null;

  return (
    <AdminLayout title="Contenus" subtitle="Modération des produits, promotions et avis">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un contenu, une boutique, un auteur..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <Select value={kindFilter} onValueChange={(v) => setKindFilter(v as typeof kindFilter)}>
          <SelectTrigger className="h-10 lg:w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {(Object.keys(contentKindLabels) as ContentKind[]).map((k) => (
              <SelectItem key={k} value={k}>{contentKindLabels[k]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
          <SelectTrigger className="h-10 lg:w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {(Object.keys(statusLabels) as ContentStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v as typeof severityFilter)}>
          <SelectTrigger className="h-10 lg:w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toute gravité</SelectItem>
            {(Object.keys(severityLabels) as ContentSeverity[]).map((s) => (
              <SelectItem key={s} value={s}>{severityLabels[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant={onlyReported ? "default" : "outline"}
          className="h-10 text-xs"
          onClick={() => setOnlyReported((v) => !v)}
        >
          <ShieldAlert className="h-4 w-4 mr-1" /> Signalés
        </Button>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/40 p-3">
          <p className="text-xs font-medium mr-auto">{selected.length} sélectionné(s)</p>
          <Button size="sm" className="h-8 text-xs" onClick={() => approve(selected)}>
            <Check className="h-3.5 w-3.5 mr-1" /> Approuver
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => setDialog({ mode: "hidden", ids: selected })}
          >
            <EyeOff className="h-3.5 w-3.5 mr-1" /> Masquer
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => setDialog({ mode: "rejected", ids: selected })}
          >
            <X className="h-3.5 w-3.5 mr-1" /> Rejeter
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={() => {
              dismissReports(selected);
              setSelected([]);
              toast.success("Signalements ignorés");
            }}
          >
            Ignorer signalements
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <Checkbox
                checked={selected.includes(c.id)}
                onCheckedChange={() => toggle(c.id)}
                className="mt-0.5"
              />
              <button className="flex-1 min-w-0 text-left" onClick={() => openDetail(c)}>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium truncate">{c.title}</p>
                  <Badge variant="outline" className="text-[10px]">{contentKindLabels[c.kind]}</Badge>
                  <Badge variant="outline" className="text-[10px]">{statusLabels[c.status]}</Badge>
                  {c.severity === "high" && (
                    <Badge variant="destructive" className="text-[10px]">
                      <AlertTriangle className="h-3 w-3 mr-1" /> Gravité élevée
                    </Badge>
                  )}
                  {c.reports > 0 && (
                    <Badge variant="destructive" className="text-[10px]">{c.reports} signalement(s)</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {c.business}{c.author ? ` · ${c.author}` : ""} · {c.createdAt}
                </p>
              </button>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => openDetail(c)}>
                  <Eye className="h-3.5 w-3.5 mr-1" /> Examiner
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-xs"
                  disabled={c.status === "published"}
                  onClick={() => approve([c.id])}
                >
                  <Check className="h-3.5 w-3.5 mr-1" /> Approuver
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  disabled={c.status === "rejected"}
                  onClick={() => setDialog({ mode: "rejected", ids: [c.id] })}
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

      <ContentModerationDialog
        open={!!dialog}
        onOpenChange={(o) => !o && setDialog(null)}
        count={dialog?.ids.length ?? 0}
        mode={dialog?.mode ?? "rejected"}
        onConfirm={(reason) => {
          if (!dialog) return;
          moderateContent(dialog.ids, dialog.mode, reason);
          setSelected([]);
          setDialog(null);
          toast.success(dialog.mode === "rejected" ? "Contenu rejeté" : "Contenu masqué");
        }}
      />

      <Sheet open={!!current} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          {current && (
            <>
              <SheetHeader>
                <SheetTitle className="pr-6">{current.title}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-5">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-[10px]">{contentKindLabels[current.kind]}</Badge>
                  <Badge variant="outline" className="text-[10px]">{statusLabels[current.status]}</Badge>
                  {current.severity && (
                    <Badge variant="outline" className="text-[10px]">
                      Gravité : {severityLabels[current.severity]}
                    </Badge>
                  )}
                </div>

                <div className="space-y-1 text-sm">
                  <p className="text-xs text-muted-foreground">Boutique</p>
                  <p className="font-medium">{current.business}</p>
                  {current.author && (
                    <p className="text-xs text-muted-foreground">Auteur : {current.author}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Publié le {current.createdAt}</p>
                </div>

                {current.description && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Contenu</p>
                    <p className="text-sm rounded-lg border border-border p-3">{current.description}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Signalements ({current.reportDetails?.length ?? 0})
                  </p>
                  {(current.reportDetails ?? []).length === 0 && (
                    <p className="text-xs text-muted-foreground">Aucun signalement.</p>
                  )}
                  {(current.reportDetails ?? []).map((r) => (
                    <div key={r.id} className="rounded-lg border border-border p-3">
                      <p className="text-sm">{r.reason}</p>
                      <p className="text-xs text-muted-foreground">{r.reporter} · {r.createdAt}</p>
                    </div>
                  ))}
                </div>

                {current.rejectionReason && (
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Dernière décision</p>
                    <p className="text-sm">{current.rejectionReason}</p>
                    {current.reviewedBy && (
                      <p className="text-xs text-muted-foreground">
                        {current.reviewedBy} · {current.reviewedAt}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Note interne</p>
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Contexte pour l'équipe de modération..."
                    rows={3}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => {
                      addModerationNote(current.id, note);
                      toast.success("Note enregistrée");
                    }}
                  >
                    Enregistrer la note
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button className="h-9 text-xs" onClick={() => { approve([current.id]); setDetail(null); }}>
                    <Check className="h-3.5 w-3.5 mr-1" /> Approuver
                  </Button>
                  <Button
                    variant="outline"
                    className="h-9 text-xs"
                    onClick={() => setDialog({ mode: "hidden", ids: [current.id] })}
                  >
                    <EyeOff className="h-3.5 w-3.5 mr-1" /> Masquer
                  </Button>
                  <Button
                    variant="outline"
                    className="h-9 text-xs"
                    onClick={() => setDialog({ mode: "rejected", ids: [current.id] })}
                  >
                    <X className="h-3.5 w-3.5 mr-1" /> Rejeter
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-9 text-xs"
                    onClick={() => {
                      dismissReports([current.id]);
                      toast.success("Signalements ignorés");
                    }}
                  >
                    Ignorer signalements
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
}
