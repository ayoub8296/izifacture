import { Badge } from '../ui/Badge';

interface StatusBadgeProps {
  status: 'paid' | 'sent' | 'draft' | 'overdue' | 'cancelled' | 'accepted' | 'rejected' | 'expired';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    paid: { label: 'Payée', variant: 'success' as const },
    sent: { label: 'Envoyée', variant: 'warning' as const },
    draft: { label: 'Brouillon', variant: 'neutral' as const },
    overdue: { label: 'En retard', variant: 'orange' as const },
    cancelled: { label: 'Annulée', variant: 'error' as const },
    accepted: { label: 'Acceptée', variant: 'success' as const },
    rejected: { label: 'Refusée', variant: 'error' as const },
    expired: { label: 'Expirée', variant: 'neutral' as const },
  };

  const item = config[status] || { label: status, variant: 'neutral' as const };

  return <Badge variant={item.variant}>{item.label}</Badge>;
}
