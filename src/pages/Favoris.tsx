import { AppLayout } from "@/components/layout/AppLayout";
import { FavoritesSection } from "@/components/dashboard/FavoritesSection";

export default function Favoris() {
  return (
    <AppLayout title="Favoris" subtitle="Vos produits et boutiques sauvegardés.">
      <div className="animate-fade-in">
        <FavoritesSection />
      </div>
    </AppLayout>
  );
}
