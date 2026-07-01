import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ACK_KEY = "terms_ack_v1";

export function TermsReminderDialog() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!user) return;
    const key = `${ACK_KEY}:${user.id}`;
    if (!localStorage.getItem(key)) {
      const t = setTimeout(() => setOpen(true), 500);
      return () => clearTimeout(t);
    }
  }, [user]);

  const accept = () => {
    if (!user) return;
    localStorage.setItem(`${ACK_KEY}:${user.id}`, new Date().toISOString());
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-2">
            <ScrollText className="h-5 w-5" />
          </div>
          <DialogTitle className="text-center">Bienvenue sur la plateforme</DialogTitle>
          <DialogDescription className="text-center">
            Avant de continuer, merci de prendre connaissance de nos conditions d'utilisation.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground max-h-40 overflow-y-auto">
          Cette plateforme met en relation acheteurs et vendeurs. Vous vous engagez à publier des informations exactes,
          à respecter la législation en vigueur et à traiter les autres membres avec respect. Les paiements sont sécurisés
          et libérés après confirmation de réception.{" "}
          <Link to="/conditions" className="underline text-foreground">
            Lire l'intégralité des conditions
          </Link>
          .
        </div>
        <label className="flex items-start gap-2 text-sm cursor-pointer">
          <Checkbox checked={checked} onCheckedChange={(v) => setChecked(v === true)} className="mt-0.5" />
          <span>J'ai lu et j'accepte les conditions d'utilisation de la plateforme.</span>
        </label>
        <DialogFooter>
          <Button onClick={accept} disabled={!checked} className="w-full">
            Continuer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
