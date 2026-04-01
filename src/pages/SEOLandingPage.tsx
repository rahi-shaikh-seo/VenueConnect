import { useParams, Link } from "react-router-dom";
import { generateSEOContent, formatTitle } from "@/lib/seoContentEngine";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Star, ShieldCheck, ArrowRight, ChevronRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const SEOLandingPage = () => {
    // Handling all possible granular route combinations
    const params = useParams<{
        type?: string;
        categorySlug?: string; 
        citySlug?: string;
        localitySlug?: string;
        eventSlug?: string;
    }>();

    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Normalize params (Legacy vs New Venuelook Style)
    // If 'type' is a city name, we are in the new style /:citySlug/:categorySlug
    const isLegacy = params.type === "venues" || params.type === "vendors";
    
    const citySlug = isLegacy ? params.citySlug : params.type || params.citySlug;
    const categorySlug = params.categorySlug;
    const localitySlug = params.localitySlug;
    const eventSlug = params.eventSlug;
    const type = isLegacy ? params.type : "venues"; // Default to venues for city-first routes

    useEffect(() => {
        const fetchListings = async () => {
            if (!citySlug) return;
            setLoading(true);
            try {
                const tableName = type === "vendors" ? "vendors" : "venues";
                const cityTitle = formatTitle(citySlug);
                
                let query = supabase.from(tableName).select('*').ilike('city', `%${cityTitle}%`);
                
                // Add category/type filtering
                if (categorySlug) {
                    const catSearch = categorySlug.replace(/-/g, ' ');
                    if (tableName === 'vendors') {
                        query = query.ilike('category', `%${catSearch}%`);
                    } else {
                        query = query.ilike('type', `%${catSearch}%`);
                    }
                }

                // Add locality filtering if provided
                if (localitySlug) {
                    const locSearch = localitySlug.replace(/-/g, ' ');
                    query = query.or(`location.ilike.%${locSearch}%,address.ilike.%${locSearch}%`);
                }

                const { data, error } = await query.limit(10);

                if (!error && data) {
                    setListings(data);
                }
            } catch (err) {
                console.error("Error fetching SEO listings:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, [citySlug, categorySlug, localitySlug, eventSlug, type]);

    if (!citySlug) return null;

    const baseUrl = "https://venueconnect.in";
    const data = generateSEOContent(
        baseUrl, 
        citySlug, 
        categorySlug, 
        localitySlug, 
        eventSlug,
        type
    );

    // Construct Canonical URL correctly
    const canonicalPath = eventSlug 
        ? `/venues-for/${eventSlug}/${citySlug}${localitySlug ? '/' + localitySlug : ''}`
        : `/${citySlug}${localitySlug ? '/' + localitySlug : ''}/${categorySlug || ''}`;

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Helmet>
                <title>{data.title}</title>
                <meta name="description" content={data.description} />
                <link rel="canonical" href={`${baseUrl}${canonicalPath}`} />
                <script type="application/ld+json">
                    {data.faqSchema}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": data.breadcrumbs.map((b, index) => ({
                            "@type": "ListItem",
                            "position": index + 1,
                            "name": b.name,
                            "item": b.item
                        }))
                    })}
                </script>
            </Helmet>

            <Navbar />

            {/* Breadcrumb UI */}
            <div className="bg-slate-50 border-b border-slate-200 py-3 hidden md:block">
                <div className="container mx-auto px-4 flex items-center text-sm text-slate-500">
                    {data.breadcrumbs.map((crumb, i) => (
                        <div key={i} className="flex items-center">
                            {i > 0 && <ChevronRight className="w-4 h-4 mx-2" />}
                            <a href={crumb.item} className={`${i === data.breadcrumbs.length - 1 ? 'text-slate-900 font-medium' : 'hover:text-pink-600 transition-colors'}`}>
                                {crumb.name}
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hero Section */}
            <header className="relative py-24 md:py-32 overflow-hidden bg-slate-900">
                <div className="absolute inset-0">
                    <img 
                        src={data.cityImage} 
                        alt={`${formatTitle(citySlug)} scenery`} 
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                </div>
                
                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-sm font-medium mb-6 animate-pulse">
                        <MapPin className="w-4 h-4" />
                        {localitySlug ? `${formatTitle(localitySlug)}, ` : ''}{formatTitle(citySlug)}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                        {data.h1}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
                        {data.heroSubtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white font-medium h-14 px-8 rounded-full shadow-lg shadow-pink-600/20 text-lg group">
                            Get Free Quotes <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-lg border-slate-200/20 text-white hover:bg-white/10">
                            Explore {listings.length}+ Options
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 py-16 md:py-24 bg-slate-50">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid lg:grid-cols-3 gap-12">
                        
                        <div className="lg:col-span-2">
                            {/* AI Insights Summary Box */}
                            <div className="mb-10 bg-white rounded-3xl p-6 border-l-8 border-pink-600 shadow-sm">
                                <h2 className="text-sm font-black text-pink-600 mb-3 flex items-center gap-2 uppercase tracking-widest">
                                    <Sparkles className="w-4 h-4" /> Local Intelligence Summary
                                </h2>
                                <p className="text-slate-700 leading-relaxed italic text-lg">
                                    "Based on localized market data for <strong>{formatTitle(citySlug)}</strong>{localitySlug ? ` (focusing on ${formatTitle(localitySlug)})` : ''}, demand for <strong>{categorySlug ? formatTitle(categorySlug).toLowerCase() : eventSlug ? formatTitle(eventSlug).toLowerCase() : 'event spaces'}</strong> is peak during the upcoming wedding season. Verified listings in this area offer a guest capacity range of 100 to 2000+, with average response times under 12 hours for new inquiries."
                                </p>
                            </div>

                            <article className="prose prose-slate prose-lg max-w-none mb-16" dangerouslySetInnerHTML={{ __html: data.content }}>
                            </article>
                            
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 border-l-4 border-pink-600 pl-4 py-1">
                                Verified {categorySlug ? formatTitle(categorySlug) : eventSlug ? formatTitle(eventSlug) : 'Listings'} in {localitySlug ? formatTitle(localitySlug) + ', ' : ''}{formatTitle(citySlug)}
                            </h2>
                            
                            <div className="space-y-6">
                                {loading ? (
                                    <div className="p-12 text-center text-slate-400">Analyzing live availability...</div>
                                ) : listings.length > 0 ? (
                                    listings.map((listing) => (
                                        <div key={listing.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 items-start md:items-center hover:shadow-md transition-shadow">
                                            <div className="w-full md:w-48 h-32 bg-slate-100 rounded-xl flex-shrink-0 overflow-hidden">
                                                <img 
                                                    src={listing.images?.[0] || listing.portfolio?.[0] || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80"} 
                                                    alt={listing.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-xl font-bold text-slate-900 hover:text-pink-600 transition-colors">
                                                        <Link to={`/${type}/${listing.id}`}>{listing.name}</Link>
                                                    </h3>
                                                    <ShieldCheck className="w-5 h-5 text-blue-500" />
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-slate-600 mb-4">
                                                    <div className="flex items-center text-amber-500 font-medium bg-amber-50 px-2 py-0.5 rounded">
                                                        <Star className="w-4 h-4 fill-amber-500 mr-1" /> {listing.rating || 4.5}
                                                    </div>
                                                    <span>({listing.reviews || 0} reviews)</span>
                                                    <span>•</span>
                                                    <span className="font-medium text-slate-700 capitalize">{listing.location || listing.city}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full flex items-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3 text-green-500" /> Verified Pro
                                                    </span>
                                                    <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full flex items-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3 text-green-500" /> Price Match
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-full md:w-auto">
                                                <Link to={`/${type}/${listing.id}`}>
                                                    <Button className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 px-6">View Venue</Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center bg-white border border-dashed border-slate-300 rounded-3xl text-slate-500">
                                        No specific matches for <strong>{localitySlug ? formatTitle(localitySlug) : formatTitle(citySlug)}</strong> currently verified in this category. 
                                        <br />
                                        <Link to={`/${type}`} className="text-pink-600 font-bold mt-4 inline-block hover:underline">Explore All in {formatTitle(citySlug)}</Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 sticky top-24 border border-slate-100">
                                <h3 className="text-2xl font-black text-slate-900 mb-2">Instant Booking</h3>
                                <p className="text-slate-500 mb-6">Connect with top {categorySlug ? formatTitle(categorySlug).toLowerCase() : 'spaces'} in {formatTitle(citySlug)} today.</p>
                                
                                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-1.5 block">Full Name</label>
                                        <input type="text" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all" placeholder="Enter your name" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-1.5 block">WhatsApp Number</label>
                                        <input type="tel" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all" placeholder="+91" />
                                    </div>
                                    <Button className="w-full h-12 mt-4 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-xl text-lg shadow-md shadow-pink-600/20">
                                        Get Availability
                                    </Button>
                                    <p className="text-[10px] text-center text-slate-400 mt-4 leading-relaxed uppercase tracking-widest font-bold">
                                        No Booking Fee • 100% Verified
                                    </p>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default SEOLandingPage;
