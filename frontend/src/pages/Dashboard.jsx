import React, { useState } from 'react';
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
  Cpu,
  Layers
} from 'lucide-react';

const capabilities = [
  {
    id: 'sentiment',
    name: 'Financial Sentiment Analysis',
    category: 'NLP',
    description: 'Classify financial text, news, and earnings calls into Bullish (positive), Bearish (negative), or Neutral sentiment.',
    model: 'distilroberta-finetuned-financial-news-sentiment',
    path: '/sentiment',
    icon: TrendingUp,
    taskTag: 'Text Classification',
    badgeStyle: 'dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-700/60 bg-indigo-50 text-indigo-700 border-indigo-200',
    buttonStyle: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    cardBorder: 'dark:hover:border-indigo-500/50 hover:border-indigo-400'
  },
  {
    id: 'summarization',
    name: 'Text Summarization',
    category: 'NLP',
    description: 'Condense long financial articles, reports, and documentation into concise, structured summaries using DistilBART.',
    model: 'distilbart-cnn-12-6',
    path: '/summarization',
    icon: FileText,
    taskTag: 'Sequence-to-Sequence',
    badgeStyle: 'dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-700/60 bg-indigo-50 text-indigo-700 border-indigo-200',
    buttonStyle: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    cardBorder: 'dark:hover:border-indigo-500/50 hover:border-indigo-400'
  },
  {
    id: 'ner',
    name: 'Named Entity Recognition',
    category: 'NLP',
    description: 'Extract and label key domain entities such as Organizations (ORG), Locations (LOC), and Persons (PER).',
    model: 'bert-base-NER',
    path: '/ner',
    icon: Tag,
    taskTag: 'Token Classification',
    badgeStyle: 'dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-700/60 bg-indigo-50 text-indigo-700 border-indigo-200',
    buttonStyle: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    cardBorder: 'dark:hover:border-indigo-500/50 hover:border-indigo-400'
  },
  {
    id: 'qa',
    name: 'Extractive Question Answering',
    category: 'NLP',
    description: 'Supply context passages and query specific details to extract exact start-and-end position answers.',
    model: 'roberta-base-squad2',
    path: '/qa',
    icon: HelpCircle,
    taskTag: 'Question Answering',
    badgeStyle: 'dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-700/60 bg-indigo-50 text-indigo-700 border-indigo-200',
    buttonStyle: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    cardBorder: 'dark:hover:border-indigo-500/50 hover:border-indigo-400'
  },
  {
    id: 'translation',
    name: 'English → French Translation',
    category: 'NLP',
    description: 'Neural machine translation converting English source text into fluent, grammatically sound French.',
    model: 'opus-mt-en-fr',
    path: '/translation',
    icon: Languages,
    taskTag: 'Translation',
    badgeStyle: 'dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-700/60 bg-indigo-50 text-indigo-700 border-indigo-200',
    buttonStyle: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    cardBorder: 'dark:hover:border-indigo-500/50 hover:border-indigo-400'
  },
  {
    id: 'image-classification',
    name: 'Image Classification',
    category: 'VISION',
    description: 'Analyze photographic or graphic visual assets to predict high-confidence object classification labels.',
    model: 'resnet-50',
    path: '/image-classification',
    icon: ImageIcon,
    taskTag: 'Computer Vision',
    badgeStyle: 'dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700/60 bg-emerald-50 text-emerald-700 border-emerald-200',
    buttonStyle: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    cardBorder: 'dark:hover:border-emerald-500/50 hover:border-emerald-400'
  },
  {
    id: 'image-captioning',
    name: 'Image Captioning',
    category: 'VISION',
    description: 'Generate detailed descriptive captions for complex visual scenes using cross-modal vision transformers.',
    model: 'blip-image-captioning-base',
    path: '/image-captioning',
    icon: MessageSquare,
    taskTag: 'Vision-to-Text',
    badgeStyle: 'dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700/60 bg-emerald-50 text-emerald-700 border-emerald-200',
    buttonStyle: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    cardBorder: 'dark:hover:border-emerald-500/50 hover:border-emerald-400'
  },
  {
    id: 'speech-to-text',
    name: 'Speech-to-Text',
    category: 'AUDIO',
    description: 'Transcribe spoken audio files (WAV, MP3, FLAC) into accurate written text transcripts using Whisper.',
    model: 'whisper-tiny',
    path: '/speech-to-text',
    icon: Mic,
    taskTag: 'Audio Recognition',
    badgeStyle: 'dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700/60 bg-amber-50 text-amber-700 border-amber-200',
    buttonStyle: 'bg-amber-600 hover:bg-amber-500 text-white',
    cardBorder: 'dark:hover:border-amber-500/50 hover:border-amber-400'
  }
];

const categories = ['ALL', 'NLP', 'VISION', 'AUDIO'];

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filteredCapabilities = selectedCategory === 'ALL'
    ? capabilities
    : capabilities.filter((cap) => cap.category === selectedCategory);

  return (
    <div className="space-y-8 font-sans">
      {/* Studio Banner */}
      <div className="rounded-2xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900 bg-white p-6 md:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full dark:bg-slate-800 bg-slate-100 dark:border-slate-700 border-slate-300 dark:text-slate-300 text-slate-700 text-xs font-medium">
              <Cpu className="w-3.5 h-3.5 text-indigo-500" />
              <span>Multi-Modal AI Platform</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold dark:text-white text-slate-900 tracking-tight font-sans">
              AI Intelligence Studio
            </h1>
            <p className="dark:text-slate-300 text-slate-600 text-sm md:text-base leading-relaxed font-sans">
              Unified workspace for interactive NLP, Computer Vision, and Audio transformers powered by production-grade Hugging Face models.
            </p>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l dark:border-slate-800 border-slate-200 pt-4 md:pt-0 md:pl-8">
            <div className="space-y-1">
              <div className="text-2xl font-bold dark:text-white text-slate-900 tracking-tight font-sans">8</div>
              <div className="text-xs dark:text-slate-400 text-slate-500 font-mono uppercase tracking-wider">Active Models</div>
            </div>
            <div className="h-8 w-px dark:bg-slate-800 bg-slate-200 mx-2" />
            <div className="space-y-1">
              <div className="text-2xl font-bold dark:text-white text-slate-900 tracking-tight font-sans">3</div>
              <div className="text-xs dark:text-slate-400 text-slate-500 font-mono uppercase tracking-wider">Modalities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Capabilities Hub Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b dark:border-slate-800 border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-bold dark:text-white text-slate-900 tracking-tight font-sans">Model Capabilities</h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 dark:bg-slate-900 bg-white p-1.5 rounded-xl border dark:border-slate-800 border-slate-200 shadow-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors font-sans ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'dark:text-slate-400 text-slate-600 dark:hover:text-slate-200 hover:text-slate-900 dark:hover:bg-slate-800 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCapabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.id}
                className={`group flex flex-col justify-between rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 p-5 transition-all shadow-md ${cap.cardBorder}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl dark:bg-slate-800 bg-slate-100 border dark:border-slate-700 border-slate-200 dark:text-slate-200 text-slate-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded border ${cap.badgeStyle}`}>
                      {cap.category}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold dark:text-white text-slate-900 tracking-tight font-sans">
                      {cap.name}
                    </h3>
                    <p className="text-xs dark:text-slate-300 text-slate-600 leading-relaxed line-clamp-3 font-sans">
                      {cap.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-5 border-t dark:border-slate-800 border-slate-200 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-mono dark:text-slate-400 text-slate-500 tracking-wider">
                      {cap.taskTag}
                    </span>
                    <span className="text-[11px] font-mono dark:text-slate-300 text-slate-700 truncate max-w-[120px]" title={cap.model}>
                      {cap.model}
                    </span>
                  </div>

                  <Link
                    to={cap.path}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${cap.buttonStyle}`}
                  >
                    <span>Launch</span>
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
