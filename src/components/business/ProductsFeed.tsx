import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Heart, 
  ShoppingCart, 
  Eye, 
  MoreHorizontal, 
  Send, 
  FileEdit, 
  Archive,
  Plus,
  Search,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateProductSheet } from "./CreateProductSheet";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  status: "draft" | "published" | "removed";
  category: "articles";
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

const ITEMS_PER_PAGE = 6;

const statusConfig = {
  draft: { label: "Brouillon", variant: "secondary" as const, icon: FileEdit },
  published: { label: "Publié", variant: "default" as const, icon: Send },
  removed: { label: "Retiré", variant: "outline" as const, icon: Archive },
};

function ProductCardView({ product, isOwner, onProductClick }: { product: Product; isOwner: boolean; onProductClick: (p: Product) => void }) {
  const status = statusConfig[product.status];
  const StatusIcon = status.icon;

  return (
    <div 
      className="group rounded-lg bg-card border border-border/60 overflow-hidden cursor-pointer hover:border-border transition-colors"
      onClick={() => onProductClick(product)}
    >
      <div className="relative h-36 bg-muted">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">
            🛍️
          </div>
        )}
        <Badge variant={status.variant} className="absolute top-2 left-2 gap-1 text-xs">
          <StatusIcon className="h-3 w-3" />
          {status.label}
        </Badge>
        {isOwner && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onProductClick(product)}>Modifier</DropdownMenuItem>
                {product.status === "draft" && <DropdownMenuItem>Publier</DropdownMenuItem>}
                {product.status === "published" && <DropdownMenuItem>Retirer</DropdownMenuItem>}
                {product.status === "removed" && <DropdownMenuItem>Republier</DropdownMenuItem>}
                <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base truncate">{product.name}</h3>
          <span className="font-bold text-base whitespace-nowrap">{product.price}€</span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{product.description}</p>
        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{product.likes}</span>
          <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{product.views}</span>
          <span className="flex items-center gap-1"><ShoppingCart className="h-3.5 w-3.5" />{product.sales}</span>
        </div>
      </div>
    </div>
  );
}

function ProductListView({ product, isOwner, onProductClick }: { product: Product; isOwner: boolean; onProductClick: (p: Product) => void }) {
  const status = statusConfig[product.status];
  const StatusIcon = status.icon;

  return (
    <div 
      className="flex items-center gap-4 px-4 py-4 hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={() => onProductClick(product)}
    >
      <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center text-xl shrink-0">
        🛍️
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm truncate">{product.name}</h3>
          <Badge variant={status.variant} className="gap-1 text-xs shrink-0">
            <StatusIcon className="h-3.5 w-3.5" />
            {status.label}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate">{product.description}</p>
      </div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground shrink-0">
        <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{product.likes}</span>
        <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{product.views}</span>
        <span className="flex items-center gap-1"><ShoppingCart className="h-3.5 w-3.5" />{product.sales}</span>
      </div>
      <span className="font-bold text-base shrink-0">{product.price}€</span>
      {isOwner && (
        <div onClick={e => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onProductClick(product)}>Modifier</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

export function ProductsFeed({ products, isOwner }: ProductsFeedProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("sales");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleProductClick = (product: Product) => {
    setEditProduct(product);
    setEditOpen(true);
  };

  const filtered = products
    .filter(p => statusFilter === "all" || p.status === statusFilter)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "sales") return b.sales - a.sales;
      if (sortBy === "likes") return b.likes - a.likes;
      if (sortBy === "price") return b.price - a.price;
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const counts = {
    all: products.length,
    published: products.filter(p => p.status === "published").length,
    draft: products.filter(p => p.status === "draft").length,
    removed: products.filter(p => p.status === "removed").length,
  };

  return (
    <div className="space-y-4">
      {/* Filter Bar - sticky & prominent */}
      <div className="sticky top-0 z-10 -mx-1 px-1 py-3 bg-background/95 backdrop-blur-sm space-y-3">
        {/* Row 1: Search + Actions */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher un produit..." 
              value={search} 
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 h-10 bg-card"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-10 w-[140px] text-xs bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Par ventes</SelectItem>
              <SelectItem value="likes">Par likes</SelectItem>
              <SelectItem value="price">Par prix</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex rounded-lg bg-muted p-0.5">
            <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewMode("grid")}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
          {isOwner && (
            <CreateProductSheet
              trigger={
                <Button size="sm" className="h-10 gap-2 px-4">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Nouveau produit</span>
                  <span className="sm:hidden">Nouveau</span>
                </Button>
              }
            />
          )}
        </div>

        {/* Row 2: Status filter chips */}
        <div className="flex items-center gap-2">
          {(["all", "published", "draft", "removed"] as const).map(s => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              className={`h-8 text-xs rounded-full ${statusFilter !== s ? "bg-card" : ""}`}
              onClick={() => { setStatusFilter(s); setPage(1); }}
            >
              {s === "all" ? "Tous" : s === "published" ? "Publiés" : s === "draft" ? "Brouillons" : "Retirés"}
              <Badge variant={statusFilter === s ? "outline" : "secondary"} className="ml-1.5 text-[10px] px-1.5 rounded-full">{counts[s]}</Badge>
            </Button>
          ))}
          <span className="ml-auto text-xs text-muted-foreground">{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Content */}
      {paginated.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map(p => <ProductCardView key={p.id} product={p} isOwner={isOwner} onProductClick={handleProductClick} />)}
          </div>
        ) : (
          <div className="rounded-lg border border-border/60 bg-card overflow-hidden divide-y divide-border/50">
            {paginated.map(p => <ProductListView key={p.id} product={p} isOwner={isOwner} onProductClick={handleProductClick} />)}
          </div>
        )
      ) : (
        <div className="py-12 text-center text-muted-foreground text-sm">
          Aucun produit trouvé
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button variant="ghost" size="icon" className="h-8 w-8" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Edit Product Sheet */}
      <CreateProductSheet
        product={editProduct}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditProduct(null);
        }}
      />
    </div>
  );
}
