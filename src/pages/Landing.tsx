import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSelector } from "@/components/ui/language-selector";
import { useLanguage } from "@/hooks/use-language";
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

export default function Landing() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Store,
      title: t("landing.feature.multibusiness"),
      description: t("landing.feature.multibusiness.desc"),
    },
    {
      icon: Users,
      title: t("landing.feature.collaboration"),
      description: t("landing.feature.collaboration.desc"),
    },
    {
      icon: ShoppingBag,
      title: t("landing.feature.marketplace"),
      description: t("landing.feature.marketplace.desc"),
    },
    {
      icon: TrendingUp,
      title: t("landing.feature.analytics"),
      description: t("landing.feature.analytics.desc"),
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: t("landing.benefit.fast"),
      description: t("landing.benefit.fast.desc"),
    },
    {
      icon: Shield,
      title: t("landing.benefit.secure"),
      description: t("landing.benefit.secure.desc"),
    },
    {
      icon: Globe,
      title: t("landing.benefit.accessible"),
      description: t("landing.benefit.accessible.desc"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <Store className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">FastRelays</span>
          </div>
          
          {/* Nav */}
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <LanguageSelector />
            <Link to="/auth">
              <Button size="sm" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                {t("landing.login")}
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
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
              {t("landing.tagline")}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              {t("landing.hero.title.1")}{" "}
              <span className="text-primary">{t("landing.hero.title.2")}</span>{" "}
              {t("landing.hero.title.3")}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("landing.hero.description")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  {t("landing.cta.start")}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  <ShoppingBag className="h-5 w-5" />
                  {t("landing.cta.marketplace")}
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
              {t("landing.features.title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("landing.features.description")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border/50 hover:border-foreground/30 transition-colors group">
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
                {t("landing.benefits.title")}
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
                  {t("landing.cta.create")}
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
                      <p className="font-semibold">{t("landing.shop.name")}</p>
                      <p className="text-xs text-muted-foreground">{t("landing.shop.stats")}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-2xl font-bold">2,847€</p>
                      <p className="text-xs text-muted-foreground">{t("landing.shop.revenue")}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-2xl font-bold">+23%</p>
                      <p className="text-xs text-muted-foreground">{t("landing.shop.growth")}</p>
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
              {t("landing.cta.final.title")}
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              {t("landing.cta.final.desc")}
            </p>
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="gap-2">
                {t("landing.cta.final.button")}
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
              <span className="font-semibold">FastRelays</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("landing.footer.rights")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
