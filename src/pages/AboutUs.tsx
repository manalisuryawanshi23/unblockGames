import SEO from "@/components/SEO";

export default function AboutUs() {
  return (
    <div className="min-h-screen py-12">
      <SEO 
        title="About Us - UnblockedGamesZone" 
        description="Learn more about our mission to provide free, unblocked games for students and gamers worldwide."
      />
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-black mb-8 text-gradient-gaming">About UnblockedGamesZone</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>
            Welcome to the home of free, unblocked, and high-quality browser gaming. UnblockedGamesZone was created by a small team of passionate developers who spent way too much time playing games in school and wanted to build a portal that worked perfectly on Chromebooks and restricted school networks.
          </p>

          <h2 className="text-2xl font-bold text-foreground">Why We Built This?</h2>
          <p>
            Standard gaming platforms are often slow, resource-heavy, and frequently blocked by school filters. We wanted a lightweight, fast, and secure destination where you can jump straight into top HTML5 games without downloading anything.
          </p>

          <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
          <p>
            Our goal is simple: to be the #1 place where students can decompress, have fun, and play their favorite titles for free. We are committed to maintaining a safe environment and regularly auditing our library to ensure it remains kid-friendly and compliant with modern safety standards.
          </p>

          <h2 className="text-2xl font-bold text-foreground">A Note on Performance</h2>
          <p>
            Every game on UnblockedGamesZone is tested on low-end hardware to ensure it runs smoothly even on older devices and slow WiFi. We use advanced caching techniques to make sure the site loads in under 2 seconds.
          </p>

          <p className="pt-8">
            Thanks for playing with us. Game on!
          </p>
        </div>
      </div>
    </div>
  );
}
