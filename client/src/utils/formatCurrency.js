export const formatCurrency = (amount, currency = 'USD') => {
  const config = {
    USD: { locale: 'en-US' },
    EUR: { locale: 'de-DE' },
    GBP: { locale: 'en-GB' },
    INR: { locale: 'en-IN' },
    JPY: { locale: 'ja-JP' },
    CAD: { locale: 'en-CA' },
    AUD: { locale: 'en-AU' },
  };

  return new Intl.NumberFormat(config[currency]?.locale || 'en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};