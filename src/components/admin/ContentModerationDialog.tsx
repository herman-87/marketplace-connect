import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { rejectionReasons } from "@/data/adminData";

interface ContentModerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
  mode: "rejected" | "hidden";
  onConfirm: (reason: string) => void;
}

export function ContentModerationDialog({
  open,
  onOpenChange,
  count,
  mode,
  onConfirm,
}: ContentModerationDialogProps) {
  const [reason, setReason] = useState<string>(rejectionReasons[0]);
  const [custom, setCustom] = useState("");
  const isOther = reason === "Autre (préciser)";

  const submit = () => {
    const final = isOther ? custom.trim() : reason;
    if (!final) {
      toast.error("Précisez le motif.");
      return;
    }
    onConfirm(final);
    setCustom("");
    setReason(rejectionReasons[0]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "rejected" ? "Rejeter" : "Masquer"} {count > 1 ? `${count} contenus` : "ce contenu"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Motif</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                {rejectionReasons.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {isOther && (
            <div className="space-y-1.5">
              <Label className="text-xs">Précisez</Label>
              <Input
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="Motif détaillé..."
                className="h-10"
              />
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Le motif est envoyé à la boutique et enregistré dans le journal de modération.
          </p>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" className="h-9 text-xs" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button className="h-9 text-xs" onClick={submit}>Confirmer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
