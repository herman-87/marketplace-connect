// Taux de TVA par défaut (modifiable selon la juridiction du business)
export const DEFAULT_VAT_RATE = 0.20; // 20%

/** Convertit un prix TTC en HT */
export function toHT(ttc: number, rate: number = DEFAULT_VAT_RATE): number {
  return ttc / (1 + rate);
}

/** Convertit un prix HT en TTC */
export function toTTC(ht: number, rate: number = DEFAULT_VAT_RATE): number {
  return ht * (1 + rate);
}

/** Formatte un montant en devise locale */
export function formatPrice(amount: number, currency: string = "EUR", locale: string = "fr-FR"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
