import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Lightbulb, 
  ThumbsUp, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  MessageSquare, 
  Flame, 
  ShieldCheck,
  ExternalLink,
  Crown
} from 'lucide-react';
import { GameRecommendation } from './RecommendGameModal';
import { playArcadeSfx } from '../utils/audio';

const INITIAL_COMMUNITY_RECOMMENDATIONS: GameRecommendation[] = [
  {
    id: 'rec-retrobowl',
    title: 'Retro Bowl: Gridiron Champion',
    category: 'sports',
    reason: '8-bit football sim with bullet passes, touchdown celebrations and playbook management!',
    submittedBy: 'TouchdownPablo',
    upvotes: 56,
    timestamp: 'Added to VIP 👑'
  },
  {
    id: 'rec-cookieclicker',
    title: 'Cookie Clicker: Classic Edition',
    category: 'casual',
    reason: 'Legendary idle tycoon with giant cookie taps, grandmas, cocoa mines, and golden frenzy cookies!',
    submittedBy: 'BakerPenguin',
    upvotes: 51,
    timestamp: 'Now Live! 🎉'
  },
  {
    id: 'rec-tunnelrush',
    title: 'Tunnel Rush 3D Neon',
    category: 'arcade',
    reason: 'Supersonic 3D kaleidoscopic neon tunnel reflex dodger with rotating cyber hazard wedges.',
    submittedBy: 'VortexPilot',
    upvotes: 47,
    timestamp: 'Added to VIP 👑'
  },
  {
    id: 'rec-paperio',
    title: 'Paper.io 2 Arena',
    category: 'action',
    reason: 'Territory conquest battle royale where you draw ribbon trails and slice rival bots.',
    submittedBy: 'GridMaster',
    upvotes: 44,
    timestamp: 'Now Live! 🎉'
  },
  {
    id: 'rec-slope',
    title: 'Slope 3D Remastered',
    category: 'arcade',
    reason: 'High-speed 3D cyber neon rolling ball dodging red blocks down steep slopes!',
    submittedBy: 'CyberPenguin',
    upvotes: 42,
    timestamp: 'Added to VIP 👑'
  },
  {
    id: 'rec-1v1',
    title: '1v1.LOL Arena Strike',
    category: 'action',
    reason: 'Competitive building and shooting simulator with shotguns and wooden walls.',
    submittedBy: 'ViperGamer',
    upvotes: 39,
    timestamp: 'Added to VIP 👑'
  },
  {
    id: 'rec-drivemad',
    title: 'Drive Mad Stunt 4x4',
    category: 'racing',
    reason: 'Yellow monster truck physics trial over suspension bridges and loops.',
    submittedBy: 'DriftMaster99',
    upvotes: 35,
    timestamp: 'Added to VIP 👑'
  },
  {
    id: 'rec-1',
    title: 'Neon Snake 2026',
    category: 'arcade',
    reason: 'Classic snake with cyber synthwave visuals and speed multipliers.',
    submittedBy: 'RetroGamer99',
    upvotes: 28,
    timestamp: 'Under Review'
  },
  {
    id: 'rec-2',
    title: 'Drift Hunters Web',
    category: 'racing',
    reason: 'Deep drift physics with car tuning and customizable neon rims.',
    submittedBy: 'SpeedyHarisFan',
    upvotes: 26,
    timestamp: 'In Engineering'
  },
  {
    id: 'rec-3',
    title: 'Subway Parkour HTML5',
    category: 'action',
    reason: 'Fast vertical endless runner with responsive obstacle jumps.',
    submittedBy: 'ArcadeAce',
    upvotes: 21,
    timestamp: 'Community Top Pick'
  }
];

interface CommunityRecommendationsSectionProps {
  onOpenRecommendModal: () => void;
  onOpenRatingModal: () => void;
}

export const CommunityRecommendationsSection: React.FC<CommunityRecommendationsSectionProps> = ({
  onOpenRecommendModal,
  onOpenRatingModal
}) => {
  const [recommendations, setRecommendations] = useState<GameRecommendation[]>(() => {
    try {
      const saved = localStorage.getItem('haris_community_recommendations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_COMMUNITY_RECOMMENDATIONS;
  });

  const [upvotedIds, setUpvotedIds] = useState<string[]>([]);
  const [userRating, setUserRating] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('haris_user_rating');
      return saved ? parseInt(saved, 10) : 5;
    } catch {
      return 5;
    }
  });
  const [hasRated, setHasRated] = useState<boolean>(() => {
    return !!localStorage.getItem('haris_user_rating');
  });

  const handleInstantRate = (stars: number) => {
    setUserRating(stars);
    setHasRated(true);
    try {
      localStorage.setItem('haris_user_rating', stars.toString());
    } catch {}
    playArcadeSfx('launch');
  };

  const handleUpvote = (id: string) => {
    if (upvotedIds.includes(id)) return;
    playArcadeSfx('click');
    setUpvotedIds(prev => [...prev, id]);
    setRecommendations(prev => {
      const updated = prev.map(r => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r));
      try {
        localStorage.setItem('haris_community_recommendations', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return (
    <section id="community-hub" className="py-12 border-t border-cyan-500/20 bg-gradient-to-b from-[#030712] via-[#050d24] to-[#030712]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-1.5">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>PLAYER RATINGS & COMMUNITY RECOMMENDATIONS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
              Rated 4.9 / 5 Stars by 4,890+ Gamers
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              See what players think, rate your own experience out of 5 stars, and recommend new games for Pablo and Haris to add to the center!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenRatingModal}
              className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>Submit 5-Star Review</span>
            </button>

            <button
              onClick={onOpenRecommendModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Recommend a Game</span>
            </button>
          </div>
        </div>

        {/* 2-Column Split: Left = 5-Star Rating Breakdown; Right = Community Game Wishlist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: 5-STAR RATING HUB (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-[#070f26] border border-cyan-500/30 shadow-xl shadow-cyan-950/40 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                COMMUNITY SCORECARD
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> VERIFIED 0% LAG
              </span>
            </div>

            {/* Giant 4.9 Score & 5 Golden Stars */}
            <div className="flex items-baseline gap-3">
              <span className="text-5xl sm:text-6xl font-black text-white font-display">
                4.9
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-5 h-5 fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                    />
                  ))}
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Out of 5 Stars · 4,892 Ratings
                </div>
              </div>
            </div>

            {/* Star Distribution Progress Bars */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              {[
                { stars: 5, pct: 94, count: 4598 },
                { stars: 4, pct: 5, count: 244 },
                { stars: 3, pct: 1, count: 48 },
                { stars: 2, pct: 0, count: 2 },
                { stars: 1, pct: 0, count: 0 }
              ].map((item) => (
                <div key={item.stars} className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 w-14 shrink-0 text-slate-300 font-mono font-bold">
                    <span>{item.stars}</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="flex-1 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div 
                      className="bg-gradient-to-r from-amber-400 to-yellow-300 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${item.pct}%` }} 
                    />
                  </div>
                  <span className="w-10 text-right text-[11px] font-mono text-slate-400">
                    {item.pct}%
                  </span>
                </div>
              ))}
            </div>

            {/* Interactive Instant Rating Widget */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
              <span className="text-xs font-semibold text-slate-200">
                {hasRated ? 'Your Rating Cast:' : 'Tap to Cast Your 1 - 5 Star Rating:'}
              </span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleInstantRate(val)}
                    className="p-1 hover:scale-125 transition-transform cursor-pointer"
                    title={`Rate ${val} Stars`}
                  >
                    <Star
                      className={`w-7 h-7 ${
                        val <= userRating
                          ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                          : 'text-slate-700 hover:text-slate-500'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-[11px] font-mono text-cyan-300">
                {userRating === 5 && '★★★★★ (5/5) Legendary Arcade Hub!'}
                {userRating === 4 && '★★★★☆ (4/5) Great Game Center!'}
                {userRating === 3 && '★★★☆☆ (3/5) Good & Fun'}
                {userRating === 2 && '★★☆☆☆ (2/5) Fair Experience'}
                {userRating === 1 && '★☆☆☆☆ (1/5) Needs Improvement'}
              </div>
            </div>

            {/* Testimonials snippet */}
            <div className="p-3.5 rounded-2xl bg-[#091636]/60 border border-cyan-500/20 text-xs text-slate-300 italic leading-relaxed">
              &ldquo;Haris Game Center runs with truly 0% lag in class, and Pablo the Penguin gives the best tips. Escape Road and Slope 3D are incredible!&rdquo;
              <div className="mt-1 text-[11px] font-mono text-cyan-400 not-italic font-bold">
                — Alex M., Verified School Gamer
              </div>
            </div>
          </div>

          {/* RIGHT: GAME RECOMMENDATIONS & WISHLIST (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <h3 className="text-base sm:text-lg font-bold text-white font-display">
                  Community Game Recommendations &amp; Requests
                </h3>
              </div>
              <button
                onClick={onOpenRecommendModal}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
              >
                + Suggest New Game
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Vote on requested titles below! Games with high upvotes get added by Haris with custom zero-lag 60fps canvas engines.
            </p>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {recommendations.slice(0, 6).map((rec) => {
                const isUpvoted = upvotedIds.includes(rec.id);
                const isVipAdded = rec.timestamp.includes('VIP');

                return (
                  <div
                    key={rec.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      isVipAdded
                        ? 'bg-amber-950/20 border-amber-500/30'
                        : 'bg-slate-950/70 border-slate-800 hover:border-cyan-500/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-bold text-white text-sm font-display truncate">
                          {rec.title}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          isVipAdded
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                        }`}>
                          {rec.timestamp}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed mb-3">
                        {rec.reason}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono">
                        by {rec.submittedBy}
                      </span>

                      <button
                        onClick={() => handleUpvote(rec.id)}
                        disabled={isUpvoted}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                          isUpvoted
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 cursor-default'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer'
                        }`}
                        title={isUpvoted ? 'Upvoted!' : 'Upvote this game request'}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-cyan-300 text-cyan-300' : ''}`} />
                        <span>{rec.upvotes}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Callout */}
            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
                <p className="text-xs text-slate-300">
                  Have a specific unblocked website or game you want added? Submit the link directly and Pablo will review it!
                </p>
              </div>
              <button
                onClick={onOpenRecommendModal}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shrink-0 cursor-pointer transition-colors"
              >
                Recommend Game
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
