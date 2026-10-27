import { useState } from 'react';
import { 
  Github, 
  Sparkles, 
  Menu, 
  X, 
  Star, 
  Lightbulb, 
  ShieldAlert, 
  Snowflake, 
  Coins, 
  Crown, 
  LogOut,
  User,
  Heart
} from 'lucide-react';
import { UserAccount } from '../types';
import pabloMascotImg from '../assets/images/retro_pablo_mascot_1793055166374.jpg';

interface NavbarProps {
  currentUser: UserAccount | null;
  onOpenPabloHub: () => void;
  onTriggerStealth: () => void;
  snowEnabled: boolean;
  onToggleSnow: () => void;
  onSignOut: () => void;
  onOpenRecommendModal: () => void;
  onOpenRatingModal: () => void;
  onOpenVipModal: () => void;
}

export function Navbar({ 
  currentUser,
  onOpenPabloHub,
  onTriggerStealth,
  snowEnabled,
  onToggleSnow,
  onSignOut,
  onOpenRecommendModal,
  onOpenRatingModal,
  onOpenVipModal
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const points = currentUser?.penguinPoints || 0;
  const isVip = !!currentUser?.isVip;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#040814]/90 backdrop-blur-md border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Brand Wordmark & Mascot Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenPabloHub}
            className="flex items-center gap-2.5 group text-left cursor-pointer"
            title="Click to visit Pablo Arcade Hub"
          >
            <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-cyan-400 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <img
                src={pabloMascotImg}
                alt="Pablo Mascot"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-base sm:text-lg font-black tracking-tight text-white font-display group-hover:text-cyan-300 transition-colors">
                Haris Game Center
              </div>
              <div className="text-[10px] font-mono text-cyan-400 -mt-1 hidden sm:block">
                Powered by Pablo the Penguin · 0% Lag
              </div>
            </div>
          </button>
        </div>

        {/* Center Utilities / Pablo Hub button */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Rate 5 Stars Button */}
          <button
            onClick={onOpenRatingModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 transition-all text-xs font-bold cursor-pointer"
            title="Rate Haris Game Center out of 5 stars"
          >
            <div className="flex items-center gap-0.5 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3 h-3 fill-amber-400" />
              ))}
            </div>
            <span className="font-mono">4.9/5</span>
            <span className="text-[10px] text-amber-200/80 font-normal">Rate</span>
          </button>

          {/* Game Recommendations button */}
          <button
            onClick={onOpenRecommendModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 hover:text-white transition-all text-xs font-bold cursor-pointer"
            title="Recommend a game or request additions"
          >
            <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
            <span>Recommend Game</span>
          </button>

          {/* Pablo Hub shortcut button */}
          <button
            onClick={onOpenPabloHub}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-500/40 text-cyan-300 hover:text-white hover:border-cyan-400 transition-all text-xs font-bold shadow-sm shadow-cyan-950/40 cursor-pointer"
          >
            <span className="text-sm">🐧</span>
            <span>Pablo Hub</span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-[10px] text-cyan-300 font-mono">
              Tips & Pet
            </span>
          </button>

          {/* Teacher Panic / Stealth Button */}
          <button
            onClick={onTriggerStealth}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
            title="Instant classroom disguise (Hotkey: ] or Esc)"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Panic</span>
          </button>

          {/* Snow toggle */}
          <button
            onClick={onToggleSnow}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              snowEnabled
                ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={snowEnabled ? 'Disable snowfall particles' : 'Enable snowfall particles'}
          >
            <Snowflake className="w-4 h-4" />
          </button>
        </div>

        {/* Right side: Player status & Points */}
        <div className="flex items-center gap-2.5 shrink-0">
          {currentUser && (
            <div className="flex items-center gap-2">
              {/* Penguin Points badge */}
              <div 
                onClick={onOpenPabloHub}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold cursor-pointer hover:bg-amber-500/20 transition-colors"
                title="Your Penguin Points balance. Click to feed Pablo or unlock VIP!"
              >
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>{points} pts</span>
              </div>

              {/* VIP Status or VIP Upgrade Button */}
              {isVip ? (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono">
                  <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>VIP PASS</span>
                </div>
              ) : (
                <button
                  onClick={onOpenVipModal}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-xs hover:brightness-110 transition-all shadow-sm shadow-amber-500/20 cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Get VIP</span>
                </button>
              )}

              {/* Player Tag & Sign Out */}
              <div className="flex items-center gap-1.5 pl-1">
                <span className="text-lg p-1 bg-slate-900 rounded-lg border border-slate-800" title={`Signed in as ${currentUser.username}`}>
                  {currentUser.avatar || '🐧'}
                </span>
                <button
                  onClick={onSignOut}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Sign out or switch gamer tag"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#070e24] px-4 py-4 space-y-3">
          <button
            onClick={() => { onOpenPabloHub(); setMobileMenuOpen(false); }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold"
          >
            <span>🐧 Pablo Arcade Hub (Tips & Pet)</span>
            <span>Open →</span>
          </button>

          <button
            onClick={() => { onTriggerStealth(); setMobileMenuOpen(false); }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 text-xs font-semibold"
          >
            <span>🛡️ Stealth Panic Disguise</span>
            <span>Activate</span>
          </button>

          <div className="flex gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => { onOpenRecommendModal(); setMobileMenuOpen(false); }}
              className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-slate-300"
            >
              Recommend
            </button>
            <button
              onClick={() => { onOpenRatingModal(); setMobileMenuOpen(false); }}
              className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-amber-300"
            >
              Rate Site
            </button>
            <button
              onClick={() => { onToggleSnow(); setMobileMenuOpen(false); }}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-cyan-300"
            >
              ❄️ Snow
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
