import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium">
          Engagement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-md border border-border">
            <Heart className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
            <p className="text-2xl font-semibold">{stats.totalLikes}</p>
            <p className="text-xs text-muted-foreground">Likes</p>
            {stats.likesThisWeek > 0 && (
              <Badge variant="secondary" className="mt-2 text-xs">
                +{stats.likesThisWeek} cette semaine
              </Badge>
            )}
          </div>
          
          <div className="text-center p-4 rounded-md border border-border">
            <Eye className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
            <p className="text-2xl font-semibold">{stats.totalViews}</p>
            <p className="text-xs text-muted-foreground">Vues</p>
            {stats.viewsThisWeek > 0 && (
              <Badge variant="secondary" className="mt-2 text-xs">
                +{stats.viewsThisWeek} cette semaine
              </Badge>
            )}
          </div>
          
          <div className="text-center p-4 rounded-md border border-border">
            <Users className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
            <p className="text-2xl font-semibold">{stats.totalFollowers}</p>
            <p className="text-xs text-muted-foreground">Abonnés</p>
            {stats.newFollowers > 0 && (
              <Badge variant="secondary" className="mt-2 text-xs">
                +{stats.newFollowers} nouveaux
              </Badge>
            )}
          </div>
        </div>

        {/* Top Liked Products */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Produits les plus aimés
          </h4>
          <div className="space-y-2">
            {stats.topLikedProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-medium text-muted-foreground w-4">
                  {index + 1}.
                </span>
                <div className="h-10 w-10 rounded-md bg-muted border border-border flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-lg">📦</span>
                  )}
                </div>
                <span className="flex-1 text-sm font-medium truncate">{product.name}</span>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Heart className="h-3 w-3" />
                  <span className="text-sm font-medium">{product.likes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
