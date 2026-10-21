import { Github } from 'lucide-react';
import { GAME_CENTER_REPO, HARIS_GITHUB_PROFILE } from '../data/games';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-900 bg-[#02050e] text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand info */}
          <div className="text-center md:text-left space-y-1">
            <div className="text-base font-bold text-white tracking-tight font-display">
              Haris Game Center
            </div>
            <p className="text-xs text-slate-400">
              Open-source browser arcade platform developed by Haris.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <a href="https://harisxcode.github.io/nitro-league/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
              Nitro League
            </a>
            <a href="https://now.gg/apps/a/19900/b.html" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
              Roblox (now.gg)
            </a>
            <a href="https://harisxcode.github.io/flappy-bird-arcade/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
              Flappy Bird Arcade
            </a>
            <a href="https://harisxcode.github.io/meme-mania/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
              Meme Mania
            </a>
            <a href={GAME_CENTER_REPO} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
              GitHub Repo
            </a>
            <a href={HARIS_GITHUB_PROFILE} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
              harisxcode Profile
            </a>
          </div>

          {/* Copyright & Social */}
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>© {currentYear} Haris. All rights reserved.</span>
            <a
              href={HARIS_GITHUB_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
              aria-label="GitHub profile"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}
