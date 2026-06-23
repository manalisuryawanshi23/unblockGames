import { useSearchParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Loader2, Search, X, Filter } from "lucide-react";
import { searchGames, getCategories, getCategoryIcon, type GameCompact, type Category } from "@/data/games";
import { useFavorites } from "@/hooks/useFavorites";
import GameCard from "@/components/GameCard";
import SEO from "@/components/SEO";
import AdPlacement from "@/components/AdPlacement";

const POPULAR_SEARCHES = [
  "Slope", "Run 3", "Basketball Stars", "Friday Night Funkin",
  "Minecraft", "Subway Surfers", "Among Us", "1v1 LOL",
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { isFavorite, toggleFavorite } = useFavorites();
  const [results, setResults] = useState<GameCompact[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(query);
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load categories for filter
  useEffect(() => {
    getCategories().then((cats) =>
      setCategories(cats.filter((c) => c.total_games > 0).slice(0, 12))
    );
  }, []);

  // Sync inputValue when URL query changes
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  // Debounced search — runs 300ms after typing stops
  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchGames(query).then((r) => {
        setResults(r);
        setLoading(false);
      });
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleInput = (val: string) => {
    setInputValue(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchParams(val.trim() ? { q: val.trim() } : {});
    }, 300);
  };

  const handleClear = () => {
    setInputValue("");
    setSearchParams({});
    setResults([]);
  };

  // Apply category filter
  const filteredResults = categoryFilter
    ? results.filter((g) => g.c === categoryFilter)
    : results;

  // Get categories that have results
  const resultCategories = categories.filter((cat) =>
    results.some((g) => g.c === cat.id)
  );

  return (
    <div className="min-h-screen">
      <SEO
        title={query ? `"${query}" — Search Results` : "Search Unblocked Games"}
        description={
          query
            ? `Found ${results.length} unblocked games for "${query}". Play free online games instantly — no download needed.`
            : "Search 28,000+ free unblocked games. Find your favorite game instantly and play in your browser."
        }
        canonical={query ? `/search?q=${encodeURIComponent(query)}` : "/search"}
        noindex={!query}
      />

      <div className="container py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-foreground mb-6">
            {query ? (
              <>Search: <span className="text-primary">"{query}"</span></>
            ) : (
              "Search Games"
            )}
          </h1>

          {/* Live Search Input */}
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-muted-foreground" />
            </div>
            <input
              type="search"
              autoFocus
              value={inputValue}
              onChange={(e) => handleInput(e.target.value)}
              placeholder="Search for any game... (e.g. Slope, Run 3)"
              className="w-full bg-card border border-border rounded-xl py-4 pl-12 pr-12 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-base"
              aria-label="Search games"
            />
            {inputValue && (
              <button
                onClick={handleClear}
                className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* No query — show popular searches */}
        {!query && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                🔥 Popular Searches
              </h2>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setInputValue(term);
                      setSearchParams({ q: term });
                    }}
                    className="px-4 py-2 bg-card border border-border/50 rounded-full text-sm text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4">🎯 Browse by Category</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-card border border-border/50 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                  >
                    <span aria-hidden>{getCategoryIcon(cat.slug)}</span>
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {/* Results */}
        {!loading && query && (
          <>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <p className="text-muted-foreground">
                <strong className="text-foreground">{filteredResults.length}</strong>{" "}
                {filteredResults.length === 1 ? "game" : "games"} found
                {categoryFilter && results.length !== filteredResults.length && (
                  <> (filtered from {results.length})</>
                )}
              </p>

              {/* Category filter chips */}
              {resultCategories.length > 1 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <button
                    onClick={() => setCategoryFilter(null)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      !categoryFilter
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    All
                  </button>
                  {resultCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() =>
                        setCategoryFilter(
                          categoryFilter === cat.id ? null : cat.id
                        )
                      }
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        categoryFilter === cat.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {getCategoryIcon(cat.slug)} {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {filteredResults.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                  {filteredResults.map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      isFavorite={isFavorite(game.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
                <AdPlacement size="728x90" slot="leaderboard-homepage-mid" />
              </>
            ) : (
              <div className="text-center py-20 space-y-4">
                <p className="text-6xl">🎮</p>
                <p className="text-xl font-bold text-foreground">
                  No games found for "{query}"
                </p>
                <p className="text-muted-foreground">
                  Try a different spelling or browse our categories
                </p>
                <div className="flex justify-center gap-3 mt-4">
                  <Link
                    to="/trending"
                    className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all"
                  >
                    🔥 Trending Games
                  </Link>
                  <Link
                    to="/categories"
                    className="px-5 py-2.5 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    Browse Categories
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
