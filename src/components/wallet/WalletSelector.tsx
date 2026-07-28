import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/tax";
import { Building2, User, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WalletAccount } from "@/data/walletData";

interface Props {
  wallets: WalletAccount[];
  selectedId: string;
  onSelect: (id: string) => void;
  onDeposit?: (wallet: WalletAccount) => void;
  onWithdraw?: (wallet: WalletAccount) => void;
}

export function WalletSelector({ wallets, selectedId, onSelect, onDeposit, onWithdraw }: Props) {
  return (
    <div className="-mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto scrollbar-none">
      <div className="flex gap-3 min-w-max pb-1">
        {wallets.map((w) => {
          const active = w.id === selectedId;
          const Icon = w.kind === "personal" ? User : Building2;
          return (
            <div
              key={w.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(w.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(w.id);
                }
              }}
              aria-pressed={active}
              className={cn(
                "group relative text-left rounded-xl border p-4 w-[220px] shrink-0 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary",
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

              <div
                className={cn(
                  "absolute inset-x-0 bottom-0 p-3 flex gap-2 opacity-0 transition-opacity duration-200",
                  "group-hover:opacity-100 group-focus-within:opacity-100",
                  "bg-card/95 backdrop-blur-sm rounded-b-xl"
                )}
              >
                <Button
                  size="sm"
                  className="h-8 flex-1 gap-1 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeposit?.(w);
                  }}
                >
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                  Dépôt
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 flex-1 gap-1 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onWithdraw?.(w);
                  }}
                >
                  <ArrowUpFromLine className="w-3.5 h-3.5" />
                  Retrait
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
