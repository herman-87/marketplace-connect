import { createContext, useContext, useState, ReactNode } from "react";
import type { PlanId, PaymentProviderId } from "@/data/subscriptionPlans";

export interface PaymentInfo {
  provider: PaymentProviderId;
  phone: string;
  email: string;
  amount: number;
  currency: string;
}

interface SubscriptionContextType {
  isPro: boolean;
  /** Souscription payée en attente de validation */
  pendingPlan: PlanId | null;
  pendingPayment: PaymentInfo | null;
  /** Enregistre une souscription payée, en attente de validation */
  requestValidation: (plan: PlanId, payment?: PaymentInfo) => void;
  /** Plan actif, null si aucun */
  plan: PlanId | null;
  /** Publicités débloquées (plan Growth) */
  hasAds: boolean;
  lastPayment: PaymentInfo | null;
  autoRenew: boolean;
  activatePlan: (plan: PlanId, payment?: PaymentInfo) => void;
  /** @deprecated garde la compat : active le plan Starter */
  upgradeToPro: () => void;
  cancelSubscription: () => void;
  setAutoRenew: (value: boolean) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<PlanId | null>(null);
  const [pendingPlan, setPendingPlan] = useState<PlanId | null>(null);
  const [pendingPayment, setPendingPayment] = useState<PaymentInfo | null>(null);
  const [lastPayment, setLastPayment] = useState<PaymentInfo | null>(null);
  const [autoRenew, setAutoRenew] = useState(false);

  const requestValidation = (nextPlan: PlanId, payment?: PaymentInfo) => {
    setPendingPlan(nextPlan);
    setPendingPayment(payment ?? null);
  };

  const activatePlan = (nextPlan: PlanId, payment?: PaymentInfo) => {
    setPlan(nextPlan);
    setPendingPlan(null);
    setPendingPayment(null);
    if (payment) setLastPayment(payment);
  };

  const cancelSubscription = () => {
    setPlan(null);
    setLastPayment(null);
    setPendingPlan(null);
    setPendingPayment(null);
  };

  return (
    <SubscriptionContext.Provider
      value={{
        isPro: plan !== null,
        pendingPlan,
        pendingPayment,
        requestValidation,
        plan,
        hasAds: plan === "growth",
        lastPayment,
        autoRenew,
        activatePlan,
        upgradeToPro: () => activatePlan("starter"),
        cancelSubscription,
        setAutoRenew,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error("useSubscription must be used within SubscriptionProvider");
  return context;
}
