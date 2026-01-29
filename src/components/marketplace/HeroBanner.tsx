import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Zap, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
  {
    title: "Découvrez le meilleur de votre quartier",
    subtitle: "Repas, articles, services - Tout à portée de main",
    cta: "Explorer maintenant",
    gradient: "from-primary/20 via-primary/10 to-transparent",
    icon: Sparkles,
  },
];

export function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-border">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
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
              Repas savoureux, articles tendance, services de qualité — Tout ce dont vous avez besoin, livré chez vous.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
              <Button size="lg" className="gradient-primary gap-2 text-base">
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
              icon={Zap} 
              value="500+" 
              label="Boutiques" 
              color="bg-primary/10 text-primary"
            />
            <StatCard 
              icon={Gift} 
              value="2000+" 
              label="Produits" 
              color="bg-accent/10 text-accent-foreground"
            />
            <StatCard 
              icon={Sparkles} 
              value="50%" 
              label="Promos" 
              color="bg-warning/10 text-warning"
            />
            <StatCard 
              icon={ArrowRight} 
              value="24h" 
              label="Livraison" 
              color="bg-success/10 text-success"
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
  color 
}: { 
  icon: React.ElementType; 
  value: string; 
  label: string; 
  color: string;
}) {
  return (
    <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-4 text-center hover:shadow-lg transition-shadow">
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2", color)}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
