import React, { useState } from 'react';
import { HelpCircle, Send, Loader2, AlertCircle, Copy, Check } from 'lucide-react';
import { answerQuestion } from '../services/api';

const SAMPLES = [
  {
    label: 'Earnings Q&A',
    context: 'TechCorp recorded $12.4 billion in annual free cash flow during fiscal year 2024, representing a 15% expansion year-over-year. The board approved a $5 billion dividend payout scheduled for quarterly distribution starting in Q1.',
    question: 'How much free cash flow did TechCorp generate in FY 2024?'
  },
  {
    label: 'Policy Q&A',
    context: 'The European Central Bank maintained its benchmark refinancing rate at 4.25% during its Frankfurt policy assembly.',
    question: 'What is the benchmark refinancing rate?'
  }
];

export default function QuestionAnswering() {
  const [context, setContext] = useState(SAMPLES[0].context);
  const [question, setQuestion] = useState(SAMPLES[0].question);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!context.trim() || !question.trim()) {
      setError('Please provide both context text and a target question.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await answerQuestion(question, context);
      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred during question answering.');
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

  return (
    <div className="space-y-6 max-w-5xl font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b dark:border-slate-800 border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-indigo-950 bg-indigo-100 border dark:border-indigo-700/60 border-indigo-200 dark:text-indigo-300 text-indigo-700">
              NLP
            </span>
            <span className="text-xs dark:text-slate-400 text-slate-500 font-mono">
              deepset/roberta-base-squad2
            </span>
          </div>
          <h1 className="text-2xl font-bold dark:text-white text-slate-900 tracking-tight flex items-center gap-2.5 font-sans">
            <HelpCircle className="w-6 h-6 text-indigo-500" />
            Extractive Question Answering
          </h1>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl dark:bg-rose-950/60 bg-rose-50 border dark:border-rose-800 border-rose-200 dark:text-rose-300 text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold dark:text-rose-200 text-rose-900">Processing Error</h4>
            <p className="mt-0.5 text-xs dark:text-rose-300 text-rose-700">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form Column */}
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 p-5 space-y-4 shadow-md">
            {/* Presets */}
            <div className="flex items-center justify-between">
              <span className="text-xs dark:text-slate-400 text-slate-500 font-mono">Preset:</span>
              <div className="flex items-center gap-2">
                {SAMPLES.map((sample) => (
                  <button
                    key={sample.label}
                    type="button"
                    onClick={() => {
                      setContext(sample.context);
                      setQuestion(sample.question);
                    }}
                    className="px-2.5 py-1 text-xs rounded-lg dark:bg-slate-800 bg-slate-100 dark:hover:bg-slate-700 hover:bg-slate-200 dark:text-slate-200 text-slate-700 border dark:border-slate-700 border-slate-300 transition-colors font-sans"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono dark:text-slate-400 text-slate-500 uppercase tracking-wider">
                Context Passage
              </label>
              <textarea
                rows={5}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Paste paragraph or document context passage..."
                disabled={loading}
                className="w-full rounded-xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 p-3.5 text-sm dark:text-slate-100 text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50 transition-colors font-sans leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono dark:text-slate-400 text-slate-500 uppercase tracking-wider">
                Target Question
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What specific fact do you want to extract?"
                disabled={loading}
                className="w-full rounded-xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 p-3.5 text-sm dark:text-slate-100 text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50 transition-colors font-sans"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm disabled:opacity-50 transition-colors shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extracting Answer...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Run Query</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Column */}
        <div className="space-y-4">
          <div className="rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 p-5 h-full flex flex-col justify-between shadow-md">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b dark:border-slate-800 border-slate-200 pb-3">
                <h3 className="text-sm font-semibold dark:text-slate-200 text-slate-800 font-sans">
                  Extracted Answer
                </h3>
                {result && (
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg dark:bg-slate-800 bg-slate-100 dark:hover:bg-slate-700 hover:bg-slate-200 dark:text-slate-300 text-slate-700 text-xs font-mono transition-colors border dark:border-slate-700 border-slate-300"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'JSON'}</span>
                  </button>
                )}
              </div>

              {!result && !loading && (
                <div className="py-16 text-center dark:text-slate-400 text-slate-500 text-sm font-sans">
                  Enter context and question to extract exact answer substring using RoBERTa.
                </div>
              )}

              {loading && (
                <div className="py-16 flex flex-col items-center justify-center space-y-3 dark:text-slate-400 text-slate-500">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                  <span className="text-xs font-mono">Searching span indices in context...</span>
                </div>
              )}

              {result && !loading && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-3">
                    <div className="text-xs font-mono dark:text-slate-400 text-slate-500 uppercase">Extracted Answer</div>
                    <div className="text-base font-semibold dark:text-white text-slate-900 font-sans">
                      "{result.answer}"
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-1">
                      <div className="text-[11px] font-mono dark:text-slate-400 text-slate-500">Confidence Score</div>
                      <div className="text-sm font-mono font-bold dark:text-white text-slate-900">
                        {result.score ? (result.score * 100).toFixed(2) : '100'}%
                      </div>
                    </div>
                    <div className="p-3 rounded-xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-1">
                      <div className="text-[11px] font-mono dark:text-slate-400 text-slate-500">Character Range</div>
                      <div className="text-sm font-mono font-semibold dark:text-slate-300 text-slate-700">
                        [{result.start || 0} : {result.end || 0}]
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 mt-6 border-t dark:border-slate-800 border-slate-200 text-[11px] font-mono dark:text-slate-400 text-slate-500 flex justify-between">
              <span>Model: RoBERTa-SQuAD2</span>
              <span>Endpoint: /api/nlp/qa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
