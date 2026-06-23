import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Gamepad2 } from "lucide-react";
import { getCategories, type Category } from "@/data/games";
import SuggestGame from "./SuggestGame";

export default function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(cats => setCategories(cats.filter(c => c.total_games > 0)));
  }, []);

  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Gamepad2 className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-gradient-gaming">UnblockedGamesZone</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6">
              UnblockedGamesZone is your ultimate destination for free unblocked games. Play thousands of action, puzzle, and racing games directly in your browser.
            </p>
            <SuggestGame />
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">Categories</h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.slug}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">More Categories</h4>
            <ul className="space-y-2">
              {categories.slice(6).map(cat => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.slug}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">Site Info</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/disclaimer" className="text-sm text-muted-foreground hover:text-primary transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2026 UnblockedGamesZone. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
