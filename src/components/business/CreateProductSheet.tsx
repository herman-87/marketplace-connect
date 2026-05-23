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
import { X, Save, ImagePlus, Package, RefreshCw, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Specification {
  key: string;
  value: string;
}

interface ProductData {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity?: number;
  currency?: string;
  status?: string;
  likes?: number;
  views?: number;
  sales?: number;
  specifications?: Specification[];
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
  const [specifications, setSpecifications] = useState<Specification[]>([]);

  // Populate fields when editing
  useEffect(() => {
    if (product && open) {
      setName(product.name || "");
      setDescription(product.description || "");
      setCategory(product.category || "");
      setQuantity(product.quantity?.toString() || "");
      setPrice(product.price?.toString() || "");
      setCurrency(product.currency || "XOF");
      setSpecifications(product.specifications || []);
    }
  }, [product, open]);

  // Track if anything changed (edit mode)
  const hasChanges = useMemo(() => {
    if (!product) return true;
    return (
      name !== (product.name || "") ||
      description !== (product.description || "") ||
      category !== (product.category || "") ||
      quantity !== (product.quantity?.toString() || "") ||
      price !== (product.price?.toString() || "") ||
      currency !== (product.currency || "XOF") ||
      JSON.stringify(specifications) !== JSON.stringify(product.specifications || [])
    );
  }, [name, description, category, quantity, price, currency, specifications, product]);

  const addSpecification = () => {
    setSpecifications((prev) => [...prev, { key: "", value: "" }]);
  };

  const updateSpecification = (index: number, field: "key" | "value", value: string) => {
    setSpecifications((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const removeSpecification = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

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

    const cleanedSpecs = specifications.filter(
      (s) => s.key.trim() && s.value.trim()
    );

    const payload = {
      name,
      quantity: Number(quantity) || 0,
      price: { amount: Number(price), currency },
      category,
      description,
      images: {},
      initialQuantity: Number(quantity) || 0,
      specifications: cleanedSpecs,
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
      setSpecifications([]);
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

            {/* Price */}
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

            {/* Quantity */}
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

            {/* Specifications */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Spécifications</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSpecification}
                  className="gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter
                </Button>
              </div>
              {specifications.length === 0 ? (
                <p className="text-sm text-muted-foreground border border-dashed border-border rounded-lg px-4 py-6 text-center">
                  Aucune spécification. Ajoutez par exemple : Taille → XXL, Couleur → Noir.
                </p>
              ) : (
                <div className="space-y-2">
                  {specifications.map((spec, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <Input
                        placeholder="Nom (ex: Taille)"
                        value={spec.key}
                        onChange={(e) => updateSpecification(i, "key", e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Valeur (ex: XXL)"
                        value={spec.value}
                        onChange={(e) => updateSpecification(i, "value", e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSpecification(i)}
                        className="shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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
