import { GameCompact } from "@/data/games";

const FAVORITES_KEY = "ugz_favorites";
const RECENTLY_PLAYED_KEY = "ugz_recently_played";
const MAX_RECENT_GAMES = 10;

export const getFavorites = (): number[] => {
  const stored = localStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const toggleFavorite = (gameId: number): boolean => {
  const favorites = getFavorites();
  const index = favorites.indexOf(gameId);
  let isFavorite = false;
  
  if (index === -1) {
    favorites.push(gameId);
    isFavorite = true;
  } else {
    favorites.splice(index, 1);
  }
  
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return isFavorite;
};

export const isGameFavorite = (gameId: number): boolean => {
  return getFavorites().includes(gameId);
};

export const getRecentlyPlayed = (): number[] => {
  const stored = localStorage.getItem(RECENTLY_PLAYED_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addToRecentlyPlayed = (gameId: number) => {
  let recent = getRecentlyPlayed();
  // Remove if already exists to move it to the front
  recent = recent.filter(id => id !== gameId);
  recent.unshift(gameId);
  
  // Limit to MAX_RECENT_GAMES
  if (recent.length > MAX_RECENT_GAMES) {
    recent = recent.slice(0, MAX_RECENT_GAMES);
  }
  
  localStorage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify(recent));
};
