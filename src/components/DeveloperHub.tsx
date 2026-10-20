import { Github, ExternalLink, Code2, GitFork, ArrowUpRight, FolderGit2 } from 'lucide-react';
import { GAME_CENTER_REPO, HARIS_GITHUB_PROFILE } from '../data/games';

export function DeveloperHub({ onOpenAddModal }: { onOpenAddModal: () => void }) {
  const repos = [
    {
      name: 'game-center',
      fullName: 'harisxcode/game-center',
      role: 'Hub / Landing Platform',
      desc: 'Central game portal featuring responsive catalogs, instant in-app players, custom dark blue gaming theme, and transition effects.',
      url: GAME_CENTER_REPO,
      stars: 'Hub',
      tech: 'React · Tailwind CSS · Motion'
    },
    {
      name: 'nitro-league',
      fullName: 'harisxcode/nitro-league',
      role: 'Arcade Racing Game',
      desc: 'High-octane browser arcade racer featuring nitro boosts, cyber city tracks, and responsive keyboard steering mechanics.',
      url: 'https://github.com/harisxcode/nitro-league',
      stars: 'Live',
      tech: 'HTML5 Canvas · TypeScript · WebGL'
    },
    {
      name: 'flappy-bird-arcade',
      fullName: 'harisxcode/flappy-bird-arcade',
      role: 'Retro Arcade Game',
      desc: 'Classic pipe navigation arcade game rebuilt with fine-tuned flight physics, local high-score storage, and instant replay cycles.',
      url: 'https://github.com/harisxcode/flappy-bird-arcade',
      stars: 'Live',
      tech: 'Vanilla JS / TS · Canvas 2D'
    },
    {
      name: 'meme-mania',
      fullName: 'harisxcode/meme-mania',
      role: 'Viral Meme Arcade Game',
      desc: 'Fast-paced arcade reflex mini-games and trivia challenges celebrating iconic internet pop-culture and viral memes.',
      url: 'https://github.com/harisxcode/meme-mania',
      stars: 'Live',
      tech: 'HTML5 Canvas · TypeScript · Web Audio'
    }
  ];

  return (
    <section id="repositories" className="py-16 sm:py-20 border-b border-slate-800/80 bg-[#040816]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
              <FolderGit2 className="w-4 h-4" />
              <span>Open Source Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
              GitHub Repositories &amp; Source
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
              Every project in Haris Game Center is fully transparent, open-source, and hosted on GitHub Pages for zero-latency execution.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={HARIS_GITHUB_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>@harisxcode on GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>
        </div>

        {/* 4 Repositories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {repos.map((repo, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between p-6 rounded-2xl bg-[#081024] border border-slate-800/80 hover:border-cyan-500/30 transition-all duration-300 group shadow-md"
            >
              <div>
                {/* Header of repo card */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Code2 className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-mono text-cyan-300">{repo.role}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {repo.stars}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors font-display">
                  {repo.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5 mb-3">
                  {repo.fullName}
                </p>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {repo.desc}
                </p>
              </div>

              <div>
                <div className="text-[11px] font-mono text-slate-400 mb-4 pt-3 border-t border-slate-800/80">
                  {repo.tech}
                </div>

                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-semibold transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Inspect Code on GitHub</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Future Expansion Callout */}
        <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900/40 to-cyan-950/40 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-base sm:text-lg font-bold text-white font-display">
              Ready to plug in your next game?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              The game center platform is structured for instant scalability. Simply deploy to GitHub Pages and add the config entry.
            </p>
          </div>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shrink-0 cursor-pointer shadow-md shadow-cyan-500/20"
          >
            <span>Add New Game</span>
          </button>
        </div>

      </div>
    </section>
  );
}
