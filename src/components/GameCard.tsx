import { useState } from 'react';
import { Play, Github, ExternalLink, Heart, Layers, Terminal, Globe } from 'lucide-react';
import { Game } from '../data/games';

interface GameCardProps {
  game: Game;
  onPlayModal: (game: Game) => void;
  isFavorite: boolean;
  onToggleFavorite: (gameId: string) => void;
}

export function GameCard({ game, onPlayModal, isFavorite, onToggleFavorite }: GameCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      id={game.id === 'flappy-bird-arcade' ? 'flappy-bird' : game.id}
      className="group relative flex flex-col rounded-2xl bg-[#091124] border border-slate-800/90 hover:border-cyan-500/40 transition-all duration-300 overflow-hidden shadow-lg shadow-black/40 hover:shadow-cyan-950/20"
    >
      {/* Thumbnail Banner Area */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
        {!imgError ? (
          <img
            src={game.thumbnailUrl}
            alt={`${game.title} thumbnail`}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500 p-4">
            <span className="text-sm font-semibold text-slate-300">{game.title}</span>
            <span className="text-xs text-slate-500 mt-1">Arcade Canvas Visual</span>
          </div>
        )}

        {/* Ambient Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#091124] via-[#091124]/30 to-transparent pointer-events-none" />

        {/* Top Floating Actions: Favorite & Status */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 text-[11px] font-mono tracking-wide text-cyan-300 bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-cyan-500/20">
            <span>{game.genre}</span>
          </div>

          <button
            onClick={() => onToggleFavorite(game.id)}
            className={`p-2 rounded-lg backdrop-blur-md transition-colors ${
              isFavorite
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label="Toggle favorite"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-400' : ''}`} />
          </button>
        </div>

        {/* Play Overlay Button on hover */}
        {game.status === 'live' && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40 backdrop-blur-[2px]">
            <button
              onClick={() => onPlayModal(game)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-cyan-400 transition-transform transform active:scale-95 shadow-xl shadow-cyan-500/30 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Quick Play</span>
            </button>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex-1 flex flex-col p-6 space-y-4">
        
        {/* Unboxed Metadata (Anti-slop zero-pill discipline) */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>{game.releaseYear}</span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span>{game.status === 'live' ? (game.isExternal ? 'External Iframe Game' : 'Live on GitHub Pages') : 'Under Development'}</span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span>{game.isExternal ? 'Web Arcade' : 'Harisxcode'}</span>
        </div>

        {/* Title and Tagline */}
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors font-display">
            {game.title}
          </h3>
          <p className="mt-1 text-xs text-cyan-300 font-medium">
            {game.tagline}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-300 leading-relaxed">
          {game.description}
        </p>

        {/* Key Features Bullet List */}
        <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Key Highlights</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1">
            {game.features.slice(0, 3).map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold select-none">•</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Controls cheat sheet preview */}
        {game.controls.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Input Mapping</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {game.controls.slice(0, 4).map((ctrl, idx) => (
                <div key={idx} className="bg-slate-950/60 rounded px-2 py-1 border border-slate-800 flex items-center justify-between">
                  <span className="font-mono text-cyan-300 text-[11px] font-semibold">{ctrl.key}</span>
                  <span className="text-slate-400 text-[11px] truncate ml-1.5">{ctrl.action}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons Footer */}
        <div className="pt-4 border-t border-slate-800/80 mt-auto flex flex-col sm:flex-row items-center gap-2.5">
          {game.status === 'live' ? (
            <>
              <a
                href={game.playUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-sm shadow-cyan-500/20"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Launch Game</span>
              </a>

              <button
                onClick={() => onPlayModal(game)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                title="Play inside embedded frame"
              >
                <Play className="w-3.5 h-3.5 text-cyan-400" />
                <span>In-App</span>
              </button>
            </>
          ) : (
            <div className="w-full py-2.5 px-4 text-center text-xs font-medium text-slate-400 bg-slate-950/60 rounded-xl border border-slate-800">
              In Development · Source on GitHub
            </div>
          )}

          {/* Repository or External Host Link */}
          <a
            href={game.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-medium transition-colors"
            title={game.isExternal ? 'Visit external host site' : 'Inspect project repository on GitHub'}
          >
            {game.isExternal ? <Globe className="w-3.5 h-3.5 text-cyan-400" /> : <Github className="w-3.5 h-3.5" />}
            <span>{game.isExternal ? 'Host Site' : 'Repository'}</span>
          </a>
        </div>

      </div>
    </div>
  );
}
