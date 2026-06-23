import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Play, Heart, Star, Users, Share2, Loader2, Maximize, Check, Trophy } from "lucide-react";
import { getGameDetail, getCategoryGames, getCategories, getCategoryIcon, formatPlays, type GameDetail, type GameCompact, type Category } from "@/data/games";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentlyPlayed } from "@/hooks/useRecentlyPlayed";
import { useGameRating } from "@/hooks/useGameRating";
import GameCard from "@/components/GameCard";
import AdPlacement from "@/components/AdPlacement";
import SEO from "@/components/SEO";
import ScraperShield from "@/components/ScraperShield";
import NextGameOverlay from "@/components/NextGameOverlay";
import { getOptimizedImage } from "@/lib/image-utils";
import { gameDescriptions } from "@/data/game-descriptions";
import { useToast } from "@/hooks/use-toast";

const BASE_URL = "https://unblockedgameszone.com";

export default function GamePage() {
  const { slug } = useParams<{ slug: string }>();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addRecent } = useRecentlyPlayed();
  const { toast } = useToast();
  const [game, setGame] = useState<GameDetail | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [related, setRelated] = useState<GameCompact[]>([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [playStartTime, setPlayStartTime] = useState<number | null>(null);
  const [imgSrc, setImgSrc] = useState("");
  const [hasError, setHasError] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // useGameRating is called with undefined until game loads, then updates
  const { setRating, currentRating } = useGameRating(game?.id);

  const handleFullscreen = () => {
    const el = iframeRef.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
    else if ((el as any).webkitRequestFullscreen) (el as any).webkitRequestFullscreen();
    else if ((el as any).msRequestFullscreen) (el as any).msRequestFullscreen();
  };

  const handleShare = async () => {
    const url = `${BASE_URL}/game/${slug}`;
    const shareData = {
      title: `Play ${game?.t} Unblocked`,
      text: `Check out ${game?.t} — free unblocked game, no download needed!`,
      url,
    };
    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: "Link copied!", description: "Game link copied to clipboard." });
      }
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        toast({ title: "Link copied!", description: "Game link copied to clipboard." });
      } catch {
        // Silent fail
      }
    }
  };

  const handleRate = (starValue: number) => {
    if (!game) return;
    setRating(game.id, starValue);
    setRatingSubmitted(true);
    toast({ title: `Rated ${starValue} ⭐`, description: "Thanks for your rating!" });
    setTimeout(() => setRatingSubmitted(false), 2000);
  };

  const handlePlay = () => {
    setPlaying(true);
    setPlayStartTime(Date.now());
  };

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setPlaying(false);
    setPlayStartTime(null);
    window.scrollTo(0, 0);

    getGameDetail(slug).then(async (g) => {
      setGame(g);
      if (g) {
        setImgSrc(getOptimizedImage(g.img, 800));
        setHasError(false);
        addRecent(g.id);
        const cats = await getCategories();
        const cat = cats.find((c) => c.id === g.c) || null;
        setCategory(cat);
        const catGames = await getCategoryGames(g.c);
        setRelated(catGames.filter((cg) => cg.s !== slug).slice(0, 12));
      }
      setLoading(false);
    });
  }, [slug]);

  // Re-initialize rating state when game changes
  useEffect(() => {
    setRatingSubmitted(false);
    setHoverRating(0);
  }, [slug]);

  const handleError = () => {
    if (!hasError && game) {
      setHasError(true);
      setImgSrc(game.img);
    } else {
      setImgSrc("/placeholder.svg");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">Game Not Found</h1>
        <p className="text-muted-foreground mb-6">This game may have been removed or the link is invalid.</p>
        <Link to="/" className="text-primary hover:underline">← Back to Home</Link>
      </div>
    );
  }

  const cleanDesc = game.d.replace(/<[^>]+>/g, "");
  const displayRating = currentRating || game.r || 4.8;

  // Richer VideoGame schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": game.t,
    "description": cleanDesc || `Play ${game.t} unblocked for free online. No download required.`,
    "image": game.img,
    "url": `${BASE_URL}/game/${slug}`,
    "genre": category?.name || "Online Game",
    "playMode": "SinglePlayer",
    "applicationCategory": "Game",
    "operatingSystem": "Browser, ChromeOS, Windows, macOS",
    "inLanguage": "en",
    "isAccessibleForFree": true,
    "publisher": {
      "@type": "Organization",
      "name": "UnblockedGamesZone",
      "url": BASE_URL,
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": displayRating,
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": Math.max(game.p || 100, 100),
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
    },
  };

  const breadcrumbs = [
    { name: "Home", url: "/" },
    ...(category ? [{ name: category.name, url: `/category/${category.slug}` }] : []),
    { name: game.t, url: `/game/${slug}` },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title={`Play ${game.t} Unblocked - Free Online Game for School`}
        description={`Play ${game.t} unblocked online for free! No download needed. Works on Chromebooks and all browsers. ${cleanDesc.slice(0, 100).trim()}...`}
        canonical={`/game/${slug}`}
        keywords={`${game.t}, ${game.t} unblocked, ${game.t} online, ${category?.name || "browser games"}, unblocked games, school games`}
        schema={schema}
        breadcrumbs={breadcrumbs}
        ogType="article"
      />

      <ScraperShield />

      {/* Breadcrumb nav */}
      <div className="container py-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span aria-hidden>/</span>
          {category && (
            <>
              <Link to={`/category/${category.slug}`} className="hover:text-foreground transition-colors">
                {category.name}
              </Link>
              <span aria-hidden>/</span>
            </>
          )}
          <span className="text-foreground truncate max-w-[200px]" aria-current="page">{game.t}</span>
        </nav>
      </div>

      <div className="container">
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          {/* Main column */}
          <div>
            {/* Title row */}
            <div className="flex items-center justify-between mb-4 gap-4">
              <h1 className="text-2xl md:text-3xl font-black text-foreground">{game.t}</h1>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleFavorite(game.id as any)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    isFavorite(game.id as any)
                      ? "bg-red-500/20 text-red-500 scale-110"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-red-400"
                  }`}
                  title={isFavorite(game.id as any) ? "Remove from favorites" : "Add to favorites"}
                  aria-label={isFavorite(game.id as any) ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className={`w-5 h-5 ${isFavorite(game.id as any) ? "fill-current" : ""}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                  title="Share this game"
                  aria-label="Share this game"
                >
                  <Share2 className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Game iframe or play button */}
            <div className="relative w-full aspect-video bg-black rounded-xl border border-border shadow-2xl overflow-hidden mb-4 group">
              {playing && game.u ? (
                <>
                  <iframe
                    ref={iframeRef}
                    src={game.u}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; fullscreen; gamepad *; accelerometer *; gyroscope *; magnetometer *; clipboard-write *; keyboard-map; focus-without-user-activation"
                    sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-storage-access-by-user-activation"
                    title={`Play ${game.t} - Unblocked Free Online Game`}
                    loading="eager"
                    onLoad={(e) => {
                      (e.target as HTMLIFrameElement).focus();
                    }}
                  />
                  {/* Invisible click-through focus layer */}
                  <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    onClick={() => iframeRef.current?.focus()}
                  />
                  {/* Fullscreen button */}
                  <button
                    onClick={handleFullscreen}
                    className="absolute bottom-4 right-4 z-20 p-2.5 bg-black/50 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 border border-white/20"
                    title="Fullscreen (F11)"
                    aria-label="Toggle fullscreen"
                  >
                    <Maximize className="w-5 h-5" />
                  </button>
                  {/* Next Game Overlay — appears after 3 min */}
                  <NextGameOverlay
                    games={related}
                    isPlaying={playing}
                    playStartTime={playStartTime}
                  />
                </>
              ) : (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-card to-secondary cursor-pointer"
                  onClick={handlePlay}
                  role="button"
                  tabIndex={0}
                  aria-label={`Play ${game.t}`}
                  onKeyDown={(e) => e.key === "Enter" && handlePlay()}
                >
                  <img
                    src={imgSrc}
                    alt={`${game.t} game screenshot`}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                    onError={handleError}
                  />
                  <div className="relative z-10 flex flex-col items-center gap-4 w-full px-4 text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary flex items-center justify-center shadow-glow animate-pulse-glow shrink-0">
                      <Play className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground ml-1" />
                    </div>
                    <p className="text-lg md:text-xl font-black text-white drop-shadow-lg break-words max-w-full">
                      Play {game.t}
                    </p>
                    <p className="text-[10px] md:text-sm font-medium text-muted-foreground bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 uppercase tracking-wider">
                      No Download • Unblocked • Free
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Stats & Rating bar */}
            <div className="flex flex-wrap items-center gap-4 mb-6 p-3 bg-card rounded-lg border border-border/50">
              {/* Interactive star rating */}
              <div className="flex items-center gap-1.5">
                <div
                  className="flex gap-0.5"
                  onMouseLeave={() => setHoverRating(0)}
                  role="group"
                  aria-label="Rate this game"
                >
                  {[1, 2, 3, 4, 5].map((s) => {
                    const isActive = s <= (hoverRating || currentRating || Math.round(displayRating));
                    return (
                      <button
                        key={s}
                        className="hover:scale-125 transition-transform focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
                        onMouseEnter={() => setHoverRating(s)}
                        onClick={() => handleRate(s)}
                        aria-label={`Rate ${s} star${s > 1 ? "s" : ""}`}
                      >
                        <Star
                          className={`w-4 h-4 transition-colors ${
                            isActive
                              ? "text-gaming-yellow fill-gaming-yellow"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                {ratingSubmitted ? (
                  <span className="flex items-center gap-1 text-xs text-primary font-semibold">
                    <Check className="w-3 h-3" /> Rated!
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-foreground">
                    {displayRating}/5
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground font-medium">
                  {formatPlays(game.p)} plays
                </span>
              </div>

              {category && (
                <Link
                  to={`/category/${category.slug}`}
                  className="text-sm text-primary hover:underline font-bold ml-auto"
                >
                  {getCategoryIcon(category.slug)} {category.name}
                </Link>
              )}
            </div>

            <AdPlacement size="728x90" className="mb-8" slot="leaderboard-below-game" />

            {/* About & Instructions */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-6">
                <div className="p-6 bg-card rounded-xl border border-border/50">
                  <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full" />
                    About {game.t}
                  </h2>
                  <div
                    className="text-muted-foreground leading-relaxed prose prose-invert max-w-none text-sm"
                    dangerouslySetInnerHTML={{
                      __html:
                        (slug && gameDescriptions[slug]?.about) ||
                        cleanDesc ||
                        `${game.t} is a popular unblocked game that you can play directly in your browser. Experience high-speed action and challenging levels designed specifically for student gamers.`,
                    }}
                  />
                </div>

                <div className="p-6 bg-card rounded-xl border border-border/50">
                  <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-gaming-blue rounded-full" />
                    How to Play {game.t}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {(slug && gameDescriptions[slug]?.howToPlay) ||
                      game.ins?.replace(/<[^>]+>/g, "") ||
                      `To play ${game.t}, simply use your mouse or keyboard controls. Follow the on-screen instructions to navigate through levels and achieve the highest score possible!`}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-card rounded-xl border border-border/50">
                  <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-gaming-yellow rounded-full" />
                    <Trophy className="w-4 h-4 text-gaming-yellow" />
                    Tips &amp; Tricks
                  </h2>
                  <ul className="space-y-3">
                    {[
                      "Start with easier levels to master the controls before advancing",
                      "Use your browser's full-screen mode (F11) for the best experience",
                      "Look for power-ups or hidden bonuses in every level",
                      "Practice regularly to improve your score and climb the ranks",
                    ].map((tip, i) => (
                      <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-primary">
                          {i + 1}
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 bg-primary/5 rounded-xl border border-primary/10">
                  <h2 className="text-lg font-bold text-foreground mb-2">
                    ✅ Why Play on UnblockedGamesZone?
                  </h2>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li>⚡ Fast loading — optimized for school WiFi</li>
                    <li>🔓 Truly unblocked — works on Chromebooks</li>
                    <li>📥 Zero downloads — instant browser play</li>
                    <li>🆓 100% free — no account needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <AdPlacement size="300x250" slot="sidebar-rectangle-top" />
            {related.length > 0 && (
              <div className="bg-card rounded-lg border border-border/50 p-4">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  🔥 <span>More {category?.name || "Games"}</span>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {related.slice(0, 8).map((g) => (
                    <GameCard key={g.id} game={g} size="sm" />
                  ))}
                </div>
              </div>
            )}
            <AdPlacement size="300x250" slot="sidebar-rectangle-bottom" />
          </aside>
        </div>
      </div>

      {/* More games from this category */}
      {related.length > 8 && (
        <section className="container mt-12 mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              More {category?.name} Games
            </h2>
            {category && (
              <Link
                to={`/category/${category.slug}`}
                className="text-sm text-primary hover:underline font-medium"
              >
                View all →
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {related.slice(0, 12).map((g) => (
              <GameCard
                key={g.id}
                game={g}
                isFavorite={isFavorite(g.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
