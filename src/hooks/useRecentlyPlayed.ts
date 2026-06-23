import { useState, useEffect, useCallback } from "react";

const KEY = "ugz_recently_played";

export function useRecentlyPlayed() {
  const [recent, setRecent] = useState<number[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    if (stored) setRecent(JSON.parse(stored));
  }, []);

  const addRecent = useCallback((gameId: number) => {
    if (!gameId) return;
    setRecent(prev => {
      const next = [gameId, ...prev.filter(id => id !== gameId)].slice(0, 20);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { recent, addRecent };
}
