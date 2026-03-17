import { useState, useEffect, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Save, ImagePlus, Package, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface ProductData {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity?: number;
  unitPrice?: number;
  quantityContent?: number;
  currency?: string;
  status?: string;
  likes?: number;
  views?: number;
  sales?: number;
}

interface CreateProductSheetProps {
  trigger?: React.ReactNode;
  product?: ProductData | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  
}

const productCategories = [
  { value: "ELECTRONICS", label: "Électronique" },
  { value: "FOOD", label: "Alimentation" },
  { value: "CLOTHING", label: "Vêtements" },
  { value: "BEAUTY", label: "Beauté" },
  { value: "HOME", label: "Maison" },
  { value: "SPORT", label: "Sport" },
  { value: "OTHER", label: "Autre" },
];

const currencies = [
  { value: "XOF", label: "XOF (FCFA)" },
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
];

const MAX_IMAGES = 10;

export function CreateProductSheet({ trigger, product, open: controlledOpen, onOpenChange }: CreateProductSheetProps) {
  const isEditMode = !!product;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("XOF");
  const [unitPrice, setUnitPrice] = useState("");
  const [quantityContent, setQuantityContent] = useState("");

  // Populate fields when editing
  useEffect(() => {
    if (product && open) {
      setName(product.name || "");
      setDescription(product.description || "");
      setCategory(product.category || "");
      setQuantity(product.quantity?.toString() || "");
      setPrice(product.price?.toString() || "");
      setCurrency(product.currency || "XOF");
      setUnitPrice(product.unitPrice?.toString() || "");
      setQuantityContent(product.quantityContent?.toString() || "");
    }
  }, [product, open]);

  // Track if anything changed (edit mode)
  const hasChanges = useMemo(() => {
    if (!product) return true; // create mode always enabled
    return (
      name !== (product.name || "") ||
      description !== (product.description || "") ||
      category !== (product.category || "") ||
      quantity !== (product.quantity?.toString() || "") ||
      price !== (product.price?.toString() || "") ||
      currency !== (product.currency || "XOF") ||
      unitPrice !== (product.unitPrice?.toString() || "") ||
      quantityContent !== (product.quantityContent?.toString() || "")
    );
  }, [name, description, category, quantity, price, currency, unitPrice, quantityContent, product]);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Le nom du produit est requis");
      return;
    }
    if (!price) {
      toast.error("Le prix est requis");
      return;
    }
    if (!category) {
      toast.error("La catégorie est requise");
      return;
    }

    const payload = {
      name,
      quantity: Number(quantity) || 0,
      price: { amount: Number(price), currency },
      category,
      description,
      images: {},
      initialQuantity: Number(quantity) || 0,
      quantityContent: Number(quantityContent) || 0,
      unitPrice: unitPrice
        ? { amount: Number(unitPrice), currency }
        : undefined,
    };

    console.log(isEditMode ? "Update product payload:" : "Create product payload:", payload);
    toast.success(isEditMode ? "Produit mis à jour avec succès !" : "Produit créé avec succès !");
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setName("");
      setDescription("");
      setCategory("");
      setQuantity("");
      setPrice("");
      setCurrency("XOF");
      setUnitPrice("");
      setQuantityContent("");
    }, 300);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent
        side="left"
        className="w-full sm:max-w-full p-0 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            {isEditMode ? "Détails du Produit" : "Nouveau Produit"}
          </h2>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={handleSave}
            disabled={isEditMode && !hasChanges}
          >
            {isEditMode ? (
              <>
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Mettre à jour</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Enregistrer</span>
              </>
            )}
          </Button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="prod-name">Nom du produit *</Label>
              <Input
                id="prod-name"
                placeholder="Ex: iPhone 15 Pro"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="prod-desc">Description</Label>
              <Textarea
                id="prod-desc"
                placeholder="Décrivez votre produit..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Catégorie *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {productCategories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prod-price">Prix *</Label>
                <div className="flex gap-2">
                  <Input
                    id="prod-price"
                    type="number"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prod-unit-price">Prix unitaire</Label>
                <Input
                  id="prod-unit-price"
                  type="number"
                  placeholder="0.00"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Quantity row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prod-qty">Quantité</Label>
                <Input
                  id="prod-qty"
                  type="number"
                  placeholder="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prod-qty-content">Contenu par unité</Label>
                <Input
                  id="prod-qty-content"
                  type="number"
                  placeholder="0"
                  value={quantityContent}
                  onChange={(e) => setQuantityContent(e.target.value)}
                />
              </div>
            </div>

            {/* Images Section */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Images du produit
                <span className="text-sm font-normal text-muted-foreground ml-2">(max {MAX_IMAGES})</span>
              </Label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {Array.from({ length: MAX_IMAGES }).map((_, i) => (
                  <button
                    key={i}
                    className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-foreground/30 flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ImagePlus className="w-5 h-5" />
                    <span className="text-[10px]">{i + 1}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>

    </Sheet>
  );
}
