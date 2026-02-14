import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const ITEMS_PER_PAGE = 6;

const statusConfig = {
  draft: { label: "Brouillon", variant: "secondary" as const, icon: FileEdit },
  published: { label: "Publié", variant: "default" as const, icon: Send },
  removed: { label: "Retiré", variant: "outline" as const, icon: Archive },
};

function ProductCardView({ product, isOwner }: { product: Product; isOwner: boolean }) {
  const navigate = useNavigate();
  const status = statusConfig[product.status];
  const StatusIcon = status.icon;

  return (
    <div 
      className="group rounded-lg bg-card overflow-hidden cursor-pointer hover:bg-muted/30 transition-colors"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative h-36 bg-muted">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">
            {product.category === "repas" ? "🍽️" : "🛍️"}
          </div>
        )}
        <Badge variant={status.variant} className="absolute top-2 left-2 gap-1 text-[10px]">
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
                <DropdownMenuItem>Modifier</DropdownMenuItem>
                {product.status === "draft" && <DropdownMenuItem>Publier</DropdownMenuItem>}
                {product.status === "published" && <DropdownMenuItem>Retirer</DropdownMenuItem>}
                {product.status === "removed" && <DropdownMenuItem>Republier</DropdownMenuItem>}
                <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-sm truncate">{product.name}</h3>
          <span className="font-semibold text-sm whitespace-nowrap">{product.price}€</span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{product.description}</p>
        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{product.likes}</span>
          <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{product.views}</span>
          <span className="flex items-center gap-1"><ShoppingCart className="h-3 w-3" />{product.sales}</span>
        </div>
      </div>
    </div>
  );
}

function ProductListView({ product, isOwner }: { product: Product; isOwner: boolean }) {
  const navigate = useNavigate();
  const status = statusConfig[product.status];
  const StatusIcon = status.icon;

  return (
    <div 
      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center text-xl shrink-0">
        {product.category === "repas" ? "🍽️" : "🛍️"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-sm truncate">{product.name}</h3>
          <Badge variant={status.variant} className="gap-1 text-[10px] shrink-0">
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate">{product.description}</p>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
        <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{product.likes}</span>
        <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{product.views}</span>
        <span className="flex items-center gap-1"><ShoppingCart className="h-3 w-3" />{product.sales}</span>
      </div>
      <span className="font-semibold text-sm shrink-0">{product.price}€</span>
      {isOwner && (
        <div onClick={e => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Modifier</DropdownMenuItem>
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
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher un produit..." 
            value={search} 
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 h-9 bg-background"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status filter chips */}
          {(["all", "published", "draft", "removed"] as const).map(s => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "ghost"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => { setStatusFilter(s); setPage(1); }}
            >
              {s === "all" ? "Tous" : s === "published" ? "Publiés" : s === "draft" ? "Brouillons" : "Retirés"}
              <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5">{counts[s]}</Badge>
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Par ventes</SelectItem>
              <SelectItem value="likes">Par likes</SelectItem>
              <SelectItem value="price">Par prix</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex rounded-md bg-muted p-0.5">
            <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setViewMode("grid")}>
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setViewMode("list")}>
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>
          {isOwner && (
            <Button size="sm" className="h-8 gap-1.5 text-xs">
              <Plus className="h-3.5 w-3.5" />
              Nouveau
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {paginated.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {paginated.map(p => <ProductCardView key={p.id} product={p} isOwner={isOwner} />)}
          </div>
        ) : (
          <div className="space-y-1">
            {paginated.map(p => <ProductListView key={p.id} product={p} isOwner={isOwner} />)}
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
    </div>
  );
}
