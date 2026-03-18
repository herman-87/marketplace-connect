import { useState } from "react";
import { useReviews } from "@/contexts/ReviewsContext";
import { ReviewDialog } from "@/components/reviews/ReviewDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Heart,
  ShoppingCart,
  Share2,
  Star,
  Plus,
  Minus,
  User,
  MessageSquare,
  X,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface ProductPreviewDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockSpecs = [
  { label: "Catégorie", value: "Articles" },
  { label: "Vendeur", value: "Business" },
  { label: "État", value: "Neuf" },
];

const productImages = [
  { id: 1, emoji: "🛍️", label: "Vue principale" },
  { id: 2, emoji: "📦", label: "Emballage" },
  { id: 3, emoji: "✨", label: "Détails" },
];

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

export function ProductPreviewDialog({ product, open, onOpenChange }: ProductPreviewDialogProps) {
  const { isLiked, toggleLike, getLikesCount, getReviews, getAverageRating } = useReviews();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeSection, setActiveSection] = useState<"reviews" | "comments">("reviews");

  if (!product) return null;

  const liked = isLiked("product", product.id);
  const likesCount = getLikesCount("product", product.id);
  const reviews = getReviews("product", product.id);
  const { average: rating, count: reviewCount } = getAverageRating("product", product.id);

  const stock = 50; // mock
  const stockLabel = stock > 10 ? "En stock" : stock > 0 ? `Plus que ${stock} en stock` : "Rupture de stock";
  const stockColor = stock > 10 ? "text-foreground" : stock > 0 ? "text-muted-foreground" : "text-destructive";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0 gap-0 overflow-hidden">
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-50 h-8 w-8 rounded-full bg-muted/80 backdrop-blur-sm flex items-center justify-center hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <ScrollArea className="h-full">
          <div className="p-6 md:p-8 max-w-4xl mx-auto">
            {/* Preview badge */}
            <div className="mb-6">
              <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                Aperçu Marketplace
              </span>
            </div>

            {/* 2-Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {/* LEFT — Images */}
              <div className="space-y-3">
                <div className="aspect-square rounded-2xl bg-muted/20 border border-border/50 flex items-center justify-center text-8xl select-none">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    productImages[selectedImage].emoji
                  )}
                </div>
                {!product.image && (
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
                )}
              </div>

              {/* RIGHT — Product Info */}
              <div className="flex flex-col gap-5">
                <div>
                  <h1 className="text-2xl font-bold leading-tight tracking-tight">{product.name}</h1>
                  <p className="mt-1 text-sm text-muted-foreground">{product.createdBy}</p>
                </div>

                <span className="text-3xl font-bold">{product.price.toFixed(2)} €</span>

                {/* Rating + Stock */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Stars rating={rating || 4.5} size={14} />
                    <span className="font-medium">{rating || "4.5"}</span>
                    <span className="text-muted-foreground">({reviewCount || 0})</span>
                  </div>
                  <span className="text-border">|</span>
                  <span className={`font-medium ${stockColor}`}>{stockLabel}</span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

                {/* Quantity + Add to Cart */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center text-sm font-semibold tabular-nums">{quantity}</span>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none" onClick={() => setQuantity(quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button className="flex-1 h-10 gap-2 text-sm font-semibold" disabled>
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
                  <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Share2 className="h-4 w-4" />
                    <span>Partager</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="mt-10 space-y-8">
              {/* Specs */}
              <div>
                <h2 className="text-base font-semibold mb-3">Caractéristiques</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-2.5 max-w-2xl">
                  {mockSpecs.map((spec) => (
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
                    Avis ({reviewCount})
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
                      <p className="text-sm text-muted-foreground text-center py-12">Aucun avis pour le moment.</p>
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
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
