export interface GameCompact {
  id: number;
  t: string;   // title
  s: string;   // slug
  img: string;  // thumbnail
  c: number;   // category_id
  p: number;   // plays
  r: number;   // rating
  f: boolean;  // featured
}

export interface GameDetail {
  id: number;
  t: string;
  s: string;
  d: string;       // description
  ins: string;     // instructions
  u: string;       // iframe_url
  img: string;
  c: number;
  tags: string[];
  p: number;
  r: number;
  f: boolean;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  image: string;
  total_games: number;
}

const cache: Record<string, any> = {};

async function fetchJson<T>(path: string): Promise<T> {
  if (cache[path]) return cache[path];
  const res = await fetch(path);
  const data = await res.json();
  cache[path] = data;
  return data;
}

export async function getCategories(): Promise<Category[]> {
  return fetchJson<Category[]>('/data/categories.json');
}

export async function getTrendingGames(): Promise<GameCompact[]> {
  return fetchJson<GameCompact[]>('/data/games-trending.json');
}

export async function getFeaturedGames(): Promise<GameCompact[]> {
  return fetchJson<GameCompact[]>('/data/games-featured.json');
}

export async function getInitialGames(): Promise<GameCompact[]> {
  return fetchJson<GameCompact[]>('/data/games-initial.json');
}

export async function getGamesPage(page: number): Promise<GameCompact[]> {
  try {
    return await fetchJson<GameCompact[]>(`/data/games-p${page}.json`);
  } catch {
    return [];
  }
}

export async function getCategoryGames(categoryId: number): Promise<GameCompact[]> {
  try {
    return await fetchJson<GameCompact[]>(`/data/cat-${categoryId}.json`);
  } catch {
    return [];
  }
}

export async function getGameDetail(slug: string): Promise<GameDetail | null> {
  const slugMap = await fetchJson<Record<string, number>>('/data/slug-map.json');
  const gameId = slugMap[slug];
  if (!gameId) return null;

  const detailIndex = await fetchJson<Record<string, number>>('/data/detail-index.json');
  const chunkNum = detailIndex[gameId];
  if (chunkNum === undefined) return null;

  const chunk = await fetchJson<Record<string, GameDetail>>(`/data/details-${chunkNum}.json`);
  const game = chunk[gameId];
  if (game) {
    game.id = gameId;
  }
  return game || null;
}

export async function searchGames(query: string): Promise<GameCompact[]> {
  const q = query.toLowerCase();
  // Search across first few pages for performance
  const results: GameCompact[] = [];
  for (let i = 0; i < 10 && results.length < 50; i++) {
    try {
      const page = await getGamesPage(i);
      results.push(...page.filter(g => g.t.toLowerCase().includes(q)));
    } catch {
      break;
    }
  }
  return results.slice(0, 50);
}

export async function getGamesByIds(ids: number[]): Promise<GameCompact[]> {
  if (ids.length === 0) return [];
  const initial = await getInitialGames();
  const trending = await getTrendingGames();
  const searchResults = [...initial, ...trending];
  
  // Find in common sets first
  return searchResults.filter(g => ids.includes(g.id));
}

export function getCategoryIcon(slug: string): string {
  const icons: Record<string, string> = {
    'action-games': '⚔️', 'racing-games': '🏎️', 'shooting-games': '🎯',
    'arcade-games': '🕹️', 'puzzle-games': '🧩', 'strategy-games': '♟️',
    'multiplayer-games': '🌐', 'sports-games': '⚽', 'fighting-games': '🥊',
    'girls-games': '💅', 'hypercasual-games': '🎮', 'boys-games': '🎯',
    'adventure-games': '🗺️', 'bejeweled-games': '💎', 'clicker-games': '👆',
    'cooking-games': '🍳', 'soccer-games': '⚽', 'stickman-games': '🏃',
    'io-games': '🌐', '3d-games': '🎲',
  };
  return icons[slug] || '🎮';
}

export function formatPlays(plays: number): string {
  if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`;
  if (plays >= 1000) return `${(plays / 1000).toFixed(0)}K`;
  return String(plays);
}
