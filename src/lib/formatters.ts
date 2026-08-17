/**
 * Format a number as currency in FCFA (XOF) or specified currency
 * e.g., 12450000 -> "12 450 000 FCFA"
 */
export function formatCurrency(
  amount: number | undefined | null,
  currency: string = 'FCFA'
): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return `0 ${currency}`;
  }

  // Format with space as thousands separator
  const formattedNumber = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return `${formattedNumber} ${currency}`;
}

/**
 * Format dates into French locale (e.g., "31 Mai 2025")
 */
export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const months = [
      'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
      'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'
    ];

    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  } catch {
    return dateString;
  }
}

/**
 * Format short date (e.g., "31 Mai")
 */
export function formatShortDate(dateString: string | undefined | null): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const months = [
      'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
      'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'
    ];

    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];

    return `${day} ${month}`;
  } catch {
    return dateString;
  }
}

/**
 * Format percentage change with sign (e.g., "+ 18.6%")
 */
export function formatPercentage(rate: number): { text: string; isPositive: boolean } {
  const isPositive = rate >= 0;
  const absRate = Math.abs(rate).toFixed(1);
  return {
    text: `${isPositive ? '+' : '-'} ${absRate}%`,
    isPositive,
  };
}

/**
 * Get color scheme class for invoice status badge
 */
export function getStatusBadgeConfig(status: string): {
  label: string;
  badgeClass: string;
  dotClass: string;
} {
  switch (status) {
    case 'paid':
      return {
        label: 'Payée',
        badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-medium',
        dotClass: 'bg-emerald-500',
      };
    case 'pending':
    case 'sent':
      return {
        label: 'En attente',
        badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200/60 font-medium',
        dotClass: 'bg-amber-500',
      };
    case 'overdue':
      return {
        label: 'En retard',
        badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200/60 font-medium',
        dotClass: 'bg-rose-500',
      };
    case 'draft':
      return {
        label: 'Brouillon',
        badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200 font-medium',
        dotClass: 'bg-slate-400',
      };
    case 'cancelled':
      return {
        label: 'Annulée',
        badgeClass: 'bg-gray-100 text-gray-500 border border-gray-200 font-medium',
        dotClass: 'bg-gray-400',
      };
    default:
      return {
        label: status,
        badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200 font-medium',
        dotClass: 'bg-slate-400',
      };
  }
}

/**
 * Get payment provider details
 */
export function getProviderDetails(provider: string): {
  name: string;
  badgeClass: string;
  iconName: string;
} {
  switch (provider) {
    case 'wave':
      return {
        name: 'Wave',
        badgeClass: 'bg-sky-50 text-sky-600 border border-sky-200',
        iconName: 'Smartphone',
      };
    case 'orange_money':
      return {
        name: 'Orange Money',
        badgeClass: 'bg-orange-50 text-orange-600 border border-orange-200',
        iconName: 'Smartphone',
      };
    case 'stripe':
      return {
        name: 'Stripe',
        badgeClass: 'bg-indigo-50 text-indigo-600 border border-indigo-200',
        iconName: 'CreditCard',
      };
    case 'bank_transfer':
      return {
        name: 'Virement',
        badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200',
        iconName: 'Building',
      };
    case 'cash':
      return {
        name: 'Espèces',
        badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        iconName: 'Banknote',
      };
    default:
      return {
        name: 'Manuel',
        badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200',
        iconName: 'CheckCircle',
      };
  }
}
