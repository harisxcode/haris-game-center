import { useState } from 'react';
import { X, Plus, Copy, Check, Sparkles } from 'lucide-react';
import { Game } from '../data/games';

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGame: (game: Game) => void;
}

export function AddGameModal({ isOpen, onClose, onAddGame }: AddGameModalProps) {
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState<Game['genre']>('Retro Arcade');
  const [playUrl, setPlayUrl] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newGame: Game = {
      id,
      title: title.trim(),
      tagline: tagline.trim() || 'Fast-paced browser game experience',
      description: description.trim() || 'Custom browser-based game created with HTML5 canvas and TypeScript.',
      genre,
      category: genre.includes('Racing') ? 'racing' : genre.includes('Retro') ? 'arcade' : 'action',
      status: playUrl.trim() ? 'live' : 'upcoming',
      playUrl: playUrl.trim(),
      repoUrl: repoUrl.trim() || `https://github.com/harisxcode/${id}`,
      thumbnailUrl: thumbnailUrl.trim() || '/src/assets/images/hero_gaming_center_1791725017457.jpg',
      features: ['HTML5 Canvas rendering engine', 'Smooth keyboard and touch input', 'Zero dependency standalone build'],
      controls: [{ key: 'Arrows / WASD', action: 'Player Movement' }, { key: 'Space', action: 'Action' }],
      releaseYear: new Date().getFullYear().toString(),
      techStack: ['HTML5 Canvas', 'TypeScript', 'GitHub Pages'],
      isFeatured: false
    };

    onAddGame(newGame);
    onClose();
  };

  const generatedSnippet = `{
  id: '${title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'my-new-game'}',
  title: '${title || 'My New Game'}',
  tagline: '${tagline || 'Exciting browser gameplay'}',
  description: '${description || 'Game description here.'}',
  genre: '${genre}',
  category: '${genre.includes('Racing') ? 'racing' : 'arcade'}',
  status: '${playUrl ? 'live' : 'upcoming'}',
  playUrl: '${playUrl || 'https://harisxcode.github.io/my-new-game/'}',
  repoUrl: '${repoUrl || 'https://github.com/harisxcode/my-new-game'}',
  thumbnailUrl: '${thumbnailUrl || '/src/assets/images/hero_gaming_center_1791725017457.jpg'}',
  features: ['Zero-install browser play', 'Full 60fps canvas loop'],
  controls: [{ key: 'Space', action: 'Primary Action' }],
  releaseYear: '${new Date().getFullYear()}',
  techStack: ['HTML5 Canvas', 'TypeScript', 'GitHub Pages'],
}`;

  const copySnippet = () => {
    navigator.clipboard.writeText(generatedSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#070e22] rounded-2xl border border-slate-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>Add New Game to Hub</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Easily expand Haris Game Center with your future projects.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Game Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cyber Runner DX"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. High-speed obstacle runner"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Genre
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value as Game['genre'])}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Arcade Racing">Arcade Racing</option>
                <option value="Retro Arcade">Retro Arcade</option>
                <option value="Action Adventure">Action Adventure</option>
                <option value="Puzzle & Strategy">Puzzle &amp; Strategy</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief synopsis of gameplay mechanics..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                GitHub Pages Play URL
              </label>
              <input
                type="url"
                value={playUrl}
                onChange={(e) => setPlayUrl(e.target.value)}
                placeholder="https://harisxcode.github.io/game-name/"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/harisxcode/game-name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Thumbnail URL (Optional)
            </label>
            <input
              type="text"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="Path to thumbnail image or screenshot"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Action Row */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={copySnippet}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Code Snippet Copied!' : 'Copy Code Snippet'}</span>
            </button>

            <div className="w-full sm:w-auto flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-cyan-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add Game to Hub</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
