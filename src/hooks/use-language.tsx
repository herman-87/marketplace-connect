import { useState, useEffect, createContext, useContext, ReactNode } from "react";

export type Language = "fr" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    "landing.explore": "Explorer",
    "landing.login": "Connexion",
    "landing.tagline": "Plateforme tout-en-un pour entrepreneurs",
    "landing.hero.title.1": "Créez et gérez vos",
    "landing.hero.title.2": "business",
    "landing.hero.title.3": "en toute simplicité",
    "landing.hero.description": "Une plateforme unique pour lancer vos boutiques, vendre vos produits et collaborer avec votre équipe. Rejoignez des milliers d'entrepreneurs.",
    "landing.cta.start": "Commencer gratuitement",
    "landing.cta.marketplace": "Explorer le marketplace",
    "landing.features.title": "Tout ce dont vous avez besoin",
    "landing.features.description": "Des outils puissants pour développer votre activité et atteindre vos objectifs",
    "landing.feature.multibusiness": "Multi-Business",
    "landing.feature.multibusiness.desc": "Gérez plusieurs boutiques depuis un seul tableau de bord",
    "landing.feature.collaboration": "Collaboration",
    "landing.feature.collaboration.desc": "Invitez des collaborateurs et partagez la gestion",
    "landing.feature.marketplace": "Marketplace",
    "landing.feature.marketplace.desc": "Vendez vos produits sur notre marketplace intégré",
    "landing.feature.analytics": "Analytics",
    "landing.feature.analytics.desc": "Suivez vos performances avec des statistiques détaillées",
    "landing.benefits.title": "Pourquoi choisir notre plateforme ?",
    "landing.benefit.fast": "Rapide à configurer",
    "landing.benefit.fast.desc": "Créez votre première boutique en moins de 5 minutes",
    "landing.benefit.secure": "Sécurisé",
    "landing.benefit.secure.desc": "Vos données et transactions sont protégées",
    "landing.benefit.accessible": "Accessible partout",
    "landing.benefit.accessible.desc": "Gérez votre business depuis n'importe quel appareil",
    "landing.cta.create": "Créer mon compte",
    "landing.cta.final.title": "Prêt à lancer votre business ?",
    "landing.cta.final.desc": "Rejoignez notre communauté d'entrepreneurs et commencez à vendre dès aujourd'hui.",
    "landing.cta.final.button": "Commencer maintenant",
    "landing.footer.rights": "© 2024 Marketplace. Tous droits réservés.",
    "landing.shop.name": "Ma Boutique",
    "landing.shop.stats": "12 produits • 3 collaborateurs",
    "landing.shop.revenue": "Revenus du mois",
    "landing.shop.growth": "vs mois dernier",
  },
  en: {
    "landing.explore": "Explore",
    "landing.login": "Login",
    "landing.tagline": "All-in-one platform for entrepreneurs",
    "landing.hero.title.1": "Create and manage your",
    "landing.hero.title.2": "business",
    "landing.hero.title.3": "with ease",
    "landing.hero.description": "A unique platform to launch your stores, sell your products and collaborate with your team. Join thousands of entrepreneurs.",
    "landing.cta.start": "Start for free",
    "landing.cta.marketplace": "Explore marketplace",
    "landing.features.title": "Everything you need",
    "landing.features.description": "Powerful tools to grow your business and reach your goals",
    "landing.feature.multibusiness": "Multi-Business",
    "landing.feature.multibusiness.desc": "Manage multiple stores from a single dashboard",
    "landing.feature.collaboration": "Collaboration",
    "landing.feature.collaboration.desc": "Invite collaborators and share management",
    "landing.feature.marketplace": "Marketplace",
    "landing.feature.marketplace.desc": "Sell your products on our integrated marketplace",
    "landing.feature.analytics": "Analytics",
    "landing.feature.analytics.desc": "Track your performance with detailed statistics",
    "landing.benefits.title": "Why choose our platform?",
    "landing.benefit.fast": "Quick to set up",
    "landing.benefit.fast.desc": "Create your first store in less than 5 minutes",
    "landing.benefit.secure": "Secure",
    "landing.benefit.secure.desc": "Your data and transactions are protected",
    "landing.benefit.accessible": "Accessible anywhere",
    "landing.benefit.accessible.desc": "Manage your business from any device",
    "landing.cta.create": "Create my account",
    "landing.cta.final.title": "Ready to launch your business?",
    "landing.cta.final.desc": "Join our community of entrepreneurs and start selling today.",
    "landing.cta.final.button": "Start now",
    "landing.footer.rights": "© 2024 Marketplace. All rights reserved.",
    "landing.shop.name": "My Shop",
    "landing.shop.stats": "12 products • 3 collaborators",
    "landing.shop.revenue": "Monthly revenue",
    "landing.shop.growth": "vs last month",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("language") as Language;
      if (stored) return stored;
      const browserLang = navigator.language.split("-")[0];
      return browserLang === "en" ? "en" : "fr";
    }
    return "fr";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
