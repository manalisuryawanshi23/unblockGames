import { useState, useEffect, useCallback } from "react";

const KEY = "ugz_game_ratings";

type RatingsMap = Record<number, number>; // gameId -> rating (1-5)

export function useGameRating(gameId?: number) {
  const [ratings, setRatings] = useState<RatingsMap>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setRatings(JSON.parse(stored));
    } catch {
      // ignore parse errors
    }
  }, []);

  const setRating = useCallback(
    (id: number, rating: number) => {
      setRatings((prev) => {
        const next = { ...prev, [id]: rating };
        try {
          localStorage.setItem(KEY, JSON.stringify(next));
        } catch {
          // ignore storage errors
        }
        return next;
      });
    },
    []
  );

  const getRating = useCallback(
    (id: number): number => ratings[id] ?? 0,
    [ratings]
  );

  const currentRating = gameId ? getRating(gameId) : 0;

  return { getRating, setRating, currentRating };
}
