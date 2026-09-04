import { useMemo, useState } from "react";
import { History, Search } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

export default function AdminModerationLog() {
  const { moderationLog } = useAdminAuth();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return moderationLog;
    return moderationLog.filter((l) =>
      [l.contentTitle, l.action, l.admin, l.reason ?? ""].some((v) => v.toLowerCase().includes(q)),
    );
  }, [moderationLog, query]);

  return (
    <AdminLayout title="Journal de modération" subtitle="Traçabilité des décisions prises sur les contenus">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une décision, un contenu, un modérateur..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-10"
        />
      </div>

      <div className="space-y-2">
        {filtered.map((l) => (
          <Card key={l.id}>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium truncate">{l.contentTitle}</p>
                  <Badge variant="outline" className="text-[10px]">{l.action}</Badge>
                </div>
                {l.reason && <p className="text-xs text-muted-foreground">Motif : {l.reason}</p>}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 shrink-0">
                <History className="h-3.5 w-3.5" /> {l.admin} · {l.at}
              </p>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-10">Aucune décision enregistrée.</p>
        )}
      </div>
    </AdminLayout>
  );
}
