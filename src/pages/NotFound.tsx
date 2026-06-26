import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Home, Search, Gamepad2 } from "lucide-react";
import SEO from "@/components/SEO";

const NotFound = () => {
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>404 — Page Not Found | UnblockedGamesZone</title>
      </Helmet>

      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center max-w-md mx-auto">
          {/* Large 404 */}
          <div className="text-8xl font-black text-primary/20 leading-none mb-4 select-none">404</div>

          <h1 className="text-3xl font-extrabold text-foreground mb-3">Page Not Found</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            The page you're looking for has been moved, deleted, or never existed.
            Try browsing our games collection instead!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Home className="w-4 h-4" /> Back to Home
            </Link>
            <Link
              to="/trending"
              className="inline-flex items-center gap-2 bg-secondary text-foreground font-bold px-5 py-2.5 rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <Gamepad2 className="w-4 h-4" /> Trending Games
            </Link>
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 bg-secondary text-foreground font-bold px-5 py-2.5 rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <Search className="w-4 h-4" /> Browse Categories
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
