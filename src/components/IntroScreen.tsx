import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, Play, Volume2, VolumeX, FastForward } from 'lucide-react';
import { playArcadeSfx } from '../utils/audio';
import { mascotLogo } from '../data/games';

interface IntroScreenProps {
  onComplete: () => void;
}

export function IntroScreen({ onComplete }: IntroScreenProps) {
  const [progress, setProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isDismissing, setIsDismissing] = useState(false);

  useEffect(() => {
    // Progress loader simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2.5;
      });
    }, 45);

    return () => clearInterval(interval);
  }, []);

  // When progress hits 100%, hold briefly and auto-finish, or let user click
  useEffect(() => {
    if (progress >= 100 && !isDismissing) {
      const timer = setTimeout(() => {
        handleEnter();
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [progress, isDismissing]);

  const handleEnter = () => {
    if (isDismissing) return;
    setIsDismissing(true);
    if (soundEnabled) {
      playArcadeSfx('launch');
    }
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  const handleSkip = () => {
    setIsDismissing(true);
    setTimeout(() => {
      onComplete();
    }, 200);
  };

  return (
    <AnimatePresence>
      {!isDismissing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030714] text-white overflow-hidden select-none"
        >
          {/* Dark blue gaming atmospheric backdrop */}
          <div className="absolute inset-0 bg-radial from-[#0c1a3b] via-[#050b1d] to-[#02050e] pointer-events-none" />
          
          {/* Subtle cyber grid */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(56, 189, 248, 0.15) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(56, 189, 248, 0.15) 1px, transparent 1px)`,
              backgroundSize: '48px 48px'
            }}
          />

          {/* Glowing ambient orbs in dark blue */}
          <div className="absolute -top-40 left-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-blue-700/20 rounded-full blur-3xl pointer-events-none" />

          {/* Sound & Skip controls */}
          <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playArcadeSfx('click');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/60 bg-slate-900/60 text-xs text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
              title={soundEnabled ? 'Mute audio' : 'Enable audio'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
              <span>{soundEnabled ? 'SFX ON' : 'SFX MUTED'}</span>
            </button>

            <button
              onClick={handleSkip}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700/60 bg-slate-900/60 text-xs text-slate-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors"
            >
              <span>SKIP</span>
              <FastForward className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Main Hero Animated Content */}
          <div className="relative z-10 max-w-2xl w-full px-6 text-center flex flex-col items-center">
            {/* Center Gaming Emblem */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-6"
            >
              <div className="w-24 h-24 rounded-2xl p-1 bg-gradient-to-br from-cyan-500/40 via-blue-600/20 to-slate-900 border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.25)] flex items-center justify-center overflow-hidden">
                <img
                  src={mascotLogo}
                  alt="Haris Game Center Emblem"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    // Fallback to SVG icon
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <Gamepad2 className="w-12 h-12 text-cyan-400 absolute" style={{ display: 'none' }} />
              </div>
            </motion.div>

            {/* Intro kicker text */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center justify-center gap-3 text-xs tracking-[0.25em] text-cyan-400 font-semibold mb-2 uppercase"
            >
              <span>SYSTEM READY</span>
              <span className="text-slate-600">·</span>
              <span>ZERO INSTALL</span>
              <span className="text-slate-600">·</span>
              <span>PURE HTML5</span>
            </motion.div>

            {/* Main Title Heading */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.7 }}
            >
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase leading-none font-display">
                WELCOME TO <br />
                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(56,189,248,0.4)]">
                  HARIS GAME CENTER
                </span>
              </h1>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="mt-4 text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed font-normal"
            >
              Universal Browser Gaming Hub · Fast, Zero-Install Arcade &amp; Cloud Experiences.
            </motion.p>

            {/* Progress / Loading Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="w-full max-w-md mt-8"
            >
              <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2">
                <span>INITIALIZING ENGINE</span>
                <span className="text-cyan-400 font-medium tabular-nums">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 w-full bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-0.5">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-300 rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>
            </motion.div>

            {/* Primary Action Button */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-8"
            >
              <button
                onClick={handleEnter}
                className="group relative inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-[0_0_30px_rgba(14,165,233,0.35)] hover:shadow-[0_0_40px_rgba(14,165,233,0.55)] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{progress >= 100 ? 'ENTER GAME CENTER' : 'ENTER NOW'}</span>
              </button>
            </motion.div>
          </div>

          {/* Bottom subtle watermark/credit */}
          <div className="absolute bottom-6 text-xs text-slate-500 tracking-wider">
            CREATED BY HARIS · GITHUB: HARISXCODE
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
