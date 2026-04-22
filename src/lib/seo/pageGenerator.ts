import { createClient } from '@/lib/supabase/server';
import { buildSEOSlug, unslugify } from './slugify';

export interface SEOPageRow {
  id: string;
  slug: string;
  page_type: 'city' | 'area' | 'category';
  city_id: string | null;
  area_id: string | null;
  category_id: string | null;
  custom_content: Record<string, unknown> | null;
  last_generated: string;
  created_at: string;
  meta_title?: string;
  meta_description?: string;
}

/**
 * Looks up or creates an SEO page for the given category + city + optional area combo.
 *
 * @param categorySlug  e.g. "wedding-venues"
 * @param categoryId    UUID of the category row
 * @param citySlug      e.g. "ahmedabad"
 * @param cityId        UUID of the city location row
 * @param areaSlug      (optional) e.g. "navrangpura"
 * @param areaId        (optional) UUID of the area location row
 */
export async function generateSEOPage(
  categorySlug: string,
  categoryId: string | null,
  citySlug: string,
  cityId: string,
  areaSlug?: string,
  areaId?: string
): Promise<SEOPageRow | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  // Build the canonical slug for this page
  const slug = buildSEOSlug(categorySlug, citySlug, areaSlug);

  // Human-readable labels for meta copy
  const categoryLabel = unslugify(categorySlug);
  const locationLabel = areaSlug ? unslugify(areaSlug) : unslugify(citySlug);
  const cityLabel = unslugify(citySlug);

  // Build meta copy
  const meta_title = `Top ${categoryLabel} in ${locationLabel} | VenueConnect`;
  const meta_description =
    `Find the best ${categoryLabel} in ${locationLabel}, ${cityLabel}. ` +
    `Compare prices, read reviews, and book instantly on VenueConnect.`;

  // Upsert the SEO page to avoid duplicate key race conditions
  const { data: newPage, error } = await supabase
    .from('seo_pages')
    .upsert({
      slug,
      page_type: areaSlug ? 'area' : 'city',
      category_id: categoryId,
      city_id: cityId,
      area_id: areaId ?? null,
      custom_content: {
        meta_title,
        meta_description,
      },
      last_generated: new Date().toISOString(),
    }, { onConflict: 'slug' })
    .select()
    .single();

  if (error) {
    console.error('[generateSEOPage] Upsert failed:', error.message);
    return null;
  }

  return newPage as SEOPageRow;

  return newPage as SEOPageRow;
}

/**
 * Fetches an existing SEO page by its slug only (no write).
 */
export async function getSEOPageBySlug(slug: string): Promise<SEOPageRow | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from('seo_pages')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  return (data as SEOPageRow) ?? null;
}
