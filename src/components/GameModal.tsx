import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  ExternalLink, 
  Zap, 
  Coins, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { Game } from '../types';

interface GameModalProps {
  game: Game | null;
  onClose: () => void;
  onGamePlayed?: (game: Game) => void;
  allGames?: Game[];
  onSelectGame?: (game: Game) => void;
}

export function GameModal({ game, onClose, onGamePlayed, allGames, onSelectGame }: GameModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [useBuiltInEngine, setUseBuiltInEngine] = useState(false);
  const [hasAwardedPoints, setHasAwardedPoints] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (game && !hasAwardedPoints && onGamePlayed) {
      onGamePlayed(game);
      setHasAwardedPoints(true);
    }
  }, [game, hasAwardedPoints, onGamePlayed]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.fullscreenElement) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!game) return null;

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const reloadGame = () => {
    setIframeKey((prev) => prev + 1);
  };

  // Determine source
  const hasBuiltIn = !!game.builtInHtml;
  const isUsingBuiltIn = useBuiltInEngine || (hasBuiltIn && !game.isExternal);
  const directLink = game.playUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md">
      <div
        ref={containerRef}
        className="relative w-full max-w-5xl h-[92vh] max-h-[850px] bg-[#050916] rounded-2xl border border-cyan-500/30 flex flex-col overflow-hidden shadow-2xl shadow-cyan-950/50"
      >
        {/* Modal Top Bar */}
        <div className="px-4 py-3 bg-[#081024] border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="text-sm sm:text-base font-bold text-white truncate font-display">
              {game.title}
            </h2>
            <span className="hidden sm:inline text-xs text-slate-400 font-mono">
              · {game.genre}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
              <Coins className="w-3 h-3 text-amber-400" /> +25 Pts Earned!
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Built-in engine fallback toggle */}
            {hasBuiltIn && (
              <button
                onClick={() => setUseBuiltInEngine(!useBuiltInEngine)}
                className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                  isUsingBuiltIn
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title="Toggle 0% lag built-in engine"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isUsingBuiltIn ? 'Built-In (0% Lag)' : 'Switch Engine'}</span>
              </button>
            )}

            {/* Reload button */}
            <button
              onClick={reloadGame}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Restart session"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Direct launch link that safely navigates without 404 */}
            <a
              href={directLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
              title="Open full page in dedicated tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Launch Tab</span>
            </a>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close game modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Embedded Game Execution Area */}
        <div className="flex-1 bg-black relative overflow-hidden flex items-center justify-center">
          {isUsingBuiltIn && game.builtInHtml ? (
            <iframe
              key={`builtin-${iframeKey}`}
              srcDoc={game.builtInHtml}
              title={`${game.title} Built-in Engine`}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-pointer-lock"
            />
          ) : (
            <iframe
              key={`external-${iframeKey}`}
              src={game.iframeUrl || game.playUrl}
              title={game.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock"
            />
          )}
        </div>

        {/* Recommended Games Quick Switcher */}
        {allGames && allGames.length > 0 && (
          <div className="px-3 sm:px-4 py-2 bg-[#060c1d] border-t border-slate-800/80 flex items-center justify-between gap-3 shrink-0 overflow-x-auto">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Recommended Games:</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
              {allGames
                .filter((g) => g.id !== game.id)
                .slice(0, 4)
                .map((rec) => (
                  <button
                    key={rec.id}
                    onClick={() => {
                      if (onSelectGame) onSelectGame(rec);
                    }}
                    className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left shrink-0 transition-all cursor-pointer group"
                    title={`Switch to recommended game: ${rec.title}`}
                  >
                    <img
                      src={rec.thumbnailUrl}
                      alt={rec.title}
                      className="w-5 h-5 rounded-md object-cover"
                    />
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 truncate max-w-[110px]">
                      {rec.title}
                    </span>
                    <span className="text-[10px] font-mono text-amber-400">★ {rec.rating.toFixed(1)}</span>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Footer info bar */}
        <div className="px-4 py-2 bg-[#081024] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Unblocked
            </span>
            <span className="hidden sm:inline text-slate-500">·</span>
            <span className="hidden sm:inline text-[11px]">
              Controls: {game.controls.map((c) => `${c.key} (${c.action})`).join(' | ')}
            </span>
          </div>

          <div className="text-[11px] font-mono text-cyan-300">
            Haris Game Center · Pablo Verified
          </div>
        </div>
      </div>
    </div>
  );
}
