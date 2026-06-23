import SEO from "@/components/SEO";

export default function Disclaimer() {
  return (
    <div className="min-h-screen py-12">
      <SEO 
        title="Disclaimer - UnblockedGamesZone" 
        description="Important legal disclaimer for those playing games at UnblockedGamesZone."
      />
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-black mb-8">Disclaimer</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>
            Please read this disclaimer before using UnblockedGamesZone. Your use of this site signifies your understanding and agreement to the following terms.
          </p>

          <h2 className="text-2xl font-bold text-foreground">1. Content Ownership</h2>
          <p>
            All games on UnblockedGamesZone are provided by third-party developers and are for informational and educational purposes. We do not claim ownership of the games unless otherwise stated. All copyrights and trademarks belong to their respective owners.
          </p>

          <h2 className="text-2xl font-bold text-foreground">2. Accuracy of Information</h2>
          <p>
            While we strive for accuracy, the contents of this site are provided without any guarantees or conditions as to its accuracy. Games are tested for safety and performance, but bugs can occur.
          </p>

          <h2 className="text-2xl font-bold text-foreground">3. External Links</h2>
          <p>
            Our games and site may contain links to external sites that are not controlled or maintained by us. We are not responsible for the content, privacy policies, or practices of any third-party websites.
          </p>

          <h2 className="text-2xl font-bold text-foreground">4. Liability</h2>
          <p>
            UnblockedGamesZone will not be liable for any losses and/or damages in connection with the use of our website. By using our site, you hereby consent to our disclaimer and agree to its terms.
          </p>

          <p className="pt-8">
            Last Updated: April 2026
          </p>
        </div>
      </div>
    </div>
  );
}
