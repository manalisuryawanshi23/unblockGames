import { useState } from "react";
import { Send, Gamepad2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Since we're using a simple shadcn-like structure, we'll implement a clean local version
export default function SuggestGame() {
  const [isOpen, setIsOpen] = useState(false);
  const [gameName, setGameName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameName.trim()) {
      // In a real app, you'd send this to a backend/email
      console.log("Game suggested:", gameName);
      toast.success("Thanks! We'll look into adding " + gameName);
      setGameName("");
      setIsOpen(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-bold hover:bg-primary/20 transition-all group"
      >
        <Gamepad2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
        Suggest a Game
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-primary" />
                Suggest a Game
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-secondary rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              Can't find your favorite game? Let us know and we'll try our best to add it to UnblockedGamesZone!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Game Name</label>
                <input
                  type="text"
                  placeholder="e.g. Minecraft, Roblox, 1v1.lol"
                  autoFocus
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full py-6 font-bold text-base shadow-glow group">
                Send Suggestion
                <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
