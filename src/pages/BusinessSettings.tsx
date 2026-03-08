import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Upload, Image as ImageIcon, Coins, Save, Trash2, Store, MapPin, Phone, Mail, Tag, Power, Plus, X } from "lucide-react";
import { BusinessMobileNav } from "@/components/business/BusinessMobileNav";
import { toast } from "sonner";

const currencies = [
  { code: "XOF", name: "Franc CFA (BCEAO)", symbol: "CFA" },
  { code: "XAF", name: "Franc CFA (BEAC)", symbol: "FCFA" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "USD", name: "Dollar américain", symbol: "$" },
  { code: "GBP", name: "Livre sterling", symbol: "£" },
  { code: "MAD", name: "Dirham marocain", symbol: "DH" },
  { code: "TND", name: "Dinar tunisien", symbol: "DT" },
  { code: "NGN", name: "Naira nigérian", symbol: "₦" },
  { code: "GHS", name: "Cedi ghanéen", symbol: "₵" },
  { code: "KES", name: "Shilling kényan", symbol: "KSh" },
];

const businessTypes = [
  { id: "retail", name: "Commerce de détail" },
  { id: "wholesale", name: "Commerce de gros" },
  { id: "service", name: "Prestation de services" },
  { id: "food", name: "Restauration / Alimentation" },
  { id: "fashion", name: "Mode & Habillement" },
  { id: "tech", name: "Technologie & Électronique" },
  { id: "beauty", name: "Beauté & Cosmétique" },
  { id: "other", name: "Autre" },
];

const countryCodes = [
  { code: "+225", country: "CI" },
  { code: "+33", country: "FR" },
  { code: "+1", country: "US" },
  { code: "+44", country: "GB" },
  { code: "+221", country: "SN" },
  { code: "+223", country: "ML" },
  { code: "+226", country: "BF" },
  { code: "+228", country: "TG" },
  { code: "+229", country: "BJ" },
  { code: "+234", country: "NG" },
  { code: "+212", country: "MA" },
];

interface PhoneEntry {
  number: string;
  countryCode: string;
  label: string;
}

export default function BusinessSettings() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [businessName, setBusinessName] = useState("Ma Boutique");
  const [businessDescription, setBusinessDescription] = useState("Une boutique en ligne proposant des produits variés et de qualité.");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [businessType, setBusinessType] = useState("retail");
  const [isActive, setIsActive] = useState(true);
  const [phones, setPhones] = useState<PhoneEntry[]>([
    { number: "", countryCode: "+225", label: "Principal" }
  ]);
  const [logo, setLogo] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [currency, setCurrency] = useState("XOF");
  const [isSaving, setIsSaving] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBanner(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addPhone = () => {
    if (phones.length < 5) {
      setPhones([...phones, { number: "", countryCode: "+225", label: `Ligne ${phones.length + 1}` }]);
    }
  };

  const removePhone = (index: number) => {
    if (phones.length > 1) {
      setPhones(phones.filter((_, i) => i !== index));
    }
  };

  const updatePhone = (index: number, field: keyof PhoneEntry, value: string) => {
    const updated = [...phones];
    updated[index] = { ...updated[index], [field]: value };
    setPhones(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success("Paramètres enregistrés avec succès !");
  };

  const selectedCurrency = currencies.find(c => c.code === currency);

  return (
    <AppLayout>
      <div className="space-y-6">
        <BusinessMobileNav />
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(`/business/${id}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Paramètres du business</h1>
            <p className="text-muted-foreground">Personnalisez l'apparence et les préférences de votre boutique</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Business Info Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Store className="h-5 w-5 text-primary" />
                </div>
                Informations générales
              </CardTitle>
              <CardDescription>
                Les informations de base de votre boutique visibles par vos clients.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Nom du business</Label>
                  <Input 
                    id="business-name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value.slice(0, 100))}
                    placeholder="Nom de votre boutique"
                    maxLength={100}
                  />
                  <p className="text-xs text-muted-foreground">{businessName.length}/100</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-type">Type de business</Label>
                  <Select value={businessType} onValueChange={setBusinessType}>
                    <SelectTrigger id="business-type">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-description">Description</Label>
                <Textarea
                  id="business-description"
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value.slice(0, 500))}
                  placeholder="Décrivez votre boutique en quelques mots..."
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">{businessDescription.length}/500 caractères</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                Coordonnées
              </CardTitle>
              <CardDescription>
                Adresse, email et numéros de téléphone pour que vos clients puissent vous joindre.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email & Address */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="business-email" className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    Email
                  </Label>
                  <Input 
                    id="business-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@maboutique.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-address" className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    Adresse
                  </Label>
                  <Input 
                    id="business-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Rue du Commerce, Abidjan"
                  />
                </div>
              </div>

              {/* Phones */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    Téléphones
                  </Label>
                  {phones.length < 5 && (
                    <Button variant="ghost" size="sm" onClick={addPhone} className="gap-1.5 text-primary h-8">
                      <Plus className="h-3.5 w-3.5" />
                      Ajouter
                    </Button>
                  )}
                </div>
                <div className="space-y-3">
                  {phones.map((phone, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={phone.label}
                        onChange={(e) => updatePhone(index, "label", e.target.value)}
                        className="w-24 sm:w-28 text-xs"
                        placeholder="Label"
                      />
                      <Select
                        value={phone.countryCode}
                        onValueChange={(val) => updatePhone(index, "countryCode", val)}
                      >
                        <SelectTrigger className="w-24 sm:w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {countryCodes.map((cc) => (
                            <SelectItem key={cc.code} value={cc.code}>
                              {cc.country} {cc.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        value={phone.number}
                        onChange={(e) => updatePhone(index, "number", e.target.value)}
                        placeholder="07 00 00 00 00"
                        className="flex-1"
                      />
                      {phones.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                          onClick={() => removePhone(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logo Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ImageIcon className="h-5 w-5 text-primary" />
                </div>
                Logo de la boutique
              </CardTitle>
              <CardDescription>
                Votre logo apparaîtra sur votre profil et dans les recherches. Format recommandé : carré, min 200x200px.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 border-2 border-dashed border-border">
                  <AvatarImage src={logo || undefined} />
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    <ImageIcon className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="logo-upload" className="cursor-pointer">
                    <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Choisir une image</span>
                    </div>
                  </Label>
                  <Input 
                    id="logo-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleLogoChange}
                  />
                  {logo && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => setLogo(null)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Currency Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-accent/50">
                  <Coins className="h-5 w-5 text-accent-foreground" />
                </div>
                Devise par défaut
              </CardTitle>
              <CardDescription>
                La devise utilisée pour afficher les prix de vos produits et services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Devise</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency" className="w-full">
                    <SelectValue placeholder="Sélectionner une devise" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">
                            {curr.symbol}
                          </span>
                          <span>{curr.name}</span>
                          <span className="text-muted-foreground text-sm">({curr.code})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCurrency && (
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm text-muted-foreground mb-2">Aperçu des prix :</p>
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">
                      14 500 {selectedCurrency.symbol}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Prix affiché pour un produit à 14 500
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

           {/* Active Status Section */}
           <div className="flex items-center justify-between p-4 rounded-lg border border-border/60 bg-card lg:col-span-2">
             <div>
               <p className="font-medium text-sm">Activer le business</p>
               <p className="text-xs text-muted-foreground">
                 Rendre le business visible sur la marketplace
               </p>
             </div>
             <Switch checked={isActive} onCheckedChange={setIsActive} />
           </div>

           {/* Banner Section - Full Width */}
           <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-secondary">
                  <ImageIcon className="h-5 w-5 text-secondary-foreground" />
                </div>
                Bannière de couverture
              </CardTitle>
              <CardDescription>
                La bannière s'affiche en haut de votre page boutique. Format recommandé : 1200x300px ou 4:1.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className="relative w-full aspect-[4/1] rounded-xl overflow-hidden border-2 border-dashed border-border bg-muted/30 group cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                onClick={() => document.getElementById('banner-upload')?.click()}
              >
                {banner ? (
                  <>
                    <img 
                      src={banner} 
                      alt="Banner preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-white text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Changer la bannière</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                    <div className="p-4 rounded-full bg-muted">
                      <Upload className="h-8 w-8" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium">Cliquez pour ajouter une bannière</p>
                      <p className="text-sm">PNG, JPG ou GIF jusqu'à 5MB</p>
                    </div>
                  </div>
                )}
              </div>
              <Input 
                id="banner-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleBannerChange}
              />
              {banner && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-destructive hover:text-destructive"
                  onClick={() => setBanner(null)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer la bannière
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/business/${id}`)}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
