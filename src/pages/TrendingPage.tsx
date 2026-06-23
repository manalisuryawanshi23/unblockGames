import { useState, useEffect } from "react";
import { Flame, Loader2 } from "lucide-react";
import GameCard from "@/components/GameCard";
import AdPlacement from "@/components/AdPlacement";
import { getTrendingGames, type GameCompact } from "@/data/games";
import { useFavorites } from "@/hooks/useFavorites";
import SEO from "@/components/SEO";
import ScraperShield from "@/components/ScraperShield";

export default function TrendingPage() {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [games, setGames] = useState<GameCompact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrendingGames().then((data) => {
      setGames(data);
      setLoading(false);
    });
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEO 
        title="Trending Unblocked Games 🔥 - What Everyone is Playing"
        description="Check out the hottest unblocked games trending right now. From Slope to Run 3, play the most popular games on school Chromebooks for free."
      />
      
      <ScraperShield />

      <main className="container py-8">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4 animate-bounce">
            <Flame className="w-8 h-8 fill-current" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            Trending <span className="text-orange-500">Games</span>
          </h1>
          <p className="text-muted-foreground max-w-lg">
            Stay ahead of the curve! These are the hottest games being played by students across the globe right now.
          </p>
        </div>

        <AdPlacement size="728x90" className="mb-12" />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {games.map((game) => (
            <GameCard 
              key={game.id} 
              game={game} 
              isFavorite={isFavorite(game.id)} 
              onToggleFavorite={toggleFavorite} 
            />
          ))}
        </div>

        <AdPlacement size="728x90" className="mt-16" />
      </main>
    </div>
  );
}
