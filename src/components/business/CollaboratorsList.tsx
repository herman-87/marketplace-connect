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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedCollaborators.map((collab, index) => (
            <Card key={collab.id} className="relative hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                {/* Rank Badge */}
                <div className="absolute top-2 left-2">
                  {index === 0 ? (
                    <span className="text-lg">🥇</span>
                  ) : index === 1 ? (
                    <span className="text-lg">🥈</span>
                  ) : index === 2 ? (
                    <span className="text-lg">🥉</span>
                  ) : (
                    <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                  )}
                </div>

                {/* Actions Menu */}
                {isOwner && collab.role !== "owner" && (
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                        <DropdownMenuItem>Modifier les permissions</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Retirer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}

                {/* Avatar & Name */}
                <div className="flex flex-col items-center text-center pt-4">
                  <Avatar className="h-16 w-16 border-2 border-border">
                    <AvatarImage src={collab.avatar} />
                    <AvatarFallback className="bg-muted text-foreground text-lg">
                      {collab.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="mt-3 flex items-center gap-1.5">
                    <p className="font-medium truncate max-w-[120px]">{collab.name}</p>
                    {collab.role === "owner" && (
                      <Crown className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{collab.joinedAt}</p>
                </div>

                {/* Stats */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 bg-muted/50 rounded-md">
                    <p className="text-sm font-semibold">{collab.productsCreated}</p>
                    <p className="text-xs text-muted-foreground">Produits</p>
                  </div>
                  <div className="p-2 bg-muted/50 rounded-md">
                    <p className="text-sm font-semibold">{collab.ordersManaged}</p>
                    <p className="text-xs text-muted-foreground">Commandes</p>
                  </div>
                </div>

                {/* Activity Score */}
                <div className="mt-3 flex items-center justify-center gap-1.5 text-sm">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium">{collab.activityScore}%</span>
                  <span className="text-muted-foreground">activité</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
