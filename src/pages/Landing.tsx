import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Store, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  Sparkles,
  Shield,
  Zap,
  Globe
} from "lucide-react";

const features = [
  {
    icon: Store,
    title: "Multi-Business",
    description: "Gérez plusieurs boutiques depuis un seul tableau de bord",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Invitez des collaborateurs et partagez la gestion",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace",
    description: "Vendez vos produits sur notre marketplace intégré",
  },
  {
    icon: TrendingUp,
    title: "Analytics",
    description: "Suivez vos performances avec des statistiques détaillées",
  },
];

const benefits = [
  {
    icon: Zap,
    title: "Rapide à configurer",
    description: "Créez votre première boutique en moins de 5 minutes",
  },
  {
    icon: Shield,
    title: "Sécurisé",
    description: "Vos données et transactions sont protégées",
  },
  {
    icon: Globe,
    title: "Accessible partout",
    description: "Gérez votre business depuis n'importe quel appareil",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <Store className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Marketplace</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/marketplace">
              <Button variant="ghost" size="sm">
                Explorer
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="gap-2">
                Connexion
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Plateforme tout-en-un pour entrepreneurs
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Créez et gérez vos{" "}
              <span className="text-primary">business</span>{" "}
              en toute simplicité
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Une plateforme unique pour lancer vos boutiques, vendre vos produits 
              et collaborer avec votre équipe. Rejoignez des milliers d'entrepreneurs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Commencer gratuitement
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  <ShoppingBag className="h-5 w-5" />
                  Explorer le marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Des outils puissants pour développer votre activité et atteindre vos objectifs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border/50 hover:border-primary/50 transition-colors group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Pourquoi choisir notre plateforme ?
              </h2>
              <div className="space-y-6">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="flex gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <benefit.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link to="/auth" className="inline-block mt-8">
                <Button className="gap-2">
                  Créer mon compte
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8">
                <div className="bg-background rounded-xl shadow-xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <Store className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">Ma Boutique</p>
                      <p className="text-xs text-muted-foreground">12 produits • 3 collaborateurs</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-2xl font-bold">2,847€</p>
                      <p className="text-xs text-muted-foreground">Revenus du mois</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-2xl font-bold">+23%</p>
                      <p className="text-xs text-muted-foreground">vs mois dernier</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Prêt à lancer votre business ?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Rejoignez notre communauté d'entrepreneurs et commencez à vendre dès aujourd'hui.
            </p>
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="gap-2">
                Commencer maintenant
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Store className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Marketplace</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Marketplace. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
