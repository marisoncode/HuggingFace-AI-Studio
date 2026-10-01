import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Brain,
  LayoutDashboard,
  TrendingUp,
  FileText,
  Tag,
  HelpCircle,
  Languages,
  Image as ImageIcon,
  MessageSquare,
  Mic,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard, category: 'Main' },
  { name: 'Financial Sentiment', path: '/sentiment', icon: TrendingUp, category: 'NLP' },
  { name: 'Text Summarization', path: '/summarization', icon: FileText, category: 'NLP' },
  { name: 'Entity Recognition', path: '/ner', icon: Tag, category: 'NLP' },
  { name: 'Question Answering', path: '/qa', icon: HelpCircle, category: 'NLP' },
  { name: 'Translation (EN→FR)', path: '/translation', icon: Languages, category: 'NLP' },
  { name: 'Image Classification', path: '/image-classification', icon: ImageIcon, category: 'Vision' },
  { name: 'Image Captioning', path: '/image-captioning', icon: MessageSquare, category: 'Vision' },
  { name: 'Speech-to-Text', path: '/speech-to-text', icon: Mic, category: 'Audio' },
];

export default function Layout({ children }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'NLP':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'Vision':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Audio':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800/80 bg-slate-900/50 backdrop-blur-sm sticky top-0 h-screen overflow-y-auto">
        {/* Brand Logo Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/20">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-white leading-tight">
              AI Intelligence
            </h1>
            <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">
              Studio
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1">
          <div className="px-3 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Workspace Capabilities
          </div>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.category !== 'Main' && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getCategoryBadgeClass(item.category)}`}>
                    {item.category}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800/80 text-xs text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Hugging Face Portfolio</span>
          </div>
          <p className="text-[11px] text-slate-400">8 Integrated AI Models</p>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
            <Brain className="w-5 h-5" />
          </div>
          <span className="font-bold text-white tracking-tight">AI Intelligence Studio</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Navigation Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-1 z-40">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.category !== 'Main' && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getCategoryBadgeClass(item.category)}`}>
                    {item.category}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
