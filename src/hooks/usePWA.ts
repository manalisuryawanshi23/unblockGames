import { useState, useEffect } from "react";

export function usePWA() {
  const [prompt, setPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setPrompt(e);
      console.log("PWA install prompt captured");
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setPrompt(null);
      console.log('PWA has been installed');
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!prompt) return false;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") {
      setPrompt(null);
      return true;
    }
    return false;
  };

  return { prompt, isInstalled, install };
}
