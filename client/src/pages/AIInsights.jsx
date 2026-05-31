import { useState } from 'react'
import { Sparkles, RefreshCw, TrendingUp, AlertCircle } from 'lucide-react'
import { getAIInsights } from '../services/aiService.js'

const AIInsights = () => {
  const [insight, setInsight] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchInsights = async () => {
    try {
      setLoading(true)
      setError('')
      setInsight('')
      const data = await getAIInsights()
      setInsight(data.insight)
    } catch {
      setError('Failed to get AI insights. Please check your API key.')
    } finally {
      setLoading(false)
    }
  }

  const formatInsight = (text) => {
    return text.split('\n').filter(line => line.trim()).map((line, i) => {
      const isNumbered = /^\d+\./.test(line.trim())
      const isBullet = line.trim().startsWith('-') || line.trim().startsWith('•')
      return (
        <div key={i} className={`flex gap-3 ${(isNumbered || isBullet) ? 'items-start' : ''}`}>
          {(isNumbered || isBullet) && (
            <span className="w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              <TrendingUp size={12} />
            </span>
          )}
          <p className={`text-slate-700 dark:text-slate-300 text-sm leading-relaxed ${isNumbered || isBullet ? '' : 'font-medium text-base text-slate-800 dark:text-white'}`}>
            {line.replace(/^\d+\.\s*/, '').replace(/^[-•]\s*/, '')}
          </p>
        </div>
      )
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white">AI Insights</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Powered by AI — personalized financial advice</p>
      </div>

      {/* Hero Card */}
      <div className="bg-gradient-to-r from-primary-600 to-violet-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Sparkles size={22} />
          </div>
          <div>
            <p className="font-display font-bold text-lg">Smart Finance Advisor</p>
            <p className="text-primary-100 text-sm">Analyzes your last 50 transactions</p>
          </div>
        </div>
        <p className="text-primary-100 text-sm mb-4">
          Get personalized insights, spending patterns, and actionable tips to improve your financial health.
        </p>
        <button onClick={fetchInsights} disabled={loading}
          className="bg-white text-primary-600 font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-primary-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
          {loading
            ? <><RefreshCw size={16} className="animate-spin" /> Analyzing...</>
            : <><Sparkles size={16} /> Get AI Insights</>
          }
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="card text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">Analyzing your transactions...</p>
          <p className="text-slate-400 text-sm mt-1">AI is reviewing your spending patterns</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="card border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-red-500" />
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Insights */}
      {insight && !loading && (
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={18} className="text-primary-600" />
            <h3 className="font-display font-semibold text-slate-800 dark:text-white">
              Your Personalized Insights
            </h3>
          </div>
          <div className="space-y-4">
            {formatInsight(insight)}
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-400">
          ✨ AI Generated • Based on your recent transaction history
          </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!insight && !loading && !error && (
        <div className="card text-center py-12">
          <Sparkles size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">Ready to analyze your finances</p>
          <p className="text-slate-400 text-sm mt-1">Click the button above to get your personalized insights</p>
        </div>
      )}
    </div>
  )
}

export default AIInsights