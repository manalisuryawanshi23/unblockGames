import SEO from "@/components/SEO";

export default function TermsOfService() {
  return (
    <div className="min-h-screen py-12">
      <SEO 
        title="Terms of Service - UnblockedGamesZone" 
        description="Our simple and fair terms of service for playing games at UnblockedGamesZone."
      />
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-black mb-8">Terms of Service</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>
            By hanging out and playing games at UnblockedGamesZone, you agree to these basic terms. We’ve kept them short and simple because we want you to spend more time playing and less time reading legalese.
          </p>

          <h2 className="text-2xl font-bold text-foreground">1. Access & Use</h2>
          <p>
            UnblockedGamesZone is a free platform. We intended for students and gamers everywhere to have a place to play without jumping through hoops. Use it nicely, and don’t try to break our site or spam us.
          </p>

          <h2 className="text-2xl font-bold text-foreground">2. Games & Ownership</h2>
          <p>
            We don’t own all the games on our site. Many are made by independent developers and are licensed for free distribution. If you’re a developer and want your game removed, just email us, and we’ll handle it immediately.
          </p>

          <h2 className="text-2xl font-bold text-foreground">3. AdBlockers</h2>
          <p>
            We know ads can be annoying, but they’re the only reason we can keep this site 100% free. If you enjoy playing here, please consider disabling your ad blocker for us. It helps keep the lights on.
          </p>

          <h2 className="text-2xl font-bold text-foreground">4. Liability</h2>
          <p>
            While we do our best to make sure everything works perfectly, we can’t promise the site will always be 100% up or that games won’t have the occasional bug. We provide this site "as-is" and aren’t liable for any technical hiccups on your end.
          </p>

          <h2 className="text-2xl font-bold text-foreground">5. School Policies</h2>
          <p>
            If you’re playing at school, remember to follow your school’s own rules. We aren’t responsible if you get in trouble for playing games when you’re supposed to be studying!
          </p>

          <p className="pt-8 text-xs underline">
            Last Updated: April 2026
          </p>
        </div>
      </div>
    </div>
  );
}
