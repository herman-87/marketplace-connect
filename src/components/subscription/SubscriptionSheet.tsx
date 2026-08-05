import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, X, RefreshCw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useSubscription, type PaymentInfo } from "@/contexts/SubscriptionContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { celebrate } from "@/components/ui/celebration";
import { subscriptionPlans, type PlanId, type SubscriptionPlan } from "@/data/subscriptionPlans";
import { PlanPaymentStep } from "./PlanPaymentStep";

interface SubscriptionSheetProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SubscriptionSheet({ trigger, open: controlledOpen, onOpenChange }: SubscriptionSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<SubscriptionPlan | null>(null);
  const { activatePlan, plan: currentPlan, autoRenew, setAutoRenew } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

  const finish = (id: PlanId, name: string, payment?: PaymentInfo) => {
    activatePlan(id, payment);
    celebrate({
      title: `Plan ${name} activé !`,
      message: payment
        ? "Paiement confirmé. Vos outils publicitaires sont débloqués."
        : "Vous avez accès aux fonctionnalités pro.",
      variant: "party",
    });
    toast({
      title: `Plan ${name} activé`,
      description: "Votre espace pro est prêt.",
    });
    setPaymentPlan(null);
    setOpen(false);
    navigate("/dashboard");
  };

  const handleSelect = (plan: SubscriptionPlan) => {
    if (plan.price === 0) {
      finish(plan.id, plan.name);
    } else {
      setPaymentPlan(plan);
    }
  };

  const handleClose = () => {
    setPaymentPlan(null);
    setOpen(false);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) setPaymentPlan(null);
        setOpen(next);
      }}
    >
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent side="left" className="w-full sm:max-w-full p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-xl">
              <Crown className="w-6 h-6 text-primary" />
              Espace Pro
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 p-6 overflow-y-auto">
          {paymentPlan ? (
            <div className="w-full max-w-lg mx-auto">
              <PlanPaymentStep
                plan={paymentPlan}
                onBack={() => setPaymentPlan(null)}
                onPaid={(payment) => finish(paymentPlan.id, paymentPlan.name, payment)}
              />
            </div>
          ) : (
            <div className="w-full max-w-4xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-2">
                  <Crown className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Choisissez votre plan</h2>
                <p className="text-muted-foreground">
                  Gérez votre activité, et passez à Growth pour la publicité et la mise en avant.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {subscriptionPlans.map((plan) => {
                  const active = currentPlan === plan.id;
                  return (
                    <Card
                      key={plan.id}
                      className={cn(
                        "flex flex-col",
                        plan.highlight ? "border-primary/40 shadow-lg" : "border-border"
                      )}
                    >
                      <CardHeader className="text-center pb-4">
                        <div className="flex items-center justify-center gap-2">
                          <CardTitle className="text-xl">Plan {plan.name}</CardTitle>
                          {plan.highlight && <Badge variant="secondary">Publicité</Badge>}
                        </div>
                        <div className="flex items-baseline justify-center gap-1 mt-2">
                          <span className="text-4xl font-bold text-foreground">
                            {plan.price.toLocaleString("fr-FR")}
                          </span>
                          <span className="text-lg text-muted-foreground">
                            {plan.currency} / {plan.period}
                          </span>
                        </div>
                        <CardDescription className="mt-2">{plan.tagline}</CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-6 flex-1 flex flex-col">
                        <ul className="space-y-3 flex-1">
                          {plan.features.map((item) => (
                            <li key={item.label} className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 shrink-0">
                                <item.icon className="h-4 w-4 text-primary" />
                              </div>
                              <span className="text-sm text-foreground">{item.label}</span>
                              <Check className="h-4 w-4 text-primary ml-auto shrink-0" />
                            </li>
                          ))}
                        </ul>

                        <Button
                          onClick={() => handleSelect(plan)}
                          disabled={active}
                          variant={plan.highlight ? "default" : "outline"}
                          className="w-full"
                          size="lg"
                        >
                          {active
                            ? "Plan actuel"
                            : plan.price === 0
                              ? "Activer gratuitement"
                              : "Souscrire et payer"}
                        </Button>

                        <p className="text-xs text-center text-muted-foreground">
                          {plan.price === 0
                            ? "Aucune carte bancaire requise."
                            : "Paiement par Mobile Money, sans engagement."}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/50 max-w-lg mx-auto">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Renouvellement automatique</p>
                    <p className="text-xs text-muted-foreground">
                      Renouveler l'abonnement à la fin de la période
                    </p>
                  </div>
                </div>
                <Switch checked={autoRenew} onCheckedChange={setAutoRenew} />
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
