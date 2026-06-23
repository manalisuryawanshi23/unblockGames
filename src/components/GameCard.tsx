import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Play, Star } from "lucide-react";
import type { GameCompact } from "@/data/games";
import { formatPlays } from "@/data/games";
import { getOptimizedImage } from "@/lib/image-utils";

interface GameCardProps {
  game: GameCompact;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
}

export default function GameCard({ game, isFavorite, onToggleFavorite, size = "md", priority = false }: GameCardProps) {
  const [imgSrc, setImgSrc] = useState(getOptimizedImage(game.img, size === 'sm' ? 200 : 400));
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      // If proxy failed, try original URL
      setHasError(true);
      setImgSrc(game.img);
    } else {
      // If original also failed, use placeholder
      setImgSrc('/placeholder.svg');
    }
  };

  return (
    <Link
      to={`/game/${game.s}`}
      className="group relative block rounded-lg overflow-hidden bg-card shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
    >
      <div className={`relative overflow-hidden ${size === "lg" ? "aspect-[16/10]" : size === "sm" ? "aspect-square" : "aspect-[4/3]"}`}>
        <img
          src={imgSrc}
          alt={game.t}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "low"}
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={handleError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-glow animate-pulse-glow">
            <Play className="w-6 h-6 text-primary-foreground ml-0.5" />
          </div>
        </div>
        {onToggleFavorite && (
          <button
            onClick={(e) => { e.preventDefault(); onToggleFavorite(game.id); }}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center hover:bg-background/90 transition-colors z-10"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-destructive text-destructive" : "text-foreground/70"}`} />
          </button>
        )}
        {game.f && (
          <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-bold rounded bg-primary text-primary-foreground">
            🔥 HOT
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
          {game.t}
        </h3>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-muted-foreground">{formatPlays(game.p)} plays</span>
          {game.r > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-gaming-yellow fill-gaming-yellow" />
              <span className="text-xs text-muted-foreground">{game.r}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
