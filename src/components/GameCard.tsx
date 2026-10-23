import { useState } from 'react';
import { 
  Play, 
  Github, 
  ExternalLink, 
  Heart, 
  ChevronDown, 
  ChevronUp, 
  Terminal, 
  Layers, 
  Globe, 
  Tv, 
  Sparkles,
  Flame
} from 'lucide-react';
import { Game } from '../data/games';

interface GameCardProps {
  game: Game;
  onPlayModal: (game: Game) => void;
  onPreviewAd: (game: Game) => void;
  isFavorite: boolean;
  onToggleFavorite: (gameId: string) => void;
}

export function GameCard({ 
  game, 
  onPlayModal, 
  onPreviewAd, 
  isFavorite, 
  onToggleFavorite 
}: GameCardProps) {
  const [imgError, setImgError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      id={game.id === 'flappy-bird-arcade' ? 'flappy-bird' : game.id}
      className="group relative flex flex-col rounded-2xl bg-[#081024] border border-slate-800/90 hover:border-cyan-500/40 transition-all duration-300 overflow-hidden shadow-md shadow-black/50 hover:shadow-cyan-950/20"
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#081024] via-[#081024]/20 to-transparent pointer-events-none" />

        {/* Top Floating Actions: Genre & Favorite */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-wide text-cyan-300 bg-slate-950/85 backdrop-blur-sm px-2 py-0.5 rounded-md border border-cyan-500/20">
            <span>{game.genre}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Preview Ad Button */}
            <button
              onClick={() => onPreviewAd(game)}
              className="p-1.5 rounded-lg backdrop-blur-md bg-slate-950/70 border border-amber-500/30 text-amber-300 hover:text-amber-200 hover:bg-amber-500/20 transition-colors"
              title="Watch fun preview ad"
              aria-label="Watch game preview ad"
            >
              <Tv className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onToggleFavorite(game.id)}
              className={`p-1.5 rounded-lg backdrop-blur-md transition-colors ${
                isFavorite
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label="Toggle favorite"
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Play Overlay Button on hover */}
        {game.status === 'live' && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/55 backdrop-blur-[2px]">
            <button
              onClick={() => onPreviewAd(game)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-transform transform active:scale-95 shadow-lg shadow-amber-500/30 cursor-pointer"
              title="Watch hype ad and play"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Preview Ad</span>
            </button>

            {game.directPlayOnly ? (
              <a
                href={game.playUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-cyan-400 transition-transform transform active:scale-95 shadow-xl shadow-cyan-500/30"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Play Direct</span>
              </a>
            ) : (
              <button
                onClick={() => onPlayModal(game)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-cyan-400 transition-transform transform active:scale-95 shadow-xl shadow-cyan-500/30 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>Quick Play</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Streamlined Card Content */}
      <div className="flex-1 flex flex-col p-4 sm:p-5 space-y-3">
        {/* Title and Short Hook */}
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors font-display truncate">
              {game.title}
            </h3>
            <span className="text-[11px] font-mono text-slate-500 shrink-0">
              {game.releaseYear}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {game.tagline}
          </p>
        </div>

        {/* Optional Collapsible Details / Controls Section */}
        {showDetails && (
          <div className="pt-2 border-t border-slate-800/80 space-y-2.5 text-xs animate-in fade-in duration-200">
            <p className="text-slate-400 text-xs leading-relaxed">
              {game.description}
            </p>

            {/* Quick ad quote highlight */}
            {game.hypeAd && (
              <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-center justify-between">
                <span className="truncate italic">“{game.hypeAd.hypeQuote}”</span>
                <button
                  onClick={() => onPreviewAd(game)}
                  className="ml-2 text-cyan-300 hover:underline font-bold shrink-0 cursor-pointer"
                >
                  Watch Ad
                </button>
              </div>
            )}

            {game.controls.length > 0 && (
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-cyan-400" />
                  <span>Controls</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  {game.controls.slice(0, 4).map((ctrl, idx) => (
                    <div key={idx} className="bg-slate-950/70 rounded px-1.5 py-0.5 border border-slate-800 flex items-center justify-between">
                      <span className="font-mono text-cyan-300 font-semibold">{ctrl.key}</span>
                      <span className="text-slate-400 truncate ml-1">{ctrl.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {game.features.length > 0 && (
              <div className="space-y-0.5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-cyan-400" />
                  <span>Highlights</span>
                </div>
                <ul className="text-slate-300 text-[11px] space-y-0.5">
                  {game.features.slice(0, 2).map((feat, idx) => (
                    <li key={idx} className="truncate">• {feat}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons Footer */}
        <div className="pt-3 border-t border-slate-800/80 mt-auto flex items-center gap-2">
          {game.status === 'live' ? (
            <>
              <a
                href={game.playUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-sm shadow-cyan-500/20"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{game.id === 'roblox-cloud' ? 'Play (now.gg)' : (game.directPlayOnly ? 'Play Direct' : 'Play')}</span>
              </a>

              {/* Preview Ad Button in Footer */}
              <button
                onClick={() => onPreviewAd(game)}
                className="inline-flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-xs font-semibold transition-colors cursor-pointer"
                title="Watch preview ad about this game"
              >
                <Tv className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ad</span>
              </button>

              {!game.directPlayOnly && (
                <button
                  onClick={() => onPlayModal(game)}
                  className="inline-flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  title="Play inside embedded frame"
                >
                  <Play className="w-3.5 h-3.5 text-cyan-400" />
                  <span>In-App</span>
                </button>
              )}
            </>
          ) : (
            <div className="flex-1 py-2 px-3 text-center text-xs font-medium text-slate-400 bg-slate-950/60 rounded-xl border border-slate-800">
              Coming Soon
            </div>
          )}

          {/* Toggle Details */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            title={showDetails ? 'Hide details' : 'Show controls and details'}
            aria-label="Toggle details"
          >
            {showDetails ? <ChevronUp className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Repo / Host Link */}
          <a
            href={game.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title={game.directPlayOnly ? 'Direct link to host' : (game.isExternal ? 'Visit host site' : 'View repository on GitHub')}
          >
            {game.isExternal ? <Globe className="w-3.5 h-3.5 text-cyan-400" /> : <Github className="w-3.5 h-3.5" />}
          </a>
        </div>

      </div>
    </div>
  );
}
