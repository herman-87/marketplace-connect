import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewDialog } from "@/components/reviews/ReviewDialog";
import { useReviews } from "@/contexts/ReviewsContext";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { CartSheet } from "@/components/cart/CartSheet";
import {
  ArrowLeft,
  Star,
  Heart,
  MapPin,
  Verified,
  ShoppingCart,
  ShoppingBag,
  Clock,
  Package,
  Users,
  Share2,
  MessageSquare,
  Phone,
  Mail,
  Store,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for the public shop view
const shopData: Record<string, {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  email: string;
  phone: string;
  isVerified: boolean;
  isOpen: boolean;
  coverImage: string;
  avatar: string;
  joinedDate: string;
  productsCount: number;
  totalSales: number;
  followers: number;
  responseTime: string;
}> = {
  "1": {
    id: "1",
    name: "TechStore",
    description: "Les meilleurs gadgets et accessoires technologiques au meilleur prix. Nous sélectionnons rigoureusement chaque produit pour vous garantir qualité et innovation.",
    category: "High-Tech",
    location: "Paris 8ème, France",
    email: "contact@techstore.com",
    phone: "+33 1 23 45 67 89",
    isVerified: true,
    isOpen: true,
    coverImage: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=200&fit=crop",
    joinedDate: "Janvier 2024",
    productsCount: 156,
    totalSales: 2340,
    followers: 890,
    responseTime: "~2h",
  },
  "2": {
    id: "2",
    name: "ModeBoutique",
    description: "Tendances et styles uniques pour homme et femme. Des pièces soigneusement sélectionnées pour un look qui vous ressemble.",
    category: "Mode",
    location: "Paris 3ème, France",
    email: "hello@modeboutique.com",
    phone: "+33 1 98 76 54 32",
    isVerified: true,
    isOpen: true,
    coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=200&h=200&fit=crop",
    joinedDate: "Mars 2024",
    productsCount: 89,
    totalSales: 1560,
    followers: 654,
    responseTime: "~1h",
  },
  "3": {
    id: "3",
    name: "UrbanWear",
    description: "Streetwear et accessoires tendance pour un style urbain affirmé. Découvrez nos collections exclusives.",
    category: "Streetwear",
    location: "Paris 10ème, France",
    email: "info@urbanwear.com",
    phone: "+33 1 55 44 33 22",
    isVerified: false,
    isOpen: false,
    coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop",
    joinedDate: "Juin 2024",
    productsCount: 78,
    totalSales: 890,
    followers: 432,
    responseTime: "~4h",
  },
  "4": {
    id: "4",
    name: "SportZone",
    description: "Équipements sportifs de qualité pour tous les niveaux. Du running au fitness, trouvez tout ce qu'il vous faut.",
    category: "Sport",
    location: "Paris 15ème, France",
    email: "contact@sportzone.com",
    phone: "+33 1 44 55 66 77",
    isVerified: true,
    isOpen: true,
    coverImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop",
    joinedDate: "Février 2024",
    productsCount: 95,
    totalSales: 1890,
    followers: 765,
    responseTime: "~30min",
  },
};

const shopProducts = [
  { id: "sp-1", name: "Montre Connectée Pro X", price: 149.99, originalPrice: 179.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop", rating: 4.8, sales: 156, inStock: true },
  { id: "sp-2", name: "Casque Audio Premium", price: 199.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop", rating: 4.9, sales: 134, inStock: true },
  { id: "sp-3", name: "Enceinte Bluetooth 360", price: 69.99, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop", rating: 4.5, sales: 89, inStock: true },
  { id: "sp-4", name: "Coque iPhone Design", price: 24.99, image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=300&h=300&fit=crop", rating: 4.4, sales: 234, inStock: true },
  { id: "sp-5", name: "Power Bank 20000mAh", price: 34.99, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop", rating: 4.7, sales: 178, inStock: false },
  { id: "sp-6", name: "Clavier Mécanique RGB", price: 119.99, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=300&fit=crop", rating: 4.8, sales: 65, inStock: true },
  { id: "sp-7", name: "Tablette Graphique Pro", price: 89.99, image: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=300&h=300&fit=crop", rating: 4.5, sales: 67, inStock: true },
  { id: "sp-8", name: "Bracelet Connecté Fit", price: 49.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop", rating: 4.6, sales: 112, inStock: true },
];

const shopPromotions = [
  { id: "spromo-1", productName: "Montre Connectée Pro X", originalPrice: 179.99, promoPrice: 149.99, discount: 17, endsIn: "3 jours", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop" },
  { id: "spromo-2", productName: "Casque Audio Premium", originalPrice: 249.99, promoPrice: 199.99, discount: 20, endsIn: "5 jours", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop" },
  { id: "spromo-3", productName: "Coque iPhone Design", originalPrice: 34.99, promoPrice: 24.99, discount: 29, endsIn: "1 jour", image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=300&h=300&fit=crop" },
];

const shopReviews = [
  { id: "r1", author: "Sophie L.", rating: 5, comment: "Excellent service et produits de qualité. Livraison rapide !", date: "Il y a 2 jours" },
  { id: "r2", author: "Pierre M.", rating: 4, comment: "Bon rapport qualité/prix. Le service client est réactif.", date: "Il y a 1 semaine" },
  { id: "r3", author: "Aminata S.", rating: 5, comment: "Ma boutique préférée sur la plateforme. Je recommande vivement.", date: "Il y a 2 semaines" },
  { id: "r4", author: "Marc D.", rating: 4, comment: "Produits conformes à la description. Emballage soigné.", date: "Il y a 3 semaines" },
  { id: "r5", author: "Fatou N.", rating: 5, comment: "Toujours satisfaite de mes achats ici. Top !", date: "Il y a 1 mois" },
];

export default function MarketplaceShopDetail() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const { isLiked, toggleLike, getAverageRating } = useReviews();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState("products");

  const shop = shopData[shopId || "1"] || shopData["1"];
  const liked = isLiked("shop", shop.id);
  const { average, count } = getAverageRating("shop", shop.id);
  const displayRating = average || 4.7;
  const displayReviewCount = count || shopReviews.length;

  const handleAddToCart = (product: typeof shopProducts[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      businessId: shop.id,
      businessName: shop.name,
    });
  };

  return (
    <MarketplaceLayout>
      <div className="animate-fade-in">
        {/* Cover Banner */}
        <div className="relative h-40 sm:h-52 md:h-64 bg-muted overflow-hidden">
          <img
            src={shop.coverImage}
            alt={shop.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Back button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {/* Actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm"
              onClick={() => toggleLike("shop", shop.id, shop.name)}
            >
              <Heart className={cn("h-5 w-5", liked ? "fill-rose-500 text-rose-500" : "")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Shop Info Section */}
        <div className="container mx-auto px-4">
          <div className="relative -mt-12 sm:-mt-14 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Avatar */}
              <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-background shadow-lg">
                <AvatarImage src={shop.avatar} alt={shop.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                  {shop.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{shop.name}</h1>
                  {shop.isVerified && (
                    <Verified className="w-6 h-6 text-primary fill-primary/20" />
                  )}
                  <Badge variant={shop.isOpen ? "default" : "secondary"} className="text-xs">
                    {shop.isOpen ? "Ouvert" : "Fermé"}
                  </Badge>
                </div>
                {/* Rating stars */}
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={cn(
                          "w-4 h-4",
                          s <= Math.round(displayRating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-muted text-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-foreground">{displayRating}</span>
                  <span className="text-xs text-muted-foreground">· {displayReviewCount} avis</span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                  <Badge variant="outline" className="text-xs font-normal">{shop.category}</Badge>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {shop.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Membre depuis {shop.joinedDate}
                  </span>
                </div>
              </div>

              {/* Desktop actions */}
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Contacter
                </Button>
                <ReviewDialog
                  type="shop"
                  targetId={shop.id}
                  targetName={shop.name}
                  trigger={
                    <Button variant="outline" size="sm" className="gap-2">
                      <Star className="h-4 w-4" />
                      Donner un avis
                    </Button>
                  }
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground max-w-2xl mb-6">
            {shop.description}
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
            {[
              { icon: Star, label: "Note", value: `${displayRating}/5`, sub: `${displayReviewCount} avis`, color: "text-amber-500" },
              { icon: Package, label: "Produits", value: shop.productsCount.toString(), color: "text-primary" },
              { icon: TrendingUp, label: "Ventes", value: shop.totalSales.toLocaleString(), color: "text-emerald-500" },
              { icon: Users, label: "Abonnés", value: shop.followers.toString(), color: "text-blue-500" },
              { icon: Clock, label: "Réponse", value: shop.responseTime, color: "text-violet-500" },
            ].map((stat) => (
              <Card key={stat.label} className="hover:border-foreground/30 transition-colors">
                <CardContent className="p-3 sm:p-4 text-center">
                  <stat.icon className={cn("w-4 h-4 mx-auto mb-1", stat.color)} />
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
                  {stat.sub && <p className="text-[10px] text-muted-foreground">{stat.sub}</p>}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mobile actions */}
          <div className="flex sm:hidden gap-2 mb-6">
            <Button variant="outline" size="sm" className="flex-1 gap-2">
              <MessageSquare className="h-4 w-4" />
              Contacter
            </Button>
            <ReviewDialog
              type="shop"
              targetId={shop.id}
              targetName={shop.name}
              trigger={
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Star className="h-4 w-4" />
                  Donner un avis
                </Button>
              }
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
              <TabsTrigger value="products" className="gap-1.5 text-xs sm:text-sm">
                <ShoppingBag className="w-3.5 h-3.5" />
                Produits
              </TabsTrigger>
              <TabsTrigger value="promotions" className="gap-1.5 text-xs sm:text-sm">
                <TrendingUp className="w-3.5 h-3.5" />
                Promos
              </TabsTrigger>
              <TabsTrigger value="reviews" className="gap-1.5 text-xs sm:text-sm">
                <Star className="w-3.5 h-3.5" />
                Avis
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products" className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {shopProducts.map((product) => {
                  const fav = isFavorite(product.id);
                  return (
                    <Card key={product.id} className="group overflow-hidden hover:border-foreground/30 transition-all cursor-pointer">
                      <Link to={`/product/${product.id}`}>
                        <div className="relative aspect-square bg-muted overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                              <Badge variant="secondary">Rupture</Badge>
                            </div>
                          )}
                          {product.originalPrice && (
                            <Badge className="absolute top-2 left-2 text-[10px] bg-destructive text-destructive-foreground">
                              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                            </Badge>
                          )}
                        </div>
                      </Link>
                      <CardContent className="p-3">
                        <Link to={`/product/${product.id}`}>
                          <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-1">{product.name}</h3>
                          <div className="flex items-center gap-1.5 mb-2">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs text-foreground font-medium">{product.rating}</span>
                            <span className="text-[10px] text-muted-foreground">· {product.sales} vendus</span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-base font-bold text-foreground">{product.price.toFixed(2)} €</span>
                            {product.originalPrice && (
                              <span className="text-xs text-muted-foreground line-through">{product.originalPrice.toFixed(2)} €</span>
                            )}
                          </div>
                        </Link>
                        <div className="flex items-center gap-1.5 mt-2">
                          <Button
                            size="sm"
                            className="flex-1 h-8 text-xs gap-1"
                            disabled={!product.inStock}
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddToCart(product);
                            }}
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Ajouter
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 shrink-0"
                            onClick={(e) => {
                              e.preventDefault();
                            toggleFavorite({
                                id: product.id,
                                name: product.name,
                                businessId: shop.id,
                              });
                            }}
                          >
                            <Heart className={cn("w-3.5 h-3.5", fav ? "fill-rose-500 text-rose-500" : "")} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Promotions Tab */}
            <TabsContent value="promotions" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {shopPromotions.map((promo) => (
                  <Card key={promo.id} className="overflow-hidden hover:border-foreground/30 transition-colors cursor-pointer">
                    <div className="flex gap-4 p-4">
                      <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden shrink-0">
                        <img src={promo.image} alt={promo.productName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-foreground truncate">{promo.productName}</h3>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-lg font-bold text-primary">{promo.promoPrice.toFixed(2)} €</span>
                          <span className="text-xs text-muted-foreground line-through">{promo.originalPrice.toFixed(2)} €</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="destructive" className="text-[10px]">-{promo.discount}%</Badge>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Expire dans {promo.endsIn}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              {shopPromotions.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">Aucune promotion en cours</p>
                </div>
              )}
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-4 max-w-2xl">
                {/* Rating Summary */}
                <Card className="hover:border-foreground/30 transition-colors">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-foreground">{displayRating}</p>
                        <div className="flex items-center gap-0.5 mt-1 justify-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "w-4 h-4",
                                i < Math.floor(displayRating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                              )}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{displayReviewCount} avis</p>
                      </div>
                      <Separator orientation="vertical" className="h-16" />
                      <div className="flex-1 space-y-1.5">
                        {[5, 4, 3, 2, 1].map((stars) => {
                          const pct = stars === 5 ? 60 : stars === 4 ? 30 : stars === 3 ? 7 : stars === 2 ? 2 : 1;
                          return (
                            <div key={stars} className="flex items-center gap-2 text-xs">
                              <span className="w-3 text-muted-foreground">{stars}</span>
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="w-8 text-right text-muted-foreground">{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Review List */}
                <div className="space-y-3">
                  {shopReviews.map((review) => (
                    <Card key={review.id} className="hover:border-foreground/30 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-muted text-foreground text-xs">
                                {review.author.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-foreground">{review.author}</p>
                              <p className="text-[10px] text-muted-foreground">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "w-3 h-3",
                                  i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Floating Cart - Mobile */}
      <div className="fixed bottom-6 right-4 z-50 lg:hidden">
        <CartSheet
          trigger={
            <button className="relative flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
              <ShoppingCart className="h-6 w-6" />
            </button>
          }
        />
      </div>
    </MarketplaceLayout>
  );
}
