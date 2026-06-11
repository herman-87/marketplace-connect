import { cn } from "@/lib/utils";
import { DEFAULT_VAT_RATE, toHT, formatPrice } from "@/lib/tax";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface PriceDisplayProps {
  /** Montant TTC (prix de référence stocké) */
  price: number;
  /** Prix d'origine (avant remise) pour affichage barré */
  originalPrice?: number;
  /** Taux de TVA appliqué (ex: 0.20) */
  vatRate?: number;
  /** Devise ISO (ex: "EUR") */
  currency?: string;
  /** Variant d'affichage */
  variant?: "default" | "compact" | "inline" | "stacked";
  /** Taille du prix principal */
  size?: "sm" | "md" | "lg" | "xl";
  /** Afficher le prix HT en complément (true par défaut) */
  showHT?: boolean;
  /** Alignement */
  align?: "left" | "right";
  className?: string;
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-2xl",
};

export function PriceDisplay({
  price,
  originalPrice,
  vatRate = DEFAULT_VAT_RATE,
  currency = "EUR",
  variant = "default",
  size = "md",
  showHT = true,
  align = "left",
  className,
}: PriceDisplayProps) {
  const ht = toHT(price, vatRate);
  const formattedTTC = formatPrice(price, currency);
  const formattedHT = formatPrice(ht, currency);
  const formattedOriginal = originalPrice ? formatPrice(originalPrice, currency) : null;
  const vatPercent = Math.round(vatRate * 100);

  const alignCls = align === "right" ? "items-end text-right" : "items-start text-left";

  // Inline : tout sur une ligne (TTC · HT)
  if (variant === "inline") {
    return (
      <span className={cn("inline-flex items-baseline gap-1.5", className)}>
        <span className={cn("font-bold tabular-nums", sizeClasses[size])}>
          {formattedTTC}
        </span>
        <span className="text-[10px] uppercase tracking-wide font-medium text-muted-foreground">
          TTC
        </span>
        {showHT && (
          <span className="text-[10px] text-muted-foreground tabular-nums">
            · {formattedHT} HT
          </span>
        )}
      </span>
    );
  }

  // Compact : prix + petite mention HT en dessous
  if (variant === "compact") {
    return (
      <div className={cn("flex flex-col leading-tight", alignCls, className)}>
        <span className={cn("font-bold tabular-nums", sizeClasses[size])}>
          {formattedTTC}
        </span>
        {showHT && (
          <span className="text-[10px] text-muted-foreground tabular-nums">
            {formattedHT} HT
          </span>
        )}
      </div>
    );
  }

  // Stacked : TTC dominant, HT discret, badge TVA
  if (variant === "stacked") {
    return (
      <div className={cn("flex flex-col gap-0.5", alignCls, className)}>
        <div className="flex items-baseline gap-1.5">
          <span className={cn("font-bold tabular-nums text-foreground", sizeClasses[size])}>
            {formattedTTC}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            TTC
          </span>
        </div>
        {formattedOriginal && (
          <span className="text-xs text-muted-foreground line-through tabular-nums">
            {formattedOriginal}
          </span>
        )}
        {showHT && (
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {formattedHT} HT · TVA {vatPercent}%
          </span>
        )}
      </div>
    );
  }

  // Default : TTC principal + HT en dessous avec tooltip explicatif
  return (
    <div className={cn("flex flex-col leading-tight", alignCls, className)}>
      <div className="flex items-baseline gap-1.5">
        <span className={cn("font-bold tabular-nums text-foreground", sizeClasses[size])}>
          {formattedTTC}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          TTC
        </span>
      </div>
      {showHT && (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors tabular-nums w-fit"
              >
                {formattedHT} HT
                <Info className="h-2.5 w-2.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              Hors taxes · TVA {vatPercent}% incluse dans le prix affiché
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
