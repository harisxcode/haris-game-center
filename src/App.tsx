/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { GameCard } from './components/GameCard';
import { CompactGameRow } from './components/CompactGameRow';
import { GameFilterControls, CategoryFilter, SortOption, ViewMode } from './components/GameFilterControls';
import { GameModal } from './components/GameModal';
import { AddGameModal } from './components/AddGameModal';
import { GameHypeAdModal } from './components/GameHypeAdModal';
import { RatingModal } from './components/RatingModal';
import { RecommendGameModal } from './components/RecommendGameModal';
import { DeveloperHub } from './components/DeveloperHub';
import { Footer } from './components/Footer';
import { IntroScreen } from './components/IntroScreen';
import { MusicStreamPlayerModal } from './components/MusicStreamPlayerModal';
import { INITIAL_GAMES, Game, UNIVERSAL_CATEGORIES } from './data/games';
import { 
  Gamepad2, 
  Plus, 
  Sparkles, 
  SlidersHorizontal, 
  Car, 
  Laugh, 
  Heart, 
  Clock, 
  Flame, 
  Cloud, 
  BrainCircuit, 
  Layers,
  ArrowRight,
  Star,
  Lightbulb,
  Tv,
  Headphones
} from 'lucide-react';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [games, setGames] = useState<Game[]>(() => {
    try {
      const saved = localStorage.getItem('haris_games');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure initial games are always merged and up to date, and removed unwanted games
        const initialIds = new Set(INITIAL_GAMES.map(g => g.id));
        const customGames = parsed.filter(
          (g: Game) => !initialIds.has(g.id) && g.id !== 'drive-u' && g.id !== 'cyber-runner-dx'
        );
        return [...INITIAL_GAMES, ...customGames];
      }
    } catch {
      // Fallback
    }
    return INITIAL_GAMES;
  });

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [adGame, setAdGame] = useState<Game | null>(null);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);
  const [isMusicStreamModalOpen, setIsMusicStreamModalOpen] = useState(false);

  const [musicStreamUrl, setMusicStreamUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('haris_music_stream_url');
      return saved || 'https://is.gd/musicstream';
    } catch {
      return 'https://is.gd/musicstream';
    }
  });

  const handleUpdateMusicStreamUrl = (newUrl: string) => {
    setMusicStreamUrl(newUrl);
    try {
      localStorage.setItem('haris_music_stream_url', newUrl);
    } catch {}
    setGames(prev => prev.map(g => g.id === 'music-stream' ? { ...g, playUrl: newUrl, repoUrl: newUrl } : g));
  };

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [viewMode, setViewMode] = useState<ViewMode>('shelves');

  const [userRating, setUserRating] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('haris_user_rating');
      return saved ? parseInt(saved, 10) : 5;
    } catch {
      return 5;
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('haris_favorites');
      return saved ? JSON.parse(saved) : ['nitro-league', 'flappy-bird-arcade', 'meme-mania'];
    } catch {
      return ['nitro-league', 'flappy-bird-arcade', 'meme-mania'];
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

  const handleOpenAd = (game: Game) => {
    setAdGame(game);
    setIsAdModalOpen(true);
  };

  // Filter and sort games
  const filteredAndSortedGames = useMemo(() => {
    const result = games.filter(game => {
      // Category filter
      if (activeCategory !== 'all') {
        if (activeCategory === 'favorites') {
          if (!favorites.includes(game.id)) return false;
        } else if (activeCategory === 'upcoming') {
          if (game.status !== 'upcoming') return false;
        } else if (activeCategory === 'casual') {
          if (game.category !== 'casual' && (game.category as string) !== 'meme') return false;
        } else {
          if (game.category !== activeCategory) return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = game.title.toLowerCase().includes(query);
        const matchGenre = game.genre.toLowerCase().includes(query);
        const matchCategory = game.category.toLowerCase().includes(query);
        const matchDesc = game.description.toLowerCase().includes(query);
        const matchTagline = game.tagline.toLowerCase().includes(query);
        return matchTitle || matchGenre || matchCategory || matchDesc || matchTagline;
      }
      return true;
    });

    // Sorting
    return result.sort((a, b) => {
      if (sortOption === 'az') {
        return a.title.localeCompare(b.title);
      }
      if (sortOption === 'newest') {
        return (b.releaseYear || '').localeCompare(a.releaseYear || '');
      }
      // 'featured'
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return a.title.localeCompare(b.title);
    });
  }, [games, activeCategory, searchQuery, favorites, sortOption]);

  const handlePlayGame = (game: Game) => {
    if (game.id === 'music-stream') {
      setIsMusicStreamModalOpen(true);
    } else if (game.directPlayOnly) {
      window.open(game.playUrl, '_blank', 'noopener,noreferrer');
    } else {
      setSelectedGame(game);
    }
  };

  const getCategoryIcon = (id: CategoryFilter) => {
    switch (id) {
      case 'racing': return Car;
      case 'cloud': return Cloud;
      case 'arcade': return Gamepad2;
      case 'action': return Flame;
      case 'casual': return Laugh;
      case 'puzzle': return BrainCircuit;
      case 'other': return Headphones;
      case 'favorites': return Heart;
      case 'upcoming': return Clock;
      default: return SlidersHorizontal;
    }
  };

  const quickFilterPills: { id: CategoryFilter; label: string; icon: typeof Gamepad2 }[] = [
    { id: 'all', label: 'All Categories', icon: SlidersHorizontal },
    { id: 'racing', label: 'Racing & Driving', icon: Car },
    { id: 'cloud', label: 'Cloud Streaming', icon: Cloud },
    { id: 'arcade', label: 'Arcade & Retro', icon: Gamepad2 },
    { id: 'action', label: 'Action & Platformer', icon: Flame },
    { id: 'casual', label: 'Casual & Viral', icon: Laugh },
    { id: 'puzzle', label: 'Puzzle & Strategy', icon: BrainCircuit },
    { id: 'other', label: 'Other', icon: Headphones },
    { id: 'favorites', label: 'Favorites', icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white flex flex-col relative cyber-grid">
      
      {/* Initial Opening Transition Effect (Minimal & Universal, No Game Mentions) */}
      {showIntro && (
        <IntroScreen onComplete={() => setShowIntro(false)} />
      )}

      {/* Primary Top Bar */}
      <Navbar
        onReplayIntro={() => setShowIntro(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenRatingModal={() => setIsRatingModalOpen(true)}
        onOpenRecommendModal={() => setIsRecommendModalOpen(true)}
      />

      <main className="flex-1">
        {/* Universal Hero Section */}
        <HeroSection
          games={games}
          onPlayGame={handlePlayGame}
        />

        {/* Featured Game Hype Ads Spotlight Strip */}
        <section className="border-b border-slate-800/80 bg-[#060c1d]/60 py-3 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="font-mono uppercase tracking-wider text-amber-300 font-bold">
                Featured Game Hype Previews:
              </span>
              <span className="hidden md:inline text-slate-400">
                Watch short preview ads highlighting how fun each game is before playing!
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
              {games.slice(0, 4).map((g) => (
                <button
                  key={g.id}
                  onClick={() => handleOpenAd(g)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-[11px] text-slate-300 hover:text-amber-300 transition-colors shrink-0 cursor-pointer"
                >
                  <Tv className="w-3 h-3 text-amber-400" />
                  <span className="truncate max-w-[120px]">{g.title} Ad</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Clean & Organized Game Catalog Section */}
        <section id="games" className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Kicker and Title */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 mb-1.5">
                <Layers className="w-4 h-4" />
                <span>Universal Game Categories</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                Browse by Category
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-xl">
                Organized library for rapid navigation. Select a category below or search across all titles.
              </p>
            </div>

            {/* Quick Category Segmented Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {quickFilterPills.map((pill) => {
                const Icon = pill.icon;
                const isSelected = activeCategory === pill.id;
                return (
                  <button
                    key={pill.id}
                    onClick={() => setActiveCategory(pill.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-cyan-400'}`} />
                    <span>{pill.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Unified Filter, Dropdown, Search, and View Mode Toolbar */}
          <GameFilterControls
            games={games}
            favoritesCount={favorites.length}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortOption={sortOption}
            onSortChange={setSortOption}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalFilteredCount={filteredAndSortedGames.length}
          />

          {/* Catalog Render Logic */}
          {filteredAndSortedGames.length > 0 ? (
            /* Mode 1: Category Shelves (Organized by Category) */
            viewMode === 'shelves' && activeCategory === 'all' && !searchQuery.trim() ? (
              <div className="space-y-12">
                {UNIVERSAL_CATEGORIES.map((catMeta) => {
                  const categoryGames = games.filter(g => 
                    g.category === catMeta.id || (catMeta.id === 'casual' && (g.category as string) === 'meme')
                  );

                  if (categoryGames.length === 0) return null;

                  const CatIcon = getCategoryIcon(catMeta.id);

                  return (
                    <div key={catMeta.id} className="space-y-4">
                      {/* Category Shelf Header */}
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                            <CatIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-white font-display">
                                {catMeta.title}
                              </h3>
                              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-cyan-300 border border-slate-800">
                                {categoryGames.length} {categoryGames.length === 1 ? 'game' : 'games'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">
                              {catMeta.tagline}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setActiveCategory(catMeta.id)}
                          className="hidden sm:inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold hover:underline cursor-pointer"
                        >
                          <span>View Only {catMeta.shortLabel}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Category Games Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {categoryGames.map((game) => (
                          <GameCard
                            key={game.id}
                            game={game}
                            onPlayModal={handlePlayGame}
                            onPreviewAd={handleOpenAd}
                            isFavorite={favorites.includes(game.id)}
                            onToggleFavorite={toggleFavorite}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Scalability Slot: Register Game Card */}
                <div
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center justify-between p-5 rounded-2xl border border-dashed border-slate-800 hover:border-cyan-500/60 bg-slate-950/40 hover:bg-slate-900/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-display">Register Another Game</h4>
                      <p className="text-xs text-slate-400">Expand your game center by registering new projects into universal categories.</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                    <span>Add Game</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ) : viewMode === 'compact' ? (
              /* Mode 2: Compact Directory List View (Space-Efficient) */
              <div className="space-y-3">
                {filteredAndSortedGames.map((game) => (
                  <CompactGameRow
                    key={game.id}
                    game={game}
                    onPlayModal={handlePlayGame}
                    onPreviewAd={handleOpenAd}
                    isFavorite={favorites.includes(game.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}

                {/* Compact Add Game Row */}
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border border-dashed border-slate-800 hover:border-cyan-500/60 bg-slate-950/40 hover:bg-slate-900/40 text-xs font-medium text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-cyan-400" />
                  <span>Register a new game into Haris Game Center</span>
                </button>
              </div>
            ) : (
              /* Mode 3: Clean Responsive Grid View */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredAndSortedGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onPlayModal={handlePlayGame}
                    onPreviewAd={handleOpenAd}
                    isFavorite={favorites.includes(game.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}

                {/* Scalability Slot: Add Next Game Card */}
                <div
                  onClick={() => setIsAddModalOpen(true)}
                  className="group flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-800 hover:border-cyan-500/60 bg-slate-950/40 hover:bg-slate-900/40 text-center transition-all duration-300 cursor-pointer min-h-[220px]"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:border-cyan-400 transition-all mb-2.5 shadow-lg">
                    <Plus className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors font-display">
                    Add Another Game
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 max-w-xs leading-relaxed">
                    Register a new web or cloud game into your hub.
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 group-hover:underline">
                    <span>Register Game</span>
                    <Sparkles className="w-3 h-3" />
                  </span>
                </div>
              </div>
            )
          ) : (
            /* Clean Empty State */
            <div className="py-14 px-6 text-center rounded-2xl border border-slate-800 bg-[#070e22]">
              <div className="w-12 h-12 mx-auto rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 mb-3 border border-slate-800">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white">No games found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No titles match your current category &ldquo;{activeCategory}&rdquo;
                {searchQuery ? ` and search query "${searchQuery}"` : ''}.
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors cursor-pointer"
                >
                  Reset all filters
                </button>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Add a new game
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Community Ratings & Game Recommendations Section */}
        <section className="py-12 border-t border-slate-800/80 bg-[#050a1a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#07112c] via-[#091538] to-[#050b1d] border border-cyan-500/25 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-1.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400" />
                  ))}
                  <span className="ml-2 font-mono font-bold text-white text-base">4.9 / 5.0</span>
                  <span className="text-slate-400 text-xs hidden sm:inline">· Verified Player Score</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                  How is your experience on Haris Game Center?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  Rate the platform out of 5 stars and share your feedback, or recommend which games you want added next to the game center!
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                <button
                  onClick={() => setIsRatingModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <Star className="w-4 h-4 fill-slate-950" />
                  <span>Rate Website (5 Stars)</span>
                </button>

                <button
                  onClick={() => setIsRecommendModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Lightbulb className="w-4 h-4 text-cyan-400" />
                  <span>Recommend Future Games</span>
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* Developer & Repository Hub Section */}
        <DeveloperHub onOpenAddModal={() => setIsAddModalOpen(true)} />
      </main>

      {/* Floating Experience Rating Dock Button (Bottom Right) */}
      <aside aria-label="Quick Actions" className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsRecommendModalOpen(true)}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/95 hover:bg-slate-800 text-amber-300 border border-amber-500/40 shadow-xl backdrop-blur-md text-xs font-semibold transition-all hover:scale-105 cursor-pointer"
          title="Recommend a game"
        >
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Recommend Game</span>
        </button>

        <button
          onClick={() => setIsRatingModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-xl shadow-cyan-500/30 backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
          title="Rate website experience out of 5 stars"
        >
          <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
          <span>Rate (5 Stars)</span>
        </button>
      </aside>

      {/* Quiet Footer */}
      <Footer />

      {/* Interactive In-App Player Modal */}
      <GameModal
        game={selectedGame}
        onClose={() => setSelectedGame(null)}
      />

      {/* Pre-Roll Game Hype Preview Ad Modal */}
      <GameHypeAdModal
        game={adGame}
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        onLaunchGame={handlePlayGame}
      />

      {/* Interactive Music Stream Player & Concept Debug Console */}
      <MusicStreamPlayerModal
        isOpen={isMusicStreamModalOpen}
        onClose={() => setIsMusicStreamModalOpen(false)}
        configuredUrl={musicStreamUrl}
        onUpdateConfiguredUrl={handleUpdateMusicStreamUrl}
      />

      {/* 5-Star Website Rating Modal */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onSaveRating={(r) => setUserRating(r)}
      />

      {/* Recommend Future Game Modal */}
      <RecommendGameModal
        isOpen={isRecommendModalOpen}
        onClose={() => setIsRecommendModalOpen(false)}
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
