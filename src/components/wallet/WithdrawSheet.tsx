import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowUpFromLine, CheckCircle2, Loader2, Smartphone } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/tax";
import type { WalletAccount } from "@/data/walletData";

const providers = [
  { id: "PAWAPAY", label: "PawaPay" },
  { id: "SEBPAY", label: "SebPay" },
  { id: "MONEYFUSION", label: "MoneyFusion" },
] as const;

const FEE_RATE = 0.015;
const MIN_AMOUNT = 5;

type Step = "amount" | "recipient" | "review" | "processing" | "done";

interface WithdrawSheetProps {
  wallet: WalletAccount | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WithdrawSheet({ wallet, open, onOpenChange }: WithdrawSheetProps) {
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState("");
  const [provider, setProvider] = useState<string>(providers[0].id);
  const [phone, setPhone] = useState("");
  const [reference, setReference] = useState("");

  const available = wallet?.available ?? wallet?.balance ?? 0;
  const currency = wallet?.currency ?? "EUR";
  const value = Number(amount.replace(",", ".")) || 0;
  const fee = useMemo(() => Math.round(value * FEE_RATE * 100) / 100, [value]);
  const received = Math.max(0, Math.round((value - fee) * 100) / 100);

  const reset = () => {
    setStep("amount");
    setAmount("");
    setPhone("");
    setProvider(providers[0].id);
    setReference("");
  };

  const close = (next: boolean) => {
    onOpenChange(next);
    if (!next) setTimeout(reset, 200);
  };

  const validateAmount = () => {
    if (value < MIN_AMOUNT) {
      toast.error(`Le montant minimum est de ${formatPrice(MIN_AMOUNT, currency)}.`);
      return;
    }
    if (value > available) {
      toast.error("Montant supérieur au solde disponible.");
      return;
    }
    setStep("recipient");
  };

  const validateRecipient = () => {
    const digits = phone.replace(/[^0-9]/g, "");
    if (digits.length < 8) {
      toast.error("Renseignez un numéro de téléphone valide.");
      return;
    }
    setStep("review");
  };

  const submit = () => {
    setStep("processing");
    setTimeout(() => {
      setReference(`WDR-${Math.floor(100000 + Math.random() * 899999)}`);
      setStep("done");
      toast.success("Demande de retrait envoyée");
    }, 1600);
  };

  const providerLabel = providers.find((p) => p.id === provider)?.label ?? provider;

  return (
    <Sheet open={open} onOpenChange={close}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ArrowUpFromLine className="h-4 w-4" /> Retrait
          </SheetTitle>
          <SheetDescription>
            {wallet ? `${wallet.name} · disponible ${formatPrice(available, currency)}` : ""}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-5 space-y-5">
          {step === "amount" && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs">Montant à retirer</Label>
                <Input
                  autoFocus
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="h-12 text-lg"
                />
                <p className="text-xs text-muted-foreground">
                  Minimum {formatPrice(MIN_AMOUNT, currency)} · frais {(FEE_RATE * 100).toFixed(1)}%
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[25, 50, 100].map((q) => (
                  <Button
                    key={q}
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    disabled={q > available}
                    onClick={() => setAmount(String(q))}
                  >
                    {formatPrice(q, currency)}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setAmount(String(available))}
                >
                  Tout
                </Button>
              </div>
              <Button className="w-full h-11" onClick={validateAmount}>Continuer</Button>
            </>
          )}

          {step === "recipient" && (
            <>
              <div className="space-y-2">
                <Label className="text-xs">Moyen de réception</Label>
                {providers.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProvider(p.id)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                      provider === p.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50",
                    )}
                  >
                    <Smartphone className="h-4 w-4" />
                    <span className="text-sm font-medium">{p.label}</span>
                    <Badge variant="outline" className="ml-auto text-[10px]">Mobile Money</Badge>
                  </button>
                ))}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Numéro de téléphone</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+237 6 90 00 00 00"
                  className="h-11"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-11" onClick={() => setStep("amount")}>Retour</Button>
                <Button className="h-11" onClick={validateRecipient}>Continuer</Button>
              </div>
            </>
          )}

          {step === "review" && (
            <>
              <div className="rounded-lg border border-border divide-y divide-border text-sm">
                <Row label="Montant" value={formatPrice(value, currency)} />
                <Row label="Frais" value={formatPrice(fee, currency)} />
                <Row label="Vous recevez" value={formatPrice(received, currency)} strong />
                <Row label="Moyen" value={providerLabel} />
                <Row label="Numéro" value={phone} />
              </div>
              <p className="text-xs text-muted-foreground">
                Le traitement prend généralement quelques minutes. Vous pourrez suivre ou annuler la
                demande depuis vos transactions tant qu'elle est en attente.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-11" onClick={() => setStep("recipient")}>Retour</Button>
                <Button className="h-11" onClick={submit}>Confirmer le retrait</Button>
              </div>
            </>
          )}

          {step === "processing" && (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
              <p className="text-sm font-medium">Traitement du retrait...</p>
              <p className="text-xs text-muted-foreground">Ne fermez pas cette fenêtre.</p>
            </div>
          )}

          {step === "done" && (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="h-10 w-10 mx-auto text-primary" />
              <p className="text-base font-semibold">Demande enregistrée</p>
              <p className="text-sm text-muted-foreground">
                {formatPrice(received, currency)} seront envoyés vers {providerLabel} ({phone}).
              </p>
              <Badge variant="outline" className="text-[10px]">Référence {reference}</Badge>
              <Button className="w-full h-11 mt-2" onClick={() => close(false)}>Terminer</Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn("text-sm", strong && "font-semibold")}>{value}</span>
    </div>
  );
}
