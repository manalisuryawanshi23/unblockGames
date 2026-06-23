import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Loader2 } from "lucide-react";
import { getGamesPage, type GameCompact } from "@/data/games";
import { useFavorites } from "@/hooks/useFavorites";
import GameCard from "@/components/GameCard";

export default function FavoritesPage() {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const [favoriteGames, setFavoriteGames] = useState<GameCompact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favorites.length === 0) { setFavoriteGames([]); setLoading(false); return; }
    // Load pages until we find all favorites
    const found: GameCompact[] = [];
    const favSet = new Set(favorites);
    
    (async () => {
      for (let i = 0; i < 50 && found.length < favorites.length; i++) {
        try {
          const page = await getGamesPage(i);
          if (page.length === 0) break;
          found.push(...page.filter(g => favSet.has(g.id)));
        } catch { break; }
      }
      setFavoriteGames(found);
      setLoading(false);
    })();
  }, [favorites]);

  return (
    <div className="container py-8">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-7 h-7 text-destructive fill-destructive" />
        <h1 className="text-3xl font-black text-foreground">My Favorites</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
      ) : favoriteGames.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {favoriteGames.map(game => (
            <GameCard key={game.id} game={game} isFavorite={isFavorite(game.id)} onToggleFavorite={toggleFavorite} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-xl text-muted-foreground mb-4">No favorites yet</p>
          <Link to="/" className="text-primary hover:underline">← Browse games</Link>
        </div>
      )}
    </div>
  );
}
