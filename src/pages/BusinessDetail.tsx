import { AppLayout } from "@/components/layout/AppLayout";
import { BusinessHeader } from "@/components/business/BusinessHeader";
import { Package, ShoppingCart, Users, Heart, TrendingUp, Eye } from "lucide-react";
import { mockBusiness, mockEngagement } from "@/data/businessMockData";

export default function BusinessDetail() {
  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6">
        <BusinessHeader business={mockBusiness} />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Package, value: mockBusiness.stats.products, label: "Produits", color: "text-primary" },
            { icon: ShoppingCart, value: mockBusiness.stats.sales, label: "Ventes", color: "text-foreground" },
            { icon: Users, value: mockBusiness.stats.followers, label: "Abonnés", color: "text-foreground" },
            { icon: Heart, value: mockEngagement.totalLikes, label: "J'aime", color: "text-foreground" },
          ].map((stat, i) => (
            <div key={i} className="rounded-lg bg-card p-4 flex items-center gap-3">
              <div className="p-2 rounded-md bg-muted">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-lg bg-card p-4 space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Activité cette semaine
            </h3>
            <div className="space-y-2">
              {[
                { label: "Nouveaux likes", value: `+${mockEngagement.likesThisWeek}`, highlight: true },
                { label: "Vues", value: `+${mockEngagement.viewsThisWeek}` },
                { label: "Nouveaux abonnés", value: `+${mockEngagement.newFollowers}`, highlight: true },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className={`font-semibold text-sm ${item.highlight ? "text-primary" : ""}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-card p-4 space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              Produits populaires
            </h3>
            <div className="space-y-2">
              {mockEngagement.topLikedProducts.map((product) => (
                <div key={product.id} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{product.name}</span>
                  <span className="font-semibold text-sm flex items-center gap-1">
                    <Heart className="h-3 w-3 text-destructive" />
                    {product.likes}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
