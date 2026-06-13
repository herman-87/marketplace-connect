import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Smartphone, Banknote, Lock, Shield, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { celebrate } from "@/components/ui/celebration";
import { useCart, type SubCart } from "@/contexts/CartContext";

interface PaymentStepProps {
  selectedBusinessId: string | null;
  onBack: () => void;
  onConfirm: () => void;
}

const paymentMethods = [
  {
    id: 'card',
    name: 'Carte bancaire',
    description: 'Visa, Mastercard, CB',
    icon: CreditCard,
  },
  {
    id: 'mobile',
    name: 'Mobile Money',
    description: 'Orange, MTN, Wave',
    icon: Smartphone,
  },
  {
    id: 'cash',
    name: 'Paiement à la livraison',
    description: 'Espèces uniquement',
    icon: Banknote,
  },
];

export function PaymentStep({ selectedBusinessId, onBack, onConfirm }: PaymentStepProps) {
  const { subCarts } = useCart();
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  const selectedSubCart = subCarts.find(sc => sc.businessId === selectedBusinessId);
  const deliveryFee = 4.99; // This would come from previous step
  const total = (selectedSubCart?.total || 0) + deliveryFee;

  const handleCardInput = (field: string, value: string) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-auto min-h-0">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Payment Methods */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Mode de paiement</h3>
                <p className="text-sm text-muted-foreground">Choisissez comment payer</p>
              </div>
            </div>

            <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
              <div className="space-y-3 mb-6">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <label
                      key={method.id}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                        selectedPayment === method.id
                          ? "border-foreground bg-muted"
                          : "border-border hover:border-foreground/30"
                      )}
                    >
                      <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                      <div className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center",
                        selectedPayment === method.id ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </RadioGroup>

            {/* Card details form */}
            {selectedPayment === 'card' && (
              <div className="p-4 rounded-xl border border-border bg-card space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Numéro de carte</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => handleCardInput('number', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Date d'expiration</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/AA"
                      value={cardDetails.expiry}
                      onChange={(e) => handleCardInput('expiry', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      type="password"
                      maxLength={4}
                      value={cardDetails.cvv}
                      onChange={(e) => handleCardInput('cvv', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardName">Nom sur la carte</Label>
                  <Input
                    id="cardName"
                    placeholder="JEAN DUPONT"
                    value={cardDetails.name}
                    onChange={(e) => handleCardInput('name', e.target.value.toUpperCase())}
                  />
                </div>
              </div>
            )}

            {selectedPayment === 'mobile' && (
              <div className="p-4 rounded-xl border border-border bg-card space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">Numéro de téléphone</Label>
                  <Input
                    id="mobileNumber"
                    placeholder="+225 07 12 34 56 78"
                    type="tel"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Vous recevrez une notification pour confirmer le paiement sur votre téléphone.
                </p>
              </div>
            )}

            {selectedPayment === 'cash' && (
              <div className="p-4 rounded-xl border border-border bg-card">
                <p className="text-sm text-muted-foreground">
                  Vous paierez en espèces au livreur lors de la réception de votre commande. 
                  Prévoyez l'appoint si possible.
                </p>
              </div>
            )}

            {/* Security badges */}
            <div className="flex items-center justify-center gap-4 mt-6 text-muted-foreground">
              <div className="flex items-center gap-1.5 text-xs">
                <Lock className="w-4 h-4" />
                <span>Paiement sécurisé</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <Shield className="w-4 h-4" />
                <span>Données cryptées</span>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:w-96 shrink-0">
            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Store className="w-5 h-5 text-primary" />
                Récapitulatif
              </h3>

              {selectedSubCart && (
                <>
                  <div className="space-y-3 mb-4">
                    {selectedSubCart.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qté: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium">
                          {(item.price * item.quantity).toFixed(2)} €
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span>{selectedSubCart.total.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Livraison</span>
                      <span>{deliveryFee.toFixed(2)} €</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">{total.toFixed(2)} €</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky bottom action */}
      <div className="sticky bottom-0 pt-4 pb-2 bg-background border-t border-border mt-auto shrink-0">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <Button 
            className="flex-1 h-12 text-base gap-2" 
            size="lg"
            onClick={() => {
              celebrate({
                title: "Paiement réussi !",
                message: `Votre paiement de ${total.toFixed(2)} € a été confirmé.`,
                variant: "success",
                emoji: "✨",
              });
              onConfirm();
            }}
          >
            <Lock className="w-4 h-4" />
            Payer {total.toFixed(2)} €
          </Button>
        </div>
      </div>
    </div>
  );
}
