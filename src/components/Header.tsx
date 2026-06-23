import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Gamepad2, Search, Flame, LayoutGrid, Menu, X,
  Sun, Moon, Download, Heart, Command,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { getCategories, searchGames, type Category, type GameCompact } from "@/data/games";
import { usePWA } from "@/hooks/usePWA";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getOptimizedImage } from "@/lib/image-utils";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { prompt, isInstalled, install } = usePWA();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [suggestions, setSuggestions] = useState<GameCompact[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setShowSuggestions(false);
    setSearchQuery("");
  }, [location.pathname]);

  // Ctrl+K / Cmd+K global shortcut to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
      if (e.key === "Escape") {
        setShowSuggestions(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Click outside to close suggestions
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        !searchInputRef.current?.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced autocomplete
  const handleSearchChange = useCallback((val: string) => {
    setSearchQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (val.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setSuggestionsLoading(true);
    setShowSuggestions(true);
    debounceRef.current = setTimeout(async () => {
      const results = await searchGames(val.trim());
      setSuggestions(results.slice(0, 6));
      setSuggestionsLoading(false);
    }, 250);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setSearchQuery("");
    }
  };

  const handleSuggestionClick = (slug: string) => {
    navigate(`/game/${slug}`);
    setShowSuggestions(false);
    setSearchQuery("");
  };

  const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container flex items-center justify-between h-16 gap-4">
        {/* LOGO */}
        <div className="flex items-center gap-2 group shrink-0">
          <Link to="/" className="flex items-center gap-2" aria-label="UnblockedGamesZone Home">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-black tracking-tighter text-gradient-gaming hidden lg:inline">
              UnblockedGamesZone
            </span>
          </Link>

          {/* PWA Install Button */}
          {prompt && !isInstalled && (
            <button
              onClick={install}
              className="ml-2 flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 border border-primary/30 rounded-full text-xs font-bold text-primary hover:bg-primary/30 transition-all animate-pulse shadow-[0_0_15px_rgba(25,230,128,0.2)]"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Install App</span>
            </button>
          )}
        </div>

        {/* CENTER SEARCH BAR with Autocomplete */}
        <div className="hidden md:flex flex-1 max-w-xl relative">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
                <Search className="w-4 h-4" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search games..."
                className="w-full bg-secondary/50 border border-border rounded-full py-2 pl-10 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/60"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim().length >= 2) setShowSuggestions(true);
                }}
                autoComplete="off"
                aria-label="Search games"
                aria-autocomplete="list"
                aria-expanded={showSuggestions}
              />
              {/* Keyboard shortcut hint */}
              <div className="absolute inset-y-0 right-3 flex items-center gap-1 pointer-events-none">
                {searchQuery ? null : (
                  <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 bg-secondary rounded text-[10px] font-mono text-muted-foreground/60 border border-border/50">
                    <Command className="w-2.5 h-2.5" />K
                  </kbd>
                )}
              </div>
            </div>
          </form>

          {/* Autocomplete Dropdown */}
          {showSuggestions && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              role="listbox"
              aria-label="Search suggestions"
            >
              {suggestionsLoading ? (
                <div className="p-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  Searching...
                </div>
              ) : suggestions.length > 0 ? (
                <ul className="py-1">
                  {suggestions.map((game) => (
                    <li key={game.id}>
                      <button
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-secondary/60 transition-colors text-left"
                        onClick={() => handleSuggestionClick(game.s)}
                        role="option"
                        aria-selected="false"
                      >
                        <img
                          src={getOptimizedImage(game.img, 40)}
                          alt=""
                          aria-hidden
                          className="w-8 h-8 rounded-md object-cover flex-shrink-0 bg-secondary"
                          loading="lazy"
                        />
                        <span className="text-sm font-medium text-foreground truncate">
                          {game.t}
                        </span>
                        <span className="ml-auto text-xs text-muted-foreground shrink-0">
                          Play →
                        </span>
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      className="w-full px-3 py-2.5 text-sm text-primary font-medium hover:bg-secondary/60 transition-colors text-center border-t border-border/50"
                      onClick={() => {
                        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                        setShowSuggestions(false);
                        setSearchQuery("");
                      }}
                    >
                      See all results for "{searchQuery}" →
                    </button>
                  </li>
                </ul>
              ) : (
                <div className="px-4 py-3 text-sm text-muted-foreground">
                  No games found — try a different name
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT NAVIGATION */}
        <nav className="flex items-center gap-1" aria-label="Main navigation">
          <Link
            to="/trending"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium hover:text-primary transition-colors text-foreground/80 rounded-lg hover:bg-secondary/50"
          >
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Trending</span>
          </Link>

          <Link
            to="/favorites"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium hover:text-primary transition-colors text-foreground/80 rounded-lg hover:bg-secondary/50"
          >
            <Heart className="w-4 h-4 text-red-400" />
            <span>Favorites</span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1.5 font-medium">
                <LayoutGrid className="w-4 h-4" />
                <span>Categories</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {categories.slice(0, 12).map((cat) => (
                <DropdownMenuItem key={cat.id} asChild>
                  <Link to={`/category/${cat.slug}`} className="w-full">
                    {cat.name}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem asChild>
                <Link to="/categories" className="w-full font-semibold text-primary">
                  All Categories →
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-full"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </nav>
      </div>

      {/* MOBILE FULLSCREEN MENU */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed z-[99999] p-4 flex flex-col animate-in fade-in duration-200"
          style={{
            backgroundColor: "#0B0E14",
            top: 0, left: 0, right: 0, bottom: 0,
            width: "100vw", height: "100vh",
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Header inside menu */}
          <div className="flex items-center justify-between mb-6 shrink-0">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-black tracking-tighter text-gradient-gaming">
                UnblockedGamesZone
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(false)}
              className="w-10 h-10 rounded-full bg-secondary"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-foreground" />
            </Button>
          </div>

          {/* Mobile Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                setIsMenuOpen(false);
              }
            }}
            className="relative mb-6 shrink-0"
          >
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search games... (e.g. Slope)"
              className="w-full bg-[#1A1F2B] border border-border/50 rounded-xl py-4 pl-12 pr-4 text-lg focus:ring-2 focus:ring-primary/50 outline-none text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </form>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto pb-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-2">
                  Navigation
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { to: "/trending", icon: <Flame className="w-5 h-5 text-orange-500" />, bg: "bg-orange-500/10", label: "Trending Games" },
                    { to: "/favorites", icon: <Heart className="w-5 h-5 text-red-400 fill-red-400" />, bg: "bg-red-500/10", label: "My Favorites" },
                    { to: "/categories", icon: <LayoutGrid className="w-5 h-5 text-primary" />, bg: "bg-primary/10", label: "All Categories" },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-[#1A1F2B] border border-border/20 active:bg-secondary transition-all"
                    >
                      <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                        {item.icon}
                      </div>
                      <span className="font-bold text-foreground">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-2">
                  Popular Categories
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.slice(0, 8).map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="p-4 rounded-xl bg-[#1A1F2B]/40 border border-border/10 text-center font-bold text-xs hover:border-primary/30 transition-colors text-foreground/80"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer inside menu */}
          <div className="pt-4 border-t border-border/20 mt-auto shrink-0 flex justify-center">
            <p className="text-[10px] font-medium text-muted-foreground">
              © 2026 UNBLOCKED GAMES ZONE
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
