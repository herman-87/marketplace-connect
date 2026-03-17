import { useState } from "react";
import { Link } from "react-router-dom";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft, Search, Store, Star, MapPin, ArrowRight, Verified, Heart, LayoutGrid, List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PaginationControls } from "@/components/marketplace/PaginationControls";

const allShops = [
  { id: "1", name: "TechStore", category: "High-Tech", description: "Les meilleurs gadgets au meilleur prix", rating: 4.6, reviewsCount: 189, location: "Paris 8ème", productsCount: 156, isVerified: true, followers: 890, coverImage: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=200&fit=crop", avatar: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&h=100&fit=crop" },
  { id: "2", name: "ModeBoutique", category: "Mode", description: "Tendances et styles uniques", rating: 4.7, reviewsCount: 256, location: "Paris 3ème", productsCount: 89, isVerified: true, followers: 2100, coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop", avatar: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=100&h=100&fit=crop" },
  { id: "3", name: "UrbanWear", category: "Streetwear", description: "Streetwear et accessoires tendance", rating: 4.5, reviewsCount: 134, location: "Paris 10ème", productsCount: 78, isVerified: false, followers: 670, coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop", avatar: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop" },
  { id: "4", name: "SportZone", category: "Sport", description: "Équipements sportifs de qualité", rating: 4.3, reviewsCount: 76, location: "Paris 15ème", productsCount: 95, isVerified: true, followers: 567, coverImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=200&fit=crop", avatar: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop" },
  { id: "5", name: "ElectroMax", category: "High-Tech", description: "Électronique et accessoires", rating: 4.4, reviewsCount: 98, location: "Paris 12ème", productsCount: 210, isVerified: true, followers: 430, coverImage: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=200&fit=crop", avatar: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&h=100&fit=crop" },
  { id: "6", name: "BioBeauté", category: "Beauté", description: "Cosmétiques naturels et bio", rating: 4.8, reviewsCount: 267, location: "Paris 6ème", productsCount: 45, isVerified: true, followers: 950, coverImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=200&fit=crop", avatar: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=100&h=100&fit=crop" },
  { id: "7", name: "MaisonDéco", category: "Maison", description: "Décoration et ameublement", rating: 4.6, reviewsCount: 145, location: "Paris 5ème", productsCount: 120, isVerified: false, followers: 380, coverImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=200&fit=crop", avatar: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop" },
  { id: "8", name: "AutoParts Pro", category: "Auto", description: "Pièces et accessoires automobiles", rating: 4.5, reviewsCount: 89, location: "Paris 19ème", productsCount: 320, isVerified: true, followers: 1100, coverImage: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=200&fit=crop", avatar: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=100&h=100&fit=crop" },
  { id: "9", name: "WaxPrint Africa", category: "Mode", description: "Mode africaine contemporaine", rating: 4.9, reviewsCount: 412, location: "Paris 18ème", productsCount: 32, isVerified: true, followers: 1800, coverImage: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=200&fit=crop", avatar: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100&h=100&fit=crop" },
  { id: "10", name: "GadgetWorld", category: "High-Tech", description: "Gadgets et innovations", rating: 4.4, reviewsCount: 156, location: "Paris 4ème", productsCount: 180, isVerified: true, followers: 1450, coverImage: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=200&fit=crop", avatar: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&h=100&fit=crop" },
  { id: "11", name: "FitGear", category: "Sport", description: "Équipements fitness premium", rating: 4.7, reviewsCount: 198, location: "Paris 16ème", productsCount: 67, isVerified: false, followers: 720, coverImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=200&fit=crop", avatar: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop" },
  { id: "12", name: "AccessoirePlus", category: "Accessoires", description: "Bijoux, montres et accessoires", rating: 4.6, reviewsCount: 234, location: "Paris 2ème", productsCount: 145, isVerified: true, followers: 560, coverImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=200&fit=crop", avatar: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop" },
  { id: "13", name: "WaxDesign", category: "Mode", description: "Créations en tissu wax", rating: 4.7, reviewsCount: 198, location: "Paris 2ème", productsCount: 45, isVerified: true, followers: 820, coverImage: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=200&fit=crop", avatar: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100&h=100&fit=crop" },
  { id: "14", name: "LuxeMontre", category: "Accessoires", description: "Montres de luxe et horlogerie", rating: 4.8, reviewsCount: 310, location: "Paris 1er", productsCount: 55, isVerified: true, followers: 2300, coverImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=200&fit=crop", avatar: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop" },
  { id: "15", name: "RunFast", category: "Sport", description: "Équipements de running", rating: 4.5, reviewsCount: 167, location: "Paris 14ème", productsCount: 82, isVerified: true, followers: 640, coverImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=200&fit=crop", avatar: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop" },
  { id: "16", name: "NaturaBio", category: "Beauté", description: "Soins naturels et végans", rating: 4.6, reviewsCount: 203, location: "Paris 11ème", productsCount: 38, isVerified: false, followers: 510, coverImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=200&fit=crop", avatar: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=100&h=100&fit=crop" },
  { id: "17", name: "PixelTech", category: "High-Tech", description: "PC Gaming et composants", rating: 4.7, reviewsCount: 278, location: "Paris 13ème", productsCount: 240, isVerified: true, followers: 1650, coverImage: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=200&fit=crop", avatar: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&h=100&fit=crop" },
  { id: "18", name: "ChezSoi", category: "Maison", description: "Mobilier moderne et design", rating: 4.4, reviewsCount: 112, location: "Paris 7ème", productsCount: 95, isVerified: true, followers: 420, coverImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=200&fit=crop", avatar: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop" },
  { id: "19", name: "StreetKings", category: "Streetwear", description: "Sneakers et streetwear exclusif", rating: 4.6, reviewsCount: 345, location: "Paris 9ème", productsCount: 110, isVerified: true, followers: 1900, coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop", avatar: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop" },
  { id: "20", name: "AfroStyle", category: "Mode", description: "Mode afro-urbaine tendance", rating: 4.8, reviewsCount: 287, location: "Paris 20ème", productsCount: 64, isVerified: true, followers: 1350, coverImage: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=200&fit=crop", avatar: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100&h=100&fit=crop" },
  { id: "21", name: "DriveShop", category: "Auto", description: "Accessoires auto et tuning", rating: 4.3, reviewsCount: 78, location: "Paris 17ème", productsCount: 185, isVerified: false, followers: 390, coverImage: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=200&fit=crop", avatar: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=100&h=100&fit=crop" },
  { id: "22", name: "YogaZen", category: "Sport", description: "Yoga, méditation et bien-être", rating: 4.9, reviewsCount: 198, location: "Paris 6ème", productsCount: 42, isVerified: true, followers: 870, coverImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=200&fit=crop", avatar: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop" },
];

const categories = ["Tous", "Mode", "High-Tech", "Streetwear", "Sport", "Beauté", "Maison"];
const ITEMS_PER_PAGE = 20;

export default function MarketplaceShops() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [sortBy, setSortBy] = useState("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = allShops
    .filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === "Tous" || s.category === selectedCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "followers") return b.followers - a.followers;
      if (sortBy === "products") return b.productsCount - a.productsCount;
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <MarketplaceLayout>
      <div className="container mx-auto px-4 py-6 space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <Link to="/marketplace"><Button variant="ghost" size="icon" className="shrink-0"><ArrowLeft className="h-5 w-5" /></Button></Link>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10"><Store className="w-5 h-5 text-primary" /></div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Boutiques Vedettes</h1>
              <p className="text-sm text-muted-foreground">{filtered.length} boutique{filtered.length > 1 ? "s" : ""}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher une boutique..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="pl-10" />
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={(v) => { setSelectedCategory(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>{categories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Meilleurs avis</SelectItem>
                <SelectItem value="followers">Plus suivies</SelectItem>
                <SelectItem value="products">Plus de produits</SelectItem>
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
            <Store className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-1">Aucune boutique trouvée</h3>
            <p className="text-sm text-muted-foreground">Essayez de modifier vos filtres</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {paginated.map((shop) => (
              <Card key={shop.id} className="group overflow-hidden hover:border-foreground/30 transition-all duration-300">
                <div className="relative h-20 bg-muted overflow-hidden">
                  <img src={shop.coverImage} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-8 w-8 bg-card/80 hover:bg-card text-muted-foreground hover:text-primary"><Heart className="w-4 h-4" /></Button>
                  <div className="absolute -bottom-6 left-4">
                    <Avatar className="h-14 w-14 border-4 border-card">
                      <AvatarImage src={shop.avatar} alt={shop.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">{shop.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <CardContent className="pt-8 pb-4 px-4">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-foreground">{shop.name}</h3>
                    {shop.isVerified && <Verified className="w-4 h-4 text-primary fill-primary/20" />}
                  </div>
                  <Badge variant="secondary" className="mt-1 text-[10px]">{shop.category}</Badge>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{shop.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1"><Star className="w-3 h-3 fill-primary text-primary" /><span className="font-medium text-foreground">{shop.rating}</span><span>({shop.reviewsCount})</span></div>
                    <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /><span>{shop.location}</span></div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                    <div className="text-xs"><span className="font-semibold text-foreground">{shop.productsCount}</span><span className="text-muted-foreground"> produits</span></div>
                    <Button size="sm" variant="ghost" className="text-xs h-7 gap-1 text-primary hover:text-primary">Visiter<ArrowRight className="w-3 h-3" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {paginated.map((shop) => (
              <Card key={shop.id} className="overflow-hidden hover:border-primary/30 transition-all">
                <div className="flex">
                  <div className="relative w-32 sm:w-44 shrink-0 bg-muted overflow-hidden">
                    <img src={shop.coverImage} alt={shop.name} className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Avatar className="h-8 w-8"><AvatarImage src={shop.avatar} /><AvatarFallback className="text-xs">{shop.name.substring(0, 2)}</AvatarFallback></Avatar>
                        <h3 className="font-semibold text-foreground">{shop.name}</h3>
                        {shop.isVerified && <Verified className="w-4 h-4 text-primary fill-primary/20" />}
                        <Badge variant="secondary" className="text-[10px] ml-1">{shop.category}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{shop.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1"><Star className="w-3 h-3 fill-primary text-primary" /><span className="font-medium text-foreground">{shop.rating}</span></div>
                        <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{shop.location}</div>
                        <span>{shop.productsCount} produits</span>
                      </div>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button size="sm" variant="ghost" className="text-xs gap-1 text-primary">Visiter<ArrowRight className="w-3 h-3" /></Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}

        <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </MarketplaceLayout>
  );
}
