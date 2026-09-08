import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ReceptionCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expectedCode: string;
  onValidated: () => void;
}

export function ReceptionCodeDialog({ open, onOpenChange, expectedCode, onValidated }: ReceptionCodeDialogProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    if (code.trim() === expectedCode) {
      setCode("");
      setError(false);
      onOpenChange(false);
      onValidated();
    } else {
      setError(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) { setCode(""); setError(false); } }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">Code de réception</DialogTitle>
          <DialogDescription className="text-xs">
            Demandez au client le code à 4 chiffres affiché dans sa commande pour confirmer la remise.
          </DialogDescription>
        </DialogHeader>
        <Input
          inputMode="numeric"
          maxLength={4}
          placeholder="••••"
          value={code}
          onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); setError(false); }}
          className="h-12 text-center font-mono text-xl tracking-[0.4em]"
        />
        {error && <p className="text-xs text-destructive">Code incorrect. Vérifiez avec le client.</p>}
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" className="h-10 flex-1" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button className="h-10 flex-1" disabled={code.length !== 4} onClick={submit}>Valider</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
