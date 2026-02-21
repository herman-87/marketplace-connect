import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Heart, Store, Search, LayoutGrid, List, Star, ShoppingCart, Trash2, Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PaginationControls } from "@/components/marketplace/PaginationControls";

const favoriteProducts = [
  { id: "1", name: "Montre Connectée Pro", price: 149.99, rating: 4.9, businessName: "TechStore", category: "High-Tech", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=150&fit=crop" },
  { id: "2", name: "Sac à dos Urban", price: 59.99, rating: 4.7, businessName: "ModeBoutique", category: "Mode", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=150&fit=crop" },
  { id: "3", name: "Sneakers Limited", price: 89.99, rating: 4.6, businessName: "ModeBoutique", category: "Mode", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=150&fit=crop" },
  { id: "4", name: "Casque Audio Premium", price: 199.99, rating: 4.8, businessName: "TechStore", category: "High-Tech", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=150&fit=crop" },
  { id: "5", name: "Veste en Cuir", price: 129.99, rating: 4.5, businessName: "ModeBoutique", category: "Mode", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=150&fit=crop" },
  { id: "6", name: "Lampe Design", price: 75.00, rating: 4.4, businessName: "MaisonDeco", category: "Maison", image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=200&h=150&fit=crop" },
  { id: "7", name: "Clavier Mécanique RGB", price: 119.99, rating: 4.7, businessName: "TechStore", category: "High-Tech", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=150&fit=crop" },
  { id: "8", name: "Parfum Élégance", price: 85.00, rating: 4.9, businessName: "BeautéShop", category: "Beauté", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=150&fit=crop" },
  { id: "9", name: "Tapis Berbère", price: 210.00, rating: 4.3, businessName: "MaisonDeco", category: "Maison", image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=200&h=150&fit=crop" },
  { id: "10", name: "Bracelet Artisanal", price: 35.00, rating: 4.6, businessName: "AccessoiresPlus", category: "Accessoires", image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=200&h=150&fit=crop" },
  { id: "11", name: "Enceinte Bluetooth", price: 69.99, rating: 4.5, businessName: "TechStore", category: "High-Tech", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=150&fit=crop" },
  { id: "12", name: "Lunettes de Soleil", price: 45.00, rating: 4.4, businessName: "AccessoiresPlus", category: "Accessoires", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&h=150&fit=crop" },
  { id: "13", name: "Coussin Velours", price: 29.99, rating: 4.3, businessName: "MaisonDeco", category: "Maison", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=150&fit=crop" },
  { id: "14", name: "Crème Hydratante Bio", price: 22.50, rating: 4.7, businessName: "BeautéShop", category: "Beauté", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=150&fit=crop" },
  { id: "15", name: "Chargeur Sans Fil", price: 34.99, rating: 4.6, businessName: "TechStore", category: "High-Tech", image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200&h=150&fit=crop" },
  { id: "16", name: "Écharpe Cachemire", price: 79.00, rating: 4.8, businessName: "ModeBoutique", category: "Mode", image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=200&h=150&fit=crop" },
  { id: "17", name: "Bougie Parfumée", price: 18.99, rating: 4.5, businessName: "MaisonDeco", category: "Maison", image: "https://images.unsplash.com/photo-1602607616907-1147af831de5?w=200&h=150&fit=crop" },
  { id: "18", name: "Souris Ergonomique", price: 54.99, rating: 4.4, businessName: "TechStore", category: "High-Tech", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=150&fit=crop" },
  { id: "19", name: "Sac Bandoulière", price: 42.00, rating: 4.6, businessName: "AccessoiresPlus", category: "Accessoires", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=150&fit=crop" },
  { id: "20", name: "Rouge à Lèvres Mat", price: 15.99, rating: 4.7, businessName: "BeautéShop", category: "Beauté", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=200&h=150&fit=crop" },
  { id: "21", name: "Tablette Graphique", price: 159.99, rating: 4.8, businessName: "TechStore", category: "High-Tech", image: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=200&h=150&fit=crop" },
  { id: "22", name: "Chapeau Panama", price: 48.00, rating: 4.5, businessName: "AccessoiresPlus", category: "Accessoires", image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=200&h=150&fit=crop" },
  { id: "23", name: "Miroir Décoratif", price: 65.00, rating: 4.3, businessName: "MaisonDeco", category: "Maison", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=200&h=150&fit=crop" },
  { id: "24", name: "Sérum Anti-Âge", price: 39.99, rating: 4.9, businessName: "BeautéShop", category: "Beauté", image: "https://images.unsplash.com/photo-1570194065650-d99fb4a38c5f?w=200&h=150&fit=crop" },
  { id: "25", name: "Pull en Maille", price: 55.00, rating: 4.6, businessName: "ModeBoutique", category: "Mode", image: "https://images.unsplash.com/photo-1434389677669-e08b4cda3a14?w=200&h=150&fit=crop" },
  { id: "26", name: "Webcam HD", price: 79.99, rating: 4.4, businessName: "TechStore", category: "High-Tech", image: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=200&h=150&fit=crop" },
  { id: "27", name: "Vase Artisanal", price: 32.00, rating: 4.5, businessName: "MaisonDeco", category: "Maison", image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=200&h=150&fit=crop" },
  { id: "28", name: "Palette Maquillage", price: 27.99, rating: 4.7, businessName: "BeautéShop", category: "Beauté", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=200&h=150&fit=crop" },
];

const favoriteShops = [
  { id: "1", name: "TechStore", category: "High-Tech", rating: 4.6, productsCount: 156, avatar: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=80&h=80&fit=crop" },
  { id: "2", name: "ModeBoutique", category: "Mode", rating: 4.7, productsCount: 89, avatar: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=80&h=80&fit=crop" },
  { id: "3", name: "MaisonDeco", category: "Maison", rating: 4.5, productsCount: 64, avatar: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=80&h=80&fit=crop" },
  { id: "4", name: "BeautéShop", category: "Beauté", rating: 4.8, productsCount: 120, avatar: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=80&h=80&fit=crop" },
  { id: "5", name: "AccessoiresPlus", category: "Accessoires", rating: 4.4, productsCount: 45, avatar: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=80&h=80&fit=crop" },
];

type TabFilter = "products" | "shops";

const ITEMS_PER_PAGE = 20;

export default function Favoris() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<TabFilter>("products");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as TabFilter);
    setCurrentPage(1);
  };

  // Filter & sort products
  const filteredProducts = favoriteProducts
    .filter((p) => {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.businessName.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0; // recent = default order
    });

  // Filter & sort shops
  const filteredShops = favoriteShops
    .filter((s) => {
      const q = searchQuery.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const currentItems = activeTab === "products" ? filteredProducts : filteredShops;
  const totalPages = Math.ceil(currentItems.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const paginatedShops = filteredShops.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const categoryCounts = favoriteProducts.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  return (
    <AppLayout title="Favoris" subtitle="Vos produits et boutiques sauvegardés.">
      <div className="space-y-4 md:space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <StatsCard title="Produits favoris" value={String(favoriteProducts.length)} icon={<Heart className="h-5 w-5 text-foreground" />} />
          <StatsCard title="Boutiques suivies" value={String(favoriteShops.length)} icon={<Store className="h-5 w-5 text-foreground" />} />
          <StatsCard title="Catégorie favorite" value={topCategory} icon={<Star className="h-5 w-5 text-foreground" />} />
          <StatsCard title="Panier moyen" value={`${(favoriteProducts.reduce((s, p) => s + p.price, 0) / favoriteProducts.length).toFixed(0)} €`} icon={<ShoppingCart className="h-5 w-5 text-foreground" />} />
        </div>

        {/* Search, Sort & View Mode */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un favori..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Par défaut</SelectItem>
                <SelectItem value="name">Nom A-Z</SelectItem>
                <SelectItem value="rating">Meilleures notes</SelectItem>
                {activeTab === "products" && <SelectItem value="price-asc">Prix croissant</SelectItem>}
                {activeTab === "products" && <SelectItem value="price-desc">Prix décroissant</SelectItem>}
              </SelectContent>
            </Select>
            <div className="hidden sm:flex border border-border rounded-lg overflow-hidden">
              <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" className="rounded-none h-9 w-9" onClick={() => setViewMode("grid")}>
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" className="rounded-none h-9 w-9" onClick={() => setViewMode("list")}>
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="products" className="gap-1.5 text-xs md:text-sm">
              <Heart className="h-3.5 w-3.5" />
              Produits
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">{filteredProducts.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="shops" className="gap-1.5 text-xs md:text-sm">
              <Store className="h-3.5 w-3.5" />
              Boutiques
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">{filteredShops.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            {paginatedProducts.length === 0 ? (
              <Card><CardContent className="p-8 text-center text-muted-foreground">Aucun produit favori trouvé.</CardContent></Card>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {paginatedProducts.map((product) => (
                  <Card key={product.id} className="group overflow-hidden hover:border-primary/30 transition-all">
                    <div className="relative h-32 sm:h-36 bg-muted overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 h-7 w-7 bg-destructive/90 text-destructive-foreground hover:bg-destructive"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      </Button>
                      <Badge variant="outline" className="absolute top-2 left-2 text-[10px] bg-background/80 backdrop-blur-sm">
                        {product.category}
                      </Badge>
                    </div>
                    <CardContent className="p-3">
                      <p className="text-[10px] text-muted-foreground">{product.businessName}</p>
                      <h4 className="font-semibold text-sm text-foreground truncate">{product.name}</h4>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 fill-primary text-primary" />
                        <span className="text-xs font-medium">{product.rating}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                        <span className="font-bold text-foreground">{product.price.toFixed(2)} €</span>
                        <Button size="sm" className="h-7 text-xs gap-1">
                          <ShoppingCart className="w-3 h-3" />
                          Ajouter
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {paginatedProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:border-primary/30 transition-all">
                    <CardContent className="p-0">
                      <div className="flex gap-3 p-3 md:p-4">
                        <img src={product.image} alt={product.name} className="w-14 h-14 md:w-16 md:h-16 rounded-lg object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-[10px] text-muted-foreground">{product.businessName} • {product.category}</p>
                              <p className="font-semibold text-sm text-foreground">{product.name}</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <Star className="w-3 h-3 fill-primary text-primary" />
                                <span className="text-xs font-medium">{product.rating}</span>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-[10px] shrink-0 bg-background">
                              {product.category}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                            <p className="font-bold text-foreground">{product.price.toFixed(2)} €</p>
                            <div className="flex gap-1.5">
                              <Button size="sm" className="h-7 text-xs gap-1">
                                <ShoppingCart className="w-3 h-3" />
                                Ajouter
                              </Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Shops Tab */}
          <TabsContent value="shops">
            {paginatedShops.length === 0 ? (
              <Card><CardContent className="p-8 text-center text-muted-foreground">Aucune boutique favorite trouvée.</CardContent></Card>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {paginatedShops.map((shop) => (
                  <Card key={shop.id} className="overflow-hidden hover:border-primary/30 transition-all group">
                    <CardContent className="p-4 text-center">
                      <img src={shop.avatar} alt={shop.name} className="w-16 h-16 rounded-xl object-cover mx-auto mb-3 group-hover:scale-105 transition-transform duration-300" />
                      <h4 className="font-semibold text-foreground">{shop.name}</h4>
                      <Badge variant="secondary" className="text-[10px] mt-1">{shop.category}</Badge>
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <Star className="w-3 h-3 fill-primary text-primary" />
                        <span className="text-xs font-medium">{shop.rating}</span>
                        <span className="text-xs text-muted-foreground ml-1">• {shop.productsCount} produits</span>
                      </div>
                      <div className="flex gap-2 mt-3 pt-3 border-t border-border/50 justify-center">
                        <Button size="sm" variant="outline" className="h-8 text-xs gap-1">
                          <Eye className="w-3 h-3" /> Visiter
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {paginatedShops.map((shop) => (
                  <Card key={shop.id} className="hover:border-primary/30 transition-all">
                    <CardContent className="p-3 md:p-4 flex items-center gap-3">
                      <img src={shop.avatar} alt={shop.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground">{shop.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="secondary" className="text-[10px]">{shop.category}</Badge>
                          <div className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-primary text-primary" />
                            <span>{shop.rating}</span>
                          </div>
                          <span>{shop.productsCount} produits</span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button size="sm" variant="outline" className="h-8 text-xs">Visiter</Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        {totalPages > 1 && (
          <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}
      </div>
    </AppLayout>
  );
}
