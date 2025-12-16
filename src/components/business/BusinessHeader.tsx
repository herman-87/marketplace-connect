import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Share2, UserPlus, MoreHorizontal } from "lucide-react";
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
    <div className="relative">
      {/* Cover Image */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/30 rounded-2xl overflow-hidden">
        {business.coverImage && (
          <img
            src={business.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      {/* Profile Section */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="absolute -top-16 left-6">
          <Avatar className="h-32 w-32 border-4 border-background shadow-elegant">
            <AvatarImage src={business.avatar} />
            <AvatarFallback className="text-3xl font-bold bg-gradient-primary text-primary-foreground">
              {business.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4 gap-2">
          {business.isOwner ? (
            <>
              <Button variant="outline" size="sm" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Inviter
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                Paramètres
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

        {/* Business Info */}
        <div className="mt-8">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-bold">{business.name}</h1>
            <Badge variant={business.category === "repas" ? "default" : "secondary"}>
              {business.category === "repas" ? "🍽️ Repas" : "🛍️ Articles"}
            </Badge>
            {business.isOwner && (
              <Badge variant="outline" className="border-primary text-primary">
                Propriétaire
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-2 max-w-2xl">{business.description}</p>
        </div>

        {/* Stats Bar */}
        <div className="flex gap-6 mt-6 flex-wrap">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{business.stats.products}</p>
            <p className="text-sm text-muted-foreground">Produits</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{business.stats.sales}</p>
            <p className="text-sm text-muted-foreground">Ventes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{business.stats.followers}</p>
            <p className="text-sm text-muted-foreground">Abonnés</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">⭐ {business.stats.rating}</p>
            <p className="text-sm text-muted-foreground">Note moyenne</p>
          </div>
        </div>
      </div>
    </div>
  );
}
