import { createContext, useContext, useState, ReactNode } from "react";
import type { PlanId, PaymentProviderId } from "@/data/subscriptionPlans";

export interface PaymentInfo {
  provider: PaymentProviderId;
  phone: string;
  email: string;
  amount: number;
  currency: string;
}

/** État de la dernière souscription du user */
export type SubscriptionStatus = "pending" | "active" | "expired";

export interface SubscriptionRecord {
  plan: PlanId;
  status: SubscriptionStatus;
  payment: PaymentInfo | null;
  createdAt: string;
  /** Fin de validité (plans actifs / expirés) */
  expiresAt?: string;
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

  /** Dernière souscription connue du user (quel que soit son état) */
  lastSubscription: SubscriptionRecord | null;
  /** L'espace pro est ouvert uniquement si la business zone est active */
  businessZoneActive: boolean;
  /** Change l'état de la dernière souscription (simulation front) */
  setSubscriptionStatus: (status: SubscriptionStatus) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const monthsFromNow = (months: number) => {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString();
};

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<PlanId | null>(null);
  const [pendingPlan, setPendingPlan] = useState<PlanId | null>(null);
  const [pendingPayment, setPendingPayment] = useState<PaymentInfo | null>(null);
  const [lastPayment, setLastPayment] = useState<PaymentInfo | null>(null);
  const [autoRenew, setAutoRenew] = useState(false);
  const [lastSubscription, setLastSubscription] = useState<SubscriptionRecord | null>(null);

  const requestValidation = (nextPlan: PlanId, payment?: PaymentInfo) => {
    setPendingPlan(nextPlan);
    setPendingPayment(payment ?? null);
    setLastSubscription({
      plan: nextPlan,
      status: "pending",
      payment: payment ?? null,
      createdAt: new Date().toISOString(),
    });
  };

  const activatePlan = (nextPlan: PlanId, payment?: PaymentInfo) => {
    setPlan(nextPlan);
    setPendingPlan(null);
    setPendingPayment(null);
    if (payment) setLastPayment(payment);
    setLastSubscription({
      plan: nextPlan,
      status: "active",
      payment: payment ?? null,
      createdAt: new Date().toISOString(),
      expiresAt: monthsFromNow(1),
    });
  };

  const cancelSubscription = () => {
    setPlan(null);
    setLastPayment(null);
    setPendingPlan(null);
    setPendingPayment(null);
    setLastSubscription((prev) => (prev ? { ...prev, status: "expired" } : null));
  };

  const setSubscriptionStatus = (status: SubscriptionStatus) => {
    setLastSubscription((prev) => {
      const base: SubscriptionRecord =
        prev ?? { plan: "growth", status, payment: null, createdAt: new Date().toISOString() };
      return {
        ...base,
        status,
        expiresAt: status === "expired" ? monthsFromNow(-1) : status === "active" ? monthsFromNow(1) : base.expiresAt,
      };
    });
    if (status === "active") {
      setPlan((prev) => prev ?? lastSubscription?.plan ?? "growth");
      setPendingPlan(null);
    } else {
      setPlan(null);
      if (status === "pending") setPendingPlan(lastSubscription?.plan ?? "growth");
    }
  };

  const businessZoneActive = lastSubscription?.status === "active";

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
        lastSubscription,
        businessZoneActive,
        setSubscriptionStatus,
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
