import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bike, Package, Phone, MapPin, Store, ShieldCheck, AlertTriangle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  Delivery, DELIVERY_STATUS_CONFIG, nextDeliveryStatus, vehicleLabels,
} from "@/types/delivery";
import { createDelivery, mockCouriers, positionAtProgress } from "@/data/deliveryData";
import { DeliveryMap } from "@/components/delivery/DeliveryMap";
import { CourierMissionCard } from "@/components/delivery/CourierMissionCard";
import { ReceptionCodeDialog } from "@/components/delivery/ReceptionCodeDialog";
import { DeliveryFailureDialog } from "@/components/delivery/DeliveryFailureDialog";
import { cn } from "@/lib/utils";

const courier = mockCouriers[0];

function seedMissions(): Delivery[] {
  const a = createDelivery("CMD-10842", { address: "Bonapriso, rue Njo-Njo", fee: 1500, courier });
  const b = createDelivery("CMD-10847", { address: "Akwa, av. de la Liberté", fee: 1200 });
  const c = createDelivery("CMD-10851", { address: "Bonamoussadi, carrefour Kotto", fee: 2000 });
  b.distanceKm = 3.1; b.etaMinutes = 14;
  c.distanceKm = 7.8; c.etaMinutes = 31;
  return [a, b, c];
}

export default function CourierDeliveries() {
  const [missions, setMissions] = useState<Delivery[]>(seedMissions);
  const [selectedId, setSelectedId] = useState<string>(missions[0].id);
  const [codeOpen, setCodeOpen] = useState(false);
  const [failOpen, setFailOpen] = useState(false);

  const mission = useMemo(() => missions.find((m) => m.id === selectedId)!, [missions, selectedId]);

  const update = (id: string, patch: Partial<Delivery>, note?: string) => {
    setMissions((prev) =>
      prev.map((m) =>
        m.id !== id
          ? m
          : {
              ...m,
              ...patch,
              events: patch.status
                ? [...m.events, { status: patch.status, timestamp: new Date().toISOString(), note, position: m.courierPosition }]
                : m.events,
            },
      ),
    );
  };

  // Progression simulée du livreur sur le trajet pendant le déplacement
  useEffect(() => {
    if (!["HEADING_TO_PICKUP", "EN_ROUTE"].includes(mission.status)) return;
    const timer = setInterval(() => {
      setMissions((prev) =>
        prev.map((m) => {
          if (m.id !== mission.id) return m;
          const progress = Math.min(1, m.progress + 0.06);
          return {
            ...m,
            progress,
            courierPosition: positionAtProgress(m.route, progress),
            etaMinutes: Math.max(1, Math.round(m.etaMinutes * (1 - 0.06))),
          };
        }),
      );
    }, 1500);
    return () => clearInterval(timer);
  }, [mission.status, mission.id]);

  const advance = () => {
    const next = nextDeliveryStatus(mission.status);
    if (!next) return;
    if (next === "DELIVERED") { setCodeOpen(true); return; }
    if (next === "ASSIGNED") {
      update(mission.id, { status: next, courier, courierPosition: mission.route[0] }, "Mission acceptée");
      toast.success("Mission acceptée");
      return;
    }
    if (next === "EN_ROUTE") {
      update(mission.id, { status: next, progress: 0.35, courierPosition: positionAtProgress(mission.route, 0.35) }, "Départ vers le client");
    } else {
      update(mission.id, { status: next });
    }
    toast.success(DELIVERY_STATUS_CONFIG[next].label);
  };

  const actionLabel = DELIVERY_STATUS_CONFIG[mission.status].courierAction;
  const finished = mission.status === "DELIVERED" || mission.status === "FAILED";

  return (
    <div className="min-h-screen bg-background">
      {/* En-tête livreur */}
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <Button asChild variant="ghost" size="icon" className="h-9 w-9">
            <a href="/"><ArrowLeft className="h-4 w-4" /></a>
          </Button>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Bike className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{courier.name}</p>
            <p className="text-xs text-muted-foreground">
              {vehicleLabels[courier.vehicle]} · {courier.plate} · {courier.deliveries} livraisons
            </p>
          </div>
          <Badge variant="outline" className="text-[10px]">Espace livreur</Badge>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-4 px-4 py-4 lg:grid-cols-5 lg:gap-6">
        {/* Liste des missions */}
        <section className="space-y-2 lg:col-span-2">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Package className="h-4 w-4 text-primary" /> Mes missions ({missions.length})
          </h2>
          {missions.map((m) => (
            <CourierMissionCard
              key={m.id}
              delivery={m}
              active={m.id === selectedId}
              onSelect={() => setSelectedId(m.id)}
            />
          ))}
        </section>

        {/* Mission active */}
        <section className="space-y-4 lg:col-span-3">
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold">Commande #{mission.orderId}</h2>
              <Badge variant="outline" className="text-[10px]">
                {DELIVERY_STATUS_CONFIG[mission.status].label}
              </Badge>
              <span className="ml-auto text-sm font-semibold">
                {mission.fee.toLocaleString("fr-FR")} XAF
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {DELIVERY_STATUS_CONFIG[mission.status].description}
            </p>
          </div>

          <DeliveryMap
            route={mission.route}
            courierPosition={mission.courierPosition}
            pickupLabel={mission.pickup.label}
            dropoffLabel={mission.dropoff.label}
            etaMinutes={finished ? undefined : mission.etaMinutes}
            distanceKm={mission.distanceKm}
            height="h-72 md:h-96"
          />

          {/* Points de passage */}
          <div className="space-y-2 rounded-xl border border-border/60 bg-card p-4 text-xs">
            <p className="flex items-start gap-2">
              <Store className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <span><span className="font-medium text-foreground">Retrait</span> · {mission.pickup.label}</span>
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <span><span className="font-medium text-foreground">Livraison</span> · {mission.dropoff.label}</span>
            </p>
            {mission.instructions && (
              <p className="text-muted-foreground">Consigne : {mission.instructions}</p>
            )}
            <Button asChild size="sm" variant="outline" className="mt-1 h-8 gap-1.5 text-xs">
              <a href="tel:+237690000000"><Phone className="h-3.5 w-3.5" /> Appeler le client</a>
            </Button>
          </div>

          {/* Actions livreur */}
          {!finished ? (
            <div className={cn("flex flex-col gap-2 sm:flex-row")}>
              <Button className="h-11 flex-1 gap-2 text-sm font-semibold" onClick={advance}>
                {mission.status === "ARRIVED" ? <ShieldCheck className="h-4 w-4" /> : <Bike className="h-4 w-4" />}
                {actionLabel}
              </Button>
              <Button
                variant="outline"
                className="h-11 gap-2 text-sm text-destructive"
                onClick={() => setFailOpen(true)}
              >
                <AlertTriangle className="h-4 w-4" /> Échec
              </Button>
            </div>
          ) : (
            <div
              className={cn(
                "rounded-xl border p-4 text-sm",
                mission.status === "DELIVERED"
                  ? "border-primary/20 bg-primary/5"
                  : "border-destructive/20 bg-destructive/5",
              )}
            >
              <p className="font-semibold">
                {mission.status === "DELIVERED" ? "Livraison confirmée" : "Livraison en échec"}
              </p>
              <p className="text-xs text-muted-foreground">
                {mission.failureReason || "Le colis a été remis au client et le code a été validé."}
              </p>
            </div>
          )}
        </section>
      </main>

      <ReceptionCodeDialog
        open={codeOpen}
        onOpenChange={setCodeOpen}
        expectedCode={mission.receptionCode}
        onValidated={() => {
          update(mission.id, { status: "DELIVERED", progress: 1, courierPosition: mission.route[mission.route.length - 1] }, "Code validé");
          toast.success("Livraison confirmée !");
        }}
      />
      <DeliveryFailureDialog
        open={failOpen}
        onOpenChange={setFailOpen}
        onConfirm={(reason) => {
          update(mission.id, { status: "FAILED", failureReason: reason }, reason);
          toast.error("Échec signalé");
        }}
      />
    </div>
  );
}
