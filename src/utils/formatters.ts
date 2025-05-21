// Format a number as currency (EUR)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

// Format date to localized string
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Get a color for a category (used for charts and indicators)
export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Alimentation': '#4F46E5', // Indigo
    'Transport': '#2563EB', // Blue
    'Logement': '#0891B2', // Cyan
    'Divertissement': '#D946EF', // Fuchsia
    'Éducation': '#4F46E5', // Indigo
    'Épargne': '#059669', // Emerald
    'Investissements': '#047857', // Green
    'Santé': '#0EA5E9', // Sky
    'Charges Fixes': '#F59E0B', // Amber
    'Divers': '#6B7280', // Gray
    'default': '#3B82F6' // Default blue
  };

  return colors[category] || colors.default;
};

// Calculate percentage
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Truncate text if it's too long
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};