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
  ArrowRight,
  LayoutDashboard,
  Briefcase,
  Users,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      <div className="space-y-6">
        {/* Statistiques */}
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

        {/* Menu Tabs pour naviguer entre les rubriques */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start bg-muted/30 border border-border/50 p-1 h-auto flex-wrap">
            <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-background">
              <LayoutDashboard className="h-4 w-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="business" className="gap-2 data-[state=active]:bg-background">
              <Briefcase className="h-4 w-4" />
              Mes Business
            </TabsTrigger>
            <TabsTrigger value="collaborations" className="gap-2 data-[state=active]:bg-background">
              <Users className="h-4 w-4" />
              Collaborations
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2 data-[state=active]:bg-background">
              <ShoppingCart className="h-4 w-4" />
              Commandes
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2 data-[state=active]:bg-background">
              <Clock className="h-4 w-4" />
              Activité
            </TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Mes Business */}
            <section className="p-5 rounded-xl bg-muted/20 border border-border/40">
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

            {/* Activité récente + Actions rapides */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <section className="p-5 rounded-xl bg-muted/20 border border-border/40">
                <h2 className="text-lg font-medium text-foreground mb-4">Activité récente</h2>
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-start gap-3 pb-3 border-b border-border/30 last:border-0 last:pb-0">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
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
              </section>

              <section className="p-5 rounded-xl bg-muted/20 border border-border/40">
                <h2 className="text-lg font-medium text-foreground mb-4">Actions rapides</h2>
                <QuickActions />
              </section>
            </div>
          </TabsContent>

          {/* Mes Business */}
          <TabsContent value="business" className="mt-6">
            <section className="p-5 rounded-xl bg-muted/20 border border-border/40">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-foreground">Mes Business</h2>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Créer un business
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {myBusinesses.map((business) => (
                  <BusinessCard key={business.id} {...business} />
                ))}
              </div>
            </section>
          </TabsContent>

          {/* Collaborations */}
          <TabsContent value="collaborations" className="mt-6">
            <section className="p-5 rounded-xl bg-muted/20 border border-border/40">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-foreground">Mes Collaborations</h2>
                <Link to="/collaborations">
                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                    Voir tout
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              {collaborations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {collaborations.map((business) => (
                    <BusinessCard key={business.id} {...business} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm py-8 text-center">
                  Aucune collaboration active
                </p>
              )}
            </section>
          </TabsContent>

          {/* Commandes */}
          <TabsContent value="orders" className="mt-6">
            <section className="p-5 rounded-xl bg-muted/20 border border-border/40">
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
          </TabsContent>

          {/* Activité */}
          <TabsContent value="activity" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <section className="p-5 rounded-xl bg-muted/20 border border-border/40">
                <h2 className="text-lg font-medium text-foreground mb-4">Activité récente</h2>
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-start gap-3 pb-3 border-b border-border/30 last:border-0 last:pb-0">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
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
              </section>

              <section className="p-5 rounded-xl bg-muted/20 border border-border/40">
                <h2 className="text-lg font-medium text-foreground mb-4">Actions rapides</h2>
                <QuickActions />
              </section>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
