import { AppLayout } from "@/components/layout/AppLayout";
import { BusinessHeader } from "@/components/business/BusinessHeader";
import { BusinessMobileNav } from "@/components/business/BusinessMobileNav";
import { Heart, TrendingUp, Eye } from "lucide-react";
import { mockBusiness, mockEngagement } from "@/data/businessMockData";

export default function BusinessDetail() {
  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6 animate-fade-in">
        <BusinessMobileNav />
        <BusinessHeader business={mockBusiness} />

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
