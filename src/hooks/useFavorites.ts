import { useState, useEffect, useCallback } from "react";

const KEY = "ugz_favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const toggleFavorite = useCallback((gameId: number) => {
    setFavorites(prev => {
      const isFav = prev.includes(gameId);
      const next = isFav ? prev.filter(id => id !== gameId) : [...prev, gameId];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback((gameId: number) => favorites.includes(gameId), [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
