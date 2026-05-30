import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import {
  LayoutDashboard, ArrowLeftRight, BarChart3,
  Target, RefreshCcw, Sparkles, User,
  LogOut, X, Wallet, Info, Mail
} from 'lucide-react'

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/savings', icon: Target, label: 'Savings Goals' },
  { path: '/recurring', icon: RefreshCcw, label: 'Recurring' },
  { path: '/ai-insights', icon: Sparkles, label: 'AI Insights' },
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/about', icon: Info, label: 'About Us' },
  { path: '/contact', icon: Mail, label: 'Contact Us' },
]

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-30 w-64 
      bg-white dark:bg-surface-900 
      border-r border-slate-100 dark:border-slate-800
      transform transition-transform duration-300 ease-in-out
      lg:relative lg:translate-x-0
      flex flex-col
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Wallet size={18} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg text-slate-800 dark:text-white">
            FinTrack Pro
          </span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X size={18} className="text-slate-500" />
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm text-slate-800 dark:text-white truncate">
              {user?.name}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-sm font-medium transition-all duration-200
              ${isActive
                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }
            `}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout — always at bottom */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
            text-sm font-medium text-red-500 hover:bg-red-50
            dark:hover:bg-red-900/20 transition-all duration-200"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar