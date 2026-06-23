import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Sparkles } from "lucide-react";
import type { GameCompact } from "@/data/games";
import { getOptimizedImage } from "@/lib/image-utils";

interface NextGameOverlayProps {
  games: GameCompact[];
  isPlaying: boolean;
  playStartTime: number | null; // timestamp when play started
  delayMs?: number; // default: 3 minutes
}

export default function NextGameOverlay({
  games,
  isPlaying,
  playStartTime,
  delayMs = 3 * 60 * 1000,
}: NextGameOverlayProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!isPlaying || !playStartTime || dismissed) {
      setVisible(false);
      return;
    }

    // Check if already dismissed in this session
    const sessionKey = `ugz_overlay_dismissed_${playStartTime}`;
    if (sessionStorage.getItem(sessionKey)) {
      return;
    }

    // Calculate remaining time until the overlay should show
    const elapsed = Date.now() - playStartTime;
    const remaining = delayMs - elapsed;

    if (remaining <= 0) {
      setVisible(true);
      return;
    }

    const timer = setTimeout(() => {
      setVisible(true);
    }, remaining);

    return () => clearTimeout(timer);
  }, [isPlaying, playStartTime, dismissed, delayMs]);

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
    if (playStartTime) {
      sessionStorage.setItem(`ugz_overlay_dismissed_${playStartTime}`, "1");
    }
  };

  if (!visible || games.length === 0) return null;

  const suggestions = games.slice(0, 3);

  return (
    <div
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-lg animate-in slide-in-from-bottom-4 fade-in duration-500"
      role="complementary"
      aria-label="Game suggestions"
    >
      <div className="bg-card/95 backdrop-blur-md border border-primary/30 rounded-2xl p-4 shadow-2xl shadow-primary/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-foreground">
              You might also like...
            </span>
          </div>
          <button
            onClick={handleDismiss}
            className="w-6 h-6 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
            aria-label="Dismiss suggestions"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {suggestions.map((game) => (
            <Link
              key={game.id}
              to={`/game/${game.s}`}
              className="group relative rounded-xl overflow-hidden bg-secondary hover:bg-secondary/70 transition-all duration-200 hover:scale-105"
              onClick={handleDismiss}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={getOptimizedImage(game.img, 150)}
                  alt={game.t}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-1.5">
                <p className="text-[10px] font-semibold text-foreground truncate leading-tight">
                  {game.t}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
