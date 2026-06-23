import { useState, useEffect } from "react";
import { Download, X, Share, PlusSquare } from "lucide-react";
import { usePWA } from "@/hooks/usePWA";

export default function InstallBanner() {
  const { prompt, isInstalled, install } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [isiOS, setIsiOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsiOS(isIOSDevice);

    // Initial check for visibility delay
    const timer = setTimeout(() => {
      const isActuallyInstalled = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
      if (!isActuallyInstalled && !dismissed) {
        // On iOS, we show it always if not installed
        // On other platforms, we wait for the prompt event
        if (isIOSDevice || prompt) {
          setIsVisible(true);
        }
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [prompt, dismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
    // Optional: save to localStorage to hide for a day
    localStorage.setItem('pwa-banner-dismissed', Date.now().toString());
  };

  if (!isVisible || isInstalled) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[60] animate-in slide-in-from-bottom-full duration-500 sm:hidden">
      <div className="bg-card/95 backdrop-blur-xl border border-primary/20 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden group">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-50" />
        
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-glow">
            <Download className="w-6 h-6 text-primary-foreground" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-sm font-bold text-foreground">Install UnblockedGamesZone</h3>
            <p className="text-xs text-muted-foreground leading-tight mt-0.5">
              {isiOS 
                ? "Tap Share > Add to Home Screen" 
                : "Play offline & faster on your phone!"}
            </p>
          </div>

          {!isiOS && prompt && (
            <button 
              onClick={install}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold shadow-lg active:scale-95 transition-transform"
            >
              Install
            </button>
          )}

          {isiOS && (
            <div className="flex items-center gap-1.5 px-3 py-2 bg-secondary rounded-lg border border-border">
              <Share className="w-3.5 h-3.5 text-primary" />
              <PlusSquare className="w-3.5 h-3.5 text-primary" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
