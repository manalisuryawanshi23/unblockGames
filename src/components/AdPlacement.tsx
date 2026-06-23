import { useEffect, useRef, useId } from "react";
import { useLocation } from "react-router-dom";

interface AdPlacementProps {
  size?: "728x90" | "300x250" | "320x100" | "970x90" | "320x50";
  className?: string;
  slot?: string;
  sticky?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AD_CLIENT = "ca-pub-7506978867736173";

// Map slot names → actual AdSense slot IDs
// Create distinct ad units in your AdSense dashboard and replace these IDs
const SLOT_MAP: Record<string, string> = {
  "leaderboard-homepage-top": "5925756850",
  "leaderboard-homepage-mid": "5925756850",
  "leaderboard-category-top": "5925756850",
  "leaderboard-below-game": "5925756850",
  "sidebar-rectangle-top": "5925756850",
  "sidebar-rectangle-bottom": "5925756850",
  "sticky-bottom-mobile": "5925756850",
  // Default fallback
  "default": "5925756850",
};

export default function AdPlacement({
  size = "728x90",
  className = "",
  slot = "default",
  sticky = false,
}: AdPlacementProps) {
  const uid = useId();
  const pushed = useRef(false);
  const location = useLocation();

  const [w, h] = size.split("x").map(Number);
  const slotId = SLOT_MAP[slot] ?? SLOT_MAP["default"];

  // Re-initialize the ad unit each time the route changes (SPA fix)
  useEffect(() => {
    pushed.current = false;
  }, [location.pathname]);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;

    const timer = setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // Suppress "already pushed" errors from AdSense in dev
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname, uid]);

  const isLeaderboard = w >= 728;
  const isMobileNarrow = size === "320x50" || size === "320x100";

  const wrapperClass = sticky
    ? "fixed bottom-0 left-0 right-0 z-40 flex flex-col items-center bg-background/90 backdrop-blur-sm border-t border-border py-1 shadow-2xl"
    : `flex flex-col items-center justify-center gap-1.5 my-4 ${className}`;

  return (
    <div className={wrapperClass}>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground/40 font-medium">
        Advertisement
      </span>
      <div
        className="bg-secondary/20 border border-border/30 rounded flex items-center justify-center overflow-hidden"
        style={{ maxWidth: isLeaderboard ? "100%" : `${w}px`, minHeight: `${h}px` }}
      >
        <ins
          key={`${location.pathname}-${uid}`}
          className="adsbygoogle"
          style={{
            display: "block",
            width: isLeaderboard ? "100%" : `${w}px`,
            height: `${h}px`,
          }}
          data-ad-client={AD_CLIENT}
          data-ad-slot={slotId}
          data-ad-format={isLeaderboard ? "auto" : undefined}
          data-full-width-responsive={isLeaderboard ? "true" : "false"}
        />
      </div>
    </div>
  );
}
