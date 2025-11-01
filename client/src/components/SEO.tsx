import { Helmet } from "react-helmet-async";
import { SEO_CONFIG } from "@/lib/seo";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "profile" | "article";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  structuredData?: object | object[];
  noindex?: boolean;
  canonical?: string;
}

export function SEO({
  title,
  description,
  keywords = [],
  image,
  url,
  type = "website",
  author,
  publishedTime,
  modifiedTime,
  structuredData,
  noindex = false,
  canonical,
}: SEOProps) {
  const pageTitle = title
    ? title.includes("|")
      ? title
      : `${title} | ${SEO_CONFIG.siteName}`
    : SEO_CONFIG.defaultTitle;

  const pageDescription = description || SEO_CONFIG.defaultDescription;
  const pageKeywords = keywords.length
    ? keywords.join(", ")
    : SEO_CONFIG.defaultKeywords.join(", ");
  const pageUrl = url || canonical || window.location.href;
  const pageImage = image || `${SEO_CONFIG.siteUrl}${SEO_CONFIG.ogImage}`;

  const robotsContent = noindex ? "noindex, nofollow" : "index, follow";

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      {author && <meta name="author" content={author} />}
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={canonical || pageUrl} />

      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SEO_CONFIG.siteName} />
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {author && type === "article" && (
        <meta property="article:author" content={author} />
      )}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      {SEO_CONFIG.twitterHandle && (
        <meta name="twitter:site" content={SEO_CONFIG.twitterHandle} />
      )}
      {author && <meta name="twitter:creator" content={author} />}

      {/* Additional SEO Tags */}
      <meta name="language" content="English" />
      <meta httpEquiv="content-language" content="en" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(
            Array.isArray(structuredData) ? structuredData : [structuredData]
          )}
        </script>
      )}
    </Helmet>
  );
}

// Specialized SEO component for portfolio pages
interface PortfolioSEOProps {
  name: string;
  title?: string;
  bio?: string;
  image?: string;
  url: string;
  skills?: string[];
  projects?: Array<{
    title: string;
    description: string;
    url?: string;
    image?: string;
  }>;
  experiences?: Array<{
    title: string;
    company: string;
  }>;
  contacts?: {
    email?: string;
    linkedin?: string;
    github?: string;
  };
}

export function PortfolioSEO({
  name,
  title,
  bio,
  image,
  url,
  skills = [],
  projects = [],
  experiences = [],
  contacts,
}: PortfolioSEOProps) {
  const pageTitle = title ? `${name} - ${title}` : name;
  const pageDescription = bio
    ? `${bio.substring(0, 150)}...`
    : `Portfolio of ${name}. View projects, skills, and professional experience.`;

  // Generate Person structured data
  const personSchema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    ...(title && { jobTitle: title }),
    ...(bio && { description: bio }),
    url,
    ...(image && { image }),
    ...(contacts?.email && { email: contacts.email }),
    ...(skills.length > 0 && { knowsAbout: skills }),
    ...(contacts?.linkedin && {
      sameAs: [
        contacts.linkedin,
        ...(contacts.github ? [contacts.github] : []),
      ],
    }),
  };

  // Add work examples if projects exist
  if (projects.length > 0) {
    personSchema["workExample"] = projects.map((project) => ({
      "@type": "CreativeWork",
      name: project.title,
      description: project.description,
      ...(project.url && { url: project.url }),
      ...(project.image && { image: project.image }),
    }));
  }

  // Add occupation if experiences exist
  if (experiences.length > 0) {
    personSchema["hasOccupation"] = experiences.map((exp) => ({
      "@type": "Occupation",
      name: exp.title,
      occupationLocation: {
        "@type": "Organization",
        name: exp.company,
      },
    }));
  }

  const keywords = [
    name,
    ...(title ? [title] : []),
    "portfolio",
    "professional profile",
    ...skills.slice(0, 5),
  ];

  return (
    <SEO
      title={pageTitle}
      description={pageDescription}
      keywords={keywords}
      image={image}
      url={url}
      type="profile"
      author={name}
      structuredData={personSchema}
    />
  );
}

// Component for adding JSON-LD structured data
interface StructuredDataProps {
  data: object | object[];
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(Array.isArray(data) ? data : [data])}
      </script>
    </Helmet>
  );
}

export default SEO;
