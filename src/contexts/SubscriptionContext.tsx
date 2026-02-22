import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SubscriptionContextType {
  isPro: boolean;
  autoRenew: boolean;
  upgradeToPro: () => void;
  setAutoRenew: (value: boolean) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState(false);
  const [autoRenew, setAutoRenew] = useState(false);

  const upgradeToPro = () => setIsPro(true);

  return (
    <SubscriptionContext.Provider value={{ isPro, upgradeToPro, autoRenew, setAutoRenew }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error("useSubscription must be used within SubscriptionProvider");
  return context;
}
