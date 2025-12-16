import { Store, Package, Users, MoreVertical, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BusinessCardProps {
  id: string;
  name: string;
  description: string;
  productsCount: number;
  collaboratorsCount: number;
  status: "active" | "draft" | "paused";
  isOwner: boolean;
  imageUrl?: string;
}

export function BusinessCard({
  id,
  name,
  description,
  productsCount,
  collaboratorsCount,
  status,
  isOwner,
  imageUrl,
}: BusinessCardProps) {
  const statusConfig = {
    active: { label: "Actif", className: "bg-success/10 text-success" },
    draft: { label: "Brouillon", className: "bg-warning/10 text-warning" },
    paused: { label: "En pause", className: "bg-muted text-muted-foreground" },
  };

  return (
    <Link to={`/business/${id}`} className="block group">
      <div className="bg-card rounded-xl border border-border overflow-hidden transition-all duration-200 hover:shadow-md hover:border-border/80">
        {/* Minimal Header */}
        <div className="h-24 bg-muted/50 relative flex items-center justify-center">
          <Store className="w-8 h-8 text-muted-foreground/40" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="secondary" className="text-xs font-medium">
              {isOwner ? "Propriétaire" : "Collaborateur"}
            </Badge>
          </div>

          <Badge
            variant="secondary"
            className={cn("absolute top-3 right-12 text-xs", statusConfig[status].className)}
          >
            {statusConfig[status].label}
          </Badge>

          {/* Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={(e) => e.preventDefault()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover">
              <DropdownMenuItem>
                <ExternalLink className="mr-2 h-4 w-4" />
                Voir sur le marketplace
              </DropdownMenuItem>
              <DropdownMenuItem>Gérer les produits</DropdownMenuItem>
              <DropdownMenuItem>Gérer les collaborateurs</DropdownMenuItem>
              {isOwner && (
                <DropdownMenuItem className="text-destructive">
                  Supprimer
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-4">
            {description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Package className="h-4 w-4" />
              <span>{productsCount} produits</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>{collaboratorsCount} collab.</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
