import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReviews } from "@/contexts/ReviewsContext";
import { ReviewDialog } from "@/components/reviews/ReviewDialog";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Share2,
  Star,
  Plus,
  Minus,
  User,
  ChevronRight,
  MessageSquare,
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
  specs: { label: string; value: string }[];
}

const mockProduct: ProductData = {
  id: "1",
  name: "Montre Connectée Pro X",
  description: "Montre connectée haut de gamme avec suivi santé avancé, GPS intégré et 7 jours d'autonomie.",
  longDescription: `La Montre Connectée Pro X redéfinit l'expérience des wearables. Son écran AMOLED de 1.4 pouces offre une lisibilité parfaite en toutes conditions.

Capteurs avancés pour un suivi santé complet : fréquence cardiaque, SpO2, qualité du sommeil et stress. GPS intégré pour un suivi précis sans smartphone.

7 jours d'autonomie en usage normal. Résistance à l'eau 5ATM.`,
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
  { id: "5", name: "Chargeur Sans Fil Rapide", price: 29.99, image: undefined },
];

const productImages = [
  { id: 1, emoji: "⌚", label: "Vue principale" },
  { id: 2, emoji: "📱", label: "Avec smartphone" },
  { id: 3, emoji: "🏃", label: "Sport" },
  { id: 4, emoji: "💡", label: "Fonctionnalités" },
];

/* ─── Star Row (reusable) ─── */
function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={i < Math.round(rating) ? "fill-foreground text-foreground" : "text-border"}
        />
      ))}
    </div>
  );
}

/* ─── Review Item ─── */
function ReviewItem({ review }: { review: { id: string; author: string; rating: number; comment: string; date: string } }) {
  return (
    <div className="py-5 border-b border-border/50 last:border-0">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div>
            <span className="text-sm font-medium">{review.author}</span>
            <p className="text-xs text-muted-foreground">{review.date}</p>
          </div>
        </div>
        <Stars rating={review.rating} size={12} />
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed pl-[42px]">{review.comment}</p>
    </div>
  );
}

/* ─── Similar Product Card ─── */
function SimilarProductCard({ item, onClick }: { item: typeof mockSimilarProducts[0]; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-xl overflow-hidden bg-card border border-border/50 hover:border-foreground/30 transition-colors"
    >
      <div className="aspect-square bg-muted/30 flex items-center justify-center text-4xl">
        🛍️
      </div>
      <div className="p-3 space-y-1">
        <h4 className="text-sm font-medium truncate">{item.name}</h4>
        <p className="text-sm font-semibold">{item.price.toFixed(2)} €</p>
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════ */
export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isLiked, toggleLike, getLikesCount, getReviews, getAverageRating } = useReviews();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeSection, setActiveSection] = useState<"reviews" | "comments">("reviews");

  const product = mockProduct;
  const liked = isLiked("product", product.id);
  const likesCount = getLikesCount("product", product.id);
  const reviews = getReviews("product", product.id);
  const { average: rating, count: reviewCount } = getAverageRating("product", product.id);

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    console.log(`Added ${quantity} ${product.name} to cart`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const stockLabel = product.stock > 10
    ? "En stock"
    : product.stock > 0
      ? `Plus que ${product.stock} en stock`
      : "Rupture de stock";

  const stockColor = product.stock > 10
    ? "text-foreground"
    : product.stock > 0
      ? "text-muted-foreground"
      : "text-destructive";

  return (
    <AppLayout>
      <div className="animate-fade-in max-w-5xl mx-auto">
        {/* Back nav */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>

        {/* ─── 2-Column Layout ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

          {/* LEFT — Images */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="aspect-square rounded-2xl bg-muted/20 border border-border/50 flex items-center justify-center text-8xl select-none relative overflow-hidden">
              {productImages[selectedImage].emoji}
              {discount > 0 && (
                <span className="absolute top-4 left-4 text-xs font-semibold bg-foreground text-background px-2.5 py-1 rounded-full">
                  -{discount}%
                </span>
              )}
            </div>
            {/* Thumbnails */}
            <div className="flex gap-2">
              {productImages.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-1 aspect-square rounded-xl flex items-center justify-center text-2xl transition-all border-2 ${
                    i === selectedImage
                      ? "border-foreground bg-muted/40"
                      : "border-transparent bg-muted/20 hover:bg-muted/40"
                  }`}
                >
                  {img.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT — Product Info */}
          <div className="flex flex-col gap-6">
            {/* Name */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight">
                {product.name}
              </h1>
              <button
                className="mt-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                onClick={() => navigate(`/business/${product.businessId}`)}
              >
                {product.businessName}
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">{product.price.toFixed(2)} €</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-base text-muted-foreground line-through">
                  {product.originalPrice.toFixed(2)} €
                </span>
              )}
            </div>

            {/* Rating + Stock */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Stars rating={rating || product.rating} size={14} />
                <span className="font-medium">{rating || product.rating}</span>
                <span className="text-muted-foreground">({reviewCount || product.reviewCount})</span>
              </div>
              <span className="text-border">|</span>
              <span className={`font-medium ${stockColor}`}>{stockLabel}</span>
            </div>

            {/* Short description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center text-sm font-semibold tabular-nums">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                className="flex-1 h-10 gap-2 text-sm font-semibold"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4" />
                Ajouter au panier
              </Button>
            </div>

            {/* Interaction bar */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => toggleLike("product", product.id, product.name)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Heart className={`h-4 w-4 ${liked ? "fill-foreground text-foreground" : ""}`} />
                <span>{likesCount}</span>
              </button>
              <span className="text-border">·</span>
              <ReviewDialog
                type="product"
                targetId={product.id}
                targetName={product.name}
                trigger={
                  <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Star className="h-4 w-4" />
                    <span>Donner un avis</span>
                  </button>
                }
              />
              <span className="text-border">·</span>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>Partager</span>
              </button>
            </div>
          </div>
        </div>

        {/* ─── Details Section ─── */}
        <div className="mt-12 space-y-8">
          {/* Description */}
          <div>
            <h2 className="text-base font-semibold mb-3">Description</h2>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line max-w-2xl">
              {product.longDescription}
            </p>
          </div>

          {/* Specs */}
          <div>
            <h2 className="text-base font-semibold mb-3">Caractéristiques</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-2.5 max-w-2xl">
              {product.specs.map((spec) => (
                <div key={spec.label} className="flex justify-between py-1.5 border-b border-border/40 text-sm">
                  <span className="text-muted-foreground">{spec.label}</span>
                  <span className="font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews & Comments */}
          <div>
            <div className="flex items-center gap-6 mb-4">
              <button
                onClick={() => setActiveSection("reviews")}
                className={`text-base font-semibold pb-1 border-b-2 transition-colors ${
                  activeSection === "reviews"
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Avis ({reviewCount || product.reviewCount})
              </button>
              <button
                onClick={() => setActiveSection("comments")}
                className={`text-base font-semibold pb-1 border-b-2 transition-colors ${
                  activeSection === "comments"
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Commentaires
              </button>
            </div>

            {activeSection === "reviews" && (
              <div className="max-w-2xl">
                {/* Summary */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl font-bold tabular-nums">{rating || "—"}</span>
                  <div>
                    <Stars rating={rating || 0} size={16} />
                    <p className="text-xs text-muted-foreground mt-1">{reviewCount} avis</p>
                  </div>
                  <div className="ml-auto">
                    <ReviewDialog type="product" targetId={product.id} targetName={product.name} />
                  </div>
                </div>

                <Separator className="mb-1" />

                {reviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-12">
                    Aucun avis pour le moment.
                  </p>
                ) : (
                  reviews.map((review) => <ReviewItem key={review.id} review={review} />)
                )}
              </div>
            )}

            {activeSection === "comments" && (
              <div className="max-w-2xl">
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mb-2" />
                  <p className="text-sm">Les commentaires arrivent bientôt.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Similar Products ─── */}
        <Separator className="my-8" />
        <div className="pb-8">
          <h2 className="text-base font-semibold mb-4">Produits similaires</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {mockSimilarProducts.map((item) => (
              <SimilarProductCard
                key={item.id}
                item={item}
                onClick={() => navigate(`/product/${item.id}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
