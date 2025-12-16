import { AppLayout } from "@/components/layout/AppLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BusinessCard } from "@/components/dashboard/BusinessCard";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { QuickActions } from "@/components/dashboard/QuickActions";
import {
  Store,
  Package,
  ShoppingCart,
  TrendingUp,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const mockBusinesses = [
  {
    id: "1",
    name: "RestauFast",
    description: "Restaurant rapide et livraison de plats préparés frais",
    productsCount: 24,
    collaboratorsCount: 3,
    status: "active" as const,
    isOwner: true,
  },
  {
    id: "2",
    name: "TechStore",
    description: "Boutique d'accessoires tech et gadgets innovants",
    productsCount: 56,
    collaboratorsCount: 1,
    status: "active" as const,
    isOwner: true,
  },
  {
    id: "3",
    name: "ModeBoutique",
    description: "Collection de vêtements tendance et accessoires",
    productsCount: 89,
    collaboratorsCount: 5,
    status: "active" as const,
    isOwner: false,
  },
];

export default function Index() {
  return (
    <AppLayout
      title="Tableau de bord"
      subtitle="Bienvenue, Jean ! Voici un aperçu de votre activité."
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Revenus du mois"
            value="2,847 €"
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatsCard
            title="Mes Business"
            value="2"
            icon={<Store className="h-5 w-5 text-primary" />}
            trend={{ value: 0, isPositive: true }}
          />
          <StatsCard
            title="Produits publiés"
            value="80"
            icon={<Package className="h-5 w-5 text-primary" />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Commandes"
            value="34"
            icon={<ShoppingCart className="h-5 w-5 text-primary" />}
            trend={{ value: 23, isPositive: true }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Business Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Businesses */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Mes Business
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Business où vous êtes propriétaire
                  </p>
                </div>
                <Button className="gradient-primary border-0 gap-2">
                  <Plus className="h-4 w-4" />
                  Nouveau
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockBusinesses
                  .filter((b) => b.isOwner)
                  .map((business) => (
                    <BusinessCard key={business.id} {...business} />
                  ))}
              </div>
            </section>

            {/* Collaborations */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Mes Collaborations
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Business où vous êtes collaborateur
                  </p>
                </div>
                <Button variant="outline">Voir tout</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockBusinesses
                  .filter((b) => !b.isOwner)
                  .map((business) => (
                    <BusinessCard key={business.id} {...business} />
                  ))}
              </div>
            </section>

            {/* Recent Orders */}
            <RecentOrders />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <QuickActions />

            {/* Activity Summary */}
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="font-semibold text-foreground mb-4">
                Activité récente
              </h3>
              <div className="space-y-4">
                {[
                  {
                    text: "Nouvelle commande sur RestauFast",
                    time: "Il y a 5 min",
                    type: "order",
                  },
                  {
                    text: "Marie a rejoint TechStore",
                    time: "Il y a 2h",
                    type: "collab",
                  },
                  {
                    text: "Produit publié sur le marketplace",
                    time: "Il y a 4h",
                    type: "product",
                  },
                  {
                    text: "Commande livrée avec succès",
                    time: "Hier",
                    type: "delivery",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 text-sm"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                    <div>
                      <p className="text-foreground">{activity.text}</p>
                      <p className="text-muted-foreground text-xs">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
