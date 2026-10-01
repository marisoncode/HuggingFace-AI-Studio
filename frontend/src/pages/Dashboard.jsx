import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  FileText,
  Tag,
  HelpCircle,
  Languages,
  Image as ImageIcon,
  MessageSquare,
  Mic,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';

const capabilities = [
  {
    id: 'sentiment',
    name: 'Financial Sentiment Analysis',
    category: 'NLP',
    description: 'Classify financial text and earnings statements into bullish positive, bearish negative, or neutral sentiment.',
    model: 'distilroberta-finetuned-financial-news-sentiment',
    path: '/sentiment',
    icon: TrendingUp,
    badgeColor: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
    buttonColor: 'hover:bg-indigo-600 bg-indigo-600/90 text-white'
  },
  {
    id: 'summarization',
    name: 'Text Summarization',
    category: 'NLP',
    description: 'Condense long financial articles, reports, and documentation into concise, high-density bulleted summaries.',
    model: 'distilbart-cnn-12-6',
    path: '/summarization',
    icon: FileText,
    badgeColor: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
    buttonColor: 'hover:bg-indigo-600 bg-indigo-600/90 text-white'
  },
  {
    id: 'ner',
    name: 'Named Entity Recognition',
    category: 'NLP',
    description: 'Extract and label key named entities such as organizations (ORG), locations (LOC), and persons (PER).',
    model: 'bert-base-NER',
    path: '/ner',
    icon: Tag,
    badgeColor: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
    buttonColor: 'hover:bg-indigo-600 bg-indigo-600/90 text-white'
  },
  {
    id: 'qa',
    name: 'Extractive Question Answering',
    category: 'NLP',
    description: 'Provide context passages and ask specific questions to extract exact start-to-end answers.',
    model: 'roberta-base-squad2',
    path: '/qa',
    icon: HelpCircle,
    badgeColor: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
    buttonColor: 'hover:bg-indigo-600 bg-indigo-600/90 text-white'
  },
  {
    id: 'translation',
    name: 'English → French Translation',
    category: 'NLP',
    description: 'Translate English language text into fluent French using neural machine translation models.',
    model: 'opus-mt-en-fr',
    path: '/translation',
    icon: Languages,
    badgeColor: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
    buttonColor: 'hover:bg-indigo-600 bg-indigo-600/90 text-white'
  },
  {
    id: 'image-classification',
    name: 'Image Classification',
    category: 'Vision',
    description: 'Predict visual category labels and top confidence scores for uploaded photographs or graphic assets.',
    model: 'resnet-50',
    path: '/image-classification',
    icon: ImageIcon,
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    buttonColor: 'hover:bg-emerald-600 bg-emerald-600/90 text-white'
  },
  {
    id: 'image-captioning',
    name: 'Image Captioning',
    category: 'Vision',
    description: 'Generate detailed natural language descriptions and captions for visual content using vision transformers.',
    model: 'blip-image-captioning-base',
    path: '/image-captioning',
    icon: MessageSquare,
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    buttonColor: 'hover:bg-emerald-600 bg-emerald-600/90 text-white'
  },
  {
    id: 'speech-to-text',
    name: 'Speech-to-Text',
    category: 'Audio',
    description: 'Transcribe spoken audio files (WAV, MP3, FLAC) into accurate written text transcripts using Whisper.',
    model: 'whisper-tiny',
    path: '/speech-to-text',
    icon: Mic,
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    buttonColor: 'hover:bg-amber-600 bg-amber-600/90 text-white'
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Dashboard Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 p-6 md:p-8 border border-indigo-500/20 shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-64 h-64 text-indigo-400" />
        </div>
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" /> Multi-Modal AI Platform
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            AI Intelligence Studio
          </h1>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            Unified workspace for interactive NLP, Computer Vision, and Audio analysis powered by production-grade Hugging Face Transformer models.
          </p>
        </div>
      </div>

      {/* Capabilities Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Capabilities Hub</span>
            <span className="text-xs font-normal text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
              8 Available Models
            </span>
          </h2>
        </div>

        {/* 8 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.id}
                className="group flex flex-col justify-between rounded-xl bg-slate-900/70 border border-slate-800 p-5 hover:border-indigo-500/40 hover:bg-slate-900 transition-all shadow-sm hover:shadow-indigo-500/5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 group-hover:text-indigo-400 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${cap.badgeColor}`}>
                      {cap.category}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                    {cap.name}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {cap.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 truncate max-w-[130px]" title={cap.model}>
                    {cap.model}
                  </span>

                  <Link
                    to={cap.path}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${cap.buttonColor}`}
                  >
                    <span>Try Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
