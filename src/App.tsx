/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { GameCard } from './components/GameCard';
import { GameModal } from './components/GameModal';
import { AddGameModal } from './components/AddGameModal';
import { DeveloperHub } from './components/DeveloperHub';
import { Footer } from './components/Footer';
import { IntroScreen } from './components/IntroScreen';
import { INITIAL_GAMES, Game } from './data/games';
import { Search, Flame, Gamepad2, Plus, Sparkles, Trophy } from 'lucide-react';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [games, setGames] = useState<Game[]>(() => {
    try {
      const saved = localStorage.getItem('haris_games');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure initial games are always merged and up to date
        const initialIds = new Set(INITIAL_GAMES.map(g => g.id));
        const customGames = parsed.filter((g: Game) => !initialIds.has(g.id));
        return [...INITIAL_GAMES, ...customGames];
      }
    } catch {
      // Fallback
    }
    return INITIAL_GAMES;
  });

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'racing' | 'arcade' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('haris_favorites');
      return saved ? JSON.parse(saved) : ['nitro-league', 'flappy-bird-arcade'];
    } catch {
      return ['nitro-league', 'flappy-bird-arcade'];
    }
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Sync favorites
  useEffect(() => {
    try {
      localStorage.setItem('haris_favorites', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  // Sync custom games
  useEffect(() => {
    try {
      localStorage.setItem('haris_games', JSON.stringify(games));
    } catch {}
  }, [games]);

  const toggleFavorite = (gameId: string) => {
    setFavorites(prev => 
      prev.includes(gameId) ? prev.filter(id => id !== gameId) : [...prev, gameId]
    );
  };

  const handleAddGame = (newGame: Game) => {
    setGames(prev => [newGame, ...prev]);
  };

  // Filter games based on category, query, favorites
  const filteredGames = games.filter(game => {
    if (activeFilter === 'racing' && game.category !== 'racing') return false;
    if (activeFilter === 'arcade' && game.category !== 'arcade') return false;
    if (activeFilter === 'favorites' && !favorites.includes(game.id)) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = game.title.toLowerCase().includes(query);
      const matchGenre = game.genre.toLowerCase().includes(query);
      const matchDesc = game.description.toLowerCase().includes(query);
      return matchTitle || matchGenre || matchDesc;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white flex flex-col relative cyber-grid">
      
      {/* Initial Opening Transition Effect */}
      {showIntro && (
        <IntroScreen onComplete={() => setShowIntro(false)} />
      )}

      {/* Primary Top Bar */}
      <Navbar
        onReplayIntro={() => setShowIntro(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          games={games}
          onPlayGame={(game) => setSelectedGame(game)}
        />

        {/* Featured Showcase Section */}
        <section id="games" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Kicker and Title */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
                <Gamepad2 className="w-4 h-4" />
                <span>Playable Catalog</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
                Featured Arcade Titles
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
                Select any title to launch immediately in your browser or test in the embedded interactive viewport.
              </p>
            </div>

            {/* Functional Filter Tabs & Search Control */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 w-44 sm:w-52 transition-colors"
                />
              </div>

              {/* Segmented Filter Buttons (allowed interactive state buttons per anti-slop rules) */}
              <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    activeFilter === 'all'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({games.length})
                </button>
                <button
                  onClick={() => setActiveFilter('racing')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    activeFilter === 'racing'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Racing
                </button>
                <button
                  onClick={() => setActiveFilter('arcade')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    activeFilter === 'arcade'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Arcade
                </button>
                <button
                  onClick={() => setActiveFilter('favorites')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    activeFilter === 'favorites'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Favorites ({favorites.length})
                </button>
              </div>
            </div>
          </div>

          {/* Grid of Games */}
          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onPlayModal={(g) => setSelectedGame(g)}
                  isFavorite={favorites.includes(game.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}

              {/* Scalability Slot: Add Next Game Card */}
              <div
                onClick={() => setIsAddModalOpen(true)}
                className="group flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-slate-800 hover:border-cyan-500/60 bg-slate-950/40 hover:bg-slate-900/40 text-center transition-all duration-300 cursor-pointer min-h-[380px]"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:border-cyan-400 transition-all mb-4 shadow-lg">
                  <Plus className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors font-display">
                  Add Future Game
                </h3>
                <p className="mt-2 text-xs text-slate-400 max-w-xs leading-relaxed">
                  Easily integrate your next web game release by configuring the GitHub Pages URL and repository.
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:underline">
                  <span>Register Game</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center rounded-2xl border border-slate-800 bg-[#070e22]">
              <p className="text-slate-400 text-sm">No games match your current filter or search query.</p>
              <button
                onClick={() => {
                  setActiveFilter('all');
                  setSearchQuery('');
                }}
                className="mt-3 text-xs text-cyan-400 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>

        {/* Developer & Repository Hub Section */}
        <DeveloperHub onOpenAddModal={() => setIsAddModalOpen(true)} />
      </main>

      {/* Quiet Footer */}
      <Footer />

      {/* Interactive In-App Player Modal */}
      <GameModal
        game={selectedGame}
        onClose={() => setSelectedGame(null)}
      />

      {/* Add / Register Future Game Modal */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddGame}
      />
    </div>
  );
}
