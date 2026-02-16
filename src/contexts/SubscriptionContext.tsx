import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SubscriptionContextType {
  isPro: boolean;
  upgradeToPro: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState(() => {
    return localStorage.getItem("fastrelays_pro") === "true";
  });

  useEffect(() => {
    localStorage.setItem("fastrelays_pro", String(isPro));
  }, [isPro]);

  const upgradeToPro = () => setIsPro(true);

  return (
    <SubscriptionContext.Provider value={{ isPro, upgradeToPro }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error("useSubscription must be used within SubscriptionProvider");
  return context;
}
