import { LineItem } from './types';

/**
 * Calculates the total price for a single line item.
 * Both quantity and unitPrice are processed. FCFA is integer only.
 */
export function calculateLineTotal(quantity: number, unitPrice: number): number {
  if (isNaN(quantity) || isNaN(unitPrice)) return 0;
  return Math.round(quantity * unitPrice);
}

/**
 * Calculates subtotals, tax amount, and final total for an invoice or quote.
 * Prevents cumulative floating point rounding issues by rounding at key stages.
 */
export function calculateTotals(
  lineItems: Pick<LineItem, 'quantity' | 'unitPrice'>[],
  tvaRate: number
): {
  subtotal: number;
  tvaAmount: number;
  total: number;
} {
  // 1. Calculate each line's total and sum them up for the subtotal
  const subtotal = lineItems.reduce((acc, item) => {
    return acc + calculateLineTotal(item.quantity, item.unitPrice);
  }, 0);

  // 2. Calculate TVA amount (rounded to nearest integer)
  const tvaAmount = Math.round(subtotal * (tvaRate / 100));

  // 3. Calculate grand total
  const total = subtotal + tvaAmount;

  return {
    subtotal,
    tvaAmount,
    total,
  };
}
