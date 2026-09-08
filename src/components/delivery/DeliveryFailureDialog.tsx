import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DELIVERY_FAILURE_REASONS } from "@/types/delivery";
import { cn } from "@/lib/utils";

interface DeliveryFailureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
}

export function DeliveryFailureDialog({ open, onOpenChange, onConfirm }: DeliveryFailureDialogProps) {
  const [reason, setReason] = useState<string | null>(null);
  const [details, setDetails] = useState("");

  const reset = () => { setReason(null); setDetails(""); };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Signaler un échec de livraison</DialogTitle>
          <DialogDescription className="text-xs">
            Le client et la boutique seront informés du motif.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          {DELIVERY_FAILURE_REASONS.map((r) => (
            <button
              key={r}
              onClick={() => setReason(r)}
              className={cn(
                "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                reason === r ? "border-primary bg-primary/5 font-medium" : "border-border/60 hover:border-border",
              )}
            >
              {r}
            </button>
          ))}
        </div>
        <Textarea
          placeholder="Précisions (optionnel)"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="min-h-[70px] text-sm"
        />
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" className="h-10 flex-1" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button
            variant="destructive"
            className="h-10 flex-1"
            disabled={!reason}
            onClick={() => {
              onConfirm(details.trim() ? `${reason} — ${details.trim()}` : reason!);
              reset();
              onOpenChange(false);
            }}
          >
            Signaler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
