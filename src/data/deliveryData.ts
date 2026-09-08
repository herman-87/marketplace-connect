import { Courier, Delivery, GeoPoint } from "@/types/delivery";

export const mockCouriers: Courier[] = [
  { id: "LIV-001", name: "Samuel Ndongo", phone: "+237 6 90 12 34 56", vehicle: "moto", rating: 4.8, deliveries: 428, plate: "LT-4821-A" },
  { id: "LIV-002", name: "Fatou Bello", phone: "+237 6 77 88 21 09", vehicle: "moto", rating: 4.9, deliveries: 612, plate: "LT-1093-C" },
  { id: "LIV-003", name: "Eric Mbarga", phone: "+237 6 55 32 74 11", vehicle: "voiture", rating: 4.6, deliveries: 173, plate: "CE-7742-B" },
];

/** Trajet simplifié (Douala) — sert de polyline pour la carte */
const defaultRoute: GeoPoint[] = [
  { lat: 4.0511, lng: 9.7679, label: "Boutique" },
  { lat: 4.0489, lng: 9.7724 },
  { lat: 4.0462, lng: 9.7768 },
  { lat: 4.0447, lng: 9.7831 },
  { lat: 4.0421, lng: 9.7885 },
  { lat: 4.0398, lng: 9.7942 },
  { lat: 4.0376, lng: 9.7998, label: "Client" },
];

export function generateReceptionCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export function createDelivery(
  orderId: string,
  options?: { address?: string; fee?: number; courier?: Courier },
): Delivery {
  const route = defaultRoute;
  return {
    id: `DLV-${orderId}`,
    orderId,
    status: options?.courier ? "ASSIGNED" : "PENDING_ASSIGNMENT",
    courier: options?.courier,
    pickup: { ...route[0] },
    dropoff: { ...route[route.length - 1], label: options?.address || "Client" },
    route,
    courierPosition: options?.courier ? { ...route[0] } : undefined,
    progress: 0,
    distanceKm: 5.4,
    etaMinutes: 22,
    fee: options?.fee ?? 1500,
    receptionCode: generateReceptionCode(),
    instructions: "Appeler à l'arrivée, portail bleu.",
    events: [
      { status: "PENDING_ASSIGNMENT", timestamp: new Date().toISOString(), note: "Commande prête pour la livraison" },
    ],
  };
}

/** Position interpolée le long de la polyline (0 → 1) */
export function positionAtProgress(route: GeoPoint[], progress: number): GeoPoint {
  const clamped = Math.min(1, Math.max(0, progress));
  const scaled = clamped * (route.length - 1);
  const i = Math.min(route.length - 2, Math.floor(scaled));
  const t = scaled - i;
  const a = route[i];
  const b = route[i + 1];
  return { lat: a.lat + (b.lat - a.lat) * t, lng: a.lng + (b.lng - a.lng) * t };
}
