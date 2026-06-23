import { useEffect, useState } from "react";

interface AdPlacementProps {
  size?: "728x90" | "300x250" | "320x100" | "970x90";
  className?: string;
  slot?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdPlacement({ 
  size = "728x90", 
  className = "", 
  slot = "5925756850" 
}: AdPlacementProps) {
  const [w, h] = size.split("x").map(Number);

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  // Use smaller height for banners on small mobile screens to prevent huge empty blocks
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const displayHeight = isMobile && h > 100 ? 100 : h; // Cap banner heights to 100px on small mobile if not already smaller

  return (
    <div className={`flex flex-col items-center justify-center gap-1.5 my-4 ${className}`}>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground/40 font-medium">Advertisement</span>
      <div
        className="bg-secondary/20 border border-border/30 rounded flex items-center justify-center overflow-hidden w-full"
        style={{ maxWidth: `${w}px`, minHeight: `${displayHeight}px` }}
      >
        <ins
          className="adsbygoogle"
          style={{ 
            display: "inline-block", 
            width: isMobile ? "100%" : `${w}px`, 
            height: isMobile ? "auto" : `${h}px`,
            minHeight: isMobile ? `${displayHeight}px` : `${h}px`
          }}
          data-ad-client="ca-pub-7506978867736173"
          data-ad-slot={slot}
          data-ad-format={isMobile ? "horizontal" : undefined}
          data-full-width-responsive={isMobile ? "true" : "false"}
        />
      </div>
    </div>
  );
}
