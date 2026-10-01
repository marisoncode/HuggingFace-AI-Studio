import React, { useState } from 'react';
import { TrendingUp, Sparkles, Send, Loader2, AlertCircle } from 'lucide-react';
import { analyzeSentiment } from '../services/api';

export default function FinancialSentiment() {
  const [text, setText] = useState(
    'Operating revenue grew by 18% year-over-year while operating margins expanded to record levels.'
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please enter text to analyze.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await analyzeSentiment(text);
      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred while analyzing sentiment.');
    } finally {
      setLoading(false);
    }
  };

  const getLabelBadgeClass = (label) => {
    switch (label?.toLowerCase()) {
      case 'positive':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'negative':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded border border-indigo-500/30 text-indigo-400 bg-indigo-500/10">
              NLP
            </span>
            <span className="text-xs text-slate-400 font-mono">
              mrm8488/distilroberta-finetuned-financial-news-sentiment_v2
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-400" />
            Financial Sentiment Analysis
          </h1>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-rose-200">Analysis Error</h4>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Input Section */}
      <form onSubmit={handleSubmit} className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        <label className="block text-sm font-semibold text-slate-200">
          Financial News / Earnings Text Input
        </label>
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter financial sentence, news headline, or earnings excerpt..."
          disabled={loading}
          className="w-full rounded-lg bg-slate-950 border border-slate-800 p-3 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 transition-all"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/20"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Analyze Sentiment</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Result Container */}
      {result && (
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Analysis Results
            </h3>
            <span className="text-xs text-emerald-400 font-medium">Real Backend Response</span>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium text-sm">Sentiment Label:</span>
              <span className={`px-3 py-1 rounded-md text-sm font-bold border uppercase tracking-wider ${getLabelBadgeClass(result.label)}`}>
                {result.label}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300 font-medium">Confidence Score:</span>
              <span className="font-mono text-indigo-300 font-bold">
                {(result.score * 100).toFixed(2)}% ({result.score})
              </span>
            </div>

            {result.probabilities && (
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Class Probabilities
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(result.probabilities).map(([label, prob]) => (
                    <div key={label} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
                      <div className="text-xs text-slate-400">{label}</div>
                      <div className="text-sm font-mono font-semibold text-slate-200 mt-0.5">
                        {(prob * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
