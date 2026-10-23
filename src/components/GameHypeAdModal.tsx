import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ExternalLink, 
  FastForward, 
  Volume2, 
  VolumeX, 
  Flame, 
  Star, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Tv
} from 'lucide-react';
import { Game } from '../data/games';
import { playArcadeSfx } from '../utils/audio';

interface GameHypeAdModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
  autoLaunchOnFinish?: boolean;
}

export function GameHypeAdModal({ 
  game, 
  isOpen, 
  onClose,
  autoLaunchOnFinish = true 
}: GameHypeAdModalProps) {
  const [countdown, setCountdown] = useState(4);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasLaunched, setHasLaunched] = useState(false);

  useEffect(() => {
    if (!isOpen || !game) {
      setCountdown(4);
      setHasLaunched(false);
      return;
    }

    if (soundEnabled) {
      playArcadeSfx('launch');
    }

    setCountdown(4);
    setHasLaunched(false);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, game]);

  // When countdown hits 0, auto launch if requested
  useEffect(() => {
    if (countdown === 0 && autoLaunchOnFinish && !hasLaunched && game) {
      handleDirectLaunch();
    }
  }, [countdown, autoLaunchOnFinish, hasLaunched, game]);

  if (!isOpen || !game) return null;

  const handleDirectLaunch = () => {
    setHasLaunched(true);
    if (soundEnabled) {
      playArcadeSfx('click');
    }
    // Launch directly in a new tab without iframe
    window.open(game.playUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const ad = game.hypeAd || {
    headline: 'EXPERIENCE INSTANT ARCADE ACTION!',
    badge: '🔥 100% PURE FUN',
    funPitch: `${game.description} Designed for high-speed responsiveness, instant browser launch, and pure gaming thrill!`,
    hypeQuote: 'Incredible web gameplay—smooth, fast, and addictive!',
    reviewer: 'Game Center Community',
    ratingScore: '9.8 / 10',
    gameplayTips: game.features.slice(0, 3),
    excitementLevel: 'MAXIMUM THRILL'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-[#060c1d] rounded-2xl border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col"
        >
          {/* Top Pre-roll Commercial Indicator Bar */}
          <div className="px-4 py-2.5 bg-[#09132c] border-b border-cyan-500/20 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <div className="flex items-center gap-1 font-mono uppercase text-[11px] tracking-wider text-cyan-300 font-bold">
                <Tv className="w-3.5 h-3.5" />
                <span>Featured Game Spotlight Preview</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1 rounded text-slate-400 hover:text-white"
                title={soundEnabled ? 'Mute ad sound' : 'Enable sound'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={onClose}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                title="Close ad preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Ad Visual Media Header with Background */}
          <div className="relative aspect-[16/8] sm:aspect-[16/7] w-full overflow-hidden bg-slate-950">
            <img
              src={game.thumbnailUrl}
              alt={game.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center brightness-90 contrast-110"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060c1d] via-[#060c1d]/40 to-black/30 pointer-events-none" />

            {/* Overlaid Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold shadow-lg">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{ad.badge}</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold backdrop-blur-md">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{ad.ratingScore}</span>
              </span>
            </div>

            {/* Title & Tagline overlay */}
            <div className="absolute bottom-3 left-4 right-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                {game.genre}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight mt-1 drop-shadow-md">
                {game.title}
              </h2>
            </div>
          </div>

          {/* Countdown Progress Bar */}
          <div className="h-1.5 w-full bg-slate-900 overflow-hidden">
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: `${(countdown / 4) * 100}%` }}
              transition={{ duration: 1, ease: 'linear' }}
              className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500"
            />
          </div>

          {/* Ad Pitch Body */}
          <div className="p-5 sm:p-6 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <h3 className="text-sm sm:text-base font-extrabold text-cyan-300 uppercase tracking-wide font-display">
                  {ad.headline}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {ad.funPitch}
              </p>
            </div>

            {/* Critic / Community Hype Quote Card */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3">
              <div className="text-2xl select-none leading-none text-cyan-400 font-serif">“</div>
              <div className="flex-1">
                <p className="text-xs text-slate-300 italic font-medium">
                  {ad.hypeQuote}
                </p>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span>— {ad.reviewer}</span>
                  <span className="text-cyan-400 font-mono font-semibold">Verified Fun Factor</span>
                </div>
              </div>
            </div>

            {/* Pro Tips for Maximum Fun */}
            {ad.gameplayTips && ad.gameplayTips.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                  Why You Will Love Playing This:
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
                  {ad.gameplayTips.map((tip, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 bg-slate-950/40 px-2 py-1 rounded border border-slate-800/60 truncate">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bottom Actions Row with Skip & Direct Launch */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-mono tabular-nums text-cyan-400 font-bold text-sm">
                  {countdown > 0 ? `Launching in ${countdown}s` : 'Ready to Launch!'}
                </span>
                <span>· Instant Direct Play</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
                >
                  Stay on Hub
                </button>

                <button
                  onClick={handleDirectLaunch}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{countdown > 0 ? 'Skip Ad & Play Now' : 'Launch Game Now'}</span>
                  <FastForward className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
