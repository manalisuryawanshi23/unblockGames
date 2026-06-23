import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, TrendingUp, Zap, Globe, Loader2, Heart, Sparkles, Clock } from "lucide-react";
import GameCard from "@/components/GameCard";
import AdPlacement from "@/components/AdPlacement";
import {
  getCategories,
  getTrendingGames,
  getInitialGames,
  getCategoryIcon,
  getGamesByIds,
  type GameCompact,
  type Category,
} from "@/data/games";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentlyPlayed } from "@/hooks/useRecentlyPlayed";
import SEO, { buildWebSiteSchema } from "@/components/SEO";
import ScraperShield from "@/components/ScraperShield";
import InstallBanner from "@/components/InstallBanner";

const BASE_URL = "https://unblockedgameszone.com";

export default function Index() {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { recent } = useRecentlyPlayed();
  const [categories, setCategories] = useState<Category[]>([]);
  const [trending, setTrending] = useState<GameCompact[]>([]);
  const [allGames, setAllGames] = useState<GameCompact[]>([]);
  const [recentGames, setRecentGames] = useState<GameCompact[]>([]);
  const [favoriteGames, setFavoriteGames] = useState<GameCompact[]>([]);
  const [newGames, setNewGames] = useState<GameCompact[]>([]);
  const [loading, setLoading] = useState(true);

  // Count how many games played today for engagement streak
  const todayPlayCount = recent.length;

  useEffect(() => {
    Promise.all([
      getCategories(),
      getTrendingGames(),
      getInitialGames(),
    ]).then(([cats, trend, initial]) => {
      setCategories(cats.filter((c) => c.total_games > 0));
      setTrending(trend);
      setAllGames(initial);
      // "New This Week" — highest IDs (newest additions to the catalog)
      const byId = [...initial].sort((a, b) => b.id - a.id);
      setNewGames(byId.slice(0, 12));
      setLoading(false);
    });
  }, []);

  // Resolve recently played IDs → game objects using a smarter lookup
  useEffect(() => {
    if (recent.length === 0) {
      setRecentGames([]);
      return;
    }
    const allAvailable = [...trending, ...allGames];
    const fromCache = allAvailable.filter((g) => recent.includes(g.id));
    // Dedupe by id preserving recent order
    const seen = new Set<number>();
    const ordered = recent
      .map((id) => fromCache.find((g) => g.id === id))
      .filter((g): g is GameCompact => !!g && !seen.has(g.id) && !seen.add(g.id)!);
    setRecentGames(ordered.slice(0, 5));
  }, [recent, trending, allGames]);

  // Resolve favorite IDs → game objects
  useEffect(() => {
    if (favorites.length === 0) {
      setFavoriteGames([]);
      return;
    }
    const allAvailable = [...trending, ...allGames];
    setFavoriteGames(allAvailable.filter((g) => favorites.includes(g.id)).slice(0, 6));
  }, [favorites, trending, allGames]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Richer schemas: WebSite (SearchAction) + VideoGameSeries + ItemList of trending
  const webSiteSchema = buildWebSiteSchema();

  const gameSeriesSchema = {
    "@context": "https://schema.org",
    "@type": "VideoGameSeries",
    "name": "UnblockedGamesZone - Free Online Games",
    "url": `${BASE_URL}/`,
    "description": "Play thousands of free unblocked games for school. No download required. Works on Chromebooks, Windows, and Mac.",
    "genre": ["Action", "Puzzle", "Racing", "Arcade", "Strategy", "Multiplayer"],
    "numberOfSeasons": categories.length,
    "publisher": {
      "@type": "Organization",
      "name": "UnblockedGamesZone",
      "url": `${BASE_URL}/`,
    },
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Trending Unblocked Games",
    "description": "The most popular unblocked games played by students right now.",
    "numberOfItems": Math.min(trending.length, 10),
    "itemListElement": trending.slice(0, 10).map((g, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `${BASE_URL}/game/${g.s}`,
      "name": g.t,
    })),
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="UnblockedGamesZone - Free Online Games for School (No Download)"
        description="Play 28,000+ free unblocked games for school. Action, puzzle, racing and more — no download, works on Chromebooks. Instant play in your browser."
        schema={[webSiteSchema, gameSeriesSchema, itemListSchema]}
        keywords="unblocked games, unblocked games for school, free online games, chromebook games, no download games, html5 games, school games"
        canonical="/"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-16 md:py-24 text-white">
        <div className="absolute inset-0 opacity-20" aria-hidden>
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-2xl animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-bold mb-6">
              <Zap className="w-4 h-4 fill-current" />
              28,000+ Unblocked Games
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-foreground leading-[1.1] mb-6 tracking-tight">
              Best <span className="text-gradient-gaming">Unblocked Games</span> for School
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed font-medium">
              Play thousands of high-quality HTML5 games instantly. No downloads, no installs, 100% unblocked for Chromebooks.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={trending[0]?.s ? `/game/${trending[0].s}` : "/trending"}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg shadow-glow hover:opacity-90 transition-all animate-pulse-glow"
              >
                <Play className="w-5 h-5" /> Play Now
              </Link>
              <Link
                to="/categories"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AdPlacement size="728x90" className="my-6" slot="leaderboard-homepage-top" />

      <ScraperShield />
      <InstallBanner />

      {/* Recently Played & Favorites — shown only when user has history */}
      {(recentGames.length > 0 || favoriteGames.length > 0) && (
        <section className="container mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid md:grid-cols-2 gap-8">
            {recentGames.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Clock className="w-4 h-4" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Recently Played</h2>
                    {todayPlayCount > 0 && (
                      <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold text-primary">
                        {todayPlayCount} today
                      </span>
                    )}
                  </div>
                  <Link to="/favorites" className="text-xs text-primary hover:underline font-medium">
                    View all →
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {recentGames.map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      isFavorite={isFavorite(game.id)}
                      onToggleFavorite={toggleFavorite}
                      size="sm"
                    />
                  ))}
                </div>
              </div>
            )}
            {favoriteGames.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                      <Heart className="w-4 h-4 fill-current" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">My Favorites</h2>
                  </div>
                  <Link to="/favorites" className="text-xs text-primary hover:underline font-medium">
                    View all →
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {favoriteGames.slice(0, 3).map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      isFavorite={true}
                      onToggleFavorite={toggleFavorite}
                      size="sm"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Trending Now */}
      <section className="container mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">🔥 Trending Now</h2>
          </div>
          <Link to="/trending" className="text-sm text-primary hover:underline font-medium">
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {trending.slice(0, 12).map((game) => (
            <GameCard
              key={game.id}
              game={game}
              isFavorite={isFavorite(game.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* New This Week */}
      {newGames.length > 0 && (
        <section className="container mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-gaming-cyan" />
            <h2 className="text-2xl font-bold text-foreground">✨ New This Week</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {newGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isFavorite={isFavorite(game.id)}
                onToggleFavorite={toggleFavorite}
                isNew
              />
            ))}
          </div>
        </section>
      )}

      {/* Game Categories */}
      <section className="container mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">🎯 Game Categories</h2>
          <Link to="/categories" className="text-sm text-primary hover:underline font-medium">
            All categories →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group relative p-4 rounded-lg bg-card hover:bg-card-hover border border-border/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="text-3xl mb-2" aria-hidden>{getCategoryIcon(cat.slug)}</div>
              <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {cat.total_games.toLocaleString()} games
              </p>
            </Link>
          ))}
        </div>
      </section>

      <AdPlacement size="728x90" className="my-6" slot="leaderboard-homepage-mid" />

      {/* Global Gaming Hub — SEO value block */}
      <section className="container mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Globe className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Global Gaming Hub</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { flag: "🇺🇸", country: "USA", desc: "Top rated free games popular in US schools. Optimized for school networks and Chromebooks." },
            { flag: "🇬🇧", country: "UK", desc: "Most played browser games across the UK. Instant play, no download, fully unblocked." },
            { flag: "🇨🇦", country: "Canada", desc: "Trending HTML5 games in Canada. Works perfectly on school-issued Chromebooks." },
            { flag: "🇦🇺", country: "Australia", desc: "Best unblocked games for Australian students. Fast, free, and works on any device." },
          ].map((item) => (
            <div key={item.country} className="p-5 rounded-lg bg-card border border-border/50">
              <div className="text-3xl mb-2" aria-hidden>{item.flag}</div>
              <h3 className="font-bold text-foreground mb-2">Unblocked in {item.country}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended for You */}
      <section className="container mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">🎮 Recommended for You</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {allGames.slice(0, 48).map((game) => (
            <GameCard
              key={game.id}
              game={game}
              isFavorite={isFavorite(game.id)}
              onToggleFavorite={toggleFavorite}
              size="sm"
            />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/80 transition-colors"
          >
            Browse All Categories →
          </Link>
        </div>
      </section>
    </div>
  );
}
