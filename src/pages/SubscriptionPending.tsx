import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Smartphone, ArrowLeft, Hash } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { getPlan, formatPlanPrice } from "@/data/subscriptionPlans";
import { useLanguage } from "@/hooks/use-language";

const copy = {
  fr: {
    badge: "En attente de validation",
    title: "Votre souscription est en cours de validation",
    body: (plan: string, price: string) =>
      `Nous avons enregistré votre souscription au plan ${plan} (${price}). Votre espace pro sera débloqué dès que le paiement sera confirmé.`,
    reminder: "Si vous n'avez pas encore payé, composez :",
    orange: "Orange Money",
    mtn: "MTN Mobile Money",
    payment: "Paiement envoyé depuis",
    back: "Retour à l'accueil",
    marketplace: "Explorer le marketplace",
    none: "Aucune souscription en attente.",
  },
  en: {
    badge: "Pending validation",
    title: "Your subscription is being validated",
    body: (plan: string, price: string) =>
      `We have registered your subscription to the ${plan} plan (${price}). Your pro space will unlock as soon as the payment is confirmed.`,
    reminder: "If you have not paid yet, dial:",
    orange: "Orange Money",
    mtn: "MTN Mobile Money",
    payment: "Payment sent from",
    back: "Back to home",
    marketplace: "Explore the marketplace",
    none: "No pending subscription.",
  },
};

export default function SubscriptionPending() {
  const { pendingPlan, pendingPayment } = useSubscription();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = copy[language] ?? copy.fr;
  const plan = pendingPlan ? getPlan(pendingPlan) : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg space-y-5">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Clock className="h-7 w-7 text-primary" />
          </div>
          <Badge variant="outline" className="text-xs">{t.badge}</Badge>
          <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
          <p className="text-sm text-muted-foreground">
            {plan ? t.body(plan.name, formatPlanPrice(plan)) : t.none}
          </p>
        </div>

        {plan && (
          <div className="space-y-4 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Plan</span>
              <span className="font-semibold">{plan.name}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Montant</span>
              <span className="font-semibold">
                {plan.price.toLocaleString("fr-FR")} {plan.currency}
              </span>
            </div>
            {pendingPayment && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t.payment}</span>
                <span className="font-medium">{pendingPayment.provider} · {pendingPayment.phone}</span>
              </div>
            )}

            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Smartphone className="h-3.5 w-3.5 text-primary" /> {t.reminder}
              </p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <p className="rounded-md bg-background px-3 py-2 text-center font-mono text-sm font-bold">
                  <Hash className="mr-1 inline h-3 w-3 text-primary" />150*50# · {t.orange}
                </p>
                <p className="rounded-md bg-background px-3 py-2 text-center font-mono text-sm font-bold">
                  *126# · {t.mtn}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="h-11 flex-1 gap-2" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" /> {t.back}
          </Button>
          <Button className="h-11 flex-1" onClick={() => navigate("/marketplace")}>
            {t.marketplace}
          </Button>
        </div>
      </div>
    </div>
  );
}
