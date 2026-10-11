import { Play, Github, Gamepad2, ArrowUpRight, Flame } from 'lucide-react';
import { GAME_CENTER_REPO, Game, heroBanner } from '../data/games';

interface HeroSectionProps {
  games: Game[];
  onPlayGame: (game: Game) => void;
}

export function HeroSection({ games, onPlayGame }: HeroSectionProps) {
  const nitroGame = games.find((g) => g.id === 'nitro-league') || games[0];
  const flappyGame = games.find((g) => g.id === 'flappy-bird-arcade') || games[1];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-800/80">
      {/* Dark blue ambient background lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-900/20 via-cyan-900/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top unboxed kicker metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wider text-cyan-400 mb-4 uppercase">
          <span>HARIS GAMING CENTER</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>BROWSER ARCADE PLATFORM</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>OPEN SOURCE</span>
        </div>

        {/* 2-Column Split: Editorial Headline & Actions on Left, Hero Visual Arena on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] font-display text-balance">
              Precision browser games built for instant arcade thrill.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              Welcome to Haris Game Center—a unified home for high-octane racing and classic retro arcade games. Play Nitro League and Flappy Bird directly in your browser with zero installs, or inspect the open-source code on GitHub.
            </p>

            {/* Unboxed Metadata Stats Strip */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400 pt-2 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tabular-nums text-base">2</span>
                <span>Active Games</span>
              </div>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-cyan-400 tabular-nums text-base">60+</span>
                <span>FPS Canvas Rendering</span>
              </div>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">100%</span>
                <span>Open Source Repos</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onPlayGame(nitroGame)}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Play Nitro League</span>
              </button>

              <button
                onClick={() => onPlayGame(flappyGame)}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-100 hover:text-white border border-slate-700 hover:border-slate-600 font-semibold text-sm transition-colors cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4 text-cyan-400" />
                <span>Play Flappy Bird</span>
              </button>

              <a
                href={GAME_CENTER_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/60 font-medium text-sm transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>Game Center Repo</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
              </a>
            </div>
          </div>

          {/* Right Column: Hero Visual Arena Artwork Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-2xl shadow-blue-950/50 group">
              
              {/* Image with fallback and measured scrim */}
              <div className="aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] w-full relative overflow-hidden bg-slate-950">
                <img
                  src={heroBanner}
                  alt="Haris Gaming Center Arena"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />

                {/* Scrim overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#040814] via-[#040814]/40 to-transparent pointer-events-none" />

                {/* Overlaid quick launch badge */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="text-white font-bold text-sm">Arcade Arena Feed</div>
                    <div className="text-cyan-400 font-mono text-xs">Harisxcode Gaming Network</div>
                  </div>
                  <a
                    href="#games"
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30 font-medium transition-colors"
                  >
                    View All Games
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
