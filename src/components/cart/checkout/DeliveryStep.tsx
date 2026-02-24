import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, MapPin, Truck, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeliveryStepProps {
  onBack: () => void;
  onContinue: () => void;
}

const deliveryOptions = [
  {
    id: 'standard',
    name: 'Livraison Standard',
    description: '3-5 jours ouvrés',
    price: 4.99,
    icon: Truck,
  },
  {
    id: 'express',
    name: 'Livraison Express',
    description: '1-2 jours ouvrés',
    price: 9.99,
    icon: Zap,
  },
  {
    id: 'scheduled',
    name: 'Livraison Programmée',
    description: 'Choisissez votre créneau',
    price: 6.99,
    icon: Clock,
  },
];

export function DeliveryStep({ onBack, onContinue }: DeliveryStepProps) {
  const [selectedDelivery, setSelectedDelivery] = useState('standard');
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    instructions: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = address.fullName && address.phone && address.street && address.city && address.postalCode;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-auto min-h-0">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Delivery Address */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Adresse de livraison</h3>
                <p className="text-sm text-muted-foreground">Où souhaitez-vous être livré ?</p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nom complet *</Label>
                  <Input
                    id="fullName"
                    placeholder="Jean Dupont"
                    value={address.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    value={address.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">Adresse *</Label>
                <Input
                  id="street"
                  placeholder="123 Rue de la Paix"
                  value={address.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    placeholder="Paris"
                    value={address.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Code postal *</Label>
                  <Input
                    id="postalCode"
                    placeholder="75001"
                    value={address.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions de livraison (optionnel)</Label>
                <Input
                  id="instructions"
                  placeholder="Bâtiment B, 3ème étage, code 1234..."
                  value={address.instructions}
                  onChange={(e) => handleInputChange('instructions', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Right: Delivery Options */}
          <div className="lg:w-96 shrink-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Mode de livraison</h3>
                <p className="text-sm text-muted-foreground">Choisissez votre option</p>
              </div>
            </div>

            <RadioGroup value={selectedDelivery} onValueChange={setSelectedDelivery}>
              <div className="space-y-3">
                {deliveryOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <label
                      key={option.id}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                        selectedDelivery === option.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <RadioGroupItem value={option.id} id={option.id} className="sr-only" />
                      <div className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center",
                        selectedDelivery === option.id ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{option.name}</p>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                      <p className="font-bold text-primary">{option.price.toFixed(2)} €</p>
                    </label>
                  );
                })}
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Sticky bottom action */}
      <div className="sticky bottom-0 pt-4 pb-2 bg-background border-t border-border mt-auto shrink-0">
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-muted-foreground">Frais de livraison</span>
          <span className="font-medium">
            {deliveryOptions.find(o => o.id === selectedDelivery)?.price.toFixed(2)} €
          </span>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <Button 
            className="flex-1 gap-2" 
            onClick={onContinue}
            disabled={!isFormValid}
          >
            Paiement
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
