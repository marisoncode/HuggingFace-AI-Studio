import React, { useState } from 'react';
import { MessageSquare, Upload, Loader2, AlertCircle, Copy, Check } from 'lucide-react';
import { captionImage } from '../services/api';

export default function ImageCaptioning() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an image file to generate a caption.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await captionImage(selectedFile);
      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred during image captioning.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const caption = Array.isArray(result) ? result[0]?.generated_text : result.caption || JSON.stringify(result);
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b dark:border-slate-800 border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-emerald-950 bg-emerald-100 border dark:border-emerald-700/60 border-emerald-200 dark:text-emerald-300 text-emerald-700">
              VISION
            </span>
            <span className="text-xs dark:text-slate-400 text-slate-500 font-mono">
              Salesforce/blip-image-captioning-base
            </span>
          </div>
          <h1 className="text-2xl font-bold dark:text-white text-slate-900 tracking-tight flex items-center gap-2.5 font-sans">
            <MessageSquare className="w-6 h-6 text-emerald-500" />
            Image Captioning
          </h1>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl dark:bg-rose-950/60 bg-rose-50 border dark:border-rose-800 border-rose-200 dark:text-rose-300 text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold dark:text-rose-200 text-rose-900">Captioning Error</h4>
            <p className="mt-0.5 text-xs dark:text-rose-300 text-rose-700">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Column */}
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 p-5 space-y-4 shadow-md">
            <label className="block text-sm font-semibold dark:text-white text-slate-900 font-sans">
              Upload Image Asset
            </label>

            <div className="border-2 border-dashed dark:border-slate-700 border-slate-300 hover:border-emerald-500 dark:bg-slate-950 bg-slate-50 rounded-2xl p-6 text-center transition-colors">
              {previewUrl ? (
                <div className="space-y-3">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-56 mx-auto rounded-xl border dark:border-slate-800 border-slate-300 object-contain"
                  />
                  <div className="text-xs dark:text-slate-400 text-slate-500 font-mono truncate max-w-xs mx-auto">
                    {selectedFile?.name} ({(selectedFile?.size / 1024).toFixed(1)} KB)
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-8 h-8 dark:text-slate-400 text-slate-400 mx-auto" />
                  <div className="text-xs dark:text-slate-400 text-slate-500 font-sans">
                    Upload image to generate automatic textual description
                  </div>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
                className="mt-3 block w-full text-xs dark:text-slate-400 text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold dark:file:bg-slate-800 file:bg-slate-200 dark:file:text-slate-200 file:text-slate-700 dark:hover:file:bg-slate-700 hover:file:bg-slate-300 cursor-pointer"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={loading || !selectedFile}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm disabled:opacity-50 transition-colors shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Caption...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Generate Caption</span>
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
                  Generated Caption Output
                </h3>
                {result && (
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg dark:bg-slate-800 bg-slate-100 dark:hover:bg-slate-700 hover:bg-slate-200 dark:text-slate-300 text-slate-700 text-xs font-mono transition-colors border dark:border-slate-700 border-slate-300"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>

              {!result && !loading && (
                <div className="py-16 text-center dark:text-slate-400 text-slate-500 text-sm font-sans">
                  Upload an image to generate natural language description using BLIP.
                </div>
              )}

              {loading && (
                <div className="py-16 flex flex-col items-center justify-center space-y-3 dark:text-slate-400 text-slate-500">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                  <span className="text-xs font-mono">Synthesizing image features into text sequence...</span>
                </div>
              )}

              {result && !loading && (
                <div className="p-4 rounded-xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-2">
                  <span className="text-xs font-mono dark:text-slate-400 text-slate-500 uppercase">BLIP Description</span>
                  <div className="text-base font-semibold dark:text-white text-slate-900 leading-relaxed font-sans">
                    "{Array.isArray(result) ? result[0]?.generated_text : result.caption || JSON.stringify(result)}"
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 mt-6 border-t dark:border-slate-800 border-slate-200 text-[11px] font-mono dark:text-slate-400 text-slate-500 flex justify-between">
              <span>Model: BLIP Image Captioning</span>
              <span>Endpoint: /api/vision/caption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
