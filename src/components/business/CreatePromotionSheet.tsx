import { useState, useEffect, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Save, Percent, RefreshCw, Trash2, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { mockProducts } from "@/data/businessMockData";
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

interface PromotionData {
  id?: string;
  productId: string;
  productName: string;
  productPrice: number;
  discountPercent: number;
  discountPrice: number;
  startDate: string;
  endDate: string;
  status?: "active" | "expired" | "scheduled";
}

interface CreatePromotionSheetProps {
  trigger?: React.ReactNode;
  promotion?: PromotionData | null;
  preselectedProductId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onDelete?: (id: string) => void;
}

export function CreatePromotionSheet({
  trigger,
  promotion,
  preselectedProductId,
  open: controlledOpen,
  onOpenChange,
  onDelete,
}: CreatePromotionSheetProps) {
  const isEditMode = !!promotion;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const [productId, setProductId] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const publishedProducts = mockProducts.filter(p => p.status === "published");
  const selectedProduct = publishedProducts.find(p => p.id === productId);
  const calculatedPrice = selectedProduct && discountPercent
    ? Math.round(selectedProduct.price * (1 - Number(discountPercent) / 100) * 100) / 100
    : null;

  const handlePercentChange = (value: string) => {
    setDiscountPercent(value);
    if (selectedProduct && value && Number(value) > 0 && Number(value) < 100) {
      const amount = Math.round(selectedProduct.price * Number(value) / 100 * 100) / 100;
      setDiscountAmount(amount.toString());
    } else {
      setDiscountAmount("");
    }
  };

  const handleAmountChange = (value: string) => {
    setDiscountAmount(value);
    if (selectedProduct && value && Number(value) > 0 && Number(value) < selectedProduct.price) {
      const percent = Math.round(Number(value) / selectedProduct.price * 100 * 100) / 100;
      setDiscountPercent(percent.toString());
    } else {
      setDiscountPercent("");
    }
  };

  useEffect(() => {
    if (open) {
      if (promotion) {
        setProductId(promotion.productId);
        setDiscountPercent(promotion.discountPercent.toString());
        const amt = Math.round(promotion.productPrice * promotion.discountPercent / 100 * 100) / 100;
        setDiscountAmount(amt.toString());
        setStartDate(promotion.startDate);
        setEndDate(promotion.endDate);
      } else if (preselectedProductId) {
        setProductId(preselectedProductId);
        setDiscountPercent("");
        setDiscountAmount("");
        setStartDate(new Date().toISOString().split("T")[0]);
        setEndDate("");
      }
    }
  }, [promotion, preselectedProductId, open]);

  const hasChanges = useMemo(() => {
    if (!promotion) return true;
    return (
      productId !== promotion.productId ||
      discountPercent !== promotion.discountPercent.toString() ||
      startDate !== promotion.startDate ||
      endDate !== promotion.endDate
    );
  }, [productId, discountPercent, startDate, endDate, promotion]);

  const handleSave = () => {
    if (!productId) { toast.error("Sélectionnez un produit"); return; }
    if (!discountPercent || Number(discountPercent) <= 0 || Number(discountPercent) >= 100) {
      toast.error("La réduction doit être entre 1% et 99%"); return;
    }
    if (!startDate) { toast.error("La date de début est requise"); return; }
    if (!endDate) { toast.error("La date de fin est requise"); return; }
    if (new Date(endDate) <= new Date(startDate)) {
      toast.error("La date de fin doit être après la date de début"); return;
    }

    console.log(isEditMode ? "Update promotion:" : "Create promotion:", {
      productId,
      discountPercent: Number(discountPercent),
      discountPrice: calculatedPrice,
      startDate,
      endDate,
    });
    toast.success(isEditMode ? "Promotion mise à jour !" : "Promotion créée !");
    handleClose();
  };

  const handleDelete = () => {
    if (promotion?.id) {
      onDelete?.(promotion.id);
      toast.success("Promotion supprimée");
      handleClose();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setProductId("");
      setDiscountPercent("");
      setDiscountAmount("");
      setStartDate("");
      setEndDate("");
    }, 300);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent side="left" className="w-full sm:max-w-full p-0 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border shrink-0">
          <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Percent className="w-5 h-5 text-primary" />
            {isEditMode ? "Détails Promotion" : "Nouvelle Promotion"}
          </h2>
          <Button size="sm" className="gap-1.5" onClick={handleSave} disabled={isEditMode && !hasChanges}>
            {isEditMode ? (
              <><RefreshCw className="w-4 h-4" /><span className="hidden sm:inline">Mettre à jour</span></>
            ) : (
              <><Save className="w-4 h-4" /><span className="hidden sm:inline">Créer</span></>
            )}
          </Button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Product selection */}
            <div className="space-y-2">
              <Label>Produit *</Label>
              {preselectedProductId && !isEditMode ? (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                  <span className="text-2xl">🛍️</span>
                  <div>
                    <p className="font-medium text-sm">{selectedProduct?.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedProduct?.price} €</p>
                  </div>
                </div>
              ) : (
                <Select value={productId} onValueChange={setProductId} disabled={isEditMode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un produit publié" />
                  </SelectTrigger>
                  <SelectContent>
                    {publishedProducts.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} — {p.price} €
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Discount */}
            <div className="space-y-2">
              <Label>Réduction *</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="discount-percent" className="text-xs text-muted-foreground font-normal">Pourcentage</Label>
                  <div className="relative">
                    <Input
                      id="discount-percent"
                      type="number"
                      min={1}
                      max={99}
                      placeholder="Ex: 25"
                      value={discountPercent}
                      onChange={(e) => handlePercentChange(e.target.value)}
                      className="pr-8"
                      disabled={!selectedProduct}
                    />
                    <Percent className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="discount-amount" className="text-xs text-muted-foreground font-normal">Montant</Label>
                  <div className="relative">
                    <Input
                      id="discount-amount"
                      type="number"
                      min={0.01}
                      max={selectedProduct ? selectedProduct.price - 0.01 : 99999}
                      step="0.01"
                      placeholder="Ex: 12.50"
                      value={discountAmount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className="pr-8"
                      disabled={!selectedProduct}
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">€</span>
                  </div>
                </div>
              </div>
              {!selectedProduct && (
                <p className="text-xs text-muted-foreground">Sélectionnez un produit pour activer les champs</p>
              )}
            </div>

            {/* Price preview */}
            {selectedProduct && calculatedPrice !== null && (
              <div className="rounded-lg bg-muted/50 border border-border p-4 space-y-1">
                <p className="text-xs text-muted-foreground">Aperçu du prix</p>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-foreground">{calculatedPrice.toFixed(2)} €</span>
                  <span className="text-sm text-muted-foreground line-through">{selectedProduct.price} €</span>
                  <span className="text-xs font-semibold text-foreground bg-muted px-2 py-0.5 rounded-full">
                    -{discountPercent}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    (-{discountAmount} €)
                  </span>
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Date de début *</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">Date de fin *</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Delete button in edit mode */}
            {isEditMode && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4" />
                    Supprimer cette promotion
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer la promotion ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Le produit reviendra à son prix normal. Cette action est irréversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
