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
  Archive,
  Plus,
  Search,
  LayoutGrid,
  List,
  Percent,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CreateProductSheet } from "./CreateProductSheet";
import { CreatePromotionSheet } from "./CreatePromotionSheet";
import { ProductPreviewDialog } from "./ProductPreviewDialog";
import { AdaptivePagination } from "@/components/ui/adaptive-pagination";
import { toast } from "sonner";

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
  draft: { label: "Brouillon", variant: "secondary" as const },
  published: { label: "Publié", variant: "secondary" as const },
  removed: { label: "Retiré", variant: "outline" as const },
};

function ProductCardView({ product, isOwner, onPreviewClick, onEditClick, onCreatePromo, onPublishRequest }: { product: Product; isOwner: boolean; onPreviewClick: (p: Product) => void; onEditClick: (p: Product) => void; onCreatePromo: (productId: string) => void; onPublishRequest: (p: Product) => void }) {
  const status = statusConfig[product.status];

  return (
    <div 
      className="group rounded-lg bg-card border border-border/60 overflow-hidden cursor-pointer hover:border-foreground/30 transition-colors"
      onClick={() => onPreviewClick(product)}
    >
      <div className="relative h-36 bg-muted">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">
            🛍️
          </div>
        )}
        <span className="absolute top-2 left-2 text-[10px] font-medium text-foreground/60 bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded">
          {status.label}
        </span>
        {isOwner && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEditClick(product)}>Modifier</DropdownMenuItem>
                {product.status === "published" && (
                  <DropdownMenuItem onClick={() => onCreatePromo(product.id)}>
                    <Percent className="h-3.5 w-3.5 mr-1.5" />Créer une promo
                  </DropdownMenuItem>
                )}
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
        {isOwner && (
          <div className="mt-3 pt-3 border-t border-border/50 flex justify-end" onClick={e => e.stopPropagation()}>
            <Button
              variant={product.status === "published" ? "outline" : "default"}
              size="sm"
              className="gap-1.5 h-8 text-xs px-3"
              onClick={() => onPublishRequest(product)}
            >
              {product.status === "published" ? (
                <><Archive className="h-3.5 w-3.5" />Retirer</>
              ) : (
                <><Send className="h-3.5 w-3.5" />Publier</>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductListView({ product, isOwner, onProductClick, onCreatePromo, onPublishRequest }: { product: Product; isOwner: boolean; onProductClick: (p: Product) => void; onCreatePromo: (productId: string) => void; onPublishRequest: (p: Product) => void }) {
  const status = statusConfig[product.status];

  return (
    <div 
      className="flex items-center gap-2 md:gap-4 px-3 md:px-4 py-3 md:py-4 hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={() => onProductClick(product)}
    >
      <div className="h-10 w-10 md:h-12 md:w-12 rounded-md bg-muted flex items-center justify-center text-lg md:text-xl shrink-0">
        🛍️
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 md:gap-2">
          <h3 className="font-semibold text-sm truncate">{product.name}</h3>
          <span className="text-[10px] md:text-xs text-foreground/60 font-medium shrink-0 hidden sm:inline">
            {status.label}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{product.likes}</span>
          <span className="flex items-center gap-1"><ShoppingCart className="h-3 w-3" />{product.sales}</span>
          <span className="sm:hidden">
            <Badge variant={status.variant} className="text-[10px] px-1.5">{status.label}</Badge>
          </span>
        </div>
      </div>
      <span className="font-bold text-sm md:text-base shrink-0">{product.price}€</span>
      {isOwner && (
        <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
          <Button
            variant={product.status === "published" ? "outline" : "default"}
            size="sm"
            className="gap-1 h-7 text-[11px] px-2.5 shrink-0"
            onClick={() => onPublishRequest(product)}
          >
            {product.status === "published" ? (
              <><Archive className="h-3 w-3" />Retirer</>
            ) : (
              <><Send className="h-3 w-3" />Publier</>
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onProductClick(product)}>Modifier</DropdownMenuItem>
              {product.status === "published" && (
                <DropdownMenuItem onClick={() => onCreatePromo(product.id)}>
                  <Percent className="h-3.5 w-3.5 mr-1.5" />Créer une promo
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

export function ProductsFeed({ products: initialProducts, isOwner }: ProductsFeedProps) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("sales");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [promoProductId, setPromoProductId] = useState<string | null>(null);
  const [promoOpen, setPromoOpen] = useState(false);
  const [publishTarget, setPublishTarget] = useState<Product | null>(null);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);

  const handleProductClick = (product: Product) => {
    setEditProduct(product);
    setEditOpen(true);
  };

  const handleCreatePromo = (productId: string) => {
    setPromoProductId(productId);
    setPromoOpen(true);
  };

  const handlePublishRequest = (product: Product) => {
    setPublishTarget(product);
    setPublishDialogOpen(true);
  };

  const handleConfirmPublish = () => {
    if (!publishTarget) return;
    const isPublishing = publishTarget.status !== "published";
    setProducts(prev =>
      prev.map(p =>
        p.id === publishTarget.id
          ? { ...p, status: isPublishing ? "published" : "removed" as const }
          : p
      )
    );
    toast.success(
      isPublishing
        ? `"${publishTarget.name}" est maintenant publié et visible par les clients !`
        : `"${publishTarget.name}" a été retiré des publications.`
    );
    setPublishDialogOpen(false);
    setPublishTarget(null);
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
        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher..." 
              value={search} 
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 h-9 md:h-10 bg-card text-sm"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-9 md:h-10 w-[100px] md:w-[140px] text-xs bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Ventes</SelectItem>
              <SelectItem value="likes">Likes</SelectItem>
              <SelectItem value="price">Prix</SelectItem>
            </SelectContent>
          </Select>
          <div className="hidden sm:flex rounded-lg bg-muted p-0.5">
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
                <Button size="sm" className="h-9 md:h-10 gap-1.5 px-2.5 md:px-4 shrink-0">
                  <Plus className="h-4 w-4" />
                  <span className="hidden md:inline">Nouveau produit</span>
                </Button>
              }
            />
          )}
        </div>

        {/* Row 2: Status filter chips - horizontally scrollable on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {(["all", "published", "draft", "removed"] as const).map(s => (
            <Button
              key={s}
              variant={statusFilter === s ? "activeFilter" : "outline"}
              size="sm"
              className={`h-7 md:h-8 text-xs rounded-full whitespace-nowrap shrink-0 ${statusFilter !== s ? "bg-card" : ""}`}
              onClick={() => { setStatusFilter(s); setPage(1); }}
            >
              {s === "all" ? "Tous" : s === "published" ? "Publiés" : s === "draft" ? "Brouillons" : "Retirés"}
              <Badge variant={statusFilter === s ? "outline" : "secondary"} className={`ml-1.5 text-[10px] px-1.5 rounded-full ${statusFilter === s ? "border-background/50 text-background" : ""}`}>{counts[s]}</Badge>
            </Button>
          ))}
          <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap shrink-0">{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Content */}
      {paginated.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map(p => <ProductCardView key={p.id} product={p} isOwner={isOwner} onProductClick={handleProductClick} onCreatePromo={handleCreatePromo} onPublishRequest={handlePublishRequest} />)}
          </div>
        ) : (
          <div className="rounded-lg border border-border/60 bg-card overflow-hidden divide-y divide-border/50">
            {paginated.map(p => <ProductListView key={p.id} product={p} isOwner={isOwner} onProductClick={handleProductClick} onCreatePromo={handleCreatePromo} onPublishRequest={handlePublishRequest} />)}
          </div>
        )
      ) : (
        <div className="py-12 text-center text-muted-foreground text-sm">
          Aucun produit trouvé
        </div>
      )}

      {/* Pagination */}
      <AdaptivePagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        variant={filtered.length > 12 ? "full" : "compact"}
      />

      {/* Edit Product Sheet */}
      <CreateProductSheet
        product={editProduct}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditProduct(null);
        }}
      />

      {/* Create Promotion Sheet from product */}
      <CreatePromotionSheet
        preselectedProductId={promoProductId || undefined}
        open={promoOpen}
        onOpenChange={(open) => {
          setPromoOpen(open);
          if (!open) setPromoProductId(null);
        }}
      />

      {/* Publish/Unpublish Confirmation Dialog */}
      <AlertDialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {publishTarget?.status === "published"
                ? "Retirer des publications ?"
                : "Publier cet article ?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {publishTarget?.status === "published" ? (
                <>
                  <strong>"{publishTarget?.name}"</strong> ne sera plus visible par les clients sur le marketplace. 
                  Les commandes en cours ne seront pas affectées. Vous pourrez le republier à tout moment.
                </>
              ) : (
                <>
                  <strong>"{publishTarget?.name}"</strong> sera immédiatement visible par tous les clients sur le marketplace. 
                  Assurez-vous que les informations du produit (prix, description, images) sont complètes avant de publier.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmPublish}>
              {publishTarget?.status === "published" ? "Retirer" : "Publier"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
