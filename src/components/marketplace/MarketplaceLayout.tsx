import { ReactNode } from "react";
import { MarketplaceHeader } from "./MarketplaceHeader";

interface MarketplaceLayoutProps {
  children: ReactNode;
}

export function MarketplaceLayout({ children }: MarketplaceLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MarketplaceHeader />
      <main className="flex-1">
        {children}
      </main>
      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-8">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground text-center">
            © 2025 FastRelays. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
