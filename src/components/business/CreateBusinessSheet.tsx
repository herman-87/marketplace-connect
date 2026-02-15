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
import { Switch } from "@/components/ui/switch";
import { X, Save, Plus, Trash2, ImagePlus, Store } from "lucide-react";
import { toast } from "sonner";

interface PhoneEntry {
  usage: string;
  number: string;
  countryCode: string;
}

interface CreateBusinessSheetProps {
  trigger?: React.ReactNode;
}

const businessCategories = [
  { value: "shop", label: "Boutique" },
  { value: "fashion", label: "Mode" },
  { value: "tech", label: "High-Tech" },
  { value: "service", label: "Service" },
  { value: "artisan", label: "Artisan" },
];

const businessTypes = [
  { value: "individual", label: "Individuel" },
  { value: "company", label: "Entreprise" },
  { value: "association", label: "Association" },
];

const phoneUsages = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "call", label: "Appel" },
  { value: "sms", label: "SMS" },
];

export function CreateBusinessSheet({ trigger }: CreateBusinessSheetProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [active, setActive] = useState(true);
  const [phones, setPhones] = useState<PhoneEntry[]>([
    { usage: "whatsapp", number: "", countryCode: "+225" },
  ]);

  const addPhone = () => {
    setPhones([...phones, { usage: "call", number: "", countryCode: "+225" }]);
  };

  const removePhone = (index: number) => {
    setPhones(phones.filter((_, i) => i !== index));
  };

  const updatePhone = (index: number, field: keyof PhoneEntry, value: string) => {
    const updated = [...phones];
    updated[index] = { ...updated[index], [field]: value };
    setPhones(updated);
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Le nom du business est requis");
      return;
    }
    if (!category) {
      toast.error("La catégorie est requise");
      return;
    }

    const payload = {
      name,
      description,
      address,
      phones: phones.map((p) => ({
        usage: p.usage,
        number: { number: p.number, countryCode: p.countryCode },
      })),
      email,
      type,
      active,
      images: { logo: null, banner: null },
      category,
    };

    console.log("Create business payload:", payload);
    toast.success("Business créé avec succès !");
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setName("");
      setDescription("");
      setAddress("");
      setEmail("");
      setType("");
      setCategory("");
      setActive(true);
      setPhones([{ usage: "whatsapp", number: "", countryCode: "+225" }]);
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
            <Store className="w-5 h-5 text-primary" />
            Nouveau Business
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
              <Label className="text-base font-semibold">Images</Label>
              <div className="grid grid-cols-2 gap-4">
                <button className="h-32 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <ImagePlus className="w-6 h-6" />
                  <span className="text-xs font-medium">Logo</span>
                </button>
                <button className="h-32 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <ImagePlus className="w-6 h-6" />
                  <span className="text-xs font-medium">Bannière</span>
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="biz-name">Nom du business *</Label>
              <Input
                id="biz-name"
                placeholder="Ex: Ma Boutique"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="biz-desc">Description</Label>
              <Textarea
                id="biz-desc"
                placeholder="Décrivez votre business..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Category & Type row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Catégorie *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessCategories.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="biz-address">Adresse</Label>
              <Input
                id="biz-address"
                placeholder="Ex: Abidjan, Cocody"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="biz-email">Email</Label>
              <Input
                id="biz-email"
                type="email"
                placeholder="contact@monbusiness.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Phones */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Téléphones</Label>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs"
                  onClick={addPhone}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Ajouter
                </Button>
              </div>
              <div className="space-y-3">
                {phones.map((phone, index) => (
                  <div
                    key={index}
                    className="flex items-end gap-2 p-3 rounded-lg border border-border/60 bg-card"
                  >
                    <div className="space-y-1 w-24 shrink-0">
                      <Label className="text-xs">Usage</Label>
                      <Select
                        value={phone.usage}
                        onValueChange={(v) => updatePhone(index, "usage", v)}
                      >
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {phoneUsages.map((u) => (
                            <SelectItem key={u.value} value={u.value}>
                              {u.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1 w-20 shrink-0">
                      <Label className="text-xs">Code</Label>
                      <Input
                        className="h-9 text-xs"
                        value={phone.countryCode}
                        onChange={(e) =>
                          updatePhone(index, "countryCode", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1 flex-1">
                      <Label className="text-xs">Numéro</Label>
                      <Input
                        className="h-9"
                        placeholder="07 00 00 00 00"
                        value={phone.number}
                        onChange={(e) =>
                          updatePhone(index, "number", e.target.value)
                        }
                      />
                    </div>
                    {phones.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-destructive shrink-0"
                        onClick={() => removePhone(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Active toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-border/60 bg-card">
              <div>
                <p className="font-medium text-sm">Activer le business</p>
                <p className="text-xs text-muted-foreground">
                  Rendre le business visible sur la marketplace
                </p>
              </div>
              <Switch checked={active} onCheckedChange={setActive} />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
