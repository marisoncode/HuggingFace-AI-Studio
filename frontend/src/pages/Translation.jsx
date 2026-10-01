import React, { useState } from 'react';
import { Languages, Sparkles, Send, Loader2, AlertCircle } from 'lucide-react';
import { translateText } from '../services/api';

export default function Translation() {
  const [text, setText] = useState(
    'Artificial intelligence is transforming business analytics and automated data workflows.'
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please enter English text to translate.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await translateText(text, 'French');
      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred while translating text.');
    } finally {
      setLoading(false);
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
              Helsinki-NLP/opus-mt-en-fr
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Languages className="w-6 h-6 text-indigo-400" />
            English → French Translation
          </h1>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-rose-200">Translation Error</h4>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        <label className="block text-sm font-semibold text-slate-200">
          English Source Text
        </label>
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter English sentences to translate into French..."
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
                <span>Translating...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Translate Text</span>
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
              French Translation ({result.target_language || 'French'})
            </h3>
            <span className="text-xs text-emerald-400 font-medium">Real Backend Response</span>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 text-sm text-slate-100 font-medium leading-relaxed italic">
            "{result.translated_text}"
          </div>
        </div>
      )}
    </div>
  );
}
