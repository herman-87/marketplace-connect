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
  Users,
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
  { text: "Nouvelle commande sur RestauFast", time: "Il y a 5 min", type: "order" },
  { text: "Marie a rejoint TechStore", time: "Il y a 2h", type: "collab" },
  { text: "Produit publié sur le marketplace", time: "Il y a 4h", type: "product" },
  { text: "Commande livrée avec succès", time: "Hier", type: "delivery" },
];

export default function Index() {
  const myBusinesses = mockBusinesses.filter((b) => b.isOwner);
  const collaborations = mockBusinesses.filter((b) => !b.isOwner);

  return (
    <AppLayout
      title="Tableau de bord"
      subtitle="Bienvenue, Jean ! Voici un aperçu de votre activité."
    >
      <div className="space-y-8 animate-fade-in">
        {/* Stats Row */}
        <section>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
        </section>

        {/* My Businesses Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Mes Business</h2>
              <p className="text-sm text-muted-foreground">
                Business où vous êtes propriétaire
              </p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nouveau Business
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myBusinesses.map((business) => (
              <BusinessCard key={business.id} {...business} />
            ))}
          </div>
        </section>

        {/* Collaborations Section */}
        {collaborations.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Mes Collaborations</h2>
                <p className="text-sm text-muted-foreground">
                  Business où vous êtes collaborateur
                </p>
              </div>
              <Link to="/collaborations">
                <Button variant="outline" className="gap-2">
                  Voir tout
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {collaborations.map((business) => (
                <BusinessCard key={business.id} {...business} />
              ))}
            </div>
          </section>
        )}

        {/* Two Column Layout: Orders + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders - Takes 2/3 */}
          <div className="lg:col-span-2">
            <RecentOrders />
          </div>

          {/* Sidebar - Takes 1/3 */}
          <div className="space-y-6">
            <QuickActions />

            {/* Activity Feed */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Activité récente
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-foreground leading-tight">{activity.text}</p>
                        <p className="text-muted-foreground text-xs mt-0.5">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
