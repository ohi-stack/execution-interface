export const formatDateTime = (value) => new Date(value).toLocaleString();

export const formatCompactNumber = (value) =>
  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
