import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReviews } from "@/contexts/ReviewsContext";
import { ReviewDialog } from "@/components/reviews/ReviewDialog";
import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
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
} from "lucide-react";

// ProductData type and mock data
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
  { id: "2", name: "Écouteurs Bluetooth Pro", price: 79.99, image: undefined },
  { id: "3", name: "Bracelet Sport Fit", price: 39.99, image: undefined },
  { id: "4", name: "Casque Audio Premium", price: 199.99, image: undefined },
];

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isLiked, toggleLike, getLikesCount, getReviews, getAverageRating } = useReviews();
  const [quantity, setQuantity] = useState(1);
  const [activeSlide, setActiveSlide] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

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
    { id: 5, emoji: "🔋", label: "Autonomie" },
    { id: 6, emoji: "📦", label: "Packaging" },
  ];

  const handleAddToCart = () => {
    console.log(`Added ${quantity} ${product.name} to cart`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <AppLayout>
      <div className="space-y-5">
        {/* Back */}
        <Button variant="ghost" className="gap-2 -ml-2 h-8 text-sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>

        {/* Hero: Image + Key Info side by side on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden bg-muted/30">
            <Carousel className="w-full" opts={{ loop: true }} setApi={setCarouselApi}>
              <CarouselContent>
                {productImages.map((img) => (
                  <CarouselItem key={img.id}>
                    <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-8xl md:text-9xl">
                      {img.emoji}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-3 bg-background/80 backdrop-blur-sm border-0" />
              <CarouselNext className="right-3 bg-background/80 backdrop-blur-sm border-0" />
            </Carousel>

            {product.originalPrice && product.originalPrice > product.price && (
              <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground z-10">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </Badge>
            )}

            {/* Slide indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {productImages.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === activeSlide ? "w-6 bg-primary" : "w-1.5 bg-background/60"
                  }`}
                />
              ))}
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-2 p-3 overflow-x-auto">
              {productImages.map((img, index) => (
                <button
                  key={img.id}
                  onClick={() => carouselApi?.scrollTo(index)}
                  className={`shrink-0 w-14 h-14 rounded-lg flex items-center justify-center text-2xl transition-all ${
                    index === activeSlide
                      ? "ring-2 ring-primary bg-muted"
                      : "bg-muted/40 hover:bg-muted/70"
                  }`}
                >
                  {img.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between gap-4">
            {/* Top section */}
            <div className="space-y-3">
              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">{product.name}</h1>

              {/* Business */}
              <button
                className="text-sm text-muted-foreground flex items-center gap-1.5 hover:text-foreground transition-colors"
                onClick={() => navigate(`/business/${product.businessId}`)}
              >
                <Package className="h-4 w-4" />
                {product.businessName}
              </button>

              {/* Rating inline */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-sm">{rating || "—"}</span>
                </div>
                <span className="text-xs text-muted-foreground">({reviewCount} avis)</span>
                <span className="text-muted-foreground">·</span>
                <div className="flex items-center gap-1 text-rose-500">
                  <Heart className={`h-3.5 w-3.5 ${liked ? "fill-rose-500" : ""}`} />
                  <span className="text-xs font-medium">{likesCount}</span>
                </div>
              </div>

              {/* Description courte */}
              <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Price + Actions */}
            <div className="space-y-4">
              <Separator />

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">{product.price.toFixed(2)}€</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-base text-muted-foreground line-through">
                    {product.originalPrice.toFixed(2)}€
                  </span>
                )}
              </div>

              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Package className="h-3 w-3" />
                {product.stock} en stock
              </p>

              {/* Quantity + Add to cart */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-lg">
                  <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium text-sm">{quantity}</span>
                  <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button className="flex-1 gap-2 gradient-primary text-primary-foreground h-10" onClick={handleAddToCart}>
                  <ShoppingCart className="h-4 w-4" />
                  Ajouter au panier
                </Button>
              </div>

              {/* Quick actions row */}
              <div className="flex items-center gap-2">
                <Button
                  variant={liked ? "default" : "outline"}
                  size="sm"
                  className={`flex-1 gap-1.5 ${liked ? "bg-rose-500 hover:bg-rose-600 text-white border-rose-500" : ""}`}
                  onClick={() => toggleLike("product", product.id, product.name)}
                >
                  <Heart className={`h-4 w-4 ${liked ? "fill-white" : ""}`} />
                  {liked ? "Liké" : "J'aime"}
                </Button>
                <ReviewDialog
                  type="product"
                  targetId={product.id}
                  targetName={product.name}
                  trigger={
                    <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                      <Star className="h-4 w-4" />
                      Donner un avis
                    </Button>
                  }
                />
                <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                  Partager
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: full width below */}
        <div className="rounded-2xl bg-card p-4 md:p-6 shadow-card">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 gap-0 mb-4">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none text-sm px-4"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="specs"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none text-sm px-4"
              >
                Caractéristiques
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none text-sm px-4"
              >
                Avis ({reviewCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-0">
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.longDescription}
              </p>
            </TabsContent>

            <TabsContent value="specs" className="mt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="p-3 rounded-xl bg-muted/50">
                    <p className="text-xs text-muted-foreground">{spec.label}</p>
                    <p className="font-semibold text-sm mt-0.5">{spec.value}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0 space-y-3">
              <div className="flex justify-end mb-2">
                <ReviewDialog type="product" targetId={product.id} targetName={product.name} />
              </div>
              {reviews.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">Aucun avis pour le moment. Soyez le premier !</p>
              )}
              {reviews.map((review) => (
                <div key={review.id} className="p-3 md:p-4 rounded-xl bg-muted/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium text-sm">{review.author}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Similar Products */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Produits similaires
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {mockSimilarProducts.map((item) => (
              <div
                key={item.id}
                className="rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-card transition-shadow cursor-pointer"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-4xl">
                  🛍️
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-sm truncate">{item.name}</h4>
                  <p className="text-primary font-bold">{item.price.toFixed(2)}€</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
