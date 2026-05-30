import { Menu, Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useCurrency } from '../../context/CurrencyContext.jsx'

const CURRENCY_OPTIONS = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'INR', symbol: '₹' },
]

const Navbar = ({ onMenuClick }) => {
  const { isDark, toggleTheme } = useTheme()
  const { user } = useAuth()
  const { currency, setCurrency } = useCurrency()

  return (
    <header className="h-16 bg-white dark:bg-surface-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 md:px-6">

      {/* Left — Mobile Menu */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <Menu size={20} className="text-slate-600 dark:text-slate-400" />
      </button>

      {/* Page greeting */}
      <div className="hidden lg:block">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Welcome back,{' '}
          <span className="font-semibold text-slate-800 dark:text-white">
            {user?.name}
          </span>{' '}
          👋
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 ml-auto">

        {/* Currency Selector */}
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="text-xs border border-slate-200 dark:border-slate-700
            bg-white dark:bg-surface-800 text-slate-700 dark:text-slate-300
            rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2
            focus:ring-primary-500 cursor-pointer"
        >
          {CURRENCY_OPTIONS.map(c => (
            <option key={c.code} value={c.code}>
              {c.symbol} {c.code}
            </option>
          ))}
        </select>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDark
            ? <Sun size={18} className="text-yellow-400" />
            : <Moon size={18} className="text-slate-600" />
          }
        </button>

      </div>
    </header>
  )
}

export default Navbar