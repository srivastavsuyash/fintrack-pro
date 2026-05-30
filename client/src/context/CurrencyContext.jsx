import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext.jsx'

const CURRENCIES = {
  USD: { symbol: '$', locale: 'en-US' },
  EUR: { symbol: '€', locale: 'de-DE' },
  INR: { symbol: '₹', locale: 'en-IN' },
}

const CurrencyContext = createContext()

export const CurrencyProvider = ({ children }) => {
  const { user } = useAuth()
  const [currency, setCurrency] = useState('USD')

  // Load currency from user profile on login/refresh
  useEffect(() => {
    if (user?.currency && CURRENCIES[user.currency]) {
      setCurrency(user.currency)
    }
  }, [user])

  // Only update local state — no backend call here
  const changeCurrency = (newCurrency) => {
    if (!CURRENCIES[newCurrency]) return
    setCurrency(newCurrency)
  }

  const formatAmount = (amount) => {
    const { locale } = CURRENCIES[currency]
    const num = Number(amount) || 0
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(num)
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: changeCurrency, formatAmount, CURRENCIES }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => useContext(CurrencyContext)
export default CurrencyContext