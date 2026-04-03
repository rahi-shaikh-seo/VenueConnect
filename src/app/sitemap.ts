import { MetadataRoute } from 'next';
import { citiesData } from '@/lib/citiesData';
import { 
  VENUE_CATEGORIES, 
  VENDOR_CATEGORIES, 
  EVENT_TYPES, 
  SEO_PRIORITY_CATEGORIES,
  NEAR_ME_PATTERN
} from '@/lib/seoConstants';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://venueconnect.in';

  // 1. Static Core Pages
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/cities',
    '/blog',
    '/faqs',
    '/privacy',
    '/terms',
    '/list-business',
    '/list-venue',
    '/list-vendor',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 1.0,
  }));

  // 2. City-wide Category Pages (Cities x Categories)
  // Standard categories (Venue + Vendor + Event)
  const allCategories = [...VENUE_CATEGORIES, ...VENDOR_CATEGORIES, ...EVENT_TYPES];
  const cityCategoryPages: MetadataRoute.Sitemap = [];
  
  citiesData.forEach((city) => {
    // 2.1 Standard City + Category (Standard SEO)
    allCategories.forEach((cat) => {
      cityCategoryPages.push({
        url: `${baseUrl}/${city.slug}/${cat}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      });
    });

    // 2.2 Near Me Pages (Cities x Core Categories)
    SEO_PRIORITY_CATEGORIES.forEach((core) => {
      cityCategoryPages.push({
        url: `${baseUrl}/${core.slug}-near-me-in-${city.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      });
    });

    // 2.3 Hyper-Local Pages (Cities x Localities x Core Categories)
    if (city.localities) {
      city.localities.forEach((locality) => {
        SEO_PRIORITY_CATEGORIES.forEach((core) => {
          cityCategoryPages.push({
            url: `${baseUrl}/${city.slug}/${locality}/${core.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
          });
        });
      });
    }
  });

  return [...staticPages, ...cityCategoryPages];
}
