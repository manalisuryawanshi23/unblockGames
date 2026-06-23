import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Gamepad2, Search, Flame, LayoutGrid, Menu, X, Sun, Moon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { getCategories, type Category } from "@/data/games";
import { usePWA } from "@/hooks/usePWA";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { prompt, isInstalled, install } = usePWA();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container flex items-center justify-between h-16 gap-4">
        {/* LOGO */}
        <div className="flex items-center gap-2 group shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-black tracking-tighter text-gradient-gaming hidden lg:inline">UnblockedGamesZone</span>
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

        {/* CENTER SEARCH BAR (Large) */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search games... (e.g. Slope, Run 3)"
            className="w-full bg-secondary/50 border border-border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/60"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* RIGHT NAVIGATION */}
        <nav className="flex items-center gap-2">
          {/* Trending Link */}
          <Link to="/trending" className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium hover:text-primary transition-colors text-foreground/80">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Trending</span>
          </Link>

          {/* Categories Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1.5 font-medium">
                <LayoutGrid className="w-4 h-4" />
                <span>Categories</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {categories.slice(0, 10).map((cat) => (
                <DropdownMenuItem key={cat.id} asChild>
                  <Link to={`/category/${cat.slug}`} className="w-full">
                    {cat.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-full"
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
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </nav>
      </div>

      {/* MOBILE MENU overlay */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed z-[99999] p-4 flex flex-col animate-in fade-in duration-300"
          style={{ 
            backgroundColor: '#0B0E14', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            width: '100vw',
            height: '100vh'
          }}
        >
          {/* Header inside menu */}
          <div className="flex items-center justify-between mb-6 shrink-0">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-black tracking-tighter text-gradient-gaming">UnblockedGamesZone</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(false)}
              className="w-10 h-10 rounded-full bg-secondary"
            >
              <X className="w-6 h-6 text-foreground" />
            </Button>
          </div>

          {/* Search inside menu */}
          <form onSubmit={handleSearch} className="relative mb-6 shrink-0">
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

          {/* Scrollable Content section */}
          <div className="flex-1 overflow-y-auto pb-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-2">Navigation</h3>
                <div className="grid grid-cols-1 gap-2">
                  <Link to="/trending" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl bg-[#1A1F2B] border border-border/20 active:bg-secondary transition-all">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                      <Flame className="w-5 h-5 text-orange-500" />
                    </div>
                    <span className="font-bold text-foreground">Trending Games</span>
                  </Link>
                  <Link to="/categories" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl bg-[#1A1F2B] border border-border/20 active:bg-secondary transition-all">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <LayoutGrid className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-bold text-foreground">All Categories</span>
                  </Link>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-2">Popular Categories</h3>
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
            <p className="text-[10px] font-medium text-muted-foreground">© 2026 UNBLOCKED GAMES ZONE</p>
          </div>
        </div>
      )}
    </header>
  );
}
