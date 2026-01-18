import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Share2, UserPlus, MoreHorizontal, Star, Package, TrendingUp, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BusinessHeaderProps {
  business: {
    id: string;
    name: string;
    description: string;
    category: "repas" | "articles";
    coverImage?: string;
    avatar?: string;
    isOwner: boolean;
    stats: {
      products: number;
      sales: number;
      followers: number;
      rating: number;
    };
  };
}

export function BusinessHeader({ business }: BusinessHeaderProps) {
  return (
    <Card className="overflow-hidden">
      {/* Cover Image */}
      <div className="h-32 md:h-40 bg-gradient-to-r from-primary/20 via-accent/10 to-secondary/20 relative">
        {business.coverImage && (
          <img
            src={business.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <CardContent className="relative pt-0 pb-6">
        {/* Avatar - Positioned to overlap */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-10">
          <Avatar className="h-24 w-24 border-4 border-background shadow-lg shrink-0">
            <AvatarImage src={business.avatar} />
            <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
              {business.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Info & Actions */}
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 sm:pt-6">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground">{business.name}</h1>
                <Badge variant={business.category === "repas" ? "default" : "secondary"}>
                  {business.category === "repas" ? "🍽️ Repas" : "🛍️ Articles"}
                </Badge>
                {business.isOwner && (
                  <Badge variant="outline" className="border-primary text-primary">
                    Propriétaire
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-1 max-w-xl line-clamp-2">
                {business.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {business.isOwner ? (
                <>
                  <Button variant="outline" size="sm" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    <span className="hidden sm:inline">Inviter</span>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Paramètres</span>
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Partager
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Voir sur le marketplace</DropdownMenuItem>
                  <DropdownMenuItem>Exporter les données</DropdownMenuItem>
                  <DropdownMenuItem>Signaler un problème</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{business.stats.products}</p>
              <p className="text-xs text-muted-foreground">Produits</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{business.stats.sales}</p>
              <p className="text-xs text-muted-foreground">Ventes</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Users className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{business.stats.followers}</p>
              <p className="text-xs text-muted-foreground">Abonnés</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Star className="h-4 w-4 text-warning" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{business.stats.rating}</p>
              <p className="text-xs text-muted-foreground">Note moyenne</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
