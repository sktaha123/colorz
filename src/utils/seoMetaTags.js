/**
 * SEO Meta Tags Management Utility
 * Dynamically sets meta tags and structured data for different pages/views
 */

export const updateMetaTags = (metadata) => {
  // Update title
  if (metadata.title) {
    document.title = metadata.title;
  }

  // Update or create meta description
  updateMetaTag('description', metadata.description || '');

  // Update keywords
  if (metadata.keywords) {
    updateMetaTag('keywords', metadata.keywords);
  }

  // Open Graph tags
  if (metadata.ogTitle) updateMetaTag('og:title', metadata.ogTitle, 'property');
  if (metadata.ogDescription) updateMetaTag('og:description', metadata.ogDescription, 'property');
  if (metadata.ogImage) updateMetaTag('og:image', metadata.ogImage, 'property');
  if (metadata.ogUrl) updateMetaTag('og:url', metadata.ogUrl, 'property');
  if (metadata.ogType) updateMetaTag('og:type', metadata.ogType, 'property');

  // Twitter Card tags
  if (metadata.twitterCard) updateMetaTag('twitter:card', metadata.twitterCard);
  if (metadata.twitterTitle) updateMetaTag('twitter:title', metadata.twitterTitle);
  if (metadata.twitterDescription) updateMetaTag('twitter:description', metadata.twitterDescription);
  if (metadata.twitterImage) updateMetaTag('twitter:image', metadata.twitterImage);
  if (metadata.twitterCreator) updateMetaTag('twitter:creator', metadata.twitterCreator);

  // Canonical URL
  if (metadata.canonical) {
    updateCanonicalURL(metadata.canonical);
  }

  // Structured data
  if (metadata.schema) {
    updateSchemaMarkup(metadata.schema);
  }
};

const updateMetaTag = (name, content, attribute = 'name') => {
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const updateCanonicalURL = (url) => {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = url;
};

const updateSchemaMarkup = (schema) => {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const scriptTag = document.createElement('script');
  scriptTag.type = 'application/ld+json';
  scriptTag.textContent = JSON.stringify(schema);
  document.head.appendChild(scriptTag);
};

// Default homepage metadata
export const getHomepageMetadata = () => ({
  title: 'ColorzPallete — Professional UI Color System Generator',
  description: 'Build professional design token systems with ColorzPallete. Create, customize, and export color palettes to Tailwind CSS, CSS variables, SCSS, and JSON formats.',
  keywords: 'color palette generator, UI color system, design tokens, Tailwind colors, CSS variables, color design, UI design, color generator, palette builder',
  ogTitle: 'ColorzPallete — Color System Generator',
  ogDescription: 'Professional UI color system generator with 100+ pre-built palettes and custom token exports.',
  ogImage: 'https://colorzpallete.com/og-image.jpg',
  ogUrl: 'https://colorzpallete.com',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'ColorzPallete — UI Color System Generator',
  twitterDescription: 'Build and export professional color systems instantly.',
  twitterImage: 'https://colorzpallete.com/og-image.jpg',
  twitterCreator: '@colorzpallete',
  canonical: 'https://colorzpallete.com',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ColorzPallete',
    description: 'Professional UI color system generator with 100+ pre-built palettes and custom token exports.',
    url: 'https://colorzpallete.com',
    applicationCategory: 'DesignApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: 'ColorzPallete',
      url: 'https://colorzpallete.com',
    },
  },
});

// Standard palettes section metadata
export const getStandardPalettesMetadata = () => ({
  title: 'Standard Color Palettes — ColorzPallete',
  description: 'Explore 50+ professionally designed color palettes for UI design. Warm, cool, neutral, and vibrant color systems for modern web and app design.',
  keywords: 'color palettes, UI color systems, design palettes, warm colors, cool colors, neutral colors, vibrant colors, web design colors',
  ogTitle: 'Standard Color Palettes — ColorzPallete',
  ogDescription: 'Browse 50+ professionally designed color palettes for your next design project.',
  canonical: 'https://colorzpallete.com/?tab=standard',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Standard Color Palettes',
    description: 'Explore professionally designed color palettes for UI design.',
    url: 'https://colorzpallete.com/?tab=standard',
  },
});

// UI System palettes section metadata
export const getUISystemMetadata = () => ({
  title: 'UI Design Systems — Professional Color Palettes | ColorzPallete',
  description: 'Browse 20+ complete UI design system palettes. Dark modes, light modes, and enterprise-ready color systems with design tokens.',
  keywords: 'UI design system, design tokens, dark mode colors, light mode colors, enterprise UI, design system palettes, professional colors',
  ogTitle: 'UI Design Systems — ColorzPallete',
  ogDescription: 'Professional UI design system palettes with complete design tokens.',
  canonical: 'https://colorzpallete.com/?tab=ui-system',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'UI Design Systems',
    description: 'Complete UI design system palettes with professional design tokens.',
    url: 'https://colorzpallete.com/?tab=ui-system',
  },
});

// Generator section metadata
export const getGeneratorMetadata = () => ({
  title: 'AI Color Generator — Create Custom Palettes | ColorzPallete',
  description: 'Generate custom color palettes automatically. Describe what you need and let our AI create the perfect palette for your project.',
  keywords: 'color generator, AI color generator, custom palettes, automatic color generation, palette creator',
  ogTitle: 'AI Color Generator — ColorzPallete',
  ogDescription: 'Generate custom color palettes with AI technology.',
  canonical: 'https://colorzpallete.com/?tab=generator',
});

// Organization schema
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ColorzPallete',
  description: 'Professional UI color system generator',
  url: 'https://colorzpallete.com',
  logo: 'https://colorzpallete.com/logo.svg',
  sameAs: [
    'https://twitter.com/colorzpallete',
    'https://github.com/colorzpallete',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    availableLanguage: 'English',
  },
});

// Breadcrumb schema generator
export const getBreadcrumbSchema = (breadcrumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});
