import { useState, useMemo } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdaptivePagination } from "@/components/ui/adaptive-pagination";
import { X, Star, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";

interface CategoryProductsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryName: string;
  categoryId: string;
}

interface MockProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  shop: string;
  badge?: string;
}

const ITEMS_PER_PAGE = 12;

function generateMockProducts(categoryId: string, categoryName: string): MockProduct[] {
  const baseProducts: Record<string, string[]> = {
    mode: ["Robe élégante", "Costume homme", "Jeans slim", "T-shirt premium", "Veste en cuir", "Pull cachemire", "Chemise lin", "Short chino", "Blazer femme", "Sneakers tendance", "Manteau hiver", "Polo classique", "Jupe plissée", "Pantalon cargo", "Cardigan oversize", "Doudoune légère", "Robe longue", "Bermuda coton", "Blouson aviateur", "Combinaison"],
    tech: ["iPhone 15 Pro", "Samsung Galaxy S24", "MacBook Air M3", "iPad Pro", "AirPods Pro", "Sony WH-1000XM5", "Nintendo Switch", "PS5 Controller", "Webcam 4K", "Clavier mécanique", "Souris gaming", "Monitor 27\"", "Tablette graphique", "Drone DJI Mini", "Enceinte Bluetooth", "Chargeur rapide", "SSD externe 1TB", "Ring Light Pro", "Micro USB-C", "Smart Watch"],
    accessoires: ["Montre automatique", "Bracelet cuir", "Lunettes soleil", "Sac à main", "Ceinture tressée", "Portefeuille slim", "Écharpe soie", "Chapeau fedora", "Boucles d'oreilles", "Collier or", "Bague argent", "Pochette soirée", "Cravate soie", "Nœud papillon", "Foulard imprimé", "Barrette cheveux", "Broche vintage", "Manchettes", "Bandeau sport", "Étui AirPods"],
    maison: ["Canapé 3 places", "Table basse", "Lampe design", "Coussin velours", "Tapis berbère", "Étagère murale", "Miroir doré", "Vase céramique", "Bougie parfumée", "Cadre photo", "Nappe lin", "Rideau occultant", "Plante artificielle", "Horloge murale", "Pouf en jute", "Panier rangement", "Set de table", "Diffuseur huile", "Plaid tricot", "Tabouret bar"],
    beaute: ["Sérum visage", "Palette maquillage", "Parfum signature", "Crème hydratante", "Rouge à lèvres", "Fond de teint", "Mascara volume", "Huile cheveux", "Gel douche", "Shampoing bio", "Coffret soins", "Baume lèvres", "Eau de toilette", "Pinceau set", "Gommage corps", "Masque visage", "Vernis à ongles", "Démaquillant", "Crème solaire", "Déodorant naturel"],
    auto: ["Tapis de sol", "Housse siège", "Chargeur voiture", "Support téléphone", "Parfum voiture", "Caméra recul", "Kit nettoyage", "Organiseur coffre", "Lampe LED", "Antenne requin", "Couvre volant", "Porte-clés", "Autocollant déco", "Balai essuie-glace", "Cric hydraulique", "Coffre de toit", "Alarme voiture", "GPS portable", "Aspirateur auto", "Kit premiers soins"],
    sport: ["Haltères réglables", "Tapis yoga", "Bande résistance", "Corde à sauter", "Gourde isotherme", "Sac de sport", "Chaussures running", "Short sport", "Legging fitness", "Montre cardio", "Ballon fitness", "Rouleau massage", "Gants musculation", "Protège-tibias", "Maillot foot", "Raquette tennis", "Lunettes natation", "Casque vélo", "Coudières", "Sac à dos rando"],
    autres: ["Livre bestseller", "Jeu de société", "Puzzle 1000 pcs", "Peluche géante", "Carte cadeau", "Agenda 2025", "Stylo plume", "Carnet cuir", "Figurine collector", "Poster encadré", "Mug personnalisé", "Bouteille design", "Parapluie compact", "Sac isotherme", "Lunch box", "Trousse cuir", "Porte-documents", "Lanyard design", "Stickers pack", "Kit DIY"],
  };

  const products = baseProducts[categoryId] || baseProducts.autres;
  const shops = ["Boutique Elite", "FastShop", "Mode Express", "TechWorld", "AfriqStyle", "ProShop"];
  const badges = ["Nouveau", "Populaire", "Promo", undefined, undefined, undefined];

  return products.map((name, i) => ({
    id: `${categoryId}-${i}`,
    name,
    price: Math.floor(Math.random() * 50000) + 2000,
    originalPrice: Math.random() > 0.5 ? Math.floor(Math.random() * 30000) + 50000 : undefined,
    image: `https://images.unsplash.com/photo-${1560472354 + i * 1000}?w=300&h=300&fit=crop`,
    rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
    reviews: Math.floor(Math.random() * 200) + 5,
    shop: shops[i % shops.length],
    badge: badges[i % badges.length],
  }));
}

export function CategoryProductsModal({
  open,
  onOpenChange,
  categoryName,
  categoryId,
}: CategoryProductsModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { addToCart } = useCart();

  const allProducts = useMemo(() => generateMockProducts(categoryId, categoryName), [categoryId, categoryName]);
  const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = allProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full w-full h-full max-h-full m-0 p-0 rounded-none border-none bg-background flex flex-col [&>button]:hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">{categoryName}</h2>
            <p className="text-sm text-muted-foreground">{allProducts.length} articles trouvés</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {paginatedProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                <div className="relative aspect-square bg-muted">
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    {product.name}
                  </div>
                  {product.badge && (
                    <Badge className="absolute top-2 left-2 text-[10px] px-1.5 py-0.5">
                      {product.badge}
                    </Badge>
                  )}
                </div>
                <div className="p-2.5 sm:p-3 space-y-1.5">
                  <p className="text-xs text-muted-foreground truncate">{product.shop}</p>
                  <h3 className="text-sm font-medium text-foreground truncate">{product.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-primary text-primary" />
                    <span className="text-xs text-muted-foreground">{product.rating} ({product.reviews})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">
                      {product.price.toLocaleString()} XAF
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="w-full h-8 text-xs mt-1"
                    onClick={() =>
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        businessId: product.id.split("-")[0],
                        businessName: product.shop,
                      })
                    }
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Ajouter
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <AdaptivePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="py-6"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
