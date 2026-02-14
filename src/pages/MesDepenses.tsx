import { AppLayout } from "@/components/layout/AppLayout";
import { SpendingOverview } from "@/components/dashboard/SpendingOverview";

export default function MesDepenses() {
  return (
    <AppLayout title="Mes Dépenses" subtitle="Analysez vos habitudes de consommation.">
      <div className="animate-fade-in">
        <SpendingOverview />
      </div>
    </AppLayout>
  );
}
