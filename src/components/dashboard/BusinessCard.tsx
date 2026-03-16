import { Store, Package, Users, MoreVertical, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
}: BusinessCardProps) {
  const statusConfig = {
    active: { label: "Actif", className: "bg-success/10 text-success border-success/30" },
    draft: { label: "Brouillon", className: "bg-warning/10 text-warning border-warning/30" },
    paused: { label: "En pause", className: "bg-muted text-muted-foreground border-border" },
  };

  return (
    <Link to={`/business/${id}`} className="block group">
      <Card className="overflow-hidden border hover:border-primary/50 transition-colors">
        {/* Header */}
        <div className="h-16 bg-muted/50 relative flex items-center justify-center">
          <Store className="w-6 h-6 text-muted-foreground" />
          
          {/* Status Badge */}
          <Badge
            variant="outline"
            className={cn("absolute top-2 right-10 text-xs", statusConfig[status].className)}
          >
            {statusConfig[status].label}
          </Badge>

          {/* Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-8 w-8 hover:bg-background/50"
                onClick={(e) => e.preventDefault()}
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
        </div>

        <CardContent className="p-4">
          {/* Title & Role */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-foreground transition-colors">
              {name}
            </h3>
            <Badge variant="secondary" className="text-xs shrink-0">
              {isOwner ? "Propriétaire" : "Collaborateur"}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {description}
          </p>

          {/* Stats Row */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-3 border-t border-border/50">
            <div className="flex items-center gap-1.5">
              <Package className="h-4 w-4 text-primary/70" />
              <span>{productsCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary/70" />
              <span>{collaboratorsCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
