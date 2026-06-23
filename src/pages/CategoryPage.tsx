import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Loader2, ArrowUpDown, TrendingUp, Star, Clock, ChevronUp } from "lucide-react";
import {
  getCategories,
  getCategoryGames,
  getCategoryIcon,
  type Category,
  type GameCompact,
} from "@/data/games";
import { useFavorites } from "@/hooks/useFavorites";
import GameCard from "@/components/GameCard";
import AdPlacement from "@/components/AdPlacement";
import SEO from "@/components/SEO";
import { buildWebSiteSchema } from "@/components/SEO";

type SortOption = "popular" | "rating" | "newest";

const SORT_OPTIONS: { value: SortOption; label: string; icon: React.ReactNode }[] = [
  { value: "popular", label: "Most Played", icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { value: "rating", label: "Top Rated", icon: <Star className="w-3.5 h-3.5" /> },
  { value: "newest", label: "Newest", icon: <Clock className="w-3.5 h-3.5" /> },
];

const BASE_URL = "https://unblockedgameszone.com";

// SEO blurbs per category slug — used for the on-page text block
const CATEGORY_SEO_CONTENT: Record<string, string> = {
  "action-games": "Unblocked action games are the most searched category among students. Whether you prefer platformers, fight sequences, or beat-em-ups, our action collection is constantly updated with the hottest HTML5 titles. All games load instantly on Chromebooks and school Wi-Fi.",
  "racing-games": "Our unblocked racing games feature high-speed car, bike, and kart titles that run perfectly in your school browser. No steering wheel needed — just your keyboard. Compete for the fastest lap time and beat your classmates.",
  "puzzle-games": "Sharpen your mind with unblocked puzzle games. From classic match-3 titles to complex physics puzzles, our brain-bending collection is school-appropriate and runs on any device. Great for study breaks!",
  "shooting-games": "Unblocked shooting games for school — all safe, browser-based, and lag-free. From classic arcade shooters to precision aiming challenges, find your next favorite title here.",
  "multiplayer-games": "Play unblocked multiplayer games online with friends from your school browser. Our real-time multiplayer titles use efficient networking so you get smooth gameplay even on shared school Wi-Fi.",
  "sports-games": "Score goals, hit home runs, and dunk basketballs with our unblocked sports games. No download, no lag — just pure browser-based sports action on any Chromebook.",
  "strategy-games": "Test your tactical mind with unblocked strategy games. Build empires, command armies, and outwit opponents in our browser-based strategy collection.",
  "adventure-games": "Embark on epic quests with our unblocked adventure games. Explore vast worlds, solve mysteries, and complete epic quests all from your school browser.",
  "arcade-games": "Classic unblocked arcade games, reimagined for modern browsers. Tap, click, and swipe your way through hundreds of addictive titles.",
  "io-games": "Play unblocked .io games online — the most popular multiplayer browser games among students worldwide. Battle other players in real time with zero setup.",
};

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [category, setCategory] = useState<Category | null>(null);
  const [categoryGames, setCategoryGames] = useState<GameCompact[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortOption>("popular");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const perPage = 48;

  useEffect(() => {
    setLoading(true);
    setPage(1);
    setSort("popular");
    window.scrollTo(0, 0);
    getCategories().then(async (cats) => {
      setCategories(cats.filter((c) => c.total_games > 0));
      const cat = cats.find((c) => c.slug === slug) || null;
      setCategory(cat);
      if (cat) {
        const games = await getCategoryGames(cat.id);
        setCategoryGames(games);
      }
      setLoading(false);
    });
  }, [slug]);

  // Back-to-top visibility
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sort games
  const sortedGames = useMemo(() => {
    const games = [...categoryGames];
    if (sort === "popular") return games.sort((a, b) => (b.p || 0) - (a.p || 0));
    if (sort === "rating") return games.sort((a, b) => (b.r || 0) - (a.r || 0));
    if (sort === "newest") return games.sort((a, b) => (b.id || 0) - (a.id || 0));
    return games;
  }, [categoryGames, sort]);

  const visibleGames = sortedGames.slice(0, page * perPage);
  const hasMore = visibleGames.length < sortedGames.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">Category Not Found</h1>
        <Link to="/categories" className="text-primary hover:underline">← Browse All Categories</Link>
      </div>
    );
  }

  const catName = category.name;
  const catIcon = getCategoryIcon(category.slug);
  const seoBg = CATEGORY_SEO_CONTENT[slug || ""];

  // JSON-LD schemas
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${catName} - Unblocked Games`,
    "description": `Play the best free ${catName.toLowerCase()} unblocked online. No download, no signup. ${category.total_games.toLocaleString()} games available on Chromebooks and school browsers.`,
    "url": `${BASE_URL}/category/${slug}`,
    "isPartOf": { "@type": "WebSite", "url": `${BASE_URL}/` },
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Best Unblocked ${catName}`,
    "numberOfItems": Math.min(visibleGames.length, 10),
    "itemListElement": visibleGames.slice(0, 10).map((g, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `${BASE_URL}/game/${g.s}`,
      "name": g.t,
    })),
  };

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Categories", url: "/categories" },
    { name: catName, url: `/category/${slug}` },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title={`${catName} Unblocked - Free Online ${catName} for School`}
        description={`Play the best free ${catName.toLowerCase()} unblocked online for school. ${category.total_games.toLocaleString()} games available. No download, works on Chromebooks instantly.`}
        canonical={`/category/${slug}`}
        keywords={`${catName.toLowerCase()} unblocked, unblocked ${catName.toLowerCase()}, free ${catName.toLowerCase()} online, school ${catName.toLowerCase()}, ${catName.toLowerCase()} chromebook`}
        schema={[collectionSchema, itemListSchema]}
        breadcrumbs={breadcrumbs}
      />

      {/* Breadcrumb */}
      <div className="container py-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span aria-hidden>/</span>
          <Link to="/categories" className="hover:text-foreground transition-colors">Categories</Link>
          <span aria-hidden>/</span>
          <span className="text-foreground" aria-current="page">{catName}</span>
        </nav>
      </div>

      <section className="container mb-8">
        {/* Category Header */}
        <div className="p-6 rounded-xl bg-card border border-border/50 mb-6">
          <div className="text-4xl mb-3" aria-hidden>{catIcon}</div>
          <h1 className="text-3xl font-black text-foreground mb-2">
            {catName} — Unblocked Games
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Play the best free {catName.toLowerCase()} online — no download, no signup, 100% unblocked for school!{" "}
            <strong className="text-foreground">{category.total_games.toLocaleString()} games</strong> available. Works on Chromebooks and all browsers.
          </p>
        </div>

        <AdPlacement size="728x90" className="mb-6" slot="leaderboard-category-top" />

        {/* Sort Controls */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <ArrowUpDown className="w-4 h-4" /> Sort by:
          </span>
          <div className="flex gap-2">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setSort(opt.value); setPage(1); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  sort === opt.value
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                }`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
          <span className="ml-auto text-sm text-muted-foreground">
            {sortedGames.length.toLocaleString()} games
          </span>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {visibleGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              isFavorite={isFavorite(game.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-8 py-3 bg-primary/10 border border-primary/30 text-primary font-semibold rounded-lg hover:bg-primary/20 transition-colors"
            >
              Load More Games ({sortedGames.length - visibleGames.length} remaining)
            </button>
          </div>
        )}

        {/* SEO Text Block */}
        {seoBg && (
          <div className="mt-12 p-6 bg-card rounded-xl border border-border/30">
            <h2 className="text-lg font-bold text-foreground mb-3">
              About Unblocked {catName}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{seoBg}</p>
          </div>
        )}
      </section>

      {/* Other Categories */}
      <section className="container mb-12">
        <h2 className="text-xl font-bold text-foreground mb-4">Explore More Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories
            .filter((c) => c.id !== category.id)
            .map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-card border border-border/50 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                <span aria-hidden>{getCategoryIcon(cat.slug)}</span>
                {cat.name}
              </Link>
            ))}
        </div>
      </section>

      {/* Back to Top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-glow hover:opacity-90 transition-all animate-in fade-in duration-300"
          aria-label="Back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
