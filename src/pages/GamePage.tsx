import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Play, Heart, Star, Users, Share2, Loader2, Maximize, ChevronLeft } from "lucide-react";
import { getGameDetail, getCategoryGames, getCategories, getCategoryIcon, formatPlays, type GameDetail, type GameCompact, type Category } from "@/data/games";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentlyPlayed } from "@/hooks/useRecentlyPlayed";
import GameCard from "@/components/GameCard";
import AdPlacement from "@/components/AdPlacement";
import SEO from "@/components/SEO";
import ScraperShield from "@/components/ScraperShield";
import { getOptimizedImage } from "@/lib/image-utils";

import { gameDescriptions } from "@/data/game-descriptions";

export default function GamePage() {
  const { slug } = useParams<{ slug: string }>();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addRecent } = useRecentlyPlayed();
  const [game, setGame] = useState<GameDetail | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [related, setRelated] = useState<GameCompact[]>([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [hasError, setHasError] = useState(false);

  const handleFullscreen = () => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if ((iframe as any).webkitRequestFullscreen) {
        (iframe as any).webkitRequestFullscreen();
      } else if ((iframe as any).msRequestFullscreen) {
        (iframe as any).msRequestFullscreen();
      }
    }
  };

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setPlaying(false);
    window.scrollTo(0, 0);

    getGameDetail(slug).then(async (g) => {
      setGame(g);
      if (g) {
        setImgSrc(getOptimizedImage(g.img, 800));
        setHasError(false);
        addRecent(g.id);
        const cats = await getCategories();
        const cat = cats.find(c => c.id === g.c) || null;
        setCategory(cat);
        const catGames = await getCategoryGames(g.c);
        setRelated(catGames.filter(cg => cg.s !== slug).slice(0, 12));
      }
      setLoading(false);
    });
  }, [slug]);

  const handleError = () => {
    if (!hasError && game) {
      setHasError(true);
      setImgSrc(game.img);
    } else {
      setImgSrc('/placeholder.svg');
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
        <Link to="/" className="text-primary hover:underline">← Back to Home</Link>
      </div>
    );
  }

  const cleanDesc = game.d.replace(/<[^>]+>/g, '');
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": game.t,
    "description": cleanDesc,
    "image": game.img,
    "genre": category?.name || "Online Game",
    "playMode": "SinglePlayer",
    "applicationCategory": "Game",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="min-h-screen">
      <SEO 
        title={`Play ${game.t} Unblocked - Free Online Games for School`}
        description={`Play ${game.t} unblocked online for free! No download needed. Works on Chromebooks. Fast and fun gameplay in your browser.`}
        schema={schema}
      />
      
      <ScraperShield />
      
      <div className="container py-3">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1">
             Home
          </Link>
          <span>/</span>
          {category && (
            <>
              <Link to={`/category/${category.slug}`} className="hover:text-foreground transition-colors">{category.name}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-foreground truncate max-w-[200px]">{game.t}</span>
        </nav>
      </div>

      <div className="container">
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          <div>
            <div className="flex items-center justify-between mb-4 gap-4">
              <h1 className="text-2xl md:text-3xl font-black text-foreground">{game.t}</h1>
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => toggleFavorite(game.id as any)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isFavorite(game.id as any) ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite(game.id as any) ? 'fill-current' : ''}`} />
                </button>
                <button className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
                  <Share2 className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Game iframe or play button */}
            <div className="relative w-full aspect-video bg-black rounded-xl border border-border shadow-2xl overflow-hidden mb-4 group">              {playing && game.u ? (
                <>
                  <iframe
                    src={game.u}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; fullscreen; gamepad *; accelerometer *; gyroscope *; magnetometer *; clipboard-write *; keyboard-map; focus-without-user-activation"
                    sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-storage-access-by-user-activation"
                    title={game.t}
                    loading="eager"
                    onLoad={(e) => {
                      (e.target as HTMLIFrameElement).focus();
                    }}
                  />
                  <div 
                    className="absolute inset-0 z-10 pointer-events-none" 
                    onClick={() => {
                      const iframe = document.querySelector('iframe');
                      iframe?.focus();
                    }}
                  />
                  <button 
                    onClick={handleFullscreen}
                    className="absolute bottom-4 right-4 z-20 p-2.5 bg-black/50 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 border border-white/20"
                    title="Fullscreen"
                  >
                    <Maximize className="w-5 h-5" />
                  </button>
                </>
              ) : (

                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-card to-secondary cursor-pointer"
                  onClick={() => setPlaying(true)}
                >
                  <img 
                    src={imgSrc} 
                    alt={game.t} 
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
                      No Download • Unblocked • Fast
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6 p-3 bg-card rounded-lg border border-border/50">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-lg">
                <Star className="w-4 h-4 text-gaming-yellow fill-gaming-yellow" />
                <span className="text-sm font-semibold text-foreground">{game.r || "4.8"}/5</span>
                <span className="mx-2 text-border">|</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} className="hover:scale-110 transition-transform">
                      <Star className="w-3.5 h-3.5 text-muted-foreground hover:text-gaming-yellow" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground font-medium">{formatPlays(game.p)} plays</span>
              </div>
              {category && (
                <Link to={`/category/${category.slug}`} className="text-sm text-primary hover:underline font-bold">
                  {getCategoryIcon(category.slug)} {category.name}
                </Link>
              )}
            </div>

            <AdPlacement size="728x90" className="mb-8" />

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-6">
                <div className="p-6 bg-card rounded-xl border border-border/50">
                  <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full" />
                    About {game.t}
                  </h2>
                  <div 
                    className="text-muted-foreground leading-relaxed prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: (slug && gameDescriptions[slug]?.about) || cleanDesc || `${game.t} is a popular unblocked game that you can play directly in your browser. Experience high-speed action and challenging levels designed specifically for student gamers.`
                    }}
                  />
                </div>

                <div className="p-6 bg-card rounded-xl border border-border/50">
                  <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-gaming-blue rounded-full" />
                    How to Play
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {(slug && gameDescriptions[slug]?.howToPlay) || game.ins?.replace(/<[^>]+>/g, '') || `To play ${game.t}, simply use your mouse or keyboard controls. Follow the on-screen instructions to navigate through levels and achieve the highest score possible!`}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-card rounded-xl border border-border/50">
                  <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-gaming-yellow rounded-full" />
                    Tips & Tricks
                  </h2>
                  <ul className="space-y-3">
                    {[
                      "Start with easier levels to master the controls",
                      "Use your Chromebook's full-screen mode for the best experience",
                      "Check for power-ups or hidden bonuses in every level",
                      "Practice regularly to climb the global leaderboard"
                    ].map((tip, i) => (
                      <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-primary">{i+1}</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 bg-primary/5 rounded-xl border border-primary/10">
                  <h2 className="text-xl font-bold text-foreground mb-3">Why Play on UnblockedGamesZone?</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We host the fastest loading versions of {game.t}. Our servers are optimized for school WiFi, ensuring you never experience lag while playing. No accounts, no downloads, just gaming.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <AdPlacement size="300x250" />
            {related.length > 0 && (
              <div className="bg-card rounded-lg border border-border/50 p-4">
                <h3 className="font-bold text-foreground mb-3">🔥 Related Games</h3>
                <div className="grid grid-cols-2 gap-2">
                  {related.slice(0, 6).map(g => (
                    <GameCard key={g.id} game={g} size="sm" />
                  ))}
                </div>
              </div>
            )}
            <AdPlacement size="300x250" />
          </aside>
        </div>
      </div>

      {related.length > 6 && (
        <section className="container mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">More {category?.name}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {related.map(g => (
              <GameCard key={g.id} game={g} isFavorite={isFavorite(g.id)} onToggleFavorite={toggleFavorite} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
