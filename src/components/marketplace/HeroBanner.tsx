import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Zap, Gift, ShoppingBag, Truck } from "lucide-react";

export function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-card border border-border">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop" 
          alt="Marketplace"
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/95 to-card/80" />
      </div>

      <div className="relative z-10 p-6 sm:p-8 lg:p-12">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Content */}
          <div className="flex-1 text-center lg:text-left space-y-4">
            <Badge className="gap-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              <Sparkles className="w-3 h-3" />
              Nouveau sur la plateforme
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Découvrez le{" "}
              <span className="text-primary">meilleur</span>{" "}
              de votre quartier
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl">
              Articles tendance, accessoires de qualité, gadgets innovants — Tout ce dont vous avez besoin, livré chez vous.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
              <Button size="lg" className="gap-2 text-base">
                Explorer le marketplace
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2 text-base">
                <Gift className="w-4 h-4" />
                Voir les offres
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <StatCard 
              icon={ShoppingBag} 
              value="500+" 
              label="Boutiques" 
            />
            <StatCard 
              icon={Gift} 
              value="2000+" 
              label="Produits" 
            />
            <StatCard 
              icon={Zap} 
              value="50%" 
              label="Promos" 
            />
            <StatCard 
              icon={Truck} 
              value="24h" 
              label="Livraison" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  icon: Icon, 
  value, 
  label, 
}: { 
  icon: React.ElementType; 
  value: string; 
  label: string; 
}) {
  return (
    <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-4 text-center hover:bg-card transition-colors">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
