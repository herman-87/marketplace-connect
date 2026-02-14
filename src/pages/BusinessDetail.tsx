import { AppLayout } from "@/components/layout/AppLayout";
import { BusinessHeader } from "@/components/business/BusinessHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, Heart, TrendingUp, Eye } from "lucide-react";
import { mockBusiness, mockEngagement } from "@/data/businessMockData";

export default function BusinessDetail() {
  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6">
        <BusinessHeader business={mockBusiness} />

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockBusiness.stats.products}</p>
                <p className="text-xs text-muted-foreground">Produits</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent">
                <ShoppingCart className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockBusiness.stats.sales}</p>
                <p className="text-xs text-muted-foreground">Ventes</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary">
                <Users className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockBusiness.stats.followers}</p>
                <p className="text-xs text-muted-foreground">Abonnés</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Heart className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockEngagement.totalLikes}</p>
                <p className="text-xs text-muted-foreground">J'aime</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Activité cette semaine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Nouveaux likes</span>
                <span className="font-semibold text-primary">+{mockEngagement.likesThisWeek}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Vues</span>
                <span className="font-semibold">+{mockEngagement.viewsThisWeek}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Nouveaux abonnés</span>
                <span className="font-semibold text-primary">+{mockEngagement.newFollowers}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                Produits populaires
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockEngagement.topLikedProducts.map((product) => (
                <div key={product.id} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{product.name}</span>
                  <span className="font-semibold flex items-center gap-1">
                    <Heart className="h-3 w-3 text-destructive" />
                    {product.likes}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
