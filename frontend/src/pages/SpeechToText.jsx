import React, { useState } from 'react';
import { Mic, Upload, Loader2, AlertCircle, Copy, Check } from 'lucide-react';
import { transcribeAudio } from '../services/api';

export default function SpeechToText() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an audio file (WAV, MP3, FLAC) to transcribe.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await transcribeAudio(selectedFile);
      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred during speech transcription.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = result.text || JSON.stringify(result);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-amber-950 border border-amber-700/60 text-amber-300">
              AUDIO
            </span>
            <span className="text-xs text-slate-400 font-mono">
              openai/whisper-tiny
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5 font-sans">
            <Mic className="w-6 h-6 text-amber-400" />
            Speech-to-Text Transcription
          </h1>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-rose-200">Transcription Error</h4>
            <p className="mt-0.5 text-xs text-rose-300">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Column */}
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-md">
            <label className="block text-sm font-semibold text-white font-sans">
              Upload Audio File (WAV, MP3, FLAC, OGG)
            </label>

            <div className="border-2 border-dashed border-slate-700 hover:border-amber-500 bg-slate-950 rounded-2xl p-6 text-center transition-colors">
              {selectedFile ? (
                <div className="space-y-2">
                  <Mic className="w-8 h-8 text-amber-400 mx-auto" />
                  <div className="text-sm font-semibold text-white font-sans">{selectedFile.name}</div>
                  <div className="text-xs text-slate-400 font-mono">
                    ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                  <div className="text-xs text-slate-400 font-sans">
                    Select or drop spoken audio recording for transcription
                  </div>
                </div>
              )}

              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                disabled={loading}
                className="mt-3 block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={loading || !selectedFile}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm disabled:opacity-50 transition-colors shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transcribing Audio...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    <span>Run Whisper Pipeline</span>
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
                  Transcribed Text Result
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
                  Upload an audio file to transcribe speech to text using OpenAI Whisper.
                </div>
              )}

              {loading && (
                <div className="py-16 flex flex-col items-center justify-center space-y-3 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                  <span className="text-xs font-mono">Decoding audio waveform with Whisper...</span>
                </div>
              )}

              {result && !loading && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-mono text-slate-400 uppercase">Transcript Output</span>
                  <div className="text-sm text-slate-100 leading-relaxed font-sans">
                    {result.text || JSON.stringify(result)}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 mt-6 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between">
              <span>Model: Whisper-tiny</span>
              <span>Endpoint: /api/audio/transcribe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
