import SEO from "@/components/SEO";

export default function ContactUs() {
  return (
    <div className="min-h-screen py-12">
      <SEO 
        title="Contact Us - UnblockedGamesZone" 
        description="Have a suggestion? Found a broken game? Get in touch with us at UnblockedGamesZone."
      />
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-black mb-8">Contact Us</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>
            We’d love to hear from you. Whether you’ve found a bug, want to suggest a new game, or just want to say hi, feel free to reach out.
          </p>

          <h2 className="text-2xl font-bold text-foreground">1. Game Submissions</h2>
          <p>
            Are you a game developer? We love hosting new games. If you want your title to be played by thousands of students worldwide, send us a link to your game’s JSON-LD or iframe URL.
          </p>

          <h2 className="text-2xl font-bold text-foreground">2. Reporting a Problem</h2>
          <p>
            Found a broken game or an ad that feels out of place? We’re on it. Please tell us the name of the game and the device you’re using so we can fix it quickly.
          </p>

          <h2 className="text-2xl font-bold text-foreground">3. How to Reach Us</h2>
          <p>
            You can email us directly at:
          </p>
          <div className="p-6 bg-card border border-border/50 rounded-xl max-w-sm">
            <p className="font-bold text-primary text-xl">contact@unblockedgameszone.com</p>
          </div>

          <p className="pt-8">
            We aim to respond to all emails within 48 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
