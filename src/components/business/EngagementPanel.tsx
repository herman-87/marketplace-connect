import { Badge } from "@/components/ui/badge";
import { Heart, Eye, TrendingUp, Users } from "lucide-react";

interface EngagementStats {
  totalLikes: number;
  totalViews: number;
  totalFollowers: number;
  likesThisWeek: number;
  viewsThisWeek: number;
  newFollowers: number;
  topLikedProducts: {
    id: string;
    name: string;
    likes: number;
    image?: string;
  }[];
}

interface EngagementPanelProps {
  stats: EngagementStats;
}

export function EngagementPanel({ stats }: EngagementPanelProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-card rounded-xl border border-border p-4 md:p-5 flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
            <Heart className="h-5 w-5 md:h-6 md:w-6 text-destructive" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-2xl md:text-3xl font-bold text-foreground">{stats.totalLikes}</p>
            <p className="text-xs md:text-sm text-muted-foreground">Likes</p>
          </div>
          {stats.likesThisWeek > 0 && (
            <Badge variant="secondary" className="text-xs shrink-0">+{stats.likesThisWeek}</Badge>
          )}
        </div>
        <div className="bg-card rounded-xl border border-border p-4 md:p-5 flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-info/10 flex items-center justify-center shrink-0">
            <Eye className="h-5 w-5 md:h-6 md:w-6 text-info" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-2xl md:text-3xl font-bold text-foreground">{stats.totalViews}</p>
            <p className="text-xs md:text-sm text-muted-foreground">Vues</p>
          </div>
          {stats.viewsThisWeek > 0 && (
            <Badge variant="secondary" className="text-xs shrink-0">+{stats.viewsThisWeek}</Badge>
          )}
        </div>
        <div className="bg-card rounded-xl border border-border p-4 md:p-5 flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-2xl md:text-3xl font-bold text-foreground">{stats.totalFollowers}</p>
            <p className="text-xs md:text-sm text-muted-foreground">Abonnés</p>
          </div>
          {stats.newFollowers > 0 && (
            <Badge variant="secondary" className="text-xs shrink-0">+{stats.newFollowers}</Badge>
          )}
        </div>
      </div>

      {/* Top Liked Products */}
      <div>
        <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          Produits les plus aimés
        </h4>
        <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border/50">
          {stats.topLikedProducts.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center gap-3 md:gap-4 px-3 md:px-4 py-3 md:py-4 hover:bg-muted/30 transition-colors"
            >
              <span className="text-sm md:text-base font-semibold text-muted-foreground w-6 text-center">{index + 1}.</span>
              <div className="h-10 w-10 md:h-11 md:w-11 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-lg">📦</span>
                )}
              </div>
              <span className="flex-1 text-xs md:text-sm font-semibold truncate">{product.name}</span>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Heart className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span className="text-xs md:text-sm font-semibold">{product.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
