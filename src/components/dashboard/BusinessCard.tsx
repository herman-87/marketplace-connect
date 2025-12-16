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
    active: { label: "Actif", className: "bg-success/10 text-success border-success/20" },
    draft: { label: "Brouillon", className: "bg-warning/10 text-warning border-warning/20" },
    paused: { label: "En pause", className: "bg-muted text-muted-foreground border-muted" },
  };

  return (
    <Link to={`/business/${id}`} className="block group">
      <div className="relative bg-card rounded-xl border border-border overflow-hidden card-hover">
      {/* Image / Header */}
      <div
        className={cn(
          "h-32 relative",
          isOwner ? "gradient-owner" : "gradient-collab"
        )}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover absolute inset-0 mix-blend-overlay opacity-50"
          />
        )}
        
        {/* Role Badge */}
        <Badge
          className={cn(
            "absolute top-3 left-3 border-0",
            isOwner
              ? "bg-white/20 text-white backdrop-blur-sm"
              : "bg-white/20 text-white backdrop-blur-sm"
          )}
        >
          {isOwner ? "Propriétaire" : "Collaborateur"}
        </Badge>

        {/* Status Badge */}
        <Badge
          variant="outline"
          className={cn("absolute top-3 right-12", statusConfig[status].className)}
        >
          {statusConfig[status].label}
        </Badge>

        {/* Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 bg-white/10 hover:bg-white/20 text-white"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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

        {/* Business Icon */}
        <div className="absolute -bottom-6 left-4">
          <div className="w-12 h-12 rounded-xl bg-card border-2 border-border flex items-center justify-center shadow-lg">
            <Store className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-8">
        <h3 className="font-semibold text-lg text-foreground truncate">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-4">
          {description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>{productsCount} produits</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{collaboratorsCount} collab.</span>
          </div>
        </div>
      </div>
      </div>
    </Link>
  );
}
