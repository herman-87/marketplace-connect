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
      <CardContent className="space-y-2">
        {topClients.map((client, index) => (
          <div
            key={client.id}
            className="flex items-center gap-4 p-3 rounded-md border border-border hover:bg-muted/50 transition-colors"
          >
            {/* Rank */}
            <div className="w-6 text-center">
              {index === 0 ? (
                <span className="text-lg">👑</span>
              ) : (
                <span className="text-sm text-muted-foreground font-medium">#{index + 1}</span>
              )}
            </div>

            {/* Avatar */}
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src={client.avatar} />
              <AvatarFallback className="bg-muted text-foreground">
                {client.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{client.name}</p>
                {client.rating && (
                  <div className="flex items-center gap-0.5 text-amber-500">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="text-xs">{client.rating}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ShoppingBag className="h-3 w-3" />
                  {client.totalOrders} commandes
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {client.favoriteProducts} favoris
                </span>
              </div>
            </div>

            {/* Spending */}
            <div className="text-right">
              <p className="font-semibold">{client.totalSpent}€</p>
              <p className="text-xs text-muted-foreground">{client.lastOrderAt}</p>
            </div>

            {/* Action */}
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        ))}

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
