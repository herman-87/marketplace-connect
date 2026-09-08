import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, MessageCircle, Star, ShieldCheck, Truck, CircleDot, Check } from "lucide-react";
import {
  Delivery,
  DELIVERY_FLOW_STEPS,
  DELIVERY_STATUS_CONFIG,
  vehicleLabels,
} from "@/types/delivery";
import { UserRole } from "@/types/order";
import { DeliveryMap } from "./DeliveryMap";
import { cn } from "@/lib/utils";

interface DeliveryTrackingPanelProps {
  delivery: Delivery;
  role: UserRole;
}

export function DeliveryTrackingPanel({ delivery, role }: DeliveryTrackingPanelProps) {
  const config = DELIVERY_STATUS_CONFIG[delivery.status];
  const currentIndex = DELIVERY_FLOW_STEPS.indexOf(delivery.status);
  const isFailed = delivery.status === "FAILED";

  return (
    <div className="space-y-4">
      {/* Statut */}
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Truck className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold">{config.label}</p>
            <Badge variant="outline" className="text-[10px]">{delivery.id}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">{config.description}</p>
        </div>
      </div>

      {/* Carte */}
      <DeliveryMap
        route={delivery.route}
        courierPosition={delivery.courierPosition}
        pickupLabel={delivery.pickup.label}
        dropoffLabel={delivery.dropoff.label}
        etaMinutes={isFailed ? undefined : delivery.etaMinutes}
        distanceKm={delivery.distanceKm}
      />

      {/* Livreur */}
      {delivery.courier ? (
        <div className="rounded-xl border border-border/60 bg-card p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-xs text-primary">
                {delivery.courier.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{delivery.courier.name}</p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-current text-primary" />
                {delivery.courier.rating.toFixed(1)}
                <span>·</span>
                {vehicleLabels[delivery.courier.vehicle]}
                {delivery.courier.plate && <><span>·</span>{delivery.courier.plate}</>}
              </p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Button asChild size="sm" variant="outline" className="h-8 flex-1 gap-1.5 text-xs">
              <a href={`tel:${delivery.courier.phone.replace(/\s/g, "")}`}>
                <Phone className="h-3.5 w-3.5" /> Appeler
              </a>
            </Button>
            <Button asChild size="sm" variant="outline" className="h-8 flex-1 gap-1.5 text-xs">
              <a
                href={`https://wa.me/${delivery.courier.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="h-3.5 w-3.5" /> Message
              </a>
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-3 text-xs text-muted-foreground">
          Recherche d'un livreur disponible dans la zone…
        </div>
      )}

      {/* Code de réception */}
      {role === "client" && !isFailed && delivery.status !== "DELIVERED" && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
          <p className="flex items-center gap-1.5 text-xs font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Code de réception
          </p>
          <p className="mt-1 font-mono text-2xl font-bold tracking-[0.3em]">{delivery.receptionCode}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Communiquez ce code au livreur uniquement au moment de la remise du colis.
          </p>
        </div>
      )}

      {isFailed && delivery.failureReason && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3">
          <p className="text-xs font-medium text-destructive">Motif de l'échec</p>
          <p className="text-xs text-muted-foreground">{delivery.failureReason}</p>
        </div>
      )}

      {/* Étapes */}
      <div className="space-y-0">
        {DELIVERY_FLOW_STEPS.map((step, i) => {
          const done = !isFailed && i < currentIndex;
          const active = !isFailed && i === currentIndex;
          const event = [...delivery.events].reverse().find((e) => e.status === step);
          return (
            <div key={step} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                    done && "border-primary bg-primary text-primary-foreground",
                    active && "border-primary bg-primary/10 text-primary",
                    !done && !active && "border-border bg-muted text-muted-foreground",
                  )}
                >
                  {done ? <Check className="h-3 w-3" /> : <CircleDot className="h-3 w-3" />}
                </span>
                {i < DELIVERY_FLOW_STEPS.length - 1 && (
                  <span className={cn("w-px flex-1", done ? "bg-primary" : "bg-border")} />
                )}
              </div>
              <div className="pb-4">
                <p className={cn("text-xs font-medium", !done && !active && "text-muted-foreground")}>
                  {DELIVERY_STATUS_CONFIG[step].label}
                </p>
                {event && (
                  <p className="text-[11px] text-muted-foreground">
                    {new Date(event.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    {event.note ? ` · ${event.note}` : ""}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
