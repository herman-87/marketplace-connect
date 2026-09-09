import { useMemo } from "react";
import { Bike, Store, MapPin, Navigation } from "lucide-react";
import { GeoPoint } from "@/types/delivery";
import { cn } from "@/lib/utils";

interface DeliveryMapProps {
  route: GeoPoint[];
  courierPosition?: GeoPoint;
  pickupLabel?: string;
  dropoffLabel?: string;
  etaMinutes?: number;
  distanceKm?: number;
  className?: string;
  /** Hauteur de la carte */
  height?: string;
}

const PAD = 12;

/**
 * Carte de livraison (rendu schématique).
 * Le trajet est projeté en coordonnées normalisées : brancher un vrai
 * fournisseur de carte plus tard ne change pas l'interface du composant.
 */
export function DeliveryMap({
  route,
  courierPosition,
  pickupLabel = "Boutique",
  dropoffLabel = "Client",
  etaMinutes,
  distanceKm,
  className,
  height = "h-64 md:h-80",
}: DeliveryMapProps) {
  const { points, project } = useMemo(() => {
    const lats = route.map((p) => p.lat);
    const lngs = route.map((p) => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const spanLat = maxLat - minLat || 1;
    const spanLng = maxLng - minLng || 1;
    const proj = (p: GeoPoint) => ({
      x: PAD + ((p.lng - minLng) / spanLng) * (100 - PAD * 2),
      y: PAD + ((maxLat - p.lat) / spanLat) * (100 - PAD * 2),
    });
    return { points: route.map(proj), project: proj };
  }, [route]);

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const start = points[0];
  const end = points[points.length - 1];
  const courier = courierPosition ? project(courierPosition) : null;

  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-border/60 bg-muted/30", height, className)}>
      {/* Grille de fond */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="dm-grid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M8 0 L0 0 0 8" fill="none" stroke="hsl(var(--border))" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#dm-grid)" />
        {/* Axes routiers décoratifs */}
        <path d="M0,68 L100,52" stroke="hsl(var(--border))" strokeWidth="2.4" fill="none" />
        <path d="M22,0 L38,100" stroke="hsl(var(--border))" strokeWidth="1.8" fill="none" />
        <path d="M70,0 L78,100" stroke="hsl(var(--border))" strokeWidth="1.4" fill="none" />

        {/* Trajet */}
        <path d={path} fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.6" strokeOpacity="0.35" strokeLinecap="round" />
        <path
          d={path}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="4 3"
          className="animate-route-dash"
        />
      </svg>

      {/* Marqueur boutique */}
      <Marker x={start.x} y={start.y} label={pickupLabel} tone="muted" icon={<Store className="h-3.5 w-3.5" />} />
      {/* Marqueur client */}
      <Marker x={end.x} y={end.y} label={dropoffLabel} tone="primary" icon={<MapPin className="h-3.5 w-3.5" />} />

      {/* Livreur */}
      {courier && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-linear"
          style={{ left: `${courier.x}%`, top: `${courier.y}%` }}
        >
          <span className="absolute inset-0 -m-2 animate-ping rounded-full bg-primary/30" />
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-md">
            <Bike className="h-4 w-4" />
          </span>
        </div>
      )}

      {/* Overlay ETA */}
      {(etaMinutes !== undefined || distanceKm !== undefined) && (
        <div className="absolute left-2 top-2 flex items-center gap-3 rounded-lg border border-border/60 bg-background/90 px-3 py-2 backdrop-blur-sm">
          <Navigation className="h-4 w-4 shrink-0 text-primary" />
          <div className="min-w-0 flex-1 text-xs">
            {etaMinutes !== undefined && (
              <p className="font-semibold">Arrivée estimée dans {etaMinutes} min</p>
            )}
            {distanceKm !== undefined && (
              <p className="text-muted-foreground">{distanceKm.toFixed(1)} km de trajet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Marker({
  x, y, label, icon, tone,
}: { x: number; y: number; label: string; icon: React.ReactNode; tone: "primary" | "muted" }) {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
      <span
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full border-2 border-background shadow-sm",
          tone === "primary" ? "bg-primary text-primary-foreground" : "bg-foreground text-background",
        )}
      >
        {icon}
      </span>
      <span className="mt-1 block max-w-[110px] truncate rounded bg-background/85 px-1.5 py-0.5 text-[10px] font-medium text-foreground">
        {label}
      </span>
    </div>
  );
}
