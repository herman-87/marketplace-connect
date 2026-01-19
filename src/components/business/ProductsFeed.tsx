import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  ShoppingCart, 
  Eye, 
  MoreHorizontal, 
  Send, 
  FileEdit, 
  Archive,
  Plus,
  TrendingUp
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  status: "draft" | "published" | "removed";
  category: "repas" | "articles";
  likes: number;
  views: number;
  sales: number;
  createdAt: string;
  createdBy: string;
}

interface ProductsFeedProps {
  products: Product[];
  isOwner: boolean;
}

function ProductCard({ product, isOwner }: { product: Product; isOwner: boolean }) {
  const navigate = useNavigate();
  const statusConfig = {
    draft: { label: "Brouillon", variant: "secondary" as const, icon: FileEdit },
    published: { label: "Publié", variant: "default" as const, icon: Send },
    removed: { label: "Retiré", variant: "outline" as const, icon: Archive },
  };

  const status = statusConfig[product.status];
  const StatusIcon = status.icon;

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:bg-muted/30 transition-colors"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Product Image */}
      <div className="relative h-40 bg-muted border-b border-border">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            {product.category === "repas" ? "🍽️" : "🛍️"}
          </div>
        )}
        
        {/* Status Badge */}
        <Badge 
          variant={status.variant}
          className="absolute top-3 left-3 gap-1"
        >
          <StatusIcon className="h-3 w-3" />
          {status.label}
        </Badge>

        {/* Actions */}
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Modifier</DropdownMenuItem>
              {product.status === "draft" && (
                <DropdownMenuItem>Publier sur le marketplace</DropdownMenuItem>
              )}
              {product.status === "published" && (
                <DropdownMenuItem>Retirer du marketplace</DropdownMenuItem>
              )}
              {product.status === "removed" && (
                <DropdownMenuItem>Republier</DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Product Info */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-medium truncate">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
          </div>
          <p className="font-semibold text-lg whitespace-nowrap">{product.price}€</p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Heart className="h-4 w-4" />
            <span>{product.likes}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{product.views}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <ShoppingCart className="h-4 w-4" />
            <span>{product.sales} ventes</span>
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <span>Par {product.createdBy}</span>
          <span>{product.createdAt}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductsFeed({ products, isOwner }: ProductsFeedProps) {
  const [activeTab, setActiveTab] = useState("all");

  const filteredProducts = products.filter((product) => {
    if (activeTab === "all") return true;
    return product.status === activeTab;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => b.sales - a.sales);

  const counts = {
    all: products.length,
    published: products.filter((p) => p.status === "published").length,
    draft: products.filter((p) => p.status === "draft").length,
    removed: products.filter((p) => p.status === "removed").length,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium flex items-center gap-2">
          Produits
          <Badge variant="secondary">{products.length}</Badge>
        </h2>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau produit
        </Button>
      </div>

      {/* Top Performers Banner */}
      {sortedProducts.length > 0 && sortedProducts[0].sales > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Meilleure vente</p>
              <p className="font-medium">{sortedProducts[0].name} — {sortedProducts[0].sales} ventes</p>
            </div>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border border-border">
          <TabsTrigger value="all" className="gap-2">
            Tous <Badge variant="secondary" className="text-xs">{counts.all}</Badge>
          </TabsTrigger>
          <TabsTrigger value="published" className="gap-2">
            Publiés <Badge variant="secondary" className="text-xs">{counts.published}</Badge>
          </TabsTrigger>
          <TabsTrigger value="draft" className="gap-2">
            Brouillons <Badge variant="secondary" className="text-xs">{counts.draft}</Badge>
          </TabsTrigger>
          <TabsTrigger value="removed" className="gap-2">
            Retirés <Badge variant="secondary" className="text-xs">{counts.removed}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} isOwner={isOwner} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-2 p-8 text-center">
              <p className="text-muted-foreground">Aucun produit dans cette catégorie</p>
              <Button variant="outline" className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Créer un produit
              </Button>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
