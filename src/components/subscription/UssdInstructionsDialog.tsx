import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Smartphone, Hash } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

interface UssdInstructionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planName: string;
  amountLabel: string;
}

const copy = {
  fr: {
    title: "Finalisez votre paiement",
    description: (plan: string, amount: string) =>
      `Plan ${plan} — ${amount}. Composez l'un des codes ci-dessous depuis votre téléphone pour confirmer le paiement.`,
    orange: "Orange Money",
    mtn: "MTN Mobile Money",
    hint: "Touchez en dehors de cette fenêtre pour la fermer.",
  },
  en: {
    title: "Complete your payment",
    description: (plan: string, amount: string) =>
      `${plan} plan — ${amount}. Dial one of the codes below on your phone to confirm the payment.`,
    orange: "Orange Money",
    mtn: "MTN Mobile Money",
    hint: "Tap outside this window to close it.",
  },
};

export function UssdInstructionsDialog({ open, onOpenChange, planName, amountLabel }: UssdInstructionsDialogProps) {
  const { language } = useLanguage();
  const t = copy[language] ?? copy.fr;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <Smartphone className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-lg">{t.title}</DialogTitle>
          <DialogDescription className="text-center text-sm">
            {t.description(planName, amountLabel)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
            <p className="text-xs font-medium text-muted-foreground">{t.orange}</p>
            <p className="mt-1 flex items-center justify-center gap-1.5 font-mono text-2xl font-bold">
              <Hash className="h-4 w-4 text-primary" />#150*50#
            </p>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
            <p className="text-xs font-medium text-muted-foreground">{t.mtn}</p>
            <p className="mt-1 flex items-center justify-center gap-1.5 font-mono text-2xl font-bold">
              <Hash className="h-4 w-4 text-primary" />*126#
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">{t.hint}</p>
      </DialogContent>
    </Dialog>
  );
}
