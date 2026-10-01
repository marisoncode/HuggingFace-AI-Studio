import React, { useState } from 'react';
import { FileText, Send, Loader2, AlertCircle, Copy, Check } from 'lucide-react';
import { summarizeText } from '../services/api';

const SAMPLES = [
  {
    label: 'Earnings Report',
    text: 'Global tech giant TechCorp announced its fourth-quarter financial results today, delivering record revenues of $45 billion, representing a 14% year-over-year increase driven primarily by surging enterprise cloud adoption. Operating margin expanded by 210 basis points to 28.5%, while free cash flow reached $12.4 billion. Chief Executive Officer Sarah Jenkins highlighted that investments in artificial intelligence infrastructure generated over $3.2 billion in new recurring revenue streams during the fiscal year. The company board approved an additional $10 billion share repurchase authorization and raised its quarterly cash dividend by 8%.'
  },
  {
    label: 'Market Strategy',
    text: 'Central banks across major economies have signaled a cautious transition toward monetary policy normalization following sustained disinflation trends across core indices. Federal reserve officials noted that while labor market conditions remain resilient, interest rate adjustments will depend strictly on incoming macroeconomic data. Financial markets reacted with moderate yield curve steepening, while equities in technology and industrial sectors posted broad gains.'
  }
];

export default function TextSummarization() {
  const [text, setText] = useState(SAMPLES[0].text);
  const [maxLength, setMaxLength] = useState(130);
  const [minLength, setMinLength] = useState(30);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please enter text to summarize.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await summarizeText(text, Number(maxLength), Number(minLength));
      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred during text summarization.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.summary_text || JSON.stringify(result));
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
              sshleifer/distilbart-cnn-12-6
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5 font-sans">
            <FileText className="w-6 h-6 text-indigo-400" />
            Text Summarization
          </h1>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-rose-200">Summarization Error</h4>
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
                Source Document / Text Input
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
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste long text, financial analysis, or news report to summarize..."
              disabled={loading}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50 transition-colors font-sans leading-relaxed"
            />

            {/* Parameters */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Max Tokens ({maxLength})
                </label>
                <input
                  type="range"
                  min="50"
                  max="300"
                  value={maxLength}
                  onChange={(e) => setMaxLength(e.target.value)}
                  className="w-full accent-indigo-500 bg-slate-950"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Min Tokens ({minLength})
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={minLength}
                  onChange={(e) => setMinLength(e.target.value)}
                  className="w-full accent-indigo-500 bg-slate-950"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm disabled:opacity-50 transition-colors shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Summarizing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Generate Summary</span>
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
                  Concise Summary Output
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
                  Run summarization to generate abstractive bullet points using DistilBART.
                </div>
              )}

              {loading && (
                <div className="py-16 flex flex-col items-center justify-center space-y-3 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                  <span className="text-xs font-mono">Synthesizing document context...</span>
                </div>
              )}

              {result && !loading && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 leading-relaxed font-sans">
                  {result.summary_text}
                </div>
              )}
            </div>

            <div className="pt-4 mt-6 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between">
              <span>Model: DistilBART-CNN-12-6</span>
              <span>Endpoint: /api/nlp/summarize</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
