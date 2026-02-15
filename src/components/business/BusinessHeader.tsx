import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Settings, 
  Share2, 
  UserPlus, 
  MoreHorizontal, 
  Star, 
  Package, 
  TrendingUp, 
  Users, 
  MapPin, 
  Mail, 
  Phone,
  ChevronDown,
  ChevronUp,
  ShoppingBag
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface BusinessHeaderProps {
  business: {
    id: string;
    name: string;
    description: string;
    category: "articles";
    coverImage?: string;
    avatar?: string;
    isOwner: boolean;
    address?: string;
    email?: string;
    phone?: string;
    stats: {
      products: number;
      sales: number;
      followers: number;
      rating: number;
    };
  };
}

const categoryConfig = {
  articles: {
    label: "Commerce",
    icon: ShoppingBag,
  },
};

export function BusinessHeader({ business }: BusinessHeaderProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const config = categoryConfig[business.category];
  const CategoryIcon = config.icon;

  // Check if description is long enough to need collapsible
  const isLongDescription = business.description.length > 150;

  return (
    <Card className="overflow-hidden">
      {/* Cover */}
      <div className="h-24 md:h-32 bg-muted relative">
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
                <Badge variant="secondary" className="gap-1">
                  <CategoryIcon className="h-3 w-3" />
                  {config.label}
                </Badge>
                {business.isOwner && (
                  <Badge variant="outline" className="border-primary text-primary">
                    Propriétaire
                  </Badge>
                )}
              </div>

              {/* Description collapsible */}
              {isLongDescription ? (
                <Collapsible open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
                  <div className="mt-1 max-w-xl">
                    <p className={`text-muted-foreground ${!isDescriptionOpen ? 'line-clamp-2' : ''}`}>
                      {business.description}
                    </p>
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-auto p-0 mt-1 text-primary hover:text-primary/80 hover:bg-transparent"
                      >
                        {isDescriptionOpen ? (
                          <>
                            Voir moins
                            <ChevronUp className="ml-1 h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Voir plus
                            <ChevronDown className="ml-1 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </Collapsible>
              ) : (
                <p className="text-muted-foreground mt-1 max-w-xl">
                  {business.description}
                </p>
              )}

              {/* Contact Info */}
              <div className="flex flex-wrap items-center gap-3 mt-3">
                {business.address && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{business.address}</span>
                  </div>
                )}
                {business.email && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    <a href={`mailto:${business.email}`} className="hover:text-primary transition-colors">
                      {business.email}
                    </a>
                  </div>
                )}
                {business.phone && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    <a href={`tel:${business.phone}`} className="hover:text-primary transition-colors">
                      {business.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {business.isOwner ? (
                <>
                  <Button variant="outline" size="sm" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    <span className="hidden sm:inline">Inviter</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => navigate(`/business/${id}/settings`)}
                  >
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
            <div className="p-2 rounded-md bg-muted">
              <Package className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{business.stats.products}</p>
              <p className="text-xs text-muted-foreground">Produits</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-muted">
              <TrendingUp className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{business.stats.sales}</p>
              <p className="text-xs text-muted-foreground">Ventes</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-muted">
              <Users className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{business.stats.followers}</p>
              <p className="text-xs text-muted-foreground">Abonnés</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-muted">
              <Star className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{business.stats.rating}</p>
              <p className="text-xs text-muted-foreground">Note moyenne</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
