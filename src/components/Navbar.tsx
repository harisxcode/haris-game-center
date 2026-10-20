import { useState } from 'react';
import { Github, Sparkles, Menu, X, Play } from 'lucide-react';
import { GAME_CENTER_REPO } from '../data/games';

interface NavbarProps {
  onReplayIntro: () => void;
  onOpenAddModal: () => void;
}

export function Navbar({ onReplayIntro, onOpenAddModal }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#040814]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark (Single text element in display face) */}
        <a 
          href="/" 
          className="text-lg sm:text-xl font-extrabold tracking-tight text-white hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2.5 font-display"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-white text-xs font-black shadow-md shadow-cyan-500/20">
            H
          </span>
          <span>Haris Game Center</span>
        </a>

        {/* Zone 2: 4–5 Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a href="#games" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            Games
          </a>
          <a href="#nitro-league" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            Nitro League
          </a>
          <a href="#flappy-bird" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            Flappy Bird
          </a>
          <a href="#meme-mania" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            Meme Mania
          </a>
          <a href="#repositories" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            Repositories
          </a>
          <button 
            onClick={onOpenAddModal}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 text-slate-400 hover:text-white"
          >
            Add Game
          </button>
        </nav>

        {/* Zone 3: 1 Primary action & utility */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onReplayIntro}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-xs font-medium text-slate-300 hover:text-cyan-400 hover:border-slate-700 transition-colors"
            title="Replay opening transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Replay Intro</span>
          </button>

          <a
            href={GAME_CENTER_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-cyan-500/20"
          >
            <Github className="w-3.5 h-3.5 text-slate-950" />
            <span>GitHub Project</span>
          </a>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070d1f] border-b border-slate-800 px-4 pt-3 pb-5 space-y-3">
          <a
            href="#games"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            All Games
          </a>
          <a
            href="#nitro-league"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            Nitro League
          </a>
          <a
            href="#flappy-bird"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            Flappy Bird Arcade
          </a>
          <a
            href="#meme-mania"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            Meme Mania
          </a>
          <a
            href="#repositories"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            GitHub Repositories
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAddModal();
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            + Add / Register New Game
          </button>
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onReplayIntro();
              }}
              className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Replay Intro Transition</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
