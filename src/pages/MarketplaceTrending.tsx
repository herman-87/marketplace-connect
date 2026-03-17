import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft, Search, TrendingUp, Star, ShoppingCart, Heart, LayoutGrid, List, ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { PaginationControls } from "@/components/marketplace/PaginationControls";

const allTrending = [
  { id: "trend-1", name: "Montre Connectée Pro", description: "Suivi santé, GPS, 7 jours d'autonomie", price: 149.99, category: "High-Tech", businessId: "techstore", businessName: "TechStore", rating: 4.7, sales: 156, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop" },
  { id: "trend-2", name: "Sac à dos Urban", description: "Imperméable, compartiment laptop", price: 59.99, category: "Mode", businessId: "modeboutique", businessName: "ModeBoutique", rating: 4.6, sales: 78, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop" },
  { id: "trend-3", name: "Sneakers Urban Limited", description: "Édition limitée, design exclusif", price: 89.99, category: "Mode", businessId: "modeboutique", businessName: "ModeBoutique", rating: 4.8, sales: 203, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop" },
  { id: "trend-4", name: "Casque Audio Premium", description: "Réduction de bruit active", price: 199.99, category: "High-Tech", businessId: "techstore", businessName: "TechStore", rating: 4.9, sales: 134, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop" },
  { id: "trend-5", name: "Enceinte Bluetooth", description: "Son 360°, étanche, 20h autonomie", price: 69.99, category: "High-Tech", businessId: "techstore", businessName: "TechStore", rating: 4.5, sales: 45, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop" },
  { id: "trend-6", name: "Robe Wax Ankara", description: "Tissu africain authentique", price: 45.00, category: "Mode", businessId: "modeboutique", businessName: "ModeBoutique", rating: 4.7, sales: 89, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=300&fit=crop" },
  { id: "trend-7", name: "Coque iPhone Design", description: "Protection premium, motifs africains", price: 24.99, category: "High-Tech", businessId: "techstore", businessName: "TechStore", rating: 4.4, sales: 98, image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=300&fit=crop" },
  { id: "trend-8", name: "Tablette Graphique", description: "Pour dessin numérique pro", price: 89.99, category: "High-Tech", businessId: "techstore", businessName: "TechStore", rating: 4.5, sales: 67, image: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=400&h=300&fit=crop" },
  { id: "trend-9", name: "Sneakers Wax", description: "Baskets uniques en tissu wax", price: 79.99, category: "Mode", businessId: "modeboutique", businessName: "ModeBoutique", rating: 4.6, sales: 56, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop" },
  { id: "trend-10", name: "Bracelet Connecté Fit", description: "Suivi activité et sommeil", price: 49.99, category: "High-Tech", businessId: "techstore", businessName: "TechStore", rating: 4.8, sales: 112, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop" },
  { id: "trend-11", name: "Veste en jean vintage", description: "Style rétro, coupe moderne", price: 79.99, category: "Mode", businessId: "modeboutique", businessName: "ModeBoutique", rating: 4.6, sales: 43, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop" },
  { id: "trend-12", name: "Power Bank 20000mAh", description: "Charge rapide USB-C", price: 34.99, category: "High-Tech", businessId: "techstore", businessName: "TechStore", rating: 4.7, sales: 178, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=300&fit=crop" },
  { id: "trend-13", name: "Lunettes de soleil Aviator", description: "Protection UV400, monture légère", price: 39.99, category: "Mode", businessId: "modeboutique", businessName: "ModeBoutique", rating: 4.5, sales: 29, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=300&fit=crop" },
  { id: "trend-14", name: "Clavier Mécanique RGB", description: "Switches Cherry MX, rétroéclairage", price: 119.99, category: "High-Tech", businessId: "techstore", businessName: "TechStore", rating: 4.8, sales: 65, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop" },
];

const categories = ["Tous", "Mode", "High-Tech", "Accessoires", "Maison", "Beauté", "Auto", "Sport", "Autres"];
const ITEMS_PER_PAGE = 20;

const categoryIcons: Record<string, any> = { Mode: ShoppingBag, "High-Tech": ShoppingBag };

export default function MarketplaceTrending() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [sortBy, setSortBy] = useState("sales");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && categories.includes(cat)) {
      setSelectedCategory(cat);
      setCurrentPage(1);
    }
  }, [searchParams]);

  const filtered = allTrending
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.businessName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === "Tous" || p.category === selectedCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === "sales") return b.sales - a.sales;
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleFilterChange = () => setCurrentPage(1);

  return (
    <MarketplaceLayout>
      <div className="container mx-auto px-4 py-6 space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <Link to="/marketplace"><Button variant="ghost" size="icon" className="shrink-0"><ArrowLeft className="h-5 w-5" /></Button></Link>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10"><TrendingUp className="w-5 h-5 text-primary" /></div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Tendances</h1>
              <p className="text-sm text-muted-foreground">{filtered.length} produit{filtered.length > 1 ? "s" : ""} tendance</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher un produit..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); handleFilterChange(); }} className="pl-10" />
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={(v) => { setSelectedCategory(v); handleFilterChange(); }}>
              <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
              <SelectContent>{categories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Plus vendus</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
                <SelectItem value="rating">Meilleurs avis</SelectItem>
              </SelectContent>
            </Select>
            <div className="hidden sm:flex border border-border rounded-lg overflow-hidden">
              <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" className="rounded-none h-9 w-9" onClick={() => setViewMode("grid")}><LayoutGrid className="h-4 w-4" /></Button>
              <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" className="rounded-none h-9 w-9" onClick={() => setViewMode("list")}><List className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>

        {paginated.length === 0 ? (
          <div className="text-center py-16">
            <TrendingUp className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-1">Aucun produit trouvé</h3>
            <p className="text-sm text-muted-foreground">Essayez de modifier vos filtres</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {paginated.map((product) => {
              const liked = isFavorite(product.id);
              return (
                <Card key={product.id} className="group overflow-hidden hover:border-foreground/30 transition-all duration-300">
                  <div className="relative h-36 sm:h-44 bg-muted overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    <Badge variant="secondary" className="absolute top-2 left-2 gap-0.5 text-[10px]">{product.category}</Badge>
                    <button onClick={() => toggleFavorite({ id: product.id, name: product.name, businessId: product.businessId })} className={cn("absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all", liked ? "bg-destructive text-destructive-foreground" : "bg-card/80 backdrop-blur-sm text-muted-foreground hover:bg-card hover:text-destructive")}>
                      <Heart className={cn("w-4 h-4", liked && "fill-current")} />
                    </button>
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{product.businessName}</p>
                    <h3 className="font-semibold text-sm sm:text-base text-foreground truncate mt-0.5">{product.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      <span className="text-xs font-medium">{product.rating}</span>
                      <span className="text-[10px] text-muted-foreground">• {product.sales} vendus</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold text-foreground">{product.price.toFixed(2)} €</span>
                      <Button size="sm" className="gap-1 text-xs" onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, businessId: product.businessId, businessName: product.businessName })}>
                        <ShoppingCart className="w-3 h-3" /> Ajouter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {paginated.map((product) => {
              const liked = isFavorite(product.id);
              return (
                <Card key={product.id} className="overflow-hidden hover:border-primary/30 transition-all">
                  <div className="flex">
                    <div className="relative w-32 sm:w-44 shrink-0 bg-muted overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                      <Badge variant="secondary" className="absolute top-2 left-2 text-[10px]">{product.category}</Badge>
                    </div>
                    <CardContent className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">{product.businessName}</p>
                            <h3 className="font-semibold text-sm sm:text-base text-foreground">{product.name}</h3>
                          </div>
                          <button onClick={() => toggleFavorite({ id: product.id, name: product.name, businessId: product.businessId })} className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0", liked ? "bg-destructive text-destructive-foreground" : "bg-muted text-muted-foreground hover:text-destructive")}>
                            <Heart className={cn("w-4 h-4", liked && "fill-current")} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="w-3 h-3 fill-primary text-primary" />
                          <span className="text-xs font-medium">{product.rating}</span>
                          <span className="text-[10px] text-muted-foreground">• {product.sales} vendus</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold text-foreground">{product.price.toFixed(2)} €</span>
                        <Button size="sm" className="gap-1 text-xs" onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, businessId: product.businessId, businessName: product.businessName })}>
                          <ShoppingCart className="w-3 h-3" /> Ajouter
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </MarketplaceLayout>
  );
}
