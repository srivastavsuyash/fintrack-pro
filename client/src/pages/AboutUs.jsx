import { Wallet, Target, TrendingUp, Shield, Sparkles, RefreshCcw, FileText, Globe } from 'lucide-react'

const features = [
  { icon: TrendingUp, title: 'Smart Analytics', desc: 'Visual charts and graphs to understand your spending patterns at a glance.' },
  { icon: Target, title: 'Savings Goals', desc: 'Set financial targets and track your progress towards achieving them.' },
  { icon: RefreshCcw, title: 'Recurring Transactions', desc: 'Automate your regular income and expenses with smart scheduling.' },
  { icon: Sparkles, title: 'AI Insights', desc: 'Get personalized financial advice powered by advanced AI technology.' },
  { icon: FileText, title: 'Export Reports', desc: 'Download your financial data as PDF or CSV for offline analysis.' },
  { icon: Globe, title: 'Multi-Currency', desc: 'Support for 3 major currencies with real-time formatting.' },
  { icon: Shield, title: 'Secure & Private', desc: 'JWT authentication and encrypted passwords keep your data safe.' },
]

const AboutUs = () => {
  return (
    <div className="space-y-8 max-w-4xl">

      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-600 to-violet-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Wallet size={26} />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold">FinTrack Pro</h1>
            <p className="text-primary-100 text-sm">Your Personal Finance Companion</p>
          </div>
        </div>
        <p className="text-primary-100 text-base leading-relaxed max-w-2xl">
          FinTrack Pro helps users track expenses, manage budgets, monitor spending habits,
          and make better financial decisions through a simple, secure, and user-friendly experience.
        </p>
      </div>

      {/* Mission */}
      <div className="card">
        <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white mb-3">
          🎯 Our Mission
        </h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          We believe that financial clarity should be accessible to everyone. Our mission is to empower
          individuals to take full control of their financial life — whether it's tracking daily expenses,
          planning for a dream vacation, or building long-term savings. FinTrack Pro makes personal
          finance simple, visual, and actionable.
        </p>
      </div>

      {/* Features */}
      <div>
        <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white mb-4">
          ✨ Key Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mb-3">
                <Icon size={20} className="text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-1">{title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Future Vision */}
      <div className="card">
        <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white mb-3">
          🔮 Future Vision
        </h2>
        <div className="space-y-2">
          {[
            'Google OAuth & Social Login for faster onboarding',
            'WhatsApp & SMS notifications for budget alerts',
            'Bank Account Sync to auto-import transactions',
            'Mobile App support via React Native',
            'Advanced AI-powered monthly budget suggestions',
          ].map(item => (
            <div key={item} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
              <p className="text-slate-600 dark:text-slate-400 text-sm">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div className="card text-center py-6">
        <p className="text-slate-700 dark:text-slate-300 font-medium text-sm">
          Made with ❤️ by <span className="text-primary-600 dark:text-primary-400 font-semibold">Suyash Srivastava</span>
        </p>
        <p className="text-slate-400 text-xs mt-2">
          © {new Date().getFullYear()} FinTrack Pro. All rights reserved.
        </p>
      </div>

    </div>
  )
}

export default AboutUs