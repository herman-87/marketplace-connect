import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Smartphone, RefreshCw, Crown, Lock } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { getPlan, formatPlanPrice } from "@/data/subscriptionPlans";
import { useLanguage } from "@/hooks/use-language";
import { SubscriptionSheet } from "./SubscriptionSheet";

const copy = {
  fr: {
    lockedBadge: "Espace pro verrouillé",
    pendingBadge: "Souscription en attente de paiement",
    expiredBadge: "Souscription expirée",
    noneTitle: "Activez votre espace pro",
    noneBody: "Souscrivez à un plan pour ouvrir votre espace pro et gérer vos business.",
    pendingTitle: "Votre souscription attend le paiement",
    pendingBody: (plan: string, price: string) =>
      `Souscription au plan ${plan} (${price}) enregistrée. Finalisez le paiement pour activer votre espace pro.`,
    ussd: "Composez l'un de ces codes pour payer :",
    orange: "Orange Money",
    mtn: "MTN Mobile Money",
    expiredTitle: "Votre souscription a expiré",
    expiredBody: (plan: string, date: string) =>
      `Votre plan ${plan} est arrivé à échéance le ${date}. Renouvelez-le ou choisissez un nouveau plan pour retrouver votre espace pro.`,
    renew: "Renouveler la souscription",
    choose: "Souscrire à un autre plan",
    subscribe: "Choisir un plan",
    details: "Voir le suivi de la souscription",
    email: "Email",
    phone: "Numéro utilisé",
    plan: "Plan",
    amount: "Montant",
    simulate: "Aperçu de l'état",
  },
  en: {
    lockedBadge: "Pro space locked",
    pendingBadge: "Subscription awaiting payment",
    expiredBadge: "Subscription expired",
    noneTitle: "Activate your pro space",
    noneBody: "Subscribe to a plan to unlock your pro space and manage your businesses.",
    pendingTitle: "Your subscription is awaiting payment",
    pendingBody: (plan: string, price: string) =>
      `Your ${plan} plan subscription (${price}) has been recorded. Complete the payment to unlock your pro space.`,
    ussd: "Dial one of these codes to pay:",
    orange: "Orange Money",
    mtn: "MTN Mobile Money",
    expiredTitle: "Your subscription has expired",
    expiredBody: (plan: string, date: string) =>
      `Your ${plan} plan ended on ${date}. Renew it or pick a new plan to get your pro space back.`,
    renew: "Renew subscription",
    choose: "Subscribe to another plan",
    subscribe: "Choose a plan",
    details: "View subscription status",
    email: "Email",
    phone: "Phone used",
    plan: "Plan",
    amount: "Amount",
    simulate: "State preview",
  },
};

export function ProSpaceGate({ children }: { children: ReactNode }) {
  const { businessZoneActive, lastSubscription, setSubscriptionStatus } = useSubscription();
  const { language } = useLanguage();
  const [sheetOpen, setSheetOpen] = useState(false);
  const navigate = useNavigate();
  const t = copy[language] ?? copy.fr;

  // a* business zone active : espace pro normal
  if (businessZoneActive) return <>{children}</>;

  const status = lastSubscription?.status ?? null;
  const plan = lastSubscription ? getPlan(lastSubscription.plan) : null;
  const expiresAt = lastSubscription?.expiresAt
    ? new Date(lastSubscription.expiresAt).toLocaleDateString(language === "en" ? "en-GB" : "fr-FR")
    : "-";

  const badge = status === "pending" ? t.pendingBadge : status === "expired" ? t.expiredBadge : t.lockedBadge;
  const Icon = status === "pending" ? Clock : status === "expired" ? RefreshCw : Lock;
  const title = status === "pending" ? t.pendingTitle : status === "expired" ? t.expiredTitle : t.noneTitle;
  const body =
    status === "pending" && plan
      ? t.pendingBody(plan.name, formatPlanPrice(plan))
      : status === "expired" && plan
        ? t.expiredBody(plan.name, expiresAt)
        : t.noneBody;

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-5">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Icon className="h-7 w-7 text-primary" />
          </div>
          <Badge variant="outline" className="text-xs">{badge}</Badge>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{body}</p>
        </div>

        {plan && (
          <Card className="border-border">
            <CardContent className="space-y-3 p-5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t.plan}</span>
                <span className="font-semibold">{plan.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t.amount}</span>
                <span className="font-semibold">
                  {plan.price.toLocaleString("fr-FR")} {plan.currency}
                </span>
              </div>
              {lastSubscription?.payment && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t.phone}</span>
                    <span className="font-medium">
                      {lastSubscription.payment.provider} · {lastSubscription.payment.phone}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">{t.email}</span>
                    <span className="max-w-[60%] truncate font-medium">{lastSubscription.payment.email}</span>
                  </div>
                </>
              )}

              {/* c* souscription pending : rappel des codes USSD */}
              {status === "pending" && (
                <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
                  <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Smartphone className="h-3.5 w-3.5 text-primary" /> {t.ussd}
                  </p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <p className="rounded-md bg-background px-3 py-2 text-center font-mono text-sm font-bold">
                      #150*50# · {t.orange}
                    </p>
                    <p className="rounded-md bg-background px-3 py-2 text-center font-mono text-sm font-bold">
                      *126# · {t.mtn}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          {status === "pending" ? (
            <Button className="h-11 flex-1" onClick={() => navigate("/souscription/validation")}>
              {t.details}
            </Button>
          ) : status === "expired" ? (
            <>
              <Button className="h-11 flex-1 gap-2" onClick={() => setSheetOpen(true)}>
                <RefreshCw className="h-4 w-4" /> {t.renew}
              </Button>
              <Button variant="outline" className="h-11 flex-1" onClick={() => setSheetOpen(true)}>
                {t.choose}
              </Button>
            </>
          ) : (
            <Button className="h-11 flex-1 gap-2" onClick={() => setSheetOpen(true)}>
              <Crown className="h-4 w-4" /> {t.subscribe}
            </Button>
          )}
        </div>

        {/* Aperçu des états (prototype front) */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{t.simulate}</span>
          {(["pending", "expired", "active"] as const).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={status === s ? "secondary" : "ghost"}
              className="h-7 text-[11px]"
              onClick={() => setSubscriptionStatus(s)}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      <SubscriptionSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}
