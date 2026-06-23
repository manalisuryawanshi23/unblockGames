import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useLocation } from "react-router-dom";
import AdPlacement from "@/components/AdPlacement";

const DISMISS_KEY = "ugz_sticky_ad_dismissed";
const DISMISS_DURATION_MS = 30 * 60 * 1000; // 30 minutes

// Don't show sticky ad on game pages (would block gameplay controls)
const EXCLUDED_PATHS = ["/game/"];

export default function StickyBottomAd() {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  const isExcluded = EXCLUDED_PATHS.some((p) =>
    location.pathname.startsWith(p)
  );

  useEffect(() => {
    if (isExcluded) {
      setVisible(false);
      return;
    }

    // Check if user dismissed recently
    try {
      const dismissed = sessionStorage.getItem(DISMISS_KEY);
      if (dismissed) {
        const ts = parseInt(dismissed, 10);
        if (Date.now() - ts < DISMISS_DURATION_MS) {
          return;
        }
      }
    } catch {
      // ignore
    }

    // Delay showing so the page content loads first (better UX + viewability)
    const timer = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(timer);
  }, [location.pathname, isExcluded]);

  const handleDismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // ignore
    }
  };

  if (!visible || isExcluded) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-4 duration-500 md:hidden">
      <div className="relative bg-background/95 backdrop-blur-sm border-t border-border shadow-2xl">
        <button
          onClick={handleDismiss}
          className="absolute -top-3 right-3 w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-secondary/80 transition-colors z-10"
          aria-label="Close advertisement"
        >
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        <AdPlacement size="320x50" slot="sticky-bottom-mobile" className="my-0" />
      </div>
    </div>
  );
}
