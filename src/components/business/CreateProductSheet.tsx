import { useState } from "react";
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
import { X, Save, ImagePlus, Package } from "lucide-react";
import { toast } from "sonner";

interface CreateProductSheetProps {
  trigger?: React.ReactNode;
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

export function CreateProductSheet({ trigger }: CreateProductSheetProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("XOF");
  const [unitPrice, setUnitPrice] = useState("");
  const [quantityContent, setQuantityContent] = useState("");

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

    console.log("Create product payload:", payload);
    toast.success("Produit créé avec succès !");
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
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="left"
        className="w-full sm:max-w-full p-0 flex flex-col"
      >
        {/* Header: X left, title center, Save right */}
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
            Nouveau Produit
          </h2>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={handleSave}
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Enregistrer</span>
          </Button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Images Section */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Images du produit</Label>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <button
                    key={i}
                    className="h-28 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ImagePlus className="w-5 h-5" />
                    <span className="text-xs">Image {i}</span>
                  </button>
                ))}
              </div>
            </div>

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
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
