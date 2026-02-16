import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Store, ClipboardList, Users, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const advantages = [
  { icon: Store, label: "Créer et gérer vos business" },
  { icon: ClipboardList, label: "Gérer les commandes reçues" },
  { icon: Users, label: "Équipes et collaborateurs" },
  { icon: BarChart3, label: "Engagement et statistiques" },
];

export default function Subscription() {
  const { upgradeToPro } = useSubscription();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleActivate = () => {
    upgradeToPro();
    toast({
      title: "Espace Pro activé !",
      description: "Vous avez maintenant accès à toutes les fonctionnalités pro.",
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-2">
            <Crown className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Passez à l'Espace Pro</h1>
          <p className="text-muted-foreground">
            Débloquez toutes les fonctionnalités de gestion pour votre activité.
          </p>
        </div>

        <Card className="border-primary/30 shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Plan Starter</CardTitle>
            <div className="flex items-baseline justify-center gap-1 mt-2">
              <span className="text-4xl font-bold text-foreground">0</span>
              <span className="text-lg text-muted-foreground">XAF / mois</span>
            </div>
            <CardDescription className="mt-2">
              Accès complet à toutes les fonctionnalités pro
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {advantages.map((item) => (
                <li key={item.label} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">{item.label}</span>
                  <Check className="h-4 w-4 text-primary ml-auto" />
                </li>
              ))}
            </ul>

            <Button onClick={handleActivate} className="w-full" size="lg">
              Activer gratuitement
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Aucune carte bancaire requise. Activez et commencez immédiatement.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
