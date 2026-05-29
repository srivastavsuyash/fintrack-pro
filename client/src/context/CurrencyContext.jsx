import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';

const CurrencyContext = createContext();

const CURRENCY_CONFIG = {
  USD: { symbol: '$', locale: 'en-US' },
  EUR: { symbol: '€', locale: 'de-DE' },
  GBP: { symbol: '£', locale: 'en-GB' },
  INR: { symbol: '₹', locale: 'en-IN' },
  JPY: { symbol: '¥', locale: 'ja-JP' },
  CAD: { symbol: 'C$', locale: 'en-CA' },
  AUD: { symbol: 'A$', locale: 'en-AU' },
};

export const CurrencyProvider = ({ children }) => {
  const { user } = useAuth();
  const [currency, setCurrency] = useState('USD');

  // Sirf ek baar user change hone pe update karo
  useEffect(() => {
    if (user?.currency && user.currency !== currency) {
      setCurrency(user.currency);
    }
  }, [user?.currency]); // ← sirf user.currency watch karo

  const formatAmount = (amount) => {
    const config = CURRENCY_CONFIG[currency];
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: currency,
    }).format(amount || 0);
  };

  const getCurrencySymbol = () => {
    return CURRENCY_CONFIG[currency]?.symbol || '$';
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      formatAmount,
      getCurrencySymbol,
      CURRENCY_CONFIG
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);