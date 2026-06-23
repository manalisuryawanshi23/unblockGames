import { useState, useCallback } from "react";
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
  isNew?: boolean;
}

export default function GameCard({
  game,
  isFavorite,
  onToggleFavorite,
  size = "md",
  priority = false,
  isNew = false,
}: GameCardProps) {
  const [imgSrc, setImgSrc] = useState(
    getOptimizedImage(game.img, size === "sm" ? 200 : 400)
  );
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(game.img);
    } else {
      setImgSrc("/placeholder.svg");
    }
  };

  // Prefetch game detail data on hover — pre-warms the in-memory cache
  const handleMouseEnter = useCallback(() => {
    // Pre-connect to the game's iframe origin for faster load
    if (game.img) {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "image";
      link.href = getOptimizedImage(game.img, 800);
      // Only add if not already in head
      const existing = document.querySelector(`link[href="${link.href}"]`);
      if (!existing) document.head.appendChild(link);
    }
  }, [game.img]);

  const aspectClass =
    size === "lg"
      ? "aspect-[16/10]"
      : size === "sm"
      ? "aspect-square"
      : "aspect-[4/3]";

  return (
    <Link
      to={`/game/${game.s}`}
      className="group relative block rounded-lg overflow-hidden bg-card shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={handleMouseEnter}
      aria-label={`Play ${game.t}`}
    >
      <div className={`relative overflow-hidden ${aspectClass}`}>
        <img
          src={imgSrc}
          alt={`${game.t} - Unblocked Game`}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "low"}
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={handleError}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Play button on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-glow animate-pulse-glow">
            <Play className="w-6 h-6 text-primary-foreground ml-0.5" />
          </div>
        </div>
        {/* Favorite button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(game.id);
            }}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center hover:bg-background/90 transition-colors z-10"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? "fill-destructive text-destructive" : "text-foreground/70"
              }`}
            />
          </button>
        )}
        {/* Badges — priority: NEW > HOT */}
        {isNew && !game.f && (
          <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded bg-gaming-cyan/90 text-background uppercase tracking-wider">
            New
          </span>
        )}
        {game.f && !isNew && (
          <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-bold rounded bg-primary text-primary-foreground">
            🔥 Hot
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
            <div className="flex items-center gap-1" aria-label={`Rating: ${game.r} out of 5`}>
              <Star className="w-3 h-3 text-gaming-yellow fill-gaming-yellow" />
              <span className="text-xs text-muted-foreground">{game.r}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
