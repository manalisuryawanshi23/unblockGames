import SEO from "@/components/SEO";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen py-12">
      <SEO 
        title="Privacy Policy - UnblockedGamesZone" 
        description="Read our privacy policy to understand how we handle your data and ensure a safe gaming environment."
      />
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-black mb-8">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>
            Welcome to UnblockedGamesZone. Your privacy is genuinely important to us. We’ve written this policy in plain English to help you understand what information we collect, how we use it, and how we keep you safe while you’re enjoying our games.
          </p>

          <h2 className="text-2xl font-bold text-foreground">1. Information We Collect</h2>
          <p>
            We don’t ask for your name, email, or phone number to play games here. We believe in "instant play," which means you can jump right into the action without creating an account.
          </p>
          <p>
            However, like almost every website, we do collect some basic technical data automatically:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Log Files:</strong> This includes your IP address, browser type, and the pages you visit. This helps us see which games are popular and fix any technical bugs.</li>
            <li><strong>Cookies:</strong> We use small text files called cookies to remember your "Favorite" games and your high scores locally on your device.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground">2. Google AdSense & Third-Party Advertising</h2>
          <p>
            To keep our games free for everyone, we show advertisements. We work with Google AdSense, which uses cookies to serve ads based on your previous visits to our site or other sites on the internet.
          </p>
          <p>
            Google’s use of advertising cookies enables it and its partners to serve ads to you based on your visit to our sites and/or other sites on the Internet. You may opt-out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-primary hover:underline">Ads Settings</a>.
          </p>

          <h2 className="text-2xl font-bold text-foreground">3. Safety for Students & Schools</h2>
          <p>
            We know many of our users are students playing on school Chromebooks. We strive to maintain a clean environment. We do not host "adult" content, and we regularly audit our game library to ensure it's appropriate for all ages.
          </p>

          <h2 className="text-2xl font-bold text-foreground">4. External Links</h2>
          <p>
            Our games often come from various developers and might contain links to their own websites. Once you leave UnblockedGamesZone, our privacy policy no longer applies, so please be mindful of where you click.
          </p>

          <h2 className="text-2xl font-bold text-foreground">5. Changes to This Policy</h2>
          <p>
            We might update this page from time to time as we add new features. We’ll always keep the latest version right here for you to check.
          </p>

          <p className="pt-8">
            Last Updated: April 2026
          </p>
        </div>
      </div>
    </div>
  );
}
