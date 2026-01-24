import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Star, MessageCircle } from "lucide-react";

interface Client {
  id: string;
  name: string;
  avatar?: string;
  totalOrders: number;
  totalSpent: number;
  favoriteProducts: number;
  lastOrderAt: string;
  rating?: number;
}

interface ClientsListProps {
  clients: Client[];
}

export function ClientsList({ clients }: ClientsListProps) {
  const sortedClients = [...clients].sort((a, b) => b.totalSpent - a.totalSpent);
  const topClients = sortedClients.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          Clients fidèles
          <Badge variant="secondary">{clients.length}</Badge>
        </CardTitle>
        <Button variant="outline" size="sm">
          Voir tous
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {topClients.map((client, index) => (
            <Card key={client.id} className="relative hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                {/* Rank Badge */}
                <div className="absolute top-2 left-2">
                  {index === 0 ? (
                    <span className="text-lg">👑</span>
                  ) : (
                    <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                  )}
                </div>

                {/* Action */}
                <div className="absolute top-2 right-2">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>

                {/* Avatar & Name */}
                <div className="flex flex-col items-center text-center pt-4">
                  <Avatar className="h-14 w-14 border-2 border-border">
                    <AvatarImage src={client.avatar} />
                    <AvatarFallback className="bg-muted text-foreground">
                      {client.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="mt-3">
                    <p className="font-medium truncate max-w-[120px]">{client.name}</p>
                    {client.rating && (
                      <div className="flex items-center justify-center gap-0.5 text-amber-500 mt-0.5">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-xs">{client.rating}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <ShoppingBag className="h-3.5 w-3.5" />
                      Commandes
                    </span>
                    <span className="font-medium">{client.totalOrders}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Heart className="h-3.5 w-3.5" />
                      Favoris
                    </span>
                    <span className="font-medium">{client.favoriteProducts}</span>
                  </div>
                </div>

                {/* Spending */}
                <div className="mt-3 pt-3 border-t border-border text-center">
                  <p className="text-lg font-semibold text-primary">{client.totalSpent}€</p>
                  <p className="text-xs text-muted-foreground">{client.lastOrderAt}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {clients.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Pas encore de clients</p>
            <p className="text-sm mt-1">Les clients apparaîtront ici après leurs premières commandes</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
