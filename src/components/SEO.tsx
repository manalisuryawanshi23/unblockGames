import { Helmet } from "react-helmet-async";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string;
  ogType?: string;
  ogImage?: string;
  schema?: object | object[];
  breadcrumbs?: BreadcrumbItem[];
  robots?: string;
  noindex?: boolean;
}

const BASE_URL = "https://unblockedgameszone.com";

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`
    }))
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "UnblockedGamesZone",
    "url": `${BASE_URL}/`,
    "description": "Play thousands of free unblocked games for school. No download required. Works on Chromebooks.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${BASE_URL}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "UnblockedGamesZone",
      "url": `${BASE_URL}/`,
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/logo.png`
      }
    }
  };
}

export default function SEO({
  title,
  description,
  keywords,
  canonical,
  ogType = "website",
  ogImage = "/og-image.png",
  schema,
  breadcrumbs,
  robots,
  noindex = false,
}: SEOProps) {
  const siteName = "UnblockedGamesZone";
  const fullTitle = title
    ? `${title} | ${siteName}`
    : `${siteName} - Play Free Online Games No Download`;
  const fullDescription =
    description ||
    "Play the best free unblocked games for school. No download required. Works on Chromebooks. UnblockedGamesZone features action, puzzle, and racing games.";
  const url = canonical
    ? `${BASE_URL}${canonical}`
    : `${BASE_URL}/`;
  const robotsContent = noindex
    ? "noindex, nofollow"
    : robots || "index, follow";

  const breadcrumbSchema =
    breadcrumbs && breadcrumbs.length > 0
      ? buildBreadcrumbSchema(breadcrumbs)
      : null;

  // Support both single schema and array of schemas
  const schemas: object[] = [];
  if (schema) {
    if (Array.isArray(schema)) schemas.push(...schema);
    else schemas.push(schema);
  }
  if (breadcrumbSchema) schemas.push(breadcrumbSchema);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={url} />

      {/* OpenGraph Meta Tags */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${BASE_URL}${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@UnblockedGamesZ" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={`${BASE_URL}${ogImage}`} />

      {/* Schema.org JSON-LD — combined into one graph */}
      {schemas.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(
            schemas.length === 1
              ? schemas[0]
              : { "@context": "https://schema.org", "@graph": schemas.map(s => ({ ...s, "@context": undefined })) }
          )}
        </script>
      )}
    </Helmet>
  );
}
