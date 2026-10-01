import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Sun,
  Moon
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
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'NLP':
        return 'dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-700/60 bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Vision':
        return 'dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700/60 bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Audio':
        return 'dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700/60 bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 bg-slate-100 text-slate-600 border-slate-300';
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row dark:bg-slate-950 bg-slate-50 dark:text-slate-100 text-slate-900 font-sans transition-colors duration-200">
      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 border-r dark:border-slate-800 border-slate-200 dark:bg-slate-900 bg-white sticky top-0 h-screen overflow-y-auto">
        {/* Brand Logo Header */}
        <div className="p-5 border-b dark:border-slate-800 border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight dark:text-white text-slate-900 leading-tight font-sans">
                AI Studio
              </h1>
              <span className="text-[11px] font-semibold tracking-wider text-indigo-500 uppercase">
                Multi-Modal Hub
              </span>
            </div>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border dark:border-slate-700 border-slate-200 dark:bg-slate-800 bg-slate-100 dark:text-amber-400 text-indigo-600 hover:scale-105 transition-all shadow-sm"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1">
          <div className="px-3 pt-2 pb-2 text-[10px] font-mono dark:text-slate-400 text-slate-500 uppercase tracking-wider">
            Workspace Capabilities
          </div>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'dark:text-slate-300 text-slate-700 dark:hover:text-white hover:text-slate-900 dark:hover:bg-slate-800/80 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'dark:text-slate-400 text-slate-500'}`} />
                  <span>{item.name}</span>
                </div>
                {item.category !== 'Main' && (
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${getCategoryBadgeClass(item.category)}`}>
                    {item.category}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t dark:border-slate-800 border-slate-200 text-xs dark:text-slate-400 text-slate-500 space-y-1">
          <div className="flex items-center gap-1.5 dark:text-slate-200 text-slate-800 font-medium text-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Hugging Face Studio</span>
          </div>
          <p className="text-[10px] dark:text-slate-400 text-slate-500">8 Integrated AI Pipelines</p>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-4 dark:bg-slate-900 bg-white border-b dark:border-slate-800 border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
            <Brain className="w-5 h-5" />
          </div>
          <span className="font-bold dark:text-white text-slate-900 tracking-tight font-sans">AI Studio</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border dark:border-slate-700 border-slate-200 dark:bg-slate-800 bg-slate-100 dark:text-amber-400 text-indigo-600"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 dark:text-slate-400 text-slate-600 dark:hover:text-white hover:text-slate-900 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-100"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden dark:bg-slate-900 bg-white border-b dark:border-slate-800 border-slate-200 p-4 space-y-1 z-40">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-indigo-600 text-white' : 'dark:text-slate-300 text-slate-700 dark:hover:bg-slate-800 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.category !== 'Main' && (
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${getCategoryBadgeClass(item.category)}`}>
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
