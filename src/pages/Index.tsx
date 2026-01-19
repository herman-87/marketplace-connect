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
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

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

const recentActivities = [
  { text: "Nouvelle commande sur RestauFast", time: "Il y a 5 min" },
  { text: "Marie a rejoint TechStore", time: "Il y a 2h" },
  { text: "Produit publié sur le marketplace", time: "Il y a 4h" },
  { text: "Commande livrée avec succès", time: "Hier" },
];

export default function Index() {
  const myBusinesses = mockBusinesses.filter((b) => b.isOwner);
  const collaborations = mockBusinesses.filter((b) => !b.isOwner);

  return (
    <AppLayout
      title="Tableau de bord"
      subtitle="Bienvenue, Jean ! Voici un aperçu de votre activité."
    >
      <div className="space-y-8">
        {/* Statistiques */}
        <section>
          <h2 className="text-lg font-medium text-foreground mb-4">Aperçu</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Revenus du mois"
              value="2,847 €"
              icon={<TrendingUp className="h-5 w-5 text-foreground" />}
              trend={{ value: 12.5, isPositive: true }}
            />
            <StatsCard
              title="Mes Business"
              value="2"
              icon={<Store className="h-5 w-5 text-foreground" />}
              trend={{ value: 0, isPositive: true }}
            />
            <StatsCard
              title="Produits publiés"
              value="80"
              icon={<Package className="h-5 w-5 text-foreground" />}
              trend={{ value: 8, isPositive: true }}
            />
            <StatsCard
              title="Commandes"
              value="34"
              icon={<ShoppingCart className="h-5 w-5 text-foreground" />}
              trend={{ value: 23, isPositive: true }}
            />
          </div>
        </section>

        {/* Mes Business */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-foreground">Mes Business</h2>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Nouveau
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {myBusinesses.map((business) => (
              <BusinessCard key={business.id} {...business} />
            ))}
          </div>
        </section>

        {/* Mes Collaborations */}
        {collaborations.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-foreground">Mes Collaborations</h2>
              <Link to="/collaborations">
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                  Voir tout
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {collaborations.map((business) => (
                <BusinessCard key={business.id} {...business} />
              ))}
            </div>
          </section>
        )}

        {/* Commandes récentes */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-foreground">Commandes récentes</h2>
            <Link to="/commandes">
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                Voir tout
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <RecentOrders />
        </section>

        {/* Activité récente + Actions rapides */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activité récente */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Activité récente</h2>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-foreground">{activity.text}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions rapides */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Actions rapides</h2>
              <QuickActions />
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
