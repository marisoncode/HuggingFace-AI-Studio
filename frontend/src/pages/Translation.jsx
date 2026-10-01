import React, { useState } from 'react';
import { Languages, Send, Loader2, AlertCircle, Copy, Check } from 'lucide-react';
import { translateText } from '../services/api';

const SAMPLES = [
  {
    label: 'Business',
    text: 'Our financial quarterly results demonstrate strong growth across international cloud markets.'
  },
  {
    label: 'Technical',
    text: 'Artificial intelligence models require high-density GPU clusters for efficient inference execution.'
  }
];

export default function Translation() {
  const [text, setText] = useState(SAMPLES[0].text);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please enter English text to translate.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await translateText(text);
      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred during translation.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.translation_text || JSON.stringify(result));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              HuggingFaceH4/opus-mt-en-fr
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5 font-sans">
            <Languages className="w-6 h-6 text-indigo-400" />
            English → French Translation
          </h1>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-rose-200">Translation Error</h4>
            <p className="mt-0.5 text-xs text-rose-300">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Column */}
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-white flex items-center gap-2 font-sans">
                <span>English Source Text</span>
                <span className="text-xs font-mono text-slate-400 uppercase">(EN)</span>
              </label>
            </div>

            {/* Presets */}
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
              placeholder="Enter English sentences or paragraphs..."
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
                    <span>Translating...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Translate to French</span>
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
                <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 font-sans">
                  <span>French Target Output</span>
                  <span className="text-xs font-mono text-slate-400 uppercase">(FR)</span>
                </h3>
                {result && (
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>

              {!result && !loading && (
                <div className="py-16 text-center text-slate-400 text-sm font-sans">
                  Run translation to generate fluent French text output.
                </div>
              )}

              {loading && (
                <div className="py-16 flex flex-col items-center justify-center space-y-3 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                  <span className="text-xs font-mono">Translating sequence with MarianMT...</span>
                </div>
              )}

              {result && !loading && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 leading-relaxed font-sans">
                  {result.translation_text}
                </div>
              )}
            </div>

            <div className="pt-4 mt-6 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between">
              <span>Model: OPUS-MT-EN-FR</span>
              <span>Endpoint: /api/nlp/translate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
