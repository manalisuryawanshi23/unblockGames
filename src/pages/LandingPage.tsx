import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { GameCompact, getInitialGames } from "@/data/games";
import GameCard from "@/components/GameCard";
import AdPlacement from "@/components/AdPlacement";
import ScraperShield from "@/components/ScraperShield";

interface LandingPageProps {
  title: string;
  description: string;
  keywords: string;
  content: string;
  collectionTitle: string;
}

export default function LandingPage({ title, description, keywords, content, collectionTitle }: LandingPageProps) {
  const [games, setGames] = useState<GameCompact[]>([]);

  useEffect(() => {
    getInitialGames().then(setGames);
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <div className="min-h-screen">
      <SEO 
        title={title}
        description={description}
        keywords={keywords}
      />
      
      <ScraperShield />

      <main className="container py-8 max-w-5xl">
        <h1 className="text-4xl font-black tracking-tighter text-gradient-gaming mb-6 text-center lg:text-5xl">
          {title}
        </h1>

        {/* TOP AD */}
        <div className="mb-12">
          <AdPlacement slot="5925756850" />
        </div>

        {/* LONG FORM CONTENT (Human-like) */}
        <section className="prose prose-invert max-w-none mb-16 px-4 py-8 bg-card/30 rounded-2xl border border-border/50">
          <div className="text-foreground/90 space-y-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
        </section>

        {/* GAME COLLECTION SECTION */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              {collectionTitle}
            </h2>
            <Link to="/categories" className="text-sm font-medium text-primary hover:underline">
              View All Categories
            </Link>
          </div>

          {/* AD BEFORE GRID */}
          <AdPlacement slot="5925756850" />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {games.slice(0, 20).map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>

        {/* BOTTOM AD */}
        <div className="mt-16">
          <AdPlacement slot="5925756850" />
        </div>
      </main>
    </div>
  );
}
