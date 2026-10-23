import { useState } from 'react';
import { Github, Sparkles, Menu, X, Star, Lightbulb } from 'lucide-react';
import { GAME_CENTER_REPO } from '../data/games';

interface NavbarProps {
  onReplayIntro: () => void;
  onOpenAddModal: () => void;
  onOpenRatingModal: () => void;
  onOpenRecommendModal: () => void;
}

export function Navbar({ 
  onReplayIntro, 
  onOpenAddModal, 
  onOpenRatingModal, 
  onOpenRecommendModal 
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#040814]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Wordmark */}
        <a 
          href="/" 
          className="text-lg sm:text-xl font-extrabold tracking-tight text-white hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2.5 font-display"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-white text-xs font-black shadow-md shadow-cyan-500/20">
            H
          </span>
          <span>Haris Game Center</span>
        </a>

        {/* Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a href="#games" className="hover:text-cyan-400 transition-colors whitespace-nowrap">
            Categories
          </a>
          <button 
            onClick={onOpenRecommendModal}
            className="hover:text-amber-300 transition-colors whitespace-nowrap flex items-center gap-1.5 text-amber-400/90 hover:text-amber-300 cursor-pointer"
          >
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Recommend Game</span>
          </button>
          <button 
            onClick={onOpenRatingModal}
            className="hover:text-amber-300 transition-colors whitespace-nowrap flex items-center gap-1.5 text-slate-300 hover:text-white cursor-pointer"
          >
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Rate Website</span>
          </button>
          <button 
            onClick={onOpenAddModal}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap text-slate-400 hover:text-white cursor-pointer"
          >
            + Register Game
          </button>
        </nav>

        {/* Action & utility */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenRecommendModal}
            className="hidden sm:inline-flex md:hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer"
            title="Recommend a future game"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Recommend Game</span>
          </button>

          <button
            onClick={onOpenRatingModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-xs font-medium text-slate-300 hover:text-amber-400 hover:border-slate-700 transition-colors cursor-pointer"
            title="Rate your experience on this website"
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Rate</span>
          </button>

          <a
            href={GAME_CENTER_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-cyan-500/20"
          >
            <Github className="w-3.5 h-3.5 text-slate-950" />
            <span className="hidden sm:inline">GitHub Project</span>
            <span className="sm:hidden">Repo</span>
          </a>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070d1f] border-b border-slate-800 px-4 pt-3 pb-5 space-y-2">
          <a
            href="#games"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            Browse Categories &amp; Games
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenRecommendModal();
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-amber-300 hover:bg-slate-800 rounded-lg flex items-center gap-2 cursor-pointer"
          >
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Recommend a Future Game</span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenRatingModal();
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 rounded-lg flex items-center gap-2 cursor-pointer"
          >
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Rate Experience (5 Stars)</span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAddModal();
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-cyan-300 hover:bg-slate-800 rounded-lg cursor-pointer"
          >
            + Register New Game
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onReplayIntro();
            }}
            className="w-full text-left px-3 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
          >
            Replay Opening Intro
          </button>
        </div>
      )}
    </header>
  );
}
