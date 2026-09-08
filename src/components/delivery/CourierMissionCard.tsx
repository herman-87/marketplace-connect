import { Badge } from "@/components/ui/badge";
import { MapPin, Store, Package, ChevronRight } from "lucide-react";
import { Delivery, DELIVERY_STATUS_CONFIG } from "@/types/delivery";
import { cn } from "@/lib/utils";

interface CourierMissionCardProps {
  delivery: Delivery;
  active?: boolean;
  onSelect: () => void;
}

export function CourierMissionCard({ delivery, active, onSelect }: CourierMissionCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full rounded-xl border bg-card p-3 text-left transition-colors",
        active ? "border-primary/40 bg-primary/5" : "border-border/60 hover:border-border",
      )}
    >
      <div className="flex items-center gap-2">
        <Package className="h-3.5 w-3.5 text-primary" />
        <span className="text-sm font-semibold">#{delivery.orderId}</span>
        <Badge variant="outline" className="text-[10px]">
          {DELIVERY_STATUS_CONFIG[delivery.status].label}
        </Badge>
        <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2 space-y-1 text-xs text-muted-foreground">
        <p className="flex items-center gap-1.5 truncate">
          <Store className="h-3 w-3 shrink-0" /> {delivery.pickup.label || "Boutique"}
        </p>
        <p className="flex items-center gap-1.5 truncate">
          <MapPin className="h-3 w-3 shrink-0" /> {delivery.dropoff.label || "Client"}
        </p>
      </div>
      <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
        <span>{delivery.distanceKm.toFixed(1)} km</span>
        <span>{delivery.etaMinutes} min</span>
        <span className="ml-auto font-semibold text-foreground">
          {delivery.fee.toLocaleString("fr-FR")} XAF
        </span>
      </div>
    </button>
  );
}
