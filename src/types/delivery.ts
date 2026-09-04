// ==========================================================
// Delivery flow types (courier / tracking / map)
// ==========================================================

export type DeliveryStatus =
  | 'PENDING_ASSIGNMENT' // Commande prête, aucun livreur assigné
  | 'ASSIGNED'           // Un livreur a accepté la mission
  | 'HEADING_TO_PICKUP'  // Livreur en route vers la boutique
  | 'PICKED_UP'          // Colis récupéré
  | 'EN_ROUTE'           // En route vers le client
  | 'ARRIVED'            // Arrivé au point de livraison
  | 'DELIVERED'          // Remis au client (code validé)
  | 'FAILED';            // Échec (client absent, adresse erronée...)

export const DELIVERY_FLOW_STEPS: DeliveryStatus[] = [
  'PENDING_ASSIGNMENT',
  'ASSIGNED',
  'HEADING_TO_PICKUP',
  'PICKED_UP',
  'EN_ROUTE',
  'ARRIVED',
  'DELIVERED',
];

export interface DeliveryStatusInfo {
  label: string;
  description: string;
  /** Libellé de l'action côté livreur pour passer à l'étape suivante */
  courierAction?: string;
}

export const DELIVERY_STATUS_CONFIG: Record<DeliveryStatus, DeliveryStatusInfo> = {
  PENDING_ASSIGNMENT: {
    label: 'Recherche de livreur',
    description: 'La commande est prête, un livreur va être assigné',
    courierAction: 'Accepter la mission',
  },
  ASSIGNED: {
    label: 'Livreur assigné',
    description: 'Le livreur a accepté la mission',
    courierAction: 'Démarrer vers la boutique',
  },
  HEADING_TO_PICKUP: {
    label: 'En route vers la boutique',
    description: 'Le livreur se rend au point de retrait',
    courierAction: 'Colis récupéré',
  },
  PICKED_UP: {
    label: 'Colis récupéré',
    description: 'Le livreur a récupéré la commande',
    courierAction: 'Démarrer la livraison',
  },
  EN_ROUTE: {
    label: 'En route vers le client',
    description: 'Le livreur se dirige vers l\'adresse de livraison',
    courierAction: 'Je suis arrivé',
  },
  ARRIVED: {
    label: 'Arrivé sur place',
    description: 'Le livreur est au point de livraison',
    courierAction: 'Valider le code de réception',
  },
  DELIVERED: {
    label: 'Livrée',
    description: 'Le colis a été remis au client',
  },
  FAILED: {
    label: 'Échec de livraison',
    description: 'La livraison n\'a pas pu être effectuée',
  },
};

export const DELIVERY_FAILURE_REASONS = [
  'Client injoignable',
  'Adresse introuvable',
  'Client absent au rendez-vous',
  'Refus du colis',
  'Zone inaccessible',
  'Autre',
];

/** Coordonnée géographique (prête pour une vraie carte) */
export interface GeoPoint {
  lat: number;
  lng: number;
  label?: string;
}

export interface Courier {
  id: string;
  name: string;
  phone: string;
  vehicle: 'moto' | 'voiture' | 'velo' | 'pieton';
  rating: number;
  deliveries: number;
  plate?: string;
}

export interface DeliveryEvent {
  status: DeliveryStatus;
  timestamp: string;
  note?: string;
  position?: GeoPoint;
}

export interface Delivery {
  id: string;
  orderId: string;
  status: DeliveryStatus;
  courier?: Courier;
  pickup: GeoPoint;
  dropoff: GeoPoint;
  /** Trajet planifié (polyline simplifiée) */
  route: GeoPoint[];
  /** Position courante du livreur */
  courierPosition?: GeoPoint;
  /** Index de progression du livreur sur la polyline */
  progress: number;
  distanceKm: number;
  etaMinutes: number;
  fee: number;
  /** Code que le client communique au livreur à la remise */
  receptionCode: string;
  instructions?: string;
  events: DeliveryEvent[];
  failureReason?: string;
}

export const vehicleLabels: Record<Courier['vehicle'], string> = {
  moto: 'Moto',
  voiture: 'Voiture',
  velo: 'Vélo',
  pieton: 'À pied',
};

/** Étape suivante dans le flow livreur */
export function nextDeliveryStatus(status: DeliveryStatus): DeliveryStatus | null {
  const i = DELIVERY_FLOW_STEPS.indexOf(status);
  if (i === -1 || i === DELIVERY_FLOW_STEPS.length - 1) return null;
  return DELIVERY_FLOW_STEPS[i + 1];
}
