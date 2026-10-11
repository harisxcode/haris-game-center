import { useState, useEffect, useRef } from 'react';
import { X, Maximize2, Minimize2, RotateCcw, ExternalLink, Github, Terminal } from 'lucide-react';
import { Game } from '../data/games';

interface GameModalProps {
  game: Game | null;
  onClose: () => void;
}

export function GameModal({ game, onClose }: GameModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md">
      <div
        ref={containerRef}
        className="relative w-full max-w-5xl h-[92vh] max-h-[850px] bg-[#050916] rounded-2xl border border-slate-800 flex flex-col overflow-hidden shadow-2xl shadow-cyan-950/40"
      >
        {/* Modal Top Bar */}
        <div className="px-4 py-3 bg-[#081024] border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <h2 className="text-sm sm:text-base font-bold text-white truncate font-display">
              {game.title}
            </h2>
            <span className="hidden sm:inline text-xs text-slate-400 font-mono">
              · {game.genre}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Reload button */}
            <button
              onClick={reloadGame}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Restart session"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Launch in new tab */}
            <a
              href={game.playUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 transition-colors"
              title="Open full page"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Full Tab</span>
            </a>

            {/* View Repo */}
            <a
              href={game.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="View repository on GitHub"
            >
              <Github className="w-4 h-4" />
            </a>

            {/* Close modal */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Close player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Embedded Game Iframe Viewport */}
        <div className="flex-1 w-full bg-black relative flex items-center justify-center overflow-hidden">
          {game.playUrl ? (
            <iframe
              key={iframeKey}
              src={game.playUrl}
              title={game.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope"
              allowFullScreen
            />
          ) : (
            <div className="text-center p-8 text-slate-400">
              <p>This game is currently in active development.</p>
              <a
                href={game.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-cyan-400 hover:underline text-xs"
              >
                Track repository progress on GitHub
              </a>
            </div>
          )}
        </div>

        {/* Modal Bottom Controls / Shortcuts strip */}
        <div className="px-4 py-2 bg-[#070d1e] border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-mono text-cyan-400 font-semibold flex items-center gap-1 shrink-0">
              <Terminal className="w-3 h-3" /> CONTROLS:
            </span>
            {game.controls.map((ctrl, i) => (
              <span key={i} className="shrink-0 text-slate-300">
                <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-[10px] font-mono text-cyan-300">
                  {ctrl.key}
                </kbd>{' '}
                {ctrl.action}
                {i < game.controls.length - 1 && <span className="ml-2 text-slate-600">·</span>}
              </span>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 shrink-0">
            Esc to exit · Powered by GitHub Pages
          </div>
        </div>
      </div>
    </div>
  );
}
