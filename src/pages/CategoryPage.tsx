import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getCategories, getCategoryGames, getCategoryIcon, type Category, type GameCompact } from "@/data/games";
import { useFavorites } from "@/hooks/useFavorites";
import GameCard from "@/components/GameCard";
import AdPlacement from "@/components/AdPlacement";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [category, setCategory] = useState<Category | null>(null);
  const [categoryGames, setCategoryGames] = useState<GameCompact[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 48;

  useEffect(() => {
    setLoading(true);
    setPage(1);
    window.scrollTo(0, 0);
    getCategories().then(async cats => {
      setCategories(cats.filter(c => c.total_games > 0));
      const cat = cats.find(c => c.slug === slug) || null;
      setCategory(cat);
      if (cat) {
        const games = await getCategoryGames(cat.id);
        setCategoryGames(games);
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  if (!category) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">Category Not Found</h1>
        <Link to="/" className="text-primary hover:underline">← Back to Home</Link>
      </div>
    );
  }

  const visibleGames = categoryGames.slice(0, page * perPage);
  const hasMore = visibleGames.length < categoryGames.length;

  return (
    <div className="min-h-screen">
      <div className="container py-3">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">{category.name}</span>
        </nav>
      </div>

      <section className="container mb-8">
        <div className="p-6 rounded-xl bg-card border border-border/50 mb-6">
          <div className="text-4xl mb-3">{getCategoryIcon(category.slug)}</div>
          <h1 className="text-3xl font-black text-foreground mb-2">{category.name}</h1>
          <p className="text-muted-foreground max-w-xl">
            Play the best free {category.name.toLowerCase()} online – no download, no signup, unblocked! {category.total_games.toLocaleString()} games available.
          </p>
        </div>

        <AdPlacement size="728x90" className="mb-6" />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {visibleGames.map(game => (
            <GameCard key={game.id} game={game} isFavorite={isFavorite(game.id)} onToggleFavorite={toggleFavorite} />
          ))}
        </div>

        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => setPage(p => p + 1)}
              className="px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/80 transition-colors"
            >
              Load More ({categoryGames.length - visibleGames.length} remaining)
            </button>
          </div>
        )}
      </section>

      <section className="container mb-12">
        <h2 className="text-xl font-bold text-foreground mb-4">More Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.filter(c => c.id !== category.id).map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="px-4 py-2 bg-card border border-border/50 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
            >
              {getCategoryIcon(cat.slug)} {cat.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
