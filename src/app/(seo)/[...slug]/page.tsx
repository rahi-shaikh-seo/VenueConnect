import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Star, ArrowRight, Building2, Sparkles, ChevronRight, CheckCircle2, Phone, MessageCircle, Info, IndianRupee, Users2, Building, Store, ShieldCheck, Clock, Eye, Heart, PencilLine, Share2 } from 'lucide-react';

import { createClient } from '@/lib/supabase/server';
import { getSEOPageBySlug, generateSEOPage, type SEOPageRow } from '@/lib/seo/pageGenerator';
import { buildMetadata, buildMetadataFromSlugs } from '@/lib/seo/metaBuilder';
import { unslugify } from '@/lib/seo/slugify';
import { sanitizeHTML } from '@/lib/sanitize';
import ListingFilter from '@/components/ListingFilter';
import { VENUE_TYPES, VENDOR_TYPES, GUJARAT_CITIES } from "@/lib/constants";
import SEOCollectionView from '@/components/seo/SEOCollectionView';
import { SEOVendorHubView } from '@/components/seo/SEOVendorHubView';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { RelatedSearches } from '@/components/seo/RelatedSearches';

// Components for listing detail view
import VenueGallery from "@/components/listing/VenueGallery";
import ListingHeaderActions from "@/components/listing/ListingHeaderActions";
import ListingDescription from "@/components/listing/ListingDescription";
import { QuickInfoBar, PricingDetails, AmenitiesGrid, SpacesCapacity, CateringPolicy, LocationMap } from "@/components/listing/VenueSections";
import { VendorQuickStats, VendorServices, VendorPortfolio, VendorServiceAreas } from "@/components/listing/VendorSections";
import ReviewsList from "@/components/ReviewsList";
import GetQuoteModal from "@/components/GetQuoteModal";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function slugifyPathSegment(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '-');
}

// Venue category slugs from categories table + common aliases
const VENUE_CATEGORY_SLUGS = new Set([
  'banquet-halls', 'banquet-hall', 'farmhouse', 'farmhouses',
  'hotels', 'hotel', 'resorts', 'resort',
  'party-plots', 'party-plot',
  'wedding-venues', 'wedding-venue',
  'lawn', 'lawns', 'convention-centre', 'convention-centers',
  'venues', // generic
]);

// All vendor slugs from VENDOR_TYPES + common aliases used in UI
const VENDOR_CATEGORY_SLUGS = new Set([
  'photography', 'photographers', 'photographer', 'wedding-photographers',
  'catering', 'caterers', 'caterer',
  'decorators', 'decorator', 'decoration',
  'makeup-and-hair', 'makeup', 'makeup-artists', 'makeup-artist',
  'mehendi', 'mehndi', 'mehendi-artists', 'mehndi-artists', 'mehendi-artist', 'mehndi-artist',
  'dj', 'djs', 'disc-jockeys',
  'videography', 'videographers', 'videographer',
  'pandit', 'pandits',
  'astrologers', 'astrologer',
  'jewellery', 'jewelry', 'jewellers', 'jeweller',
  'bands', 'band', 'music-band',
  'anchor', 'anchors',
  'choreography', 'choreographers', 'choreographer',
  'sounds-led-and-lights',
  'transportation',
  'wedding-cake', 'cakes', 'cake',
  'return-gift', 'gifts', 'gift',
  'invitation-wedding-card', 'invitations', 'invitation',
  'hathi-ghoda-and-car',
  'event-planners', 'event-planner', 'planners', 'planner', 'wedding-planners', 'wedding-planner',
  'florists', 'florist',
  'tent-houses', 'tent-house',
  'magicians', 'magician',
  'entertainers', 'entertainer',
  'all-vendors', 'vendors',
]);

function parseSlug(slugArr: string[]) {
  const rawSlug = slugArr.join('/');
  
  // Keywords Identification
  const FOOD_TYPES = ['veg', 'non-veg', 'pure-veg'];
  const CITY_SLUGS = GUJARAT_CITIES.map(c => c.toLowerCase());

  // 1 Segment: /[city] or /[category]
  if (slugArr.length === 1) {
    const s = slugArr[0].toLowerCase();
    if (VENDOR_CATEGORY_SLUGS.has(s)) {
        return { categorySlug: s, citySlug: 'all', isVendorSearch: true, isGlobal: true, rawSlug };
    }
    if (VENUE_CATEGORY_SLUGS.has(s)) {
        return { categorySlug: s, citySlug: 'all', isGlobal: true, rawSlug };
    }
    // Fallback: it's a city page /[city]
    return { citySlug: s, categorySlug: 'venues', rawSlug };
  }
  
  // 2 Segments: /[city]/[category] or /[city]/[property-slug]
  if (slugArr.length === 2) {
    const city = slugArr[0].toLowerCase();
    const item = slugArr[1].toLowerCase();
    
    // Explicit /all/vendors handling
    if (city === 'all' && (item === 'vendors' || item === 'all-vendors')) {
        return { citySlug: 'all', categorySlug: 'vendors', isVendorSearch: true, isGlobal: true, rawSlug };
    }

    if (FOOD_TYPES.includes(item)) {
        return { citySlug: city, categorySlug: 'venues', foodTypeSlug: item, rawSlug };
    }
    
    // Explicit vendor category slug → mark as vendor search
    if (VENDOR_CATEGORY_SLUGS.has(item)) {
        return { citySlug: city, categorySlug: item, isVendorSearch: true, rawSlug };
    }

    // Explicit venue category slug → venue search
    if (VENUE_CATEGORY_SLUGS.has(item)) {
        return { citySlug: city, categorySlug: item, isVendorSearch: false, rawSlug };
    }
    
    // Could be a venue/vendor property slug — check DB (handled downstream)
    return { citySlug: city, categorySlug: slugArr[1], isVendorSearch: false, rawSlug };
  }

  // 3 Segments: /[city]/vendors/[vendor-type] or /[city]/[area]/[category]
  if (slugArr.length === 3) {
    const [city, mid, last] = slugArr;
    if (mid === 'vendors') {
        return { citySlug: city, categorySlug: last, isVendorSearch: true, isVendorSlugPath: true, rawSlug };
    }
    
    if (FOOD_TYPES.includes(mid)) {
        return { citySlug: city, categorySlug: last, foodTypeSlug: mid, rawSlug };
    }

    return { citySlug: city, areaSlug: mid, categorySlug: last, rawSlug };
  }
  
  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: slugArr } = await params;
  const parsed = parseSlug(slugArr);
  if (!parsed) return {};

  const supabase = await createClient();
  // Check for listing first
  const { data: listing } = await supabase.from('venues').select('name, city, description, image').eq('slug', parsed.categorySlug).maybeSingle();
  if (listing) {
      return {
          title: `${listing.name} - ${listing.city} | VenueConnect`,
          description: listing.description?.slice(0, 160) || `Check out ${listing.name} in ${listing.city}.`,
      };
  }

  const page = await getSEOPageBySlug(parsed.rawSlug);
  if (page) return buildMetadata(page);
  return buildMetadataFromSlugs(parsed.categorySlug, parsed.citySlug);
}

export default async function TopLevelRouter({ params, searchParams }: PageProps) {
  const { slug: slugArr } = await params;
  const sParams = await searchParams;
  const parsed = parseSlug(slugArr);
  if (!parsed) return notFound();

  let { categorySlug, citySlug, rawSlug, areaSlug, isVendorSearch } = parsed;
  const supabase = await createClient();

  // 1. IS IT A VENUE? (Check 2-segment slug if it's potentially a property)
  if (slugArr.length === 2) {
    const { data: venue } = await supabase
        .from('venues')
        .select('*')
        .ilike('slug', categorySlug)
        .maybeSingle();

    if (venue) {
        const { data: profile } = venue.owner_id 
            ? await supabase.from('profiles').select('phone_number, full_name').eq('id', venue.owner_id).maybeSingle()
            : { data: null };
        return <VenueDetailView venue={{...venue, profiles: profile}} cityParam={citySlug} />;
    }

    // FALLBACK REDIRECT: If no exact match, try partial match for "old URLs"
    const { data: partialVenue } = await supabase
        .from('venues')
        .select('slug, city')
        .ilike('slug', `%${categorySlug}%`)
        .maybeSingle();

    if (partialVenue && partialVenue.slug !== categorySlug) {
        redirect(`/${partialVenue.city.toLowerCase()}/${partialVenue.slug}`);
    }
  }

  // 2. IS IT A VENDOR?
  const isVendorSlugPath = (parsed as any).isVendorSlugPath;
  if (slugArr.length === 2 || (isVendorSlugPath && slugArr.length === 3)) {
    const targetSlug = categorySlug;
    const { data: vendor } = await supabase
        .from('vendors')
        .select('*')
        .ilike('slug', targetSlug)
        .maybeSingle();

    if (vendor) {
        const { data: profile } = vendor.owner_id 
            ? await supabase.from('profiles').select('phone_number, full_name, email').eq('id', vendor.owner_id).maybeSingle()
            : { data: null };
        return <VendorDetailView vendor={{...vendor, profiles: profile}} cityParam={citySlug} />;
    }
    
    // If it was a 3-segment path /city/vendors/something but NO vendor found, it could be a category.
    // We continue below.
  }

  // 3. IS IT AN SEO PAGE OR CATEGORY?
  const [seoPage, catRow, cityRow] = await Promise.all([
    getSEOPageBySlug(rawSlug),
    supabase.from('categories').select('id, type').ilike('slug', categorySlug).maybeSingle().then(r => r.data),
    supabase.from('locations').select('id').ilike('city_slug', citySlug).maybeSingle().then(r => r.data),
  ]);

  // FALLBACK: If 2 segments and NONE of the above matched, it's likely an area!
  let forcedArea = areaSlug;
  let finalCategory = categorySlug;
  let forcedSpaceType = (parsed as any).spaceTypeSlug;
  let forcedFoodType = (parsed as any).foodTypeSlug;

  // Refine vendor detection using our canonical sets
  isVendorSearch = isVendorSearch || isVendorSlugPath || catRow?.type === 'vendor' || VENDOR_CATEGORY_SLUGS.has(categorySlug.toLowerCase()) || categorySlug.toLowerCase() === 'vendors';

  // Only treat 2nd segment as area if it's genuinely not a known category
  if (slugArr.length === 2 && !seoPage && !catRow
      && !VENUE_CATEGORY_SLUGS.has(categorySlug.toLowerCase())
      && !VENDOR_CATEGORY_SLUGS.has(categorySlug.toLowerCase())
      && categorySlug !== 'venues' && categorySlug !== 'vendors'
      && !forcedFoodType && !isVendorSearch) {
      forcedArea = categorySlug; // Treat 2nd segment as area
      finalCategory = 'venues';  // Show all venues for that area
  }

  const finalSeoPage = seoPage || (cityRow ? await generateSEOPage(finalCategory, catRow?.id ?? null, citySlug, cityRow.id) : null);

  // FETCH BOTH FOR ALL COLLECTIONS (Omni-Discovery)
  const [venues, vendors] = await Promise.all([
    fetchVenues(finalCategory, citySlug, sParams, catRow?.id || finalSeoPage?.category_id, forcedArea, forcedSpaceType, forcedFoodType),
    fetchVendors(finalCategory, citySlug, sParams, catRow?.id || finalSeoPage?.category_id, forcedArea)
  ]);

    // 4. RENDER VENDOR HUB (If exactly [city]/vendors - Skip for 'all' to show directory list)
    if (slugArr.length === 2 && categorySlug.toLowerCase() === 'vendors' && citySlug.toLowerCase() !== 'all') {
        return (
            <SEOVendorHubView 
                citySlug={citySlug}
                locationLabel={unslugify(citySlug)}
                vendors={vendors}
            />
        );
    }

   return <SEOCollectionView 
      seoPage={finalSeoPage} 
      venues={venues} 
      vendors={vendors} 
      categorySlug={finalCategory} 
      citySlug={citySlug} 
      areaSlug={forcedArea}
      spaceType={forcedSpaceType}
      foodType={forcedFoodType}
      isVendorContext={isVendorSearch}
      rawSlug={rawSlug} 
      sParams={sParams} 
   />;
}

// ─── PARTIAL VIEWS ────────────────────────────────────────────────────────────

function VenueDetailView({ venue, cityParam }: { venue: any, cityParam: string }) {
  const images = venue.images && venue.images.length > 0 ? venue.images : [venue.image].filter(Boolean);
  
  return (
    <div className="min-h-screen bg-white">
        {/* TOP LEVEL BREADCRUMB */}
        <div className="bg-white border-b border-slate-50 md:border-none">
            <div className="max-w-[1300px] mx-auto px-4 md:px-6 py-3 md:py-4">
                <nav className="flex flex-wrap items-center gap-1.5 text-[11px] md:text-[13px] font-medium text-[#777]">
                    <Link href="/" className="hover:text-primary">Home</Link>
                    <span className="text-slate-300">/</span>
                    <Link href={`/${cityParam.toLowerCase()}`} className="hover:text-primary">{unslugify(cityParam)}</Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-900 font-bold line-clamp-1">{venue.name}</span>
                </nav>
            </div>
        </div>

        {/* HERO GRID */}
        <div className="max-w-[1300px] mx-auto px-0 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 md:gap-8">
                
                {/* LEFT: GALLERY SLIDER */}
                <div className="lg:col-span-8">
                    <VenueGallery images={images} name={venue.name} />
                    
                    {/* AUTHORITY INFO */}
                    <div className="mt-6 px-4 md:px-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                                {venue.name}
                            </h1>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 px-2 py-1 rounded bg-amber-500 text-white">
                                    <Star size={12} className="fill-current" />
                                    <span className="text-[12px] font-bold">4.2</span>
                                </div>
                                <span className="text-[12px] text-slate-500 font-bold">(12 reviews)</span>
                            </div>
                        </div>

                        {/* META BAR - Optimized for Mobile Wrapping */}
                        <div className="flex flex-wrap items-center gap-y-4 gap-x-6 mb-8 pb-8 border-b border-slate-100">
                            <div className="flex items-center gap-2 text-slate-600">
                                <Building size={16} className="text-primary/60" /> 
                                <span className="text-[13px] font-bold">Banquet Hall</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                                <Users2 size={16} className="text-primary/60" /> 
                                <span className="text-[13px] font-bold">{venue.min_capacity || 50}-{venue.max_capacity || 500} Guests</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                                <Eye size={16} className="text-primary/60" /> 
                                <span className="text-[13px] font-bold">2.4k Views</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 cursor-pointer hover:text-primary transition-colors">
                                <Heart size={16} /> 
                                <span className="text-[13px] font-bold">Shortlist</span>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-slate-900 font-bold hover:bg-slate-200 transition-all ml-auto text-xs">
                                <PencilLine size={14} /> Write Review
                            </button>
                        </div>

                        {/* PRICING & LOCATION */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center justify-between md:justify-start gap-4 p-4 bg-green-50/50 rounded-2xl border border-green-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                                        <p className="text-[13px] font-black text-slate-600 uppercase tracking-wider">Veg Plate</p>
                                    </div>
                                    <p className="text-lg font-black text-slate-900">₹{venue.veg_price_per_plate || '750'}</p>
                                </div>
                                <div className="flex items-center justify-between md:justify-start gap-4 p-4 bg-red-50/50 rounded-2xl border border-red-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,62,54,0.4)]" />
                                        <p className="text-[13px] font-black text-slate-600 uppercase tracking-wider">Non-Veg Plate</p>
                                    </div>
                                    <p className="text-lg font-black text-slate-900">₹{venue.non_veg_price_per_plate || '950'}</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="text-primary shrink-0 mt-1" size={20} />
                                        <div>
                                            <p className="text-[15px] font-bold text-slate-900">{venue.location || venue.area}, {venue.city}</p>
                                            <p className="text-[13px] text-slate-500 font-medium mt-1 leading-relaxed">{venue.address}</p>
                                            <Link href="#location" className="inline-block mt-2 text-[12px] font-black text-primary uppercase tracking-widest hover:underline">View on Map</Link>
                                        </div>
                                    </div>
                                    <button className="w-full md:w-auto px-8 py-4 bg-primary text-white text-[13px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/25 hover:scale-105 transition-transform">
                                        Get Best Deal
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: ENQUIRY FORM */}
                <div className="lg:col-span-4 px-4 md:px-0 mt-10 md:mt-0">
                    <div className="sticky top-24">
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                            
                             <h3 className="text-xl font-black mb-8 leading-tight">
                                Check Availability & <br/><span className="text-primary italic">Request Prices</span>
                             </h3>
                             
                             <form className="space-y-4">
                                <div className="space-y-4">
                                    <select className="w-full h-14 bg-white/10 border border-white/10 rounded-2xl px-5 text-[13px] text-white font-bold focus:ring-2 focus:ring-primary focus:outline-none appearance-none cursor-pointer">
                                        <option className="text-slate-900">Select Occasion</option>
                                        <option className="text-slate-900">Wedding</option>
                                        <option className="text-slate-900">Engagement</option>
                                        <option className="text-slate-900">Birthday</option>
                                    </select>
                                    <input type="date" className="w-full h-14 bg-white/10 border border-white/10 rounded-2xl px-5 text-[13px] text-white font-bold" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="number" placeholder="Guests" className="w-full h-14 bg-white/10 border border-white/10 rounded-2xl px-5 text-[13px] text-white font-bold placeholder:text-white/40" />
                                        <select className="w-full h-14 bg-white/10 border border-white/10 rounded-2xl px-5 text-[13px] text-white font-bold appearance-none">
                                            <option className="text-slate-900">Budget</option>
                                        </select>
                                    </div>
                                    <input type="text" placeholder="Your Name" className="w-full h-14 bg-white/10 border border-white/10 rounded-2xl px-5 text-[13px] text-white font-bold placeholder:text-white/40" />
                                    <div className="flex gap-2">
                                        <div className="w-20 h-14 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center text-[13px] font-bold">+91</div>
                                        <input type="tel" placeholder="Mobile No." className="flex-grow h-14 bg-white/10 border border-white/10 rounded-2xl px-5 text-[13px] text-white font-bold placeholder:text-white/40" />
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 py-2">
                                    <div className="w-6 h-6 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
                                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                                    </div>
                                    <label className="text-[11px] font-bold text-white/70">Send venue details on WhatsApp</label>
                                </div>

                                <button className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black text-[14px] uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95">
                                    Send Enquiry
                                </button>
                             </form>

                             <div className="mt-8 flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg"><Phone size={20} /></div>
                                <div>
                                    <p className="text-[11px] font-black uppercase tracking-widest text-white/50">Call Expert</p>
                                    <p className="font-black text-lg">+91-9104841218</p>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* STICKY TABS */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm mt-12 overflow-hidden">
            <div className="max-w-[1300px] mx-auto px-4 flex items-center gap-6 md:gap-10 h-14 overflow-x-auto no-scrollbar scroll-smooth">
                {['Overview', 'Spaces', 'Prices', 'Amenities', 'Location', 'Reviews'].map((tab) => (
                    <Link key={tab} href={`#${tab.toLowerCase()}`} className="text-[11px] md:text-[12px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors whitespace-nowrap py-4 border-b-2 border-transparent hover:border-primary">
                        {tab}
                    </Link>
                ))}
            </div>
        </div>

        {/* BOTTOM CONTENT Discovery FEED */}
        <div className="max-w-[1300px] mx-auto px-4 md:px-6 mt-12 pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-20">
                    <section id="overview" className="scroll-mt-24"><ListingDescription description={venue.description} /></section>
                    <section id="spaces" className="scroll-mt-24"><SpacesCapacity venue={venue} /></section>
                    <section id="prices" className="scroll-mt-24"><PricingDetails venue={venue} /></section>
                    <section id="amenities" className="scroll-mt-24"><AmenitiesGrid venue={venue} /></section>
                    <section id="location" className="scroll-mt-24"><LocationMap venue={venue} /></section>
                    <section id="reviews" className="scroll-mt-24">
                        <ReviewsList listingId={venue.id} listingType="venue" />
                    </section>
                </div>
            </div>
        </div>
    </div>
  );
}

function VendorDetailView({ vendor, cityParam }: { vendor: any, cityParam: string }) {
  const images = vendor.images && vendor.images.length > 0 ? vendor.images : [vendor.image].filter(Boolean);
  const isApproved = vendor.is_approved === true || vendor.is_verified === true;

  return (
    <div className="min-h-screen bg-slate-50/30">
        {/* BREADCRUMBS */}
        <div className="bg-white border-b border-slate-100">
            <div className="max-w-[1300px] mx-auto px-4 md:px-6 py-3">
                <nav className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <Link href="/" className="hover:text-primary">Home</Link><ChevronRight className="w-3 h-3" />
                    <Link href={`/${cityParam}`} className="hover:text-primary">{unslugify(cityParam)}</Link><ChevronRight className="w-3 h-3" />
                    <Link href={`/${cityParam}/vendors`} className="hover:text-primary">Vendors</Link><ChevronRight className="w-3 h-3" />
                    <span className="text-slate-900 truncate">{vendor.name}</span>
                </nav>
            </div>
        </div>

        <div className="max-w-[1300px] mx-auto px-4 md:px-6 py-6 md:py-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
                
                {/* LEFT: GALLERY & INFO */}
                <div className="lg:col-span-8 space-y-6 md:space-y-10">
                    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
                        <VenueGallery images={images} name={vendor.name} />
                        <div className="p-6 md:p-8">
                             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h1 className="text-2xl md:text-4xl font-black text-slate-950 leading-tight mb-2">{vendor.name}</h1>
                                    <div className="flex items-center gap-3">
                                        <p className="text-[12px] md:text-sm font-bold text-slate-400 flex items-center gap-1.5">
                                            <MapPin size={14} className="text-primary"/> {vendor.location || vendor.address || vendor.city}
                                        </p>
                                        <Badge className="bg-green-500/10 text-green-600 border-none font-bold uppercase tracking-widest text-[9px]">Verified Pro</Badge>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl self-start md:self-center">
                                    <Star size={18} className="fill-yellow-400 text-yellow-400" />
                                    <span className="text-xl font-black text-slate-900">{vendor.rating || '4.8'}</span>
                                    <span className="text-slate-400 font-bold text-sm">({vendor.reviews || 24} Reviews)</span>
                                </div>
                             </div>

                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-slate-50">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Starting Price</p>
                                    <p className="text-lg font-black text-slate-900">₹{vendor.starting_price || '5,000'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Category</p>
                                    <p className="text-lg font-black text-slate-900">{vendor.category || 'Professional'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Response Time</p>
                                    <p className="text-lg font-black text-slate-900">2-4 Hours</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Exp.</p>
                                    <p className="text-lg font-black text-slate-900">5+ Years</p>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* DETAILS SECTIONS */}
                    <div className="space-y-12 bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-sm">
                        <section id="about" className="scroll-mt-24">
                            <h3 className="text-xl font-black text-slate-950 mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-8 bg-primary rounded-full" /> About {vendor.name}
                            </h3>
                            <ListingDescription description={vendor.description || `Professional ${vendor.category || 'vendor'} providing premium services in ${cityParam}.`} />
                        </section>

                        <section id="pricing" className="scroll-mt-24">
                            <h3 className="text-xl font-black text-slate-950 mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-8 bg-primary rounded-full" /> Package & Pricing
                            </h3>
                            <VendorQuickStats vendor={vendor} />
                        </section>

                        <section id="contact" className="scroll-mt-24">
                            <h3 className="text-xl font-black text-slate-950 mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-8 bg-primary rounded-full" /> Contact & Location
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm"><Phone size={18}/></div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Phone</p>
                                            <p className="text-sm font-black text-slate-900">+91 98XXX XXXX</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm"><MessageCircle size={18}/></div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Email</p>
                                            <p className="text-sm font-black text-slate-900">contact@{vendor.slug}.com</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-3">Address</p>
                                    <p className="text-sm font-bold text-slate-600 leading-relaxed">{vendor.address || `${vendor.location}, ${vendor.city}, Gujarat`}</p>
                                </div>
                            </div>
                        </section>

                        <section id="reviews" className="scroll-mt-24 pt-4 border-t border-slate-50">
                             <ReviewsList listingId={vendor.id} listingType="vendor" />
                        </section>
                    </div>
                </div>

                {/* RIGHT: ENQUIRY FORM */}
                <div className="lg:col-span-4 lg:sticky lg:top-24">
                    <div className="bg-slate-950 rounded-[2.5rem] p-6 md:p-10 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                        
                        <h3 className="text-xl md:text-2xl font-black mb-2">Check Availability</h3>
                        <p className="text-white/50 text-xs md:text-sm font-bold mb-8 uppercase tracking-widest">Send inquiry to {vendor.name}</p>
                        
                        <form className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-[2px] text-white/40 ml-1">Full Name</label>
                                <input type="text" placeholder="Your Name" className="w-full h-12 md:h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-[2px] text-white/40 ml-1">Email</label>
                                    <input type="email" placeholder="Email" className="w-full h-12 md:h-14 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-[2px] text-white/40 ml-1">Mobile</label>
                                    <input type="tel" placeholder="Mobile" className="w-full h-12 md:h-14 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-[2px] text-white/40 ml-1">Event Date</label>
                                    <input type="date" className="w-full h-12 md:h-14 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all [color-scheme:dark]" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-[2px] text-white/40 ml-1">Event Type</label>
                                    <select className="w-full h-12 md:h-14 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm focus:ring-2 focus:ring-primary outline-none appearance-none transition-all">
                                        <option className="bg-slate-900">Wedding</option>
                                        <option className="bg-slate-900">Reception</option>
                                        <option className="bg-slate-900">Engagement</option>
                                        <option className="bg-slate-900">Birthday</option>
                                        <option className="bg-slate-900">Corporate</option>
                                    </select>
                                </div>
                            </div>

                            <div className="py-4 space-y-4">
                                <label className="flex items-start gap-3 group cursor-pointer">
                                    <input type="checkbox" className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-offset-slate-900" />
                                    <span className="text-[11px] md:text-xs font-bold text-white/60 group-hover:text-white transition-colors">Do you also need a venue for your event?</span>
                                </label>
                                <label className="flex items-start gap-3 group cursor-pointer">
                                    <input type="checkbox" className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-offset-slate-900" />
                                    <span className="text-[11px] md:text-xs font-bold text-white/60 group-hover:text-white transition-colors">Share my details on WhatsApp for quick response</span>
                                </label>
                                <label className="flex items-start gap-3 group cursor-pointer">
                                    <input type="checkbox" className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-offset-slate-900" />
                                    <span className="text-[11px] md:text-xs font-bold text-white/60 group-hover:text-white transition-colors">Share proposals from similar vendors for my event</span>
                                </label>
                            </div>

                            <button className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-xl shadow-primary/30 transform hover:-translate-y-1 active:scale-95 transition-all uppercase tracking-widest text-[11px] md:text-xs">
                                Send Inquiry Now
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary"><ShieldCheck size={24}/></div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Trusted Partner</p>
                                <p className="text-xs font-bold text-white/80 leading-none">Direct quote from official vendor</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* BOTTOM CONTENT Discovery FEED */}
        <div className="max-w-[1300px] mx-auto px-4 md:px-6 mt-12 pb-10 md:pb-24 overflow-hidden">
            <div className="space-y-16">
                 {/* Event Planning inspiration */}
                 <section className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-sm overflow-hidden">
                    <div className="mb-6 md:mb-10">
                        <h2 className="text-xl md:text-2xl font-black text-slate-950 mb-1">Event Planning Inspiration & Ideas</h2>
                        <p className="text-primary font-bold text-[12px] md:text-sm">Latest trends and professional advice for your big day</p>
                    </div>

                    {/* Desktop: Continuous Seamless Rotation */}
                    <div className="hidden md:block relative">
                        <div className="flex gap-6 animate-infinite-scroll hover:[animation-play-state:paused]">
                            {[
                                { title: 'Choosing the Perfect Catering Menu', img: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800' },
                                { title: 'Top 10 Wedding Photography Trends 2026', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800' },
                                { title: 'How to Budget for Your Special Event', img: 'https://images.unsplash.com/photo-1454165833767-131438967468?w=800' },
                                { title: 'Modern Floral Decor for Receptions', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800' },
                                { title: 'Creative Lighting for Outdoor Parties', img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800' },
                                { title: 'Finding the Right Entertainment', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800' },
                                // Duplicate for seamless loop
                                { title: 'Choosing the Perfect Catering Menu', img: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800' },
                                { title: 'Top 10 Wedding Photography Trends 2026', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800' },
                                { title: 'How to Budget for Your Special Event', img: 'https://images.unsplash.com/photo-1454165833767-131438967468?w=800' },
                                { title: 'Modern Floral Decor for Receptions', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800' },
                                { title: 'Creative Lighting for Outdoor Parties', img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800' },
                                { title: 'Finding the Right Entertainment', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800' }
                            ].map((b, i) => (
                                <div key={i} className="min-w-[300px] group cursor-pointer">
                                    <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-3 border border-slate-50 shadow-sm">
                                        <img src={b.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                    </div>
                                    <h4 className="font-black text-sm text-slate-800 group-hover:text-primary transition-colors leading-tight line-clamp-2 px-1">{b.title}</h4>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile: 2 Visible + Horizontal Scroll */}
                    <div className="md:hidden flex overflow-x-auto gap-4 no-scrollbar snap-x">
                        {[
                            { title: 'Choosing the Perfect Catering Menu', img: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800' },
                            { title: 'Top 10 Wedding Photography Trends 2026', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800' },
                            { title: 'How to Budget for Your Special Event', img: 'https://images.unsplash.com/photo-1454165833767-131438967468?w=800' },
                            { title: 'Modern Floral Decor for Receptions', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800' },
                            { title: 'Creative Lighting for Outdoor Parties', img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800' },
                            { title: 'Finding the Right Entertainment', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800' }
                        ].map((b, i) => (
                            <div key={i} className="min-w-[70%] snap-start group cursor-pointer">
                                <div className="aspect-video rounded-2xl overflow-hidden mb-3 border border-slate-100">
                                    <img src={b.img} className="w-full h-full object-cover" alt="" />
                                </div>
                                <h4 className="font-black text-[13px] text-slate-900 leading-tight">{b.title}</h4>
                            </div>
                        ))}
                    </div>
                 </section>
        </div>
    </div>
</div>
);
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

async function resolveOrCreateSEOPage(parsed: any, categorySlug: string, citySlug: string): Promise<SEOPageRow | null> {
  const supabase = await createClient();
  const existing = await getSEOPageBySlug(parsed.rawSlug);
  if (existing) return existing;

  const [{ data: catRow }, { data: cityRow }] = await Promise.all([
    supabase.from('categories').select('id').eq('slug', categorySlug).maybeSingle(),
    supabase.from('locations').select('id').eq('city_slug', citySlug).maybeSingle(),
  ]);

  if (!cityRow?.id) return null;
  return generateSEOPage(categorySlug, catRow?.id ?? null, citySlug, cityRow.id);
}

// Updated fetchers to use Category ID for accuracy
// Updated fetchers to use Category ID and Area for accuracy
// Maps URL category slugs → actual DB venue 'type' values (for broad OR matching)
const VENUE_SLUG_TO_TYPES: Record<string, string[]> = {
    'banquet-halls': ['Banquet Hall'],
    'banquet-hall': ['Banquet Hall'],
    'farmhouse': ['Farmhouse'],
    'farmhouses': ['Farmhouse'],
    'hotels': ['Hotel'],
    'hotel': ['Hotel'],
    'resorts': ['Resort'],
    'resort': ['Resort'],
    'party-plots': ['Party Plot'],
    'party-plot': ['Party Plot'],
    'wedding-venues': ['Banquet Hall', 'Heritage Venue', 'Convention Center', 'Boutique Venue', 'Resort', 'Hotel', 'Farmhouse'],
    'wedding-venue': ['Banquet Hall', 'Heritage Venue', 'Convention Center', 'Boutique Venue', 'Resort', 'Hotel', 'Farmhouse'],
    'lawn': ['Lawn', 'Farmhouse'],
    'lawns': ['Lawn', 'Farmhouse'],
    'convention-centre': ['Convention Center'],
    'convention-centers': ['Convention Center'],
};

async function fetchVenues(categorySlug: string, citySlug: string, sParams: any, categoryId?: string | null, areaSlug?: string, spaceType?: string, foodType?: string) {
    const supabase = await createClient();
    let query = supabase.from('venues').select('*').eq('is_active', true);
    
    // Filter by city
    if (citySlug && citySlug !== 'venues' && citySlug !== 'all') {
        const cityDecoded = unslugify(citySlug);
        query = query.or(`city.ilike.%${cityDecoded}%,city.ilike.%${citySlug}%`);
    }
    
    // Handle Path Food Type
    if (foodType) {
        const val = foodType.includes('non') ? 'Non-Veg' : 'Veg';
        query = query.ilike('food_type', `%${val}%`);
    }

    // Handle Area from Path (High Precision Fuzzy)
    if (areaSlug) {
        const fuzzyArea = areaSlug.split('-').join('%');
        query = query.or(`location.ilike.%${fuzzyArea}%,address.ilike.%${fuzzyArea}%`);
    }

    // Handle Horizontal Filters (sParams)
    if (sParams?.area) {
        const areaVal = unslugify(sParams.area);
        query = query.or(`location.ilike.%${areaVal}%,address.ilike.%${areaVal}%`);
    }
    if (sParams?.q) {
        const q = sParams.q;
        query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%,type.ilike.%${q}%`);
    }
    if (sParams?.food && sParams.food !== 'Any') {
        if (sParams.food === 'Only Veg' || sParams.food === 'Pure Veg') query = query.ilike('food_type', '%Veg%').not('food_type', 'ilike', '%Non-Veg%');
        else if (sParams.food === 'Non-Veg') query = query.ilike('food_type', '%Non-Veg%');
    }
    if (sParams?.type && !spaceType) {
        query = query.ilike('type', `%${unslugify(sParams.type)}%`);
    }
    
    if (sParams?.budget) {
        if (sParams.budget === 'Under ₹1000') query = query.lt('veg_price_per_plate', 1000);
        else if (sParams.budget === '₹1000 - ₹1500') query = query.gte('veg_price_per_plate', 1000).lte('veg_price_per_plate', 1500);
        else if (sParams.budget === '₹1500 - ₹2000') query = query.gte('veg_price_per_plate', 1500).lte('veg_price_per_plate', 2000);
        else if (sParams.budget === 'Above ₹2000') query = query.gt('veg_price_per_plate', 2000);
    }
    
    if (sParams?.capacity) {
        if (sParams.capacity === 'Under 100') query = query.lt('max_capacity', 100);
        else if (sParams.capacity === '100 - 500') query = query.gte('max_capacity', 100).lte('max_capacity', 500);
        else if (sParams.capacity === '500 - 1000') query = query.gte('max_capacity', 500).lte('max_capacity', 1000);
        else if (sParams.capacity === 'Above 1000') query = query.gt('max_capacity', 1000);
    }
    
    if (sParams?.rating && sParams.rating !== 'Any') {
        const r = parseFloat(sParams.rating);
        if (!isNaN(r)) query = query.gte('rating', r);
    }
    
    if (sParams?.cuisine) {
        const cuisineList = sParams.cuisine.split(',');
        query = query.overlaps('cuisines', cuisineList);
    }

    // Filter by category using slug→type map OR category ID
    const slugKey = categorySlug.toLowerCase();
    const mappedTypes = VENUE_SLUG_TO_TYPES[slugKey];
    
    if (mappedTypes && mappedTypes.length > 0) {
        // Build OR filter across all mapped types
        const typeConditions = mappedTypes.map(t => `type.ilike.%${t}%`).join(',');
        query = query.or(typeConditions);
    } else if (categoryId && categorySlug !== 'venues' && categorySlug !== 'vendors' && categorySlug !== 'all') {
        const catName = unslugify(categorySlug);
        query = query.or(`category_id.eq.${categoryId},type.ilike.%${catName}%`);
    } else if (categorySlug !== 'venues' && categorySlug !== 'vendors' && categorySlug !== 'all' && slugKey !== 'wedding-venues') {
        const catName = unslugify(categorySlug);
        query = query.ilike('type', `%${catName}%`);
    }
    // If it's 'venues', 'all', or 'wedding-venues' with no mapping, return all venues in city (no type filter)

    const { data } = await query.order('rating', { ascending: false }).limit(40);
    return (data || []).map(v => ({ ...v, locations: { city: v.city, area: v.location } }));
}

async function fetchVendors(categorySlug: string, citySlug: string, sParams: any, categoryId?: string | null, areaSlug?: string) {
    const supabase = await createClient();
    
    // DIAGNOSTIC: Try fetching without strict active filter if nothing found later
    let query = supabase.from('vendors').select('*');
    
    if (citySlug && citySlug !== 'all') {
        const cityDecoded = unslugify(citySlug);
        query = query.or(`city.ilike.%${cityDecoded}%,city.ilike.%${citySlug}%`);
    }

    if (areaSlug) {
        const fuzzyArea = areaSlug.split('-').join('%');
        query = query.or(`location.ilike.%${fuzzyArea}%,area.ilike.%${fuzzyArea}%`);
    }
    if (sParams?.area && sParams.area !== 'Any') {
        const fuzzy = typeof sParams.area === 'string' ? unslugify(sParams.area) : '';
        if (fuzzy) query = query.or(`location.ilike.%${fuzzy}%,area.ilike.%${fuzzy}%`);
    }

    // Mapping for plural/singular/alternative names (Exhaustive Authority Map)
    const MAPPINGS: Record<string, string> = {
        'photographers': 'Photograph', // Stem based for max fuzzy match
        'photography': 'Photograph',
        'photographer': 'Photograph',
        'wedding-photographers': 'Photograph',
        'caterers': 'Cater',
        'catering': 'Cater',
        'caterer': 'Cater',
        'food-services': 'Cater',
        'decorators': 'Decor',
        'decorator': 'Decor',
        'decoration': 'Decor',
        'makeup-artists': 'Makeup',
        'makeup': 'Makeup',
        'makeup-artist': 'Makeup',
        'makeup-and-hair': 'Makeup',
        'jewelry': 'Jewel',
        'jewellery': 'Jewel',
        'jewellers': 'Jewel',
        'jeweller': 'Jewel',
        'djs': 'DJ',
        'dj': 'DJ',
        'disc-jockeys': 'DJ',
        'mehendi': 'Mehendi',
        'mehendi-artists': 'Mehendi',
        'mehendi-artist': 'Mehendi',
        'mehndi': 'Mehendi',
        'mehndi-artists': 'Mehendi',
        'mehndi-artist': 'Mehendi',
        'pandit': 'Pandit',
        'pandits': 'Pandit',
        'astrologers': 'Astrolog',
        'astrologer': 'Astrolog',
        'videographers': 'Video',
        'videography': 'Video',
        'videographer': 'Video',
        'event-planners': 'Planner',
        'event-planner': 'Planner',
        'planners': 'Planner',
        'planner': 'Planner',
        'wedding-planners': 'Planner',
        'wedding-planner': 'Planner',
        'florists': 'Florist',
        'florist': 'Florist',
        'bands': 'Band',
        'band': 'Band',
        'music-band': 'Band',
        'choreography': 'Choreograph',
        'choreographers': 'Choreograph',
        'choreographer': 'Choreograph',
        'cakes': 'Cake',
        'cake': 'Cake',
        'wedding-cake': 'Cake',
        'gifts': 'Gift',
        'gift': 'Gift',
        'return-gift': 'Gift',
        'invitations': 'Invitation',
        'invitation': 'Invitation',
        'invitation-wedding-card': 'Invitation',
        'magicians': 'Magician',
        'magician': 'Magician',
        'entertainers': 'Entertain',
        'entertainer': 'Entertain',
        'tent-houses': 'Tent',
        'tent-house': 'Tent',
        'all-vendors': 'All',
        'vendors': 'All'
    };

    const targetType = MAPPINGS[categorySlug.toLowerCase()] || unslugify(categorySlug);

    if (categorySlug !== 'venues' && categorySlug !== 'vendors' && categorySlug !== 'all-vendors' && categorySlug !== 'all') {
        const catName = unslugify(categorySlug);
        // Extremely broad OR filter using ONLY confirmed existing columns
        query = query.or(`category.ilike.%${targetType}%,category.ilike.%${catName}%,category.ilike.%${categorySlug}%,name.ilike.%${targetType}%,description.ilike.%${targetType}%`);
    }

    const { data, error } = await query.order('rating', { ascending: false }).limit(100);
    
    if (error) {
        console.error('fetchVendors error:', error);
        // SAFE FALLBACK: Try a very minimal query
        const { data: safeData } = await supabase.from('vendors').select('*').limit(20);
        return (safeData || []).map(v => ({ ...v, type: v.category }));
    }

    // FALLBACK: If nothing found for a SPECIFIC city, do NOT show other cities (that's confusing)
    // Only do global fallback if we were already in 'all' mode or if we want to show a 'Nearby' section (skip for now)
    if (!data || data.length === 0) {
         if (citySlug === 'all') {
             let globalQuery = supabase.from('vendors').select('*');
             if (categorySlug !== 'vendors' && categorySlug !== 'all') {
                globalQuery = globalQuery.or(`category.ilike.%${targetType}%,category.ilike.%${unslugify(categorySlug)}%,category.ilike.%${categorySlug}%,name.ilike.%${targetType}%`);
             }
             const { data: globalData } = await globalQuery.order('rating', { ascending: false }).limit(60);
             if (globalData && globalData.length > 0) return globalData.map(v => ({ ...v, type: v.category }));
         }
    }

    return (data || []).map(v => ({ ...v, type: v.category }));
}
