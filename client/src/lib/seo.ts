// utils/seo.ts
// SEO Utility Functions and Constants

export const SEO_CONFIG = {
    siteName: "Folio",
    siteUrl: "https://yourwebsite.com", // Update with your actual domain
    twitterHandle: "@yourhandle", // Update with your Twitter handle
    defaultTitle: "Folio - Professional Portfolio Builder for Tech Professionals",
    titleTemplate: "%s | Folio",
    defaultDescription: "Create stunning tech portfolios in minutes. Showcase your projects, skills, work experience, and testimonials. Free portfolio builder for developers, designers, and tech professionals.",
    defaultKeywords: [
      "portfolio builder",
      "tech portfolio",
      "developer portfolio",
      "online portfolio",
      "portfolio website",
      "project showcase",
      "skills management",
      "professional portfolio"
    ],
    ogImage: "/og-image.jpg", // Update with actual image path
    twitterImage: "/twitter-image.jpg", // Update with actual image path
  };
  
  // Generate page-specific meta tags
  export const generatePageMeta = (
    title: string,
    description: string,
    keywords?: string[],
    image?: string,
    path?: string
  ) => {
    const fullTitle = title.includes('|') ? title : `${title} | ${SEO_CONFIG.siteName}`;
    const url = path ? `${SEO_CONFIG.siteUrl}${path}` : SEO_CONFIG.siteUrl;
    const ogImage = image || `${SEO_CONFIG.siteUrl}${SEO_CONFIG.ogImage}`;
    
    return {
      title: fullTitle,
      description: description || SEO_CONFIG.defaultDescription,
      keywords: keywords ? keywords.join(", ") : SEO_CONFIG.defaultKeywords.join(", "),
      canonical: url,
      ogTitle: fullTitle,
      ogDescription: description || SEO_CONFIG.defaultDescription,
      ogUrl: url,
      ogImage: ogImage,
      twitterTitle: fullTitle,
      twitterDescription: description || SEO_CONFIG.defaultDescription,
      twitterImage: ogImage,
    };
  };
  
  // Sanitize text for SEO
  export const sanitizeForSEO = (text: string, maxLength = 160): string => {
    return text
      .replace(/[<>]/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim()
      .substring(0, maxLength);
  };
  
  // Generate structured data for organization
  export const generateOrganizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SEO_CONFIG.siteName,
    "url": SEO_CONFIG.siteUrl,
    "logo": `${SEO_CONFIG.siteUrl}/logo.png`,
    "description": SEO_CONFIG.defaultDescription,
    "foundingDate": "2024",
    "sameAs": [
      "https://github.com/ahmedG3far44/Presento-Online-Platform",
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "url": `${SEO_CONFIG.siteUrl}/contact`
    }
  });
  
  // Generate breadcrumb structured data
  export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  });
  
  // Generate FAQ structured data
  export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  });
  
  // robots.txt content generator
  export const generateRobotsTxt = (): string => {
    return `# Folio Portfolio Builder - robots.txt
  User-agent: *
  Allow: /
  Allow: /user/*
  Disallow: /dashboard/*
  Disallow: /admin/*
  Disallow: /api/*
  
  Sitemap: ${SEO_CONFIG.siteUrl}/sitemap.xml
  
  # Common crawlers
  User-agent: Googlebot
  Allow: /
  
  User-agent: Bingbot
  Allow: /
  
  User-agent: Slurp
  Allow: /
  `;
  };
  
  // Generate sitemap.xml content
  export const generateSitemap = (userIds: string[]): string => {
    const baseUrls = [
      { loc: SEO_CONFIG.siteUrl, priority: '1.0', changefreq: 'daily' },
      { loc: `${SEO_CONFIG.siteUrl}/login`, priority: '0.8', changefreq: 'monthly' },
      { loc: `${SEO_CONFIG.siteUrl}/signup`, priority: '0.8', changefreq: 'monthly' },
    ];
  
    const userUrls = userIds.map(id => ({
      loc: `${SEO_CONFIG.siteUrl}/user/${id}`,
      priority: '0.9',
      changefreq: 'weekly'
    }));
  
    const allUrls = [...baseUrls, ...userUrls];
  
    return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${allUrls.map(url => `  <url>
      <loc>${url.loc}</loc>
      <changefreq>${url.changefreq}</changefreq>
      <priority>${url.priority}</priority>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>`).join('\n')}
  </urlset>`;
  };
  
  // Social sharing helper
  export const generateSocialShareUrl = (platform: 'twitter' | 'facebook' | 'linkedin', url: string, text?: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedText = text ? encodeURIComponent(text) : '';
  
    switch (platform) {
      case 'twitter':
        return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
      default:
        return url;
    }
  };
  
  // Extract keywords from text
  export const extractKeywords = (text: string, maxKeywords = 10): string[] => {
    const commonWords = new Set([
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
      'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at'
    ]);
  
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.has(word));
  
    const wordFreq = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
    return Object.entries(wordFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, maxKeywords)
      .map(([word]) => word);
  };
  
  // Performance monitoring for SEO metrics
  export const measurePageLoadMetrics = () => {
    if (typeof window === 'undefined' || !('performance' in window)) return null;
  
    const perfData = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    return {
      dns: perfData.domainLookupEnd - perfData.domainLookupStart,
      tcp: perfData.connectEnd - perfData.connectStart,
      request: perfData.responseStart - perfData.requestStart,
      response: perfData.responseEnd - perfData.responseStart,
      dom: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
      load: perfData.loadEventEnd - perfData.loadEventStart,
      total: perfData.loadEventEnd - perfData.fetchStart
    };
  };
  
  export default {
    SEO_CONFIG,
    generatePageMeta,
    sanitizeForSEO,
    generateOrganizationSchema,
    generateBreadcrumbSchema,
    generateFAQSchema,
    generateRobotsTxt,
    generateSitemap,
    generateSocialShareUrl,
    extractKeywords,
    measurePageLoadMetrics
  };