import React, { useState } from 'react';
import { TrendingUp, Send, Loader2, AlertCircle, Copy, Check } from 'lucide-react';
import { analyzeSentiment } from '../services/api';

const SAMPLES = [
  {
    label: 'Bullish',
    text: 'Operating revenue grew by 24% year-over-year while operating margins expanded to record levels.'
  },
  {
    label: 'Bearish',
    text: 'The firm reported lower net quarterly profit and reduced full-year financial guidance due to supply disruptions.'
  },
  {
    label: 'Neutral',
    text: 'The board scheduled its regular annual shareholder meeting for November 14th in Chicago.'
  }
];

export default function FinancialSentiment() {
  const [text, setText] = useState(SAMPLES[0].text);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please enter financial text to analyze.');
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

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLabelBadge = (label) => {
    const l = label?.toLowerCase() || '';
    if (l.includes('positive') || l.includes('bullish')) {
      return 'bg-emerald-950 text-emerald-300 border-emerald-700/60';
    }
    if (l.includes('negative') || l.includes('bearish')) {
      return 'bg-rose-950 text-rose-300 border-rose-700/60';
    }
    return 'bg-amber-950 text-amber-300 border-amber-700/60';
  };

  return (
    <div className="space-y-6 max-w-5xl font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-indigo-950 border border-indigo-700/60 text-indigo-300">
              NLP
            </span>
            <span className="text-xs text-slate-400 font-mono">
              distilroberta-finetuned-financial-news-sentiment
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5 font-sans">
            <TrendingUp className="w-6 h-6 text-indigo-400" />
            Financial Sentiment Analysis
          </h1>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-rose-200">Analysis Error</h4>
            <p className="mt-0.5 text-xs text-rose-300">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form Column */}
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-white font-sans">
                Financial News / Text Excerpt
              </label>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Preset:</span>
              {SAMPLES.map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  onClick={() => setText(sample.text)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors font-sans"
                >
                  {sample.label}
                </button>
              ))}
            </div>

            <textarea
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter financial sentence, news headline, or earnings excerpt..."
              disabled={loading}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50 transition-colors font-sans leading-relaxed"
            />

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm disabled:opacity-50 transition-colors shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Run Analysis</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Column */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 h-full flex flex-col justify-between shadow-md">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-semibold text-slate-200 font-sans">
                  Model Output
                </h3>
                {result && (
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'JSON'}</span>
                  </button>
                )}
              </div>

              {!result && !loading && (
                <div className="py-12 text-center text-slate-400 text-sm font-sans">
                  Run analysis to view predicted sentiment classification and confidence scores.
                </div>
              )}

              {loading && (
                <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                  <span className="text-xs font-mono">Running DistilRoBERTa model pipeline...</span>
                </div>
              )}

              {result && !loading && (
                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-xs font-mono uppercase">Predicted Sentiment</span>
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border uppercase tracking-wide ${getLabelBadge(result.label)}`}>
                        {result.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-800">
                      <span className="text-slate-400 text-xs font-mono">Confidence Score</span>
                      <span className="font-mono text-white font-bold">
                        {(result.score * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {result.probabilities && (
                    <div className="space-y-3">
                      <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                        Class Probability Distribution
                      </span>
                      <div className="space-y-2">
                        {Object.entries(result.probabilities).map(([label, prob]) => {
                          const percentage = (prob * 100).toFixed(1);
                          return (
                            <div key={label} className="space-y-1">
                              <div className="flex justify-between text-xs font-mono">
                                <span className="text-slate-300">{label}</span>
                                <span className="text-slate-400">{percentage}%</span>
                              </div>
                              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                <div
                                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 mt-6 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between">
              <span>Latency: Real-time API</span>
              <span>Endpoint: /api/nlp/sentiment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
