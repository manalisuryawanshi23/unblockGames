import { useSearchParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { searchGames, type GameCompact } from "@/data/games";
import { useFavorites } from "@/hooks/useFavorites";
import GameCard from "@/components/GameCard";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { isFavorite, toggleFavorite } = useFavorites();
  const [results, setResults] = useState<GameCompact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) { setResults([]); setLoading(false); return; }
    setLoading(true);
    searchGames(query).then(r => { setResults(r); setLoading(false); });
  }, [query]);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-black text-foreground mb-2">
        Search Results for "{query}"
      </h1>
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
      ) : (
        <>
          <p className="text-muted-foreground mb-8">{results.length} games found</p>
          {results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {results.map(game => (
                <GameCard key={game.id} game={game} isFavorite={isFavorite(game.id)} onToggleFavorite={toggleFavorite} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground mb-4">No games found for "{query}"</p>
              <Link to="/" className="text-primary hover:underline">← Browse all games</Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
