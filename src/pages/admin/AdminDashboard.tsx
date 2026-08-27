import { Building2, FileStack, ShieldAlert, Users } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { contentKindLabels } from "@/data/adminData";

export default function AdminDashboard() {
  const { users, businesses, content } = useAdminAuth();

  const stats = [
    { label: "Utilisateurs", value: users.length, hint: `${users.filter((u) => u.status === "active").length} actifs`, icon: Users },
    { label: "Boutiques", value: businesses.length, hint: `${businesses.filter((b) => b.status === "pending").length} en attente`, icon: Building2 },
    { label: "Contenus", value: content.length, hint: `${content.filter((c) => c.status === "pending").length} à modérer`, icon: FileStack },
    { label: "Signalements", value: content.reduce((s, c) => s + c.reports, 0), hint: "à traiter", icon: ShieldAlert },
  ];

  const queue = content.filter((c) => c.status === "pending" || c.reports > 0);

  return (
    <AdminLayout title="Vue d'ensemble" subtitle="Pilotage de la plateforme">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs">{s.label}</span>
                <s.icon className="h-4 w-4" />
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">File de modération</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {queue.length === 0 && <p className="text-xs text-muted-foreground">Rien à modérer.</p>}
            {queue.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-3 border border-border rounded-lg p-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{c.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {contentKindLabels[c.kind]} · {c.business}
                  </p>
                </div>
                {c.reports > 0 && <Badge variant="destructive" className="text-[10px]">{c.reports} signalement(s)</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Derniers utilisateurs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {users.slice(0, 5).map((u) => (
              <div key={u.id} className="flex items-center justify-between gap-3 border border-border rounded-lg p-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{u.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                </div>
                <Badge variant="outline" className="text-[10px]">{u.createdAt}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
