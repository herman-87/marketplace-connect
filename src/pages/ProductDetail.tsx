import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReviews } from "@/contexts/ReviewsContext";
import { ReviewDialog } from "@/components/reviews/ReviewDialog";
import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Share2,
  Star,
  Package,
  User,
  TrendingUp,
  Plus,
  Minus,
  Shield,
  Truck,
  RotateCcw,
  ChevronRight,
  Store,
} from "lucide-react";

type ProductStatus = "draft" | "published" | "removed";

interface ProductData {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  image?: string;
  status: ProductStatus;
  likes: number;
  views: number;
  sales: number;
  stock: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  createdBy: string;
  businessId: string;
  businessName: string;
  tags: string[];
  specs: { label: string; value: string }[];
}

const mockProduct: ProductData = {
  id: "1",
  name: "Montre Connectée Pro X",
  description: "Une montre connectée haut de gamme avec suivi santé avancé, GPS intégré, écran AMOLED et 7 jours d'autonomie. Compatible iOS et Android.",
  longDescription: `La Montre Connectée Pro X redéfinit l'expérience des wearables. Son écran AMOLED de 1.4 pouces offre une lisibilité parfaite en toutes conditions, même en plein soleil.

Grâce à ses capteurs avancés, elle assure un suivi santé complet : fréquence cardiaque, SpO2, qualité du sommeil et stress. Le GPS intégré permet un suivi précis de vos activités sportives sans smartphone.

Avec 7 jours d'autonomie en usage normal et une résistance à l'eau 5ATM, elle vous accompagne partout, du bureau à la salle de sport.`,
  price: 149.99,
  originalPrice: 199.99,
  image: undefined,
  status: "published" as const,
  likes: 245,
  views: 1820,
  sales: 89,
  stock: 50,
  rating: 4.7,
  reviewCount: 34,
  createdAt: "12 Jan 2025",
  createdBy: "Alex Martin",
  businessId: "1",
  businessName: "TechStore",
  tags: ["Populaire", "Recommandé", "Bestseller"],
  specs: [
    { label: "Écran", value: "AMOLED 1.4\"" },
    { label: "Autonomie", value: "7 jours" },
    { label: "Étanchéité", value: "5ATM" },
    { label: "GPS", value: "Intégré" },
    { label: "Compatibilité", value: "iOS / Android" },
    { label: "Poids", value: "45g" },
  ],
};

const mockSimilarProducts = [
  { id: "2", name: "Écouteurs Bluetooth Pro", price: 79.99, rating: 4.5, reviews: 18, image: undefined },
  { id: "3", name: "Bracelet Sport Fit", price: 39.99, rating: 4.2, reviews: 42, image: undefined },
  { id: "4", name: "Casque Audio Premium", price: 199.99, rating: 4.8, reviews: 27, image: undefined },
  { id: "5", name: "Chargeur Sans Fil Rapide", price: 29.99, rating: 4.0, reviews: 56, image: undefined },
];

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isLiked, toggleLike, getLikesCount, getReviews, getAverageRating } = useReviews();
  const [quantity, setQuantity] = useState(1);
  const [activeSlide, setActiveSlide] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");

  const product = mockProduct;
  const liked = isLiked("product", product.id);
  const likesCount = getLikesCount("product", product.id);
  const reviews = getReviews("product", product.id);
  const { average: rating, count: reviewCount } = getAverageRating("product", product.id);

  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => setActiveSlide(carouselApi.selectedScrollSnap());
    carouselApi.on("select", onSelect);
    onSelect();
    return () => { carouselApi.off("select", onSelect); };
  }, [carouselApi]);

  const productImages = [
    { id: 1, emoji: "⌚", label: "Vue principale" },
    { id: 2, emoji: "📱", label: "Avec smartphone" },
    { id: 3, emoji: "🏃", label: "Sport" },
    { id: 4, emoji: "💡", label: "Fonctionnalités" },
  ];

  const handleAddToCart = () => {
    console.log(`Added ${quantity} ${product.name} to cart`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <AppLayout>
      <div className="animate-fade-in">
        {/* Breadcrumb-style nav */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button onClick={() => navigate(-1)} className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour
          </button>
          <ChevronRight className="h-3 w-3" />
          <button onClick={() => navigate(`/business/${product.businessId}`)} className="hover:text-foreground transition-colors">
            {product.businessName}
          </button>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Main product section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Gallery */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden bg-muted/30 border border-border/50">
              <Carousel className="w-full" opts={{ loop: true }} setApi={setCarouselApi}>
                <CarouselContent>
                  {productImages.map((img) => (
                    <CarouselItem key={img.id}>
                      <div className="aspect-[4/3] bg-gradient-to-br from-muted/80 to-muted/30 flex items-center justify-center text-8xl select-none">
                        {img.emoji}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {/* Discount badge */}
              {discount > 0 && (
                <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-sm px-3 py-1 z-10">
                  -{discount}%
                </Badge>
              )}

              {/* Like button floating */}
              <button
                onClick={() => toggleLike("product", product.id, product.name)}
                className={`absolute top-4 right-4 z-10 h-10 w-10 rounded-full flex items-center justify-center transition-all ${
                  liked
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-destructive"
                }`}
              >
                <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
              </button>

              {/* Slide dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {productImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => carouselApi?.scrollTo(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === activeSlide ? "w-8 bg-primary" : "w-2 bg-foreground/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2">
              {productImages.map((img, index) => (
                <button
                  key={img.id}
                  onClick={() => carouselApi?.scrollTo(index)}
                  className={`flex-1 aspect-square rounded-xl flex items-center justify-center text-2xl transition-all border-2 ${
                    index === activeSlide
                      ? "border-primary bg-primary/5"
                      : "border-transparent bg-muted/40 hover:bg-muted/60"
                  }`}
                >
                  {img.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="flex flex-col gap-5">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs font-medium">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">{product.name}</h1>
              <button
                className="mt-2 text-sm text-muted-foreground flex items-center gap-1.5 hover:text-primary transition-colors"
                onClick={() => navigate(`/business/${product.businessId}`)}
              >
                <Store className="h-4 w-4" />
                <span>{product.businessName}</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {/* Rating & Likes */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(rating || product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted"
                    }`}
                  />
                ))}
                <span className="text-sm font-semibold ml-1">{rating || product.rating}</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-sm text-muted-foreground">{reviewCount || product.reviewCount} avis</span>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Heart className={`h-3.5 w-3.5 ${liked ? "fill-destructive text-destructive" : ""}`} />
                {likesCount}
              </span>
            </div>

            {/* Price block */}
            <div className="rounded-xl bg-muted/30 border border-border/50 p-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-primary">
                  {product.price.toFixed(2)} €
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-muted-foreground line-through">
                    {product.originalPrice.toFixed(2)} €
                  </span>
                )}
                {discount > 0 && (
                  <Badge variant="secondary" className="text-xs bg-destructive/10 text-destructive border-0">
                    Économisez {(product.originalPrice! - product.price).toFixed(2)} €
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5" />
                {product.stock > 10 ? (
                  <span className="text-green-600 dark:text-green-400 font-medium">En stock — {product.stock} disponibles</span>
                ) : product.stock > 0 ? (
                  <span className="text-amber-600 dark:text-amber-400 font-medium">Plus que {product.stock} en stock</span>
                ) : (
                  <span className="text-destructive font-medium">Rupture de stock</span>
                )}
              </p>
            </div>

            {/* Quantity + Add to cart */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-xl bg-card overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 rounded-none"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold tabular-nums">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 rounded-none"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  className="flex-1 h-11 gap-2 text-base font-semibold"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Ajouter au panier
                </Button>
              </div>

              {/* Secondary actions */}
              <div className="flex gap-2">
                <ReviewDialog
                  type="product"
                  targetId={product.id}
                  targetName={product.name}
                  trigger={
                    <Button variant="outline" className="flex-1 h-10 gap-2 text-sm">
                      <Star className="h-4 w-4" />
                      Donner un avis
                    </Button>
                  }
                />
                <Button variant="outline" className="h-10 gap-2 text-sm px-4" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                  Partager
                </Button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: "Livraison rapide", sub: "2-5 jours" },
                { icon: Shield, label: "Paiement sécurisé", sub: "100% protégé" },
                { icon: RotateCcw, label: "Retours faciles", sub: "30 jours" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="text-center p-3 rounded-xl bg-muted/30 border border-border/30">
                  <Icon className="h-5 w-5 mx-auto text-primary mb-1.5" />
                  <p className="text-xs font-semibold leading-tight">{label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description / Specs / Reviews tabs */}
        <div className="mt-10">
          {/* Tab navigation */}
          <div className="flex gap-1 border-b border-border">
            {([
              { key: "description" as const, label: "Description" },
              { key: "specs" as const, label: "Caractéristiques" },
              { key: "reviews" as const, label: `Avis (${reviewCount || product.reviewCount})` },
            ]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-5 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === key
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
                {activeTab === key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="py-6">
            {activeTab === "description" && (
              <div className="max-w-3xl">
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.longDescription}
                </p>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex items-center justify-between p-3.5 rounded-xl bg-muted/30 border border-border/30">
                    <span className="text-sm text-muted-foreground">{spec.label}</span>
                    <span className="text-sm font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="max-w-3xl space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold">{rating || "—"}</span>
                    <div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.round(rating || 0) ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{reviewCount} avis vérifiés</p>
                    </div>
                  </div>
                  <ReviewDialog type="product" targetId={product.id} targetName={product.name} />
                </div>

                <Separator />

                {reviews.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-10">
                    Aucun avis pour le moment. Soyez le premier à donner votre avis !
                  </p>
                )}
                {reviews.map((review) => (
                  <div key={review.id} className="py-4 border-b border-border/50 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <span className="font-medium text-sm">{review.author}</span>
                          <p className="text-xs text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Similar Products */}
        <Separator className="my-2" />
        <div className="py-6">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            Produits similaires
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {mockSimilarProducts.map((item) => (
              <div
                key={item.id}
                className="group rounded-xl overflow-hidden bg-card border border-border/50 hover:border-primary/30 transition-all cursor-pointer"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <div className="aspect-square bg-gradient-to-br from-muted/80 to-muted/30 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform">
                  🛍️
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-sm truncate">{item.name}</h4>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium">{item.rating}</span>
                    <span className="text-xs text-muted-foreground">({item.reviews})</span>
                  </div>
                  <p className="text-primary font-bold mt-1">{item.price.toFixed(2)} €</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
