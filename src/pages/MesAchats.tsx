import { AppLayout } from "@/components/layout/AppLayout";
import { MyPurchases } from "@/components/dashboard/MyPurchases";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ShoppingBag, PackageCheck, Truck, Clock } from "lucide-react";

export default function MesAchats() {
  return (
    <AppLayout title="Mes Achats" subtitle="Suivez vos commandes et confirmez leur réception.">
      <div className="space-y-4 md:space-y-6 animate-fade-in">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <StatsCard title="Total achats" value="12" icon={<ShoppingBag className="h-5 w-5 text-foreground" />} />
          <StatsCard title="En cours" value="2" icon={<Truck className="h-5 w-5 text-foreground" />} />
          <StatsCard title="Livrées" value="8" icon={<PackageCheck className="h-5 w-5 text-foreground" />} />
          <StatsCard title="En attente" value="2" icon={<Clock className="h-5 w-5 text-foreground" />} />
        </div>
        <section className="p-4 md:p-5 rounded-xl bg-muted/20 border border-border/40">
          <h2 className="text-base md:text-lg font-medium text-foreground mb-4">Historique des achats</h2>
          <MyPurchases />
        </section>
      </div>
    </AppLayout>
  );
}
