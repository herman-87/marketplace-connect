// Order Status Types
export type OrderStatus =
  // --- Cycle normal ---
  | 'CREATED'           // Order créé, en attente de décision du business
  | 'ACCEPTED'          // Accepté par le business
  | 'REJECTED'          // Refusé par le business
  | 'PENDING_PAYMENT'   // Accepté mais paiement non encore effectué
  | 'PAID'              // Paiement effectué
  | 'PENDING_DELIVERY'  // En attente d'un livreur
  | 'IN_DELIVERY'       // En cours de livraison
  | 'DELIVERED'         // Livré au client
  | 'COMPLETED'         // Order clôturé avec succès
  // --- Échecs automatiques ---
  | 'CANCELLED_BY_CLIENT' // Annulé par le client
  | 'PAYMENT_FAILED'      // Échec ou expiration du paiement
  | 'DELIVERY_FAILED'     // Problème de livraison
  | 'ACCEPTANCE_TIMEOUT'  // Business n'a pas accepté à temps
  // --- Cas spéciaux ---
  | 'DISPUTED';           // Contentieux ouvert

// Checkout Steps (client side)
export type CheckoutStep = 
  | 'cart'           // Review cart items
  | 'delivery'       // Delivery address & info
  | 'summary'        // Recap of order
  | 'confirmation';  // Final confirmation

export type UserRole = 'client' | 'business';

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface OrderProduct {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: string;
  customer: { name: string; phone?: string; avatar?: string };
  products: OrderProduct[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  deliveryAddress?: string;
  deliveryMethod?: 'standard' | 'express' | 'scheduled';
  statusHistory: StatusHistoryEntry[];
  rejectionReason?: string;
  paymentMethod?: string;
}

export interface OrderStatusInfo {
  status: OrderStatus;
  label: string;
  description: string;
  color: 'default' | 'warning' | 'success' | 'destructive' | 'secondary';
  icon: string;
}

// The normal flow order for the timeline
export const ORDER_FLOW_STEPS: OrderStatus[] = [
  'CREATED',
  'ACCEPTED',
  'PENDING_PAYMENT',
  'PAID',
  'PENDING_DELIVERY',
  'IN_DELIVERY',
  'DELIVERED',
  'COMPLETED',
];

export const ORDER_STATUS_CONFIG: Record<OrderStatus, Omit<OrderStatusInfo, 'status'>> = {
  CREATED: {
    label: 'En attente',
    description: 'Votre commande est en cours de validation par le vendeur',
    color: 'secondary',
    icon: 'Clock'
  },
  ACCEPTED: {
    label: 'Acceptée',
    description: 'Le vendeur a accepté votre commande',
    color: 'success',
    icon: 'CheckCircle'
  },
  REJECTED: {
    label: 'Refusée',
    description: 'Le vendeur a refusé votre commande',
    color: 'destructive',
    icon: 'XCircle'
  },
  PENDING_PAYMENT: {
    label: 'En attente de paiement',
    description: 'Veuillez procéder au paiement pour confirmer votre commande',
    color: 'warning',
    icon: 'CreditCard'
  },
  PAID: {
    label: 'Payée',
    description: 'Votre paiement a été confirmé',
    color: 'success',
    icon: 'CheckCircle2'
  },
  PENDING_DELIVERY: {
    label: 'En préparation',
    description: 'Votre commande est en attente d\'un livreur',
    color: 'secondary',
    icon: 'Package'
  },
  IN_DELIVERY: {
    label: 'En livraison',
    description: 'Votre commande est en cours de livraison',
    color: 'warning',
    icon: 'Truck'
  },
  DELIVERED: {
    label: 'Livrée',
    description: 'Votre commande a été livrée',
    color: 'success',
    icon: 'PackageCheck'
  },
  COMPLETED: {
    label: 'Terminée',
    description: 'Commande clôturée avec succès',
    color: 'success',
    icon: 'CheckCircle2'
  },
  CANCELLED_BY_CLIENT: {
    label: 'Annulée',
    description: 'Vous avez annulé cette commande',
    color: 'secondary',
    icon: 'Ban'
  },
  PAYMENT_FAILED: {
    label: 'Échec du paiement',
    description: 'Le paiement a échoué ou a expiré',
    color: 'destructive',
    icon: 'AlertTriangle'
  },
  DELIVERY_FAILED: {
    label: 'Échec de livraison',
    description: 'Un problème est survenu lors de la livraison',
    color: 'destructive',
    icon: 'AlertTriangle'
  },
  ACCEPTANCE_TIMEOUT: {
    label: 'Expirée',
    description: 'Le vendeur n\'a pas répondu à temps',
    color: 'secondary',
    icon: 'Clock'
  },
  DISPUTED: {
    label: 'Litige en cours',
    description: 'Un contentieux est ouvert sur cette commande',
    color: 'warning',
    icon: 'AlertCircle'
  }
};
