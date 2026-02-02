import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Upload, Image as ImageIcon, Coins, Save, Trash2 } from "lucide-react";
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

export default function BusinessSettings() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [logo, setLogo] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [currency, setCurrency] = useState("XOF");
  const [isSaving, setIsSaving] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBanner(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success("Paramètres enregistrés avec succès !");
  };

  const selectedCurrency = currencies.find(c => c.code === currency);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(`/business/${id}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Paramètres du business</h1>
            <p className="text-muted-foreground">Personnalisez l'apparence et les préférences de votre boutique</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
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
