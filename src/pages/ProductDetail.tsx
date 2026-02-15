import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Eye,
  Share2,
  Edit,
  Trash2,
  Send,
  Archive,
  Star,
  Package,
  Clock,
  User,
  MessageSquare,
  TrendingUp,
  Plus,
  Minus,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

// Mock product data
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

const mockReviews = [
  { id: "1", author: "Marie L.", rating: 5, comment: "Excellente montre, l'autonomie est vraiment impressionnante !", date: "Il y a 2 jours" },
  { id: "2", author: "Pierre D.", rating: 4, comment: "Très bon produit, le GPS est précis. Je recommande !", date: "Il y a 5 jours" },
  { id: "3", author: "Sophie M.", rating: 5, comment: "Design élégant et fonctionnalités top, parfait pour le sport.", date: "Il y a 1 semaine" },
];

const mockSimilarProducts = [
  { id: "2", name: "Écouteurs Bluetooth Pro", price: 79.99, image: undefined },
  { id: "3", name: "Bracelet Sport Fit", price: 39.99, image: undefined },
  { id: "4", name: "Casque Audio Premium", price: 199.99, image: undefined },
];

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

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

  const product = mockProduct;
  const isOwner = true;

  const statusConfig = {
    draft: { label: "Brouillon", variant: "secondary" as const, color: "text-muted-foreground" },
    published: { label: "Publié", variant: "default" as const, color: "text-success" },
    removed: { label: "Retiré", variant: "outline" as const, color: "text-destructive" },
  };

  const status = statusConfig[product.status];

  const handleAddToCart = () => {
    console.log(`Added ${quantity} ${product.name} to cart`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="gap-2 -ml-2 h-8 text-sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column - Image & Gallery */}
          <div className="lg:col-span-1 space-y-3 md:space-y-4">
            <Card className="border-0 shadow-card overflow-hidden">
              <div className="relative">
                <Carousel className="w-full" opts={{ loop: true }} setApi={setCarouselApi}>
                  <CarouselContent>
                    {productImages.map((img, index) => (
                      <CarouselItem key={img.id}>
                        <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50">
                          <div className="w-full h-full flex items-center justify-center text-8xl">
                            {img.emoji}
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-3 bg-background/80 backdrop-blur-sm border-0" />
                  <CarouselNext className="right-3 bg-background/80 backdrop-blur-sm border-0" />
                </Carousel>

                {/* Discount Badge */}
                {product.originalPrice && product.originalPrice > product.price && (
                  <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground z-10">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </Badge>
                )}

                {/* Like Button */}
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm z-10"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                </Button>

                {/* Slide indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {productImages.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all ${
                        index === activeSlide
                          ? "w-6 bg-primary"
                          : "w-1.5 bg-background/60"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Stats Card */}
            <Card className="border-0 shadow-card">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-rose-500">
                      <Heart className="h-4 w-4" />
                      <span className="font-bold">{product.likes}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Likes</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span className="font-bold">{product.views}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Vues</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-success">
                      <ShoppingCart className="h-4 w-4" />
                      <span className="font-bold">{product.sales}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Ventes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Product Info */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Header Card */}
            <Card className="border-0 shadow-card">
              <CardContent className="p-4 md:p-6">
                {/* Status & Category */}
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <Badge variant={status.variant}>{status.label}</Badge>
                  <Badge variant="outline">🛍️ Article</Badge>
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>

                {/* Title & Business */}
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">{product.name}</h1>
                <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  {product.businessName}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span className="font-bold">{product.rating}</span>
                  </div>
                  <span className="text-muted-foreground">
                    ({product.reviewCount} avis)
                  </span>
                </div>

                <Separator className="my-4 md:my-6" />

                {/* Price & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl md:text-3xl font-bold text-primary">{product.price.toFixed(2)}€</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-lg text-muted-foreground line-through">
                          {product.originalPrice.toFixed(2)}€
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {product.stock} en stock
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 border rounded-lg p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button 
                      className="gap-2 gradient-primary text-primary-foreground w-full sm:w-auto"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Ajouter au panier
                    </Button>
                  </div>
                </div>

                {/* Owner Actions */}
                {isOwner && (
                  <>
                    <Separator className="my-4 md:my-6" />
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button variant="outline" className="gap-2 text-xs md:text-sm h-8 md:h-9">
                        <Edit className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        Modifier
                      </Button>
                      {product.status === "draft" && (
                        <Button variant="outline" className="gap-2 text-xs md:text-sm h-8 md:h-9">
                          <Send className="h-3.5 w-3.5 md:h-4 md:w-4" />
                          Publier
                        </Button>
                      )}
                      {product.status !== "draft" && product.status === "published" && (
                        <Button variant="outline" className="gap-2 text-xs md:text-sm h-8 md:h-9">
                          <Archive className="h-3.5 w-3.5 md:h-4 md:w-4" />
                          Retirer
                        </Button>
                      )}
                      {product.status === "removed" && (
                        <Button variant="outline" className="gap-2 text-xs md:text-sm h-8 md:h-9">
                          <Send className="h-3.5 w-3.5 md:h-4 md:w-4" />
                          Republier
                        </Button>
                      )}
                      <Button variant="outline" className="gap-2 text-xs md:text-sm h-8 md:h-9" onClick={handleShare}>
                        <Share2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        <span className="hidden sm:inline">Partager</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="gap-2 text-xs md:text-sm h-8 md:h-9">
                            <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            <span className="hidden sm:inline">Supprimer</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer ce produit ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action est irréversible. Le produit sera définitivement supprimé.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive text-destructive-foreground">
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Tabs for Details */}
            <Card className="border-0 shadow-card">
              <Tabs defaultValue="description" className="w-full">
                <CardHeader className="pb-0 px-3 md:px-6">
                  <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 gap-0">
                    <TabsTrigger 
                      value="description" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none text-xs md:text-sm px-2 md:px-4"
                    >
                      Description
                    </TabsTrigger>
                    <TabsTrigger 
                      value="specs" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none text-xs md:text-sm px-2 md:px-4"
                    >
                      Specs
                    </TabsTrigger>
                    <TabsTrigger 
                      value="reviews" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none text-xs md:text-sm px-2 md:px-4"
                    >
                      Avis ({product.reviewCount})
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent className="pt-4 md:pt-6 px-3 md:px-6">
                  <TabsContent value="description" className="mt-0 space-y-3 md:space-y-4">
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{product.description}</p>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                      {product.longDescription}
                    </p>
                  </TabsContent>

                  <TabsContent value="specs" className="mt-0 space-y-3 md:space-y-4">
                    <div className="grid grid-cols-2 gap-2 md:gap-3">
                      {product.specs.map((spec) => (
                        <div key={spec.label} className="p-2.5 md:p-3 rounded-lg bg-muted/50">
                          <p className="text-[10px] md:text-xs text-muted-foreground">{spec.label}</p>
                          <p className="font-semibold text-sm md:text-base mt-0.5">{spec.value}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews" className="mt-0 space-y-3 md:space-y-4">
                    {mockReviews.map((review) => (
                      <div key={review.id} className="p-3 md:p-4 rounded-lg bg-muted/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                            </div>
                            <span className="font-medium text-sm">{review.author}</span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 md:h-4 md:w-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                        <p className="text-xs text-muted-foreground">{review.date}</p>
                      </div>
                    ))}
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </div>

        {/* Similar Products */}
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Produits similaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {mockSimilarProducts.map((item) => (
                <Card 
                  key={item.id} 
                  className="border-0 shadow-sm hover:shadow-card transition-shadow cursor-pointer"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-4xl">
                    🛍️
                  </div>
                  <CardContent className="p-2 md:p-3">
                    <h4 className="font-medium text-xs md:text-sm truncate">{item.name}</h4>
                    <p className="text-primary font-bold text-sm md:text-base">{item.price.toFixed(2)}€</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Meta Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs md:text-sm text-muted-foreground">
          <div className="flex items-center gap-3 md:gap-4 flex-wrap">
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5 md:h-4 md:w-4" />
              {product.createdBy}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 md:h-4 md:w-4" />
              {product.createdAt}
            </span>
          </div>
          <span className="text-xs">ID: {productId}</span>
        </div>
      </div>
    </AppLayout>
  );
}
