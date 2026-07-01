import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";

export default function Conditions() {
  return (
    <AppLayout title="Conditions d'utilisation" subtitle="Règles et engagements de la plateforme">
      <div className="max-w-3xl animate-fade-in">
        <Card className="p-6 md:p-8 space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold mb-2">1. Objet</h2>
            <p className="text-muted-foreground">
              La plateforme met en relation acheteurs et vendeurs pour la commercialisation de produits physiques. En utilisant nos services, vous acceptez les présentes conditions.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold mb-2">2. Compte utilisateur</h2>
            <p className="text-muted-foreground">
              Vous êtes responsable de la confidentialité de vos identifiants et de toute activité effectuée depuis votre compte.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold mb-2">3. Boutiques et produits</h2>
            <p className="text-muted-foreground">
              Les vendeurs s'engagent à publier des informations exactes, à respecter la législation en vigueur et à honorer les commandes reçues.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold mb-2">4. Paiements et livraison</h2>
            <p className="text-muted-foreground">
              Les paiements transitent par notre wallet sécurisé. La libération des fonds au vendeur intervient après confirmation de réception par l'acheteur.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold mb-2">5. Litiges</h2>
            <p className="text-muted-foreground">
              En cas de désaccord, l'acheteur et le vendeur disposent de 7 jours pour régler amiablement le litige via la messagerie de commande avant intervention de la plateforme.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold mb-2">6. Contenus interdits</h2>
            <p className="text-muted-foreground">
              Sont notamment prohibés : produits contrefaits, illégaux, dangereux, ainsi que tout comportement frauduleux ou abusif.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold mb-2">7. Suspension et suppression</h2>
            <p className="text-muted-foreground">
              La plateforme se réserve le droit de suspendre ou supprimer tout compte, boutique ou produit contrevenant aux présentes conditions.
            </p>
          </section>
          <p className="text-xs text-muted-foreground pt-4 border-t">
            Dernière mise à jour : juillet 2026.
          </p>
        </Card>
      </div>
    </AppLayout>
  );
}
