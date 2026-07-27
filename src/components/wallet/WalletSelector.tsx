import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/tax";
import { Building2, User } from "lucide-react";
import type { WalletAccount } from "@/data/walletData";

interface Props {
  wallets: WalletAccount[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function WalletSelector({ wallets, selectedId, onSelect }: Props) {
  return (
    <div className="-mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto scrollbar-none">
      <div className="flex gap-3 min-w-max pb-1">
        {wallets.map((w) => {
          const active = w.id === selectedId;
          const Icon = w.kind === "personal" ? User : Building2;
          return (
            <button
              key={w.id}
              type="button"
              onClick={() => onSelect(w.id)}
              aria-pressed={active}
              className={cn(
                "text-left rounded-xl border p-4 w-[220px] shrink-0 transition-all",
                active
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-card hover:border-foreground/30"
              )}
            >
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full",
                  active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="w-3 h-3" />
                {w.kind === "personal" ? "Personnel" : "Business"}
              </span>
              <p className="mt-2 text-sm font-medium text-foreground truncate">{w.name}</p>
              <p className="text-xl font-bold text-foreground mt-0.5">
                {formatPrice(w.balance, w.currency)}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
