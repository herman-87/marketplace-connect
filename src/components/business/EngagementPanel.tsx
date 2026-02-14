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
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-6 rounded-lg bg-card border border-border/60 hover:border-border transition-colors">
          <Heart className="h-6 w-6 mx-auto text-muted-foreground mb-3" />
          <p className="text-3xl font-bold">{stats.totalLikes}</p>
          <p className="text-sm text-muted-foreground mt-1">Likes</p>
          {stats.likesThisWeek > 0 && (
            <Badge variant="secondary" className="mt-3 text-xs">+{stats.likesThisWeek} cette semaine</Badge>
          )}
        </div>
        <div className="text-center p-6 rounded-lg bg-card border border-border/60 hover:border-border transition-colors">
          <Eye className="h-6 w-6 mx-auto text-muted-foreground mb-3" />
          <p className="text-3xl font-bold">{stats.totalViews}</p>
          <p className="text-sm text-muted-foreground mt-1">Vues</p>
          {stats.viewsThisWeek > 0 && (
            <Badge variant="secondary" className="mt-3 text-xs">+{stats.viewsThisWeek} cette semaine</Badge>
          )}
        </div>
        <div className="text-center p-6 rounded-lg bg-card border border-border/60 hover:border-border transition-colors">
          <Users className="h-6 w-6 mx-auto text-muted-foreground mb-3" />
          <p className="text-3xl font-bold">{stats.totalFollowers}</p>
          <p className="text-sm text-muted-foreground mt-1">Abonnés</p>
          {stats.newFollowers > 0 && (
            <Badge variant="secondary" className="mt-3 text-xs">+{stats.newFollowers} nouveaux</Badge>
          )}
        </div>
      </div>

      {/* Top Liked Products */}
      <div>
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Produits les plus aimés
        </h4>
        <div className="rounded-lg border border-border/60 bg-card overflow-hidden divide-y divide-border/50">
          {stats.topLikedProducts.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center gap-4 px-4 py-4 hover:bg-muted/30 transition-colors"
            >
              <span className="text-base font-semibold text-muted-foreground w-6 text-center">{index + 1}.</span>
              <div className="h-11 w-11 rounded-md bg-muted flex items-center justify-center overflow-hidden shrink-0">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-lg">📦</span>
                )}
              </div>
              <span className="flex-1 text-sm font-semibold truncate">{product.name}</span>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Heart className="h-4 w-4" />
                <span className="text-sm font-semibold">{product.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
