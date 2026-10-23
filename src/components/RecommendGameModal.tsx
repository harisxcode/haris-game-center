import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, X, Plus, ThumbsUp, Check, ExternalLink, Sparkles } from 'lucide-react';
import { GameCategory, UNIVERSAL_CATEGORIES } from '../data/games';
import { playArcadeSfx } from '../utils/audio';

export interface GameRecommendation {
  id: string;
  title: string;
  category: GameCategory;
  suggestedUrl?: string;
  reason: string;
  submittedBy: string;
  upvotes: number;
  timestamp: string;
}

const DEFAULT_RECOMMENDATIONS: GameRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Neon Snake 2026',
    category: 'arcade',
    suggestedUrl: '',
    reason: 'Classic snake with cyber synthwave visuals and speed multipliers.',
    submittedBy: 'RetroGamer99',
    upvotes: 18,
    timestamp: '2 days ago'
  },
  {
    id: 'rec-2',
    title: 'Drift Hunters Web',
    category: 'racing',
    suggestedUrl: '',
    reason: 'Deep drift physics with car tuning and customizable neon rims.',
    submittedBy: 'SpeedyHarisFan',
    upvotes: 24,
    timestamp: 'Yesterday'
  },
  {
    id: 'rec-3',
    title: 'Subway Parkour HTML5',
    category: 'action',
    suggestedUrl: '',
    reason: 'Fast vertical endless runner with responsive obstacle jumps.',
    submittedBy: 'ArcadeAce',
    upvotes: 15,
    timestamp: 'Today'
  }
];

interface RecommendGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RecommendGameModal({ isOpen, onClose }: RecommendGameModalProps) {
  const [recommendations, setRecommendations] = useState<GameRecommendation[]>(() => {
    try {
      const saved = localStorage.getItem('haris_community_recommendations');
      return saved ? JSON.parse(saved) : DEFAULT_RECOMMENDATIONS;
    } catch {
      return DEFAULT_RECOMMENDATIONS;
    }
  });

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GameCategory>('arcade');
  const [suggestedUrl, setSuggestedUrl] = useState('');
  const [reason, setReason] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [upvotedIds, setUpvotedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('haris_community_recommendations', JSON.stringify(recommendations));
    } catch {}
  }, [recommendations]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newRec: GameRecommendation = {
      id: `rec-${Date.now()}`,
      title: title.trim(),
      category,
      suggestedUrl: suggestedUrl.trim(),
      reason: reason.trim() || 'Exciting browser game that would be an awesome fit for Haris Game Center!',
      submittedBy: submittedBy.trim() || 'Anonymous Gamer',
      upvotes: 1,
      timestamp: 'Just now'
    };

    setRecommendations(prev => [newRec, ...prev]);
    setUpvotedIds(prev => [...prev, newRec.id]);
    playArcadeSfx('launch');
    setIsSubmitted(true);

    // Reset form fields
    setTitle('');
    setSuggestedUrl('');
    setReason('');
    setSubmittedBy('');

    setTimeout(() => {
      setIsSubmitted(false);
    }, 2500);
  };

  const handleUpvote = (id: string) => {
    if (upvotedIds.includes(id)) return;
    playArcadeSfx('click');
    setUpvotedIds(prev => [...prev, id]);
    setRecommendations(prev =>
      prev.map(r => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-[#070e24] rounded-2xl border border-slate-800 shadow-2xl p-6 sm:p-7 max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white font-display">
                  Recommend Future Games
                </h2>
                <p className="text-xs text-slate-400">
                  Suggest titles, links, or ideas for Haris to add to the Game Center!
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {isSubmitted && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>Thank you! Your game recommendation has been submitted to Haris Game Center!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Game Name / Idea *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 2D Platformer, Retro Racer..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Target Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GameCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="racing">🏎️ Racing &amp; Driving</option>
                  <option value="cloud">☁️ Cloud &amp; Streaming</option>
                  <option value="arcade">🕹️ Arcade &amp; Retro</option>
                  <option value="action">⚡ Action &amp; Platformer</option>
                  <option value="casual">🎭 Casual &amp; Viral</option>
                  <option value="puzzle">🧩 Puzzle &amp; Strategy</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Game Link or GitHub Repo (Optional)
                </label>
                <input
                  type="url"
                  value={suggestedUrl}
                  onChange={(e) => setSuggestedUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Your Gamer Tag / Name (Optional)
                </label>
                <input
                  type="text"
                  value={submittedBy}
                  onChange={(e) => setSubmittedBy(e.target.value)}
                  placeholder="e.g. HarisFan, ArcadePro"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                Why would this game be fun to add?
              </label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe why you want this game on the game center and what makes it fun..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Submit Recommendation</span>
              </button>
            </div>
          </form>

          {/* Community Wishlist / Existing Recommendations */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                  Community Game Wishlist ({recommendations.length})
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Vote on future additions</span>
            </div>

            <div className="space-y-2.5">
              {recommendations.map((rec) => {
                const isUpvoted = upvotedIds.includes(rec.id);
                const catMeta = UNIVERSAL_CATEGORIES.find(c => c.id === rec.category);
                return (
                  <div
                    key={rec.id}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm truncate font-display">
                          {rec.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20 text-cyan-300">
                          {catMeta?.title || rec.category}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          by {rec.submittedBy} · {rec.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-2">
                        {rec.reason}
                      </p>
                      {rec.suggestedUrl && (
                        <a
                          href={rec.suggestedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:underline"
                        >
                          <span>Reference Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => handleUpvote(rec.id)}
                      className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl border transition-colors shrink-0 cursor-pointer ${
                        isUpvoted
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                      title={isUpvoted ? 'Already upvoted!' : 'Upvote this game request'}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-cyan-300' : ''}`} />
                      <span className="text-xs font-mono font-bold mt-0.5">{rec.upvotes}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
