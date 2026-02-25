/**
 * SEO Schema Markup Configuration
 * Centralized structured data for JSON-LD implementation
 * 
 * Usage:
 * import { getSchemaMarkup } from './seoSchemaConfig'
 * const schema = getSchemaMarkup('organization')
 */

export const SITE_CONFIG = {
  name: 'ColorzPallete',
  url: 'https://colorzpallete.com',
  description: 'Professional UI color system generator with 100+ pre-built palettes and custom token exports.',
  logo: 'https://colorzpallete.com/logo.svg',
  ogImage: 'https://colorzpallete.com/og-image.jpg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterHandle: '@colorzpallete',
  twitterCreator: '@colorzpallete',
  email: 'team@colorzpallete.com',
};

export const SCHEMAS = {
  /**
   * Organization Schema
   * Identifies your website as an organization
   */
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    logo: SITE_CONFIG.logo,
    sameAs: [
      'https://twitter.com/colorzpallete',
      'https://github.com/colorzpallete',
      'https://linkedin.com/company/colorzpallete',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: SITE_CONFIG.email,
      availableLanguage: 'en',
    },
  },

  /**
   * WebApplication Schema
   * Identifies the site as a web application
   */
  webApplication: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    applicationCategory: 'DesignApplication',
    inLanguage: 'en-US',
    screenshot: SITE_CONFIG.ogImage,
    image: SITE_CONFIG.ogImage,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    creator: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  },

  /**
   * Breadcrumb Schema
   * Factory function for generating breadcrumb list schema
   */
  breadcrumbList: (items) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),

  /**
   * Product Schema
   * Factory function for individual palette products
   */
  product: (palette) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: palette.name,
    description: palette.description,
    image: palette.previewImage || SITE_CONFIG.ogImage,
    brand: {
      '@type': 'Brand',
      name: SITE_CONFIG.name,
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_CONFIG.url}/?palette=${palette.id}`,
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: palette.likes ? {
      '@type': 'AggregateRating',
      ratingValue: palette.likes,
      ratingCount: palette.likes,
    } : undefined,
    keywords: palette.tags ? palette.tags.join(', ') : '',
  }),

  /**
   * CollectionPage Schema
   * For category/collection pages
   */
  collectionPage: (title, description, itemCount) => ({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description: description,
    url: SITE_CONFIG.url,
    creator: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
    },
    aggregateOffer: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: '0',
      highPrice: '0',
      offerCount: itemCount,
    },
  }),

  /**
   * FAQPage Schema
   * For frequently asked questions
   */
  faqPage: (faqs) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }),

  /**
   * SoftwareApplication Schema
   * For tool/application descriptions
   */
  softwareApplication: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_CONFIG.name,
    applicationCategory: 'DesignApplication',
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    operatingSystem: 'Web Browser',
    inLanguage: 'en',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  },

  /**
   * LocalBusiness Schema (if applicable)
   */
  localBusiness: {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    logo: SITE_CONFIG.logo,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: SITE_CONFIG.email,
    },
  },
};

/**
 * Get specific schema markup
 * @param {string} type - Schema type (organization, webApplication, etc.)
 * @param {any} params - Parameters for factory functions
 * @returns {object} Schema object
 */
export const getSchemaMarkup = (type, params = null) => {
  if (type === 'breadcrumbList' && params) {
    return SCHEMAS.breadcrumbList(params);
  }
  if (type === 'product' && params) {
    return SCHEMAS.product(params);
  }
  if (type === 'collectionPage' && params) {
    return SCHEMAS.collectionPage(params.title, params.description, params.itemCount);
  }
  if (type === 'faqPage' && params) {
    return SCHEMAS.faqPage(params);
  }
  return SCHEMAS[type] || null;
};

/**
 * Generate all recommended schemas for homepage
 */
export const getHomepageSchemas = () => [
  SCHEMAS.organization,
  SCHEMAS.webApplication,
];

/**
 * Generate schemas for a palette/product page
 */
export const getProductSchemas = (palette) => [
  SCHEMAS.organization,
  SCHEMAS.product(palette),
];

/**
 * Generate schemas for collection pages
 */
export const getCollectionSchemas = (title, description, itemCount) => [
  SCHEMAS.organization,
  SCHEMAS.collectionPage(title, description, itemCount),
];

export default SCHEMAS;
