import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, TrendingUp, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddEmployeeDialog } from "./AddEmployeeDialog";

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
          <AddEmployeeDialog 
            onAddEmployee={(userId, roles) => {
              console.log("Adding employee:", userId, "with roles:", roles);
              // TODO: Implement actual API call to add employee
            }}
          />
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedCollaborators.map((collab, index) => (
            <div
              key={collab.id}
              className="relative p-4 rounded-lg border border-border bg-card hover:shadow-md transition-all"
            >
              {/* Rank Badge */}
              <div className="absolute top-2 left-2">
                {index === 0 ? (
                  <span className="text-lg">🥇</span>
                ) : index === 1 ? (
                  <span className="text-lg">🥈</span>
                ) : index === 2 ? (
                  <span className="text-lg">🥉</span>
                ) : (
                  <Badge variant="secondary" className="text-xs">#{index + 1}</Badge>
                )}
              </div>

              {/* Menu */}
              {isOwner && collab.role !== "owner" && (
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border border-border z-50">
                      <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                      <DropdownMenuItem>Modifier les permissions</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Retirer</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {/* Avatar & Name */}
              <div className="flex flex-col items-center pt-6 pb-4">
                <Avatar className="h-16 w-16 border-2 border-border mb-3">
                  <AvatarImage src={collab.avatar} />
                  <AvatarFallback className="bg-muted text-foreground text-lg">
                    {collab.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-center">{collab.name}</p>
                  {collab.role === "owner" && (
                    <Crown className="h-4 w-4 text-amber-500" />
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
                <div className="text-center">
                  <p className="text-lg font-semibold">{collab.productsCreated}</p>
                  <p className="text-xs text-muted-foreground">Produits</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">{collab.ordersManaged}</p>
                  <p className="text-xs text-muted-foreground">Commandes</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-lg font-semibold">
                    <TrendingUp className="h-3 w-3" />
                    {collab.activityScore}%
                  </div>
                  <p className="text-xs text-muted-foreground">Activité</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
