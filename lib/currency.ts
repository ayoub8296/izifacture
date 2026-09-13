/**
 * Formats a number to FCFA/XOF/XAF currency style (no decimals, space/dot separation).
 * Example: 1500000 -> 1 500 000 FCFA
 */
export function formatFCFA(amount: number, currency: string = 'FCFA'): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return `0 ${currency}`;
  }
  
  const integerAmount = Math.round(amount);
  
  // Format with space separators
  const formatted = new Intl.NumberFormat('fr-FR', {
    useGrouping: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(integerAmount);
  
  return `${formatted} ${currency}`;
}

/**
 * Formats date from YYYY-MM-DD to DD/MM/YYYY
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString; // Fallback if already formatted
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}
