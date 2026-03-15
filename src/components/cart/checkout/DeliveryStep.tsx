import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MapPin, ArrowRight } from "lucide-react";

export interface DeliveryFormData {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  postalCode: string;
  deliveryInstruction: string;
}

interface DeliveryStepProps {
  onBack: () => void;
  onContinue: (data: DeliveryFormData) => void;
  initialData?: DeliveryFormData;
}

export function DeliveryStep({ onBack, onContinue, initialData }: DeliveryStepProps) {
  const [form, setForm] = useState<DeliveryFormData>(initialData || {
    fullName: '',
    phone: '',
    city: '',
    address: '',
    postalCode: '',
    deliveryInstruction: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = form.fullName && form.phone && form.city && form.address && form.postalCode;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-auto min-h-0">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Informations de livraison</h3>
              <p className="text-sm text-muted-foreground">Renseignez vos coordonnées pour la commande</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet *</Label>
                <Input
                  id="fullName"
                  placeholder="Jean Dupont"
                  value={form.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+237691234567"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ville *</Label>
                <Input
                  id="city"
                  placeholder="Douala"
                  value={form.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Code postal *</Label>
                <Input
                  id="postalCode"
                  placeholder="00237"
                  value={form.postalCode}
                  onChange={(e) => handleChange('postalCode', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse *</Label>
              <Input
                id="address"
                placeholder="Akwa, Rue Joffre, Immeuble 12"
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryInstruction">Instructions de livraison (optionnel)</Label>
              <Textarea
                id="deliveryInstruction"
                placeholder="Appelez avant d'arriver."
                value={form.deliveryInstruction}
                onChange={(e) => handleChange('deliveryInstruction', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky bottom action */}
      <div className="sticky bottom-0 pt-4 pb-2 bg-background border-t border-border mt-auto shrink-0">
        <div className="flex gap-3 items-center">
          <Button variant="outline" className="h-11 px-5" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <Button 
            className="flex-1 h-14 text-base font-semibold gap-2 rounded-[10px] shadow-md bg-primary hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200" 
            onClick={() => onContinue(form)}
            disabled={!isFormValid}
          >
            Continuer vers le récapitulatif
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
