import { AppLayout } from "@/components/layout/AppLayout";
import { WalletSection } from "@/components/dashboard/WalletSection";

export default function WalletPage() {
  return (
    <AppLayout title="Wallet" subtitle="Gérez votre solde et vos moyens de paiement.">
      <div className="animate-fade-in">
        <WalletSection />
      </div>
    </AppLayout>
  );
}
