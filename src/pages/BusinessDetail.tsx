import { AppLayout } from "@/components/layout/AppLayout";
import { BusinessHeader } from "@/components/business/BusinessHeader";
import { BusinessMobileNav } from "@/components/business/BusinessMobileNav";
import { Package, ShoppingCart, Users, Heart, TrendingUp, Eye } from "lucide-react";
import { mockBusiness, mockEngagement } from "@/data/businessMockData";

export default function BusinessDetail() {
  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6 animate-fade-in">
        <BusinessMobileNav />
        <BusinessHeader business={mockBusiness} />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { icon: Package, value: mockBusiness.stats.products, label: "Produits" },
            { icon: ShoppingCart, value: mockBusiness.stats.sales, label: "Ventes" },
            { icon: Users, value: mockBusiness.stats.followers, label: "Abonnés" },
            { icon: Heart, value: mockEngagement.totalLikes, label: "J'aime" },
          ].map((stat, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-3 md:p-4 flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-lg md:text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground truncate">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="bg-card rounded-xl border border-border p-4 md:p-5 space-y-3">
            <h3 className="text-sm md:text-base font-medium flex items-center gap-2">
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
                  <span className="text-xs md:text-sm text-muted-foreground">{item.label}</span>
                  <span className={`font-semibold text-sm ${item.highlight ? "text-primary" : ""}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-4 md:p-5 space-y-3">
            <h3 className="text-sm md:text-base font-medium flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              Produits populaires
            </h3>
            <div className="space-y-2">
              {mockEngagement.topLikedProducts.map((product) => (
                <div key={product.id} className="flex justify-between items-center">
                  <span className="text-xs md:text-sm text-muted-foreground">{product.name}</span>
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
