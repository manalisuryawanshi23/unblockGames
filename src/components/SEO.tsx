import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string;
  ogType?: string;
  ogImage?: string;
  schema?: object;
}

export default function SEO({
  title,
  description,
  keywords,
  canonical,
  ogType = "website",
  ogImage = "/og-image.png",
  schema
}: SEOProps) {
  const siteName = "UnblockedGamesZone";
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - Play Free Online Games No Download`;
  const fullDescription = description || "Play the best free unblocked games for school. No download required. Works on Chromebooks. UnblockedGamesZone features action, puzzle, and racing games.";
  const url = canonical ? `https://unblockedgameszone.com${canonical}` : "https://unblockedgameszone.com/";

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />

      {/* OpenGraph Meta Tags */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
