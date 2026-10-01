import React, { useState } from 'react';
import { Tag, Send, Loader2, AlertCircle, Copy, Check } from 'lucide-react';
import { extractNER } from '../services/api';

const SAMPLES = [
  {
    label: 'Corporate News',
    text: 'Apple Inc CEO Tim Cook announced at the headquarters in Cupertino, California that new artificial intelligence initiatives will launch in Europe next September.'
  },
  {
    label: 'Finance News',
    text: 'Goldman Sachs analyst Christine Lagarde issued a market analysis regarding Inflation figures in Frankfurt and Washington.'
  }
];

export default function NamedEntityRecognition() {
  const [text, setText] = useState(SAMPLES[0].text);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please enter text for entity extraction.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await extractNER(text);
      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred during NER extraction.');
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

  const getEntityBadge = (entityGroup) => {
    const group = entityGroup?.toUpperCase() || '';
    if (group.includes('PER')) return 'bg-blue-950/80 text-blue-300 border-blue-800';
    if (group.includes('ORG')) return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
    if (group.includes('LOC')) return 'bg-amber-950/80 text-amber-300 border-amber-800';
    return 'bg-purple-950/80 text-purple-300 border-purple-800';
  };

  return (
    <div className="space-y-6 max-w-5xl font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
              NLP
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              dslim/bert-base-NER
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight flex items-center gap-2.5">
            <Tag className="w-6 h-6 text-neutral-200" />
            Named Entity Recognition (NER)
          </h1>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-lg bg-rose-950/40 border border-rose-900 text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-rose-200">Extraction Error</h4>
            <p className="mt-0.5 text-xs text-rose-300">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form Column */}
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="rounded-xl bg-neutral-900 border border-neutral-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white">
                Input Text Context
              </label>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 font-mono">Preset:</span>
              {SAMPLES.map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  onClick={() => setText(sample.text)}
                  className="px-2.5 py-1 text-xs rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors"
                >
                  {sample.label}
                </button>
              ))}
            </div>

            <textarea
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste sentence or document to extract named entities (Persons, Organizations, Locations)..."
              disabled={loading}
              className="w-full rounded-lg bg-neutral-950 border border-neutral-800 p-3.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-600 disabled:opacity-50 transition-colors font-sans leading-relaxed"
            />

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-neutral-200 text-neutral-950 font-medium text-sm disabled:opacity-50 transition-colors shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extracting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Extract Entities</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Column */}
        <div className="space-y-4">
          <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-5 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="text-sm font-medium text-neutral-200">
                  Extracted Entities ({result?.entities?.length || 0})
                </h3>
                {result && (
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'JSON'}</span>
                  </button>
                )}
              </div>

              {!result && !loading && (
                <div className="py-12 text-center text-neutral-500 text-sm">
                  Submit input text to view token classification labels and confidence scores.
                </div>
              )}

              {loading && (
                <div className="py-12 flex flex-col items-center justify-center space-y-3 text-neutral-400">
                  <Loader2 className="w-6 h-6 animate-spin text-neutral-200" />
                  <span className="text-xs font-mono">Running BERT NER token tagger...</span>
                </div>
              )}

              {result && !loading && (
                <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                  {result.entities && result.entities.length > 0 ? (
                    result.entities.map((ent, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-sm font-medium text-white">{ent.word}</span>
                          <div className="text-[11px] font-mono text-neutral-500">
                            Pos: {ent.start} - {ent.end}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-neutral-400">
                            {(ent.score * 100).toFixed(1)}%
                          </span>
                          <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-semibold border ${getEntityBadge(ent.entity_group)}`}>
                            {ent.entity_group}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 text-center text-xs text-neutral-500 font-mono">
                      No entities detected above confidence threshold.
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 mt-6 border-t border-neutral-800 text-[11px] font-mono text-neutral-500 flex justify-between">
              <span>Model: BERT-base-NER</span>
              <span>Endpoint: /api/nlp/ner</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
