import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Check, Loader2, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  paymentProviders,
  formatPlanPrice,
  type PaymentProviderId,
  type SubscriptionPlan,
} from "@/data/subscriptionPlans";
import type { PaymentInfo } from "@/contexts/SubscriptionContext";

interface PlanPaymentStepProps {
  plan: SubscriptionPlan;
  onBack: () => void;
  onPaid: (payment: PaymentInfo) => void;
}

export function PlanPaymentStep({ plan, onBack, onPaid }: PlanPaymentStepProps) {
  const [provider, setProvider] = useState<PaymentProviderId | null>(null);
  const [phone, setPhone] = useState("");
  const [processing, setProcessing] = useState(false);

  const phoneValid = phone.replace(/\D/g, "").length >= 8;
  const canPay = provider !== null && phoneValid && !processing;

  const handlePay = () => {
    if (!provider) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onPaid({ provider, phone, amount: plan.price, currency: plan.currency });
    }, 1400);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour
        </Button>
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-bold text-foreground">Paiement de l'abonnement</h3>
        <p className="text-sm text-muted-foreground">
          Plan {plan.name} — {formatPlanPrice(plan)}
        </p>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Smartphone className="h-4 w-4 text-primary" />
            Mobile Money
          </div>

          <div className="grid gap-2">
            {paymentProviders.map((p) => {
              const active = provider === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProvider(p.id)}
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-3 text-left transition-colors",
                    active ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                  )}
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.label}</p>
                    <p className="text-xs text-muted-foreground">{p.description}</p>
                  </div>
                  {active && <Check className="h-4 w-4 text-primary" />}
                </button>
              );
            })}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="sub-phone">Numéro de téléphone</Label>
            <Input
              id="sub-phone"
              type="tel"
              inputMode="tel"
              placeholder="+237 6 XX XX XX XX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="rounded-lg border border-border bg-muted/40 p-3 space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Montant</span>
              <span className="font-semibold text-foreground">
                {plan.price.toLocaleString("fr-FR")} {plan.currency}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Périodicité</span>
              <span>Tous les {plan.period}s</span>
            </div>
          </div>

          <Button onClick={handlePay} disabled={!canPay} className="w-full" size="lg">
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Paiement en cours…
              </>
            ) : (
              `Payer ${plan.price.toLocaleString("fr-FR")} ${plan.currency}`
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Vous recevrez une demande de confirmation sur votre téléphone.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
