import { generateSEOContent, formatTitle } from "@/lib/seoContentEngine";
import { createClient } from "@/lib/supabase/server";
import { MapPin, Star, ArrowRight, ChevronRight, Sparkles, Navigation, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from 'next';
import Image from 'next/image';
import SEODirectQuoteForm from "@/components/SEODirectQuoteForm";
import { notFound } from "next/navigation";
import { citiesData } from '@/lib/citiesData';
import { VENUE_CATEGORIES, VENDOR_CATEGORIES, EVENT_TYPES, SEO_PRIORITY_CATEGORIES } from '@/lib/seoConstants';

interface PageProps {
  params: Promise<{
    seoSegments: string[];
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { seoSegments } = await params;
  const baseUrl = "https://venueconnect.in";
  
  const parsed = parseSegments(seoSegments);
  if (!parsed) return { title: "Not Found" };

  const data = generateSEOContent(
    baseUrl, 
    parsed.citySlug, 
    parsed.categorySlug, 
    parsed.localitySlug, 
    undefined, 
    parsed.isNearMe
  );
  
  const canonicalPath = seoSegments.join('/');
  
  return {
    title: data.title,
    description: data.description,
    alternates: {
      canonical: `${baseUrl}/${canonicalPath}`,
    },
  };
}

function parseSegments(segments: string[]) {
  if (segments.length === 1) {
    const s = segments[0];
    if (s.includes('-near-me-in-')) {
      const [categoryPart, citySlug] = s.split('-near-me-in-');
      return { 
        citySlug, 
        categorySlug: categoryPart, 
        isNearMe: true, 
        localitySlug: undefined 
      };
    }
    return null;
  }

  if (segments.length === 2) {
    return { 
      citySlug: segments[0], 
      categorySlug: segments[1], 
      isNearMe: false, 
      localitySlug: undefined 
    };
  }

  if (segments.length === 3) {
    return { 
      citySlug: segments[0], 
      localitySlug: segments[1], 
      categorySlug: segments[2], 
      isNearMe: false 
    };
  }

  return null;
}

export default async function ConsolidatedSEOPage({ params }: PageProps) {
  const { seoSegments } = await params;
  const parsed = parseSegments(seoSegments);
  
  if (!parsed) {
    notFound();
  }

  const { citySlug, categorySlug, localitySlug, isNearMe } = parsed;
  const baseUrl = "https://venueconnect.in";
  const data = generateSEOContent(baseUrl, citySlug, categorySlug, localitySlug, undefined, isNearMe);
  const supabase = await createClient();

  const tableName = categorySlug.includes('photographer') || categorySlug.includes('makeup') ? "vendors" : "venues";
  const cityTitle = formatTitle(citySlug);
  const catSearch = categorySlug.replace(/-/g, ' ');

  let query = supabase.from(tableName).select('*').ilike('city', `%${cityTitle}%`).eq('is_approved', true);
  
  if (localitySlug) {
    const localityTitle = formatTitle(localitySlug);
    query = query.ilike('address', `%${localityTitle}%`);
  }

  if (tableName === 'vendors') {
    query = query.ilike('category', `%${catSearch}%`);
  } else {
    query = query.ilike('type', `%${catSearch}%`);
  }

  const { data: listings } = await query.limit(10);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: data.faqSchema }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: data.breadcrumbSchema }}
      />
      {data.webPageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: data.webPageSchema }}
        />
      )}
      {data.localBusinessSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data.localBusinessSchema) }}
        />
      )}

      <div className="min-h-screen flex flex-col font-sans">
        <div className="bg-slate-50 border-b border-slate-200 py-3 hidden md:block">
          <div className="container mx-auto px-4 flex items-center text-sm text-slate-500">
            {data.breadcrumbs.map((crumb, i) => (
              <div key={i} className="flex items-center">
                {i > 0 && <ChevronRight className="w-4 h-4 mx-2" />}
                <Link href={crumb.item} className={`${i === data.breadcrumbs.length - 1 ? 'text-slate-900 font-medium' : 'hover:text-primary transition-colors'}`}>
                  {crumb.name}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <header className="relative py-24 md:py-32 overflow-hidden bg-slate-900">
          <div className="absolute inset-0">
            <Image 
              src={data.cityImage} 
              alt={`Best ${formatTitle(categorySlug)} in ${cityTitle}`} 
              fill
              className="object-cover opacity-30"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary-foreground text-sm font-medium mb-6">
              {isNearMe ? <Navigation className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
              {localitySlug ? `${formatTitle(localitySlug)}, ${cityTitle}` : cityTitle}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight font-display">
              {data.h1}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto font-light">
              {data.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-medium h-14 px-8 rounded-full shadow-lg shadow-primary/20 text-lg group" asChild>
                <Link href="/venues">Get Free Quotes <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 py-16 md:py-24 bg-slate-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid lg:grid-cols-3 gap-12">
              
              <div className="lg:col-span-2">
                <div className="mb-10 bg-white rounded-3xl p-6 border-l-8 border-primary shadow-sm">
                  <h2 className="text-sm font-black text-primary mb-3 flex items-center gap-2 uppercase tracking-widest">
                    <Sparkles className="w-4 h-4" /> Local Intelligence Summary
                  </h2>
                  <div className="text-slate-700 leading-relaxed italic text-lg" dangerouslySetInnerHTML={{ __html: data.content }} />
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 border-l-4 border-primary pl-4 py-1 font-display">
                  Handpicked {formatTitle(categorySlug)} {isNearMe ? 'Near You' : `in ${localitySlug ? formatTitle(localitySlug) : cityTitle}`}
                </h2>
                
                <div className="space-y-6">
                  {listings && listings.length > 0 ? (
                    listings.map((listing) => (
                      <div key={listing.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 items-start md:items-center hover:border-primary/30 transition-all text-left">
                        <div className="relative w-full md:w-48 h-32 bg-slate-100 rounded-xl flex-shrink-0 overflow-hidden">
                          <Image 
                            src={listing.image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80"} 
                            alt={`${listing.name} — ${formatTitle(categorySlug)} in ${cityTitle}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 192px"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-900 hover:text-primary transition-colors font-display">
                             <Link href={`/${tableName}/${listing.id}`}>{listing.name}</Link>
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-slate-600 mt-2 mb-4">
                            <span className="flex items-center text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded">
                              <Star className="w-4 h-4 fill-amber-500 mr-1" /> {listing.rating || 4.5}
                            </span>
                            <span className="capitalize"><MapPin className="w-4 h-4 inline mr-1" />{listing.address || listing.location}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 text-left">
                               <CheckCircle2 className="w-4 h-4 text-green-500" />
                               <span className="text-slate-600 text-[10px] font-bold uppercase">Verified Listing</span>
                          </div>
                        </div>
                        <div className="w-full md:w-auto">
                          <Link href={`/${tableName}/${listing.id}`}>
                             <Button className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 px-6">View Details</Button>
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center bg-white border border-dashed border-slate-300 rounded-3xl text-slate-500 text-sm">
                      No verified results found for <strong>{formatTitle(categorySlug)}</strong> in <strong>{cityTitle}</strong>. 
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200 border border-slate-100 sticky top-24">
                  <h3 className="text-2xl font-black text-slate-900 mb-2 font-display text-left">Direct Quote</h3>
                  <p className="text-slate-500 text-sm mb-6 text-left">Receive quotes from the top {formatTitle(categorySlug).toLowerCase()} in {citySlug} instantly.</p>
                  <div className="space-y-4">
                    <SEODirectQuoteForm city={cityTitle} category={formatTitle(categorySlug)} />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const params: { seoSegments: string[] }[] = [];

  citiesData.forEach((city) => {
    // City + Category pages (2-segment)
    [...VENUE_CATEGORIES, ...VENDOR_CATEGORIES, ...EVENT_TYPES].forEach((cat) => {
      params.push({ seoSegments: [city.slug, cat] });
    });

    // Near Me pages (1-segment)
    SEO_PRIORITY_CATEGORIES.forEach((core) => {
      params.push({ seoSegments: [`${core.slug}-near-me-in-${city.slug}`] });
    });

    // Hyper-local pages (3-segment)
    if (city.localities) {
      city.localities.forEach((locality) => {
        SEO_PRIORITY_CATEGORIES.forEach((core) => {
          params.push({ seoSegments: [city.slug, locality, core.slug] });
        });
      });
    }
  });

  return params;
}
