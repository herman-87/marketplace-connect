import { Store, ClipboardList, Users, BarChart3, Megaphone, Sparkles, TrendingUp, Crown } from "lucide-react";

export type PlanId = "starter" | "growth";

export type PaymentProviderId = "PAWAPAY" | "SEBPAY" | "MONEYFUSION";

export interface PlanFeature {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

export interface SubscriptionPlan {
  id: PlanId;
  name: string;
  tagline: string;
  price: number;
  currency: string;
  period: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  features: PlanFeature[];
  /** Fonctionnalités publicitaires débloquées */
  ads: boolean;
}

export const paymentProviders: { id: PaymentProviderId; label: string; description: string }[] = [
  { id: "PAWAPAY", label: "PawaPay", description: "MTN, Orange, Moov" },
  { id: "SEBPAY", label: "SebPay", description: "Paiement mobile local" },
  { id: "MONEYFUSION", label: "MoneyFusion", description: "Multi-opérateurs" },
];

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Gérez votre activité au quotidien",
    price: 0,
    currency: "XAF",
    period: "mois",
    icon: Crown,
    ads: false,
    features: [
      { icon: Store, label: "Créer et gérer vos business" },
      { icon: ClipboardList, label: "Gérer les commandes reçues" },
      { icon: Users, label: "Équipes et collaborateurs" },
      { icon: BarChart3, label: "Engagement et statistiques" },
    ],
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "Gagnez en visibilité avec la publicité",
    price: 500,
    currency: "XAF",
    period: "mois",
    icon: Megaphone,
    highlight: true,
    ads: true,
    features: [
      { icon: Crown, label: "Tout le plan Starter inclus" },
      { icon: Megaphone, label: "Campagnes publicitaires sur le marketplace" },
      { icon: Sparkles, label: "Produits sponsorisés et mise en avant" },
      { icon: TrendingUp, label: "Statistiques de performance des annonces" },
    ],
  },
];

export function getPlan(id: PlanId) {
  return subscriptionPlans.find((p) => p.id === id) ?? subscriptionPlans[0];
}

export function formatPlanPrice(plan: SubscriptionPlan) {
  return `${plan.price.toLocaleString("fr-FR")} ${plan.currency} / ${plan.period}`;
}
