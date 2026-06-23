import { useEffect } from "react";
import { ShieldCheck } from "lucide-react";

interface ScraperShieldProps {
  disableContextMenu?: boolean;
}

export default function ScraperShield({ disableContextMenu = true }: ScraperShieldProps) {
  useEffect(() => {
    if (!disableContextMenu) return;

    const handleContextMenu = (e: MouseEvent) => {
      // Allow context menu on certain elements if needed, but block by default
      e.preventDefault();
    };

    const handleSelectStart = (e: Event) => {
      // Disable text selection to prevent easy scraping
      // e.preventDefault(); 
      // Note: We'll keep selection enabled for accessibility unless explicitly requested, 
      // but blocking context menu stops most simple scraper tools.
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("selectstart", handleSelectStart);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("selectstart", handleSelectStart);
    };
  }, [disableContextMenu]);

  return (
    <div className="bg-secondary/30 border-y border-border py-2 mb-8 select-none">
      <div className="container flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-widest text-center">
        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
        <span>All games are browser-based, require no downloads, and are 100% safe for students.</span>
      </div>
    </div>
  );
}
