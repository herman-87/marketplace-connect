import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Store, ClipboardList, Users, BarChart3, X, RefreshCw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const advantages = [
  { icon: Store, label: "Créer et gérer vos business" },
  { icon: ClipboardList, label: "Gérer les commandes reçues" },
  { icon: Users, label: "Équipes et collaborateurs" },
  { icon: BarChart3, label: "Engagement et statistiques" },
];

interface SubscriptionSheetProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SubscriptionSheet({ trigger, open: controlledOpen, onOpenChange }: SubscriptionSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const { upgradeToPro, autoRenew, setAutoRenew } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

  const handleActivate = () => {
    upgradeToPro();
    toast({
      title: "Espace Pro activé !",
      description: "Vous avez maintenant accès à toutes les fonctionnalités pro.",
    });
    setOpen(false);
    navigate("/dashboard");
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent
        side="left"
        className="w-full sm:max-w-full p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-xl">
              <Crown className="w-6 h-6 text-primary" />
              Espace Pro
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
          <div className="w-full max-w-lg space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-2">
                <Crown className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Passez à l'Espace Pro</h2>
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

                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/50">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Renouvellement automatique</p>
                      <p className="text-xs text-muted-foreground">Renouveler l'abonnement à la fin de la période</p>
                    </div>
                  </div>
                  <Switch checked={autoRenew} onCheckedChange={setAutoRenew} />
                </div>

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
      </SheetContent>
    </Sheet>
  );
}
