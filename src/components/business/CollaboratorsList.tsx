import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus, Crown, TrendingUp, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  role: "owner" | "collaborator";
  activityScore: number;
  productsCreated: number;
  ordersManaged: number;
  joinedAt: string;
}

interface CollaboratorsListProps {
  collaborators: Collaborator[];
  isOwner: boolean;
}

export function CollaboratorsList({ collaborators, isOwner }: CollaboratorsListProps) {
  const sortedCollaborators = [...collaborators].sort((a, b) => b.activityScore - a.activityScore);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          Équipe
          <Badge variant="secondary">{collaborators.length}</Badge>
        </CardTitle>
        {isOwner && (
          <Button size="sm" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Inviter
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {sortedCollaborators.map((collab, index) => (
          <div
            key={collab.id}
            className="flex items-center gap-4 p-3 rounded-md border border-border hover:bg-muted/50 transition-colors"
          >
            {/* Rank */}
            <div className="w-8 text-center">
              {index === 0 ? (
                <span className="text-lg">🥇</span>
              ) : index === 1 ? (
                <span className="text-lg">🥈</span>
              ) : index === 2 ? (
                <span className="text-lg">🥉</span>
              ) : (
                <span className="text-sm text-muted-foreground font-medium">#{index + 1}</span>
              )}
            </div>

            {/* Avatar */}
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src={collab.avatar} />
              <AvatarFallback className="bg-muted text-foreground">
                {collab.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{collab.name}</p>
                {collab.role === "owner" && (
                  <Crown className="h-4 w-4 text-amber-500" />
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{collab.productsCreated} produits</span>
                <span>•</span>
                <span>{collab.ordersManaged} commandes</span>
              </div>
            </div>

            {/* Activity Score */}
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm font-medium">
                  <TrendingUp className="h-3 w-3" />
                  {collab.activityScore}%
                </div>
                <p className="text-xs text-muted-foreground">Activité</p>
              </div>
              
              {isOwner && collab.role !== "owner" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                    <DropdownMenuItem>Modifier les permissions</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Retirer</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
