import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star, MapPin, CheckCircle2, ChevronLeft, Phone, Mail, Share2, Heart, Users, Calendar, Clock, IndianRupee, Wind, Wifi, Utensils, Info, Camera, Music, CarFront, CreditCard, Banknote, AlertCircle, Plane, BusFront, Check, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import GetQuoteModal from "@/components/GetQuoteModal";
import ReviewsList from "@/components/ReviewsList";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";

export default function VenueDetails() {
    const { id } = useParams();
    const [venue, setVenue] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [userSession, setUserSession] = useState<any>(null);

    useEffect(() => {
        fetchVenue();
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUserSession(session);
        });
    }, [id]);

    const fetchVenue = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('venues')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                // If it's a UUID error because we used a mock id like 'v1', just ignore or render 404
                if (error.code === '22P02') console.warn("Invalid UUID format for venue ID.");
                else throw error;
            } else {
                setVenue(data);
            }
        } catch (error) {
            console.error("Error fetching venue:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!venue) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center flex-col">
                    <h2 className="text-2xl font-bold mb-2">Venue Not Found</h2>
                    <p className="text-muted-foreground mb-4">The venue you are looking for does not exist or has been removed.</p>
                    <Link to="/venues">
                        <Button>Browse Venues</Button>
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    // Default Images if null/empty
    const images = venue.images && venue.images.length > 0 ? venue.images : [
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
        "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80",
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
        "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80"
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SEO 
                title={`${venue.name} in ${venue.city}`}
                description={`Book ${venue.name} in ${venue.city} for your next event. Check prices, capacity, amenities, and read verified reviews for this ${venue.type} on VenueConnect.`}
                type="article"
                image={images[0]}
                jsonLd={{
                    "@context": "https://schema.org",
                    "@type": "EventVenue",
                    "name": venue.name,
                    "description": venue.description,
                    "image": images,
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": venue.address || venue.location,
                        "addressLocality": venue.city,
                        "addressRegion": "Gujarat",
                        "postalCode": "380001",
                        "addressCountry": "IN"
                    },
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": 23.0225,
                        "longitude": 72.5714
                    },
                    "url": window.location.href,
                    "telephone": "+910000000000",
                    "priceRange": `₹${venue.veg_price_per_plate || 500}+`,
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": venue.rating || 4.5,
                        "reviewCount": venue.reviews || 1,
                        "bestRating": "5",
                        "worstRating": "1"
                    }
                }}
            />
            <Navbar />

            <main className="flex-grow py-8 bg-slate-50">
                <div className="container px-4 md:px-6">
                    <Link to="/venues" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Venues
                    </Link>

                    {/* AEO Quick Facts Section - Optimized for AI Bots */}
                    <div className="mb-8 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="bg-slate-900 px-6 py-3 flex items-center justify-between">
                            <h3 className="text-white font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                                <Info className="w-4 h-4 text-pink-500" /> Venue Quick Facts
                            </h3>
                            <span className="text-slate-400 text-[10px] font-medium uppercase tracking-tighter">Verified Content</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100">
                            <div className="p-4 flex flex-col gap-1">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Base Price</span>
                                <span className="text-lg font-black text-slate-800">₹{venue.veg_price_per_plate || venue.price_per_plate || 0} <span className="text-[10px] text-slate-500 font-normal">/plate</span></span>
                            </div>
                            <div className="p-4 flex flex-col gap-1">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Guest Capacity</span>
                                <span className="text-lg font-black text-slate-800">{venue.max_capacity || 0} <span className="text-[10px] text-slate-500 font-normal">max</span></span>
                            </div>
                            <div className="p-4 flex flex-col gap-1">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Rating</span>
                                <span className="text-lg font-black text-slate-800 flex items-center gap-1">
                                    {venue.rating || "0.0"} <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                </span>
                            </div>
                            <div className="p-4 flex flex-col gap-1">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Type</span>
                                <span className="text-lg font-black text-slate-800 truncate capitalize">{venue.type || "Venue"}</span>
                            </div>
                        </div>
                    </div>

                    {userSession?.user?.id === venue.owner_id && (
                        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="font-semibold text-amber-800 flex items-center gap-2">
                                    <Award className="w-5 h-5" /> You are the Lister for this Venue
                                </h3>
                                <p className="text-sm text-amber-700 mt-1">
                                    Go to your Lister Dashboard to manage details, view incoming leads, and respond to clients.
                                </p>
                            </div>
                            <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white shrink-0">
                                <Link to="/owner">Go to Dashboard</Link>
                            </Button>
                        </div>
                    )}

                    {/* Header Info */}
                    <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900">{venue.name}</h1>
                                {venue.verified !== false && (
                                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-[11px] font-bold tracking-wider uppercase">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-2 text-muted-foreground mb-3 text-sm md:text-base">
                                <MapPin className="w-4 h-4 text-primary" /> 
                                <span>{venue.address || `${venue.location || ''}, ${venue.city}`}</span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm font-medium">
                                <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded">
                                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                    <span>{venue.rating || "0.0"} ({venue.reviews || 0} Reviews)</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-600 bg-white border px-3 py-1 rounded-full shadow-sm">
                                    <Users className="w-4 h-4" /> 
                                    <span>Capacity: {venue.min_capacity || 0} - {venue.max_capacity || 0}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 md:self-start">
                            <Button variant="outline" className="gap-2 bg-white shadow-sm border-slate-200 text-slate-700 hover:text-red-500 hover:border-red-200 hover:bg-red-50">
                                <Heart className="w-4 h-4" /> Save
                            </Button>
                            <Button variant="outline" className="gap-2 bg-white shadow-sm border-slate-200 text-slate-700 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50">
                                <Share2 className="w-4 h-4" /> Share
                            </Button>
                        </div>
                    </div>

                    {/* Hero Image Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3 mb-10 h-[40vh] md:h-[55vh] min-h-[350px]">
                        <div className="md:col-span-2 md:row-span-2 rounded-xl md:rounded-l-2xl overflow-hidden relative group">
                            <img src={images[0]} alt={venue.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="hidden md:block rounded-xl overflow-hidden">
                            <img src={images[1 % images.length]} alt="Gallery 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="hidden md:block rounded-xl md:rounded-tr-2xl overflow-hidden">
                            <img src={images[2 % images.length]} alt="Gallery 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="hidden md:block rounded-xl overflow-hidden relative group">
                            <img src={images[3 % images.length]} alt="Gallery 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="hidden md:block rounded-xl md:rounded-br-2xl overflow-hidden relative group cursor-pointer">
                            <img src={images[4 % images.length] || images[0]} alt="Gallery 4" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white backdrop-blur-[2px] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                <Camera className="w-8 h-8 mb-2" />
                                <span className="font-semibold">View All Photos</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content & Sidebar Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        
                        {/* Main Content (Left, 8 cols) */}
                        <div className="lg:col-span-8 space-y-10">

                            {/* Base Attributes / Pricing Bar */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                <h2 className="text-xl font-semibold mb-4 border-b pb-3">Pricing Quick View </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-slate-500 text-sm font-medium flex items-center gap-1.5"><IndianRupee className="w-4 h-4"/> Veg Plate Option</span>
                                        <div className="text-2xl font-bold text-slate-900 border-l-4 border-green-500 pl-3">
                                            ₹{venue.veg_price_per_plate || venue.price_per_plate || 0} <span className="text-xs text-slate-500 font-normal">/ pax</span>
                                        </div>
                                    </div>
                                    {(venue.nonveg_price_per_plate || venue.food_served?.includes('Non-Veg')) && (
                                        <div className="flex flex-col gap-1 relative md:after:content-[''] md:after:absolute md:after:left-[-12px] md:after:h-full md:after:w-px md:after:bg-slate-200">
                                            <span className="text-slate-500 text-sm font-medium flex items-center gap-1.5"><IndianRupee className="w-4 h-4"/> Non-Veg Option</span>
                                            <div className="text-2xl font-bold text-slate-900 border-l-4 border-red-500 pl-3">
                                                ₹{venue.nonveg_price_per_plate || "On Request"} <span className="text-xs text-slate-500 font-normal">/ pax</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-1 relative md:after:content-[''] md:after:absolute md:after:left-[-12px] md:after:h-full md:after:w-px md:after:bg-slate-200">
                                        <span className="text-slate-500 text-sm font-medium flex items-center gap-1.5"><Calendar className="w-4 h-4"/> Booking Advance</span>
                                        <div className="text-2xl font-bold text-slate-900 pl-3 border-l-4 border-blue-500">{venue.advance_payment || 0}%</div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Key Venue Specs */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                <div className="col-span-full mb-2"><h2 className="text-xl font-semibold">Venue Specifications</h2></div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0"><Users className="w-5 h-5"/></div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Capacity</p>
                                        <p className="font-semibold text-slate-900">{venue.min_capacity || 0} - {venue.max_capacity || 0}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0"><CheckCircle2 className="w-5 h-5"/></div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Spaces</p>
                                        <p className="font-semibold text-slate-900">{venue.indoor_spaces || 0} Indoor, {venue.outdoor_spaces || 0} Outdoor</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0"><Utensils className="w-5 h-5"/></div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Catering</p>
                                        <p className="font-semibold text-slate-900 text-sm line-clamp-2">{venue.catering_policy || "In-house Catering Only"}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0"><Clock className="w-5 h-5"/></div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Timings</p>
                                        <p className="font-semibold text-slate-900 text-sm">{venue.operating_hours || "10 AM - 11 PM"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* About Section */}
                            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                <h2 className="text-2xl font-display font-semibold mb-4">About {venue.name}</h2>
                                <div className="prose text-slate-600 max-w-none">
                                    <p className="leading-relaxed whitespace-pre-wrap">
                                        {venue.description || "No description provided."}
                                    </p>
                                </div>
                            </section>

                            {/* COMPREHENSIVE DETAILS BEGIN */}
                            
                            {/* Room Details & More Info Block */}
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b pb-2"><Wind className="w-5 h-5 text-primary"/> Room Details</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">No. of Rooms</span>
                                            <span className="font-semibold">{venue.rooms_count > 0 ? venue.rooms_count : "None"}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Starting Price</span>
                                            <span className="font-semibold">{venue.room_starting_price ? `Rs. ${venue.room_starting_price} + Taxes` : "N/A"}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">AC</span>
                                            <span className="font-semibold">{venue.has_ac ? "Yes" : "No"}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">WiFi</span>
                                            <span className="font-semibold">{venue.has_wifi ? "Yes" : "No"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b pb-2"><Music className="w-5 h-5 text-primary"/> More Information</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">DJ Available</span>
                                            <span className="font-semibold">{venue.dj_available ? "Yes" : "No"}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Alcohol Served</span>
                                            <span className="font-semibold">{venue.alcohol_served ? "Yes" : "No"}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Outdoor Spaces</span>
                                            <span className="font-semibold">{venue.outdoor_spaces > 0 ? `${venue.outdoor_spaces} Spaces` : "None"}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Indoor Halls</span>
                                            <span className="font-semibold">{venue.indoor_spaces > 0 ? `${venue.indoor_spaces} Halls` : "None"}</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Cuisines, Food, Payment & Parking */}
                            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                <h2 className="text-xl font-display font-semibold mb-6 flex items-center gap-2"><Utensils className="w-5 h-5 text-primary" /> Event Specifics</h2>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                    {/* Car Parking */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2"><CarFront className="w-4 h-4"/> Car Parking</h4>
                                        <p className="text-sm text-slate-600 font-medium">Capacity: {venue.parking_capacity || "Not Specified"}</p>
                                    </div>

                                    {/* Payment Accepted */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2"><CreditCard className="w-4 h-4"/> Payment Methods</h4>
                                        <ul className="space-y-1">
                                            {venue.payment_methods?.map((pm: string, i: number) => (
                                                <li key={i} className="text-sm text-slate-600 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-slate-300 rounded-full"/>{pm}</li>
                                            )) || <li className="text-sm text-slate-600">Not Specified</li>}
                                        </ul>
                                    </div>

                                    {/* Food Served */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2"><Utensils className="w-4 h-4"/> Food Served</h4>
                                        <ul className="space-y-1">
                                            {venue.food_served?.map((fs: string, i: number) => (
                                                <li key={i} className="text-sm text-slate-600 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-slate-300 rounded-full"/>{fs}</li>
                                            )) || <li className="text-sm text-slate-600">Veg Only</li>}
                                        </ul>
                                    </div>

                                    {/* Cuisines */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2"><Star className="w-4 h-4"/> Cuisines</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {venue.cuisines?.map((c: string, i: number) => (
                                                <span key={i} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{c}</span>
                                            )) || <span className="text-xs text-slate-500">Not specified</span>}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* USPs (Unique Selling Propositions) */}
                            {venue.usps && venue.usps.length > 0 && (
                                <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                                    <h2 className="text-xl font-display font-semibold mb-4 text-slate-900 flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500 fill-yellow-500"/> USPs of {venue.name}</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {venue.usps.map((usp: string, index: number) => (
                                            <div key={index} className="flex items-start gap-2 text-sm text-slate-700 bg-white p-2.5 rounded-lg border border-slate-100 shadow-sm">
                                                <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                                <span className="font-medium">{usp}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Services & Policies Table */}
                            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                <h2 className="text-xl font-display font-semibold mb-6 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-primary"/> Services & Policies</h2>
                                
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                                        <div className="text-sm text-slate-500">Outside Liquor Permitted</div>
                                        <div className="text-sm font-medium">{venue.outside_liquor_permitted ? "Yes" : "No"}</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                                        <div className="text-sm text-slate-500">License Required Price</div>
                                        <div className="text-sm font-medium">{venue.license_required_price ? `Rs. ${venue.license_required_price}` : "N/A"}</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                                        <div className="text-sm text-slate-500">Corkage Charges</div>
                                        <div className="text-sm font-medium">{venue.corkage_charges ? `Rs. ${venue.corkage_charges}` : "N/A"}</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                                        <div className="text-sm text-slate-500">DJ Available</div>
                                        <div className="text-sm font-medium">{venue.dj_available ? "Yes (Chargeable)" : "No"}</div>
                                    </div>
                                    {venue.dj_available && (
                                        <>
                                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                                                <div className="text-sm text-slate-500">DJ Starting Price</div>
                                                <div className="text-sm font-medium text-slate-900 border border-slate-200 bg-slate-50 inline-flex px-2 py-0.5 rounded w-fit">Rs. {venue.dj_price || 0}</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                                                <div className="text-sm text-slate-500">Tax (DJ)</div>
                                                <div className="text-sm font-medium">{venue.dj_tax || 18}%</div>
                                            </div>
                                        </>
                                    )}
                                    <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                                        <div className="text-sm text-slate-500">Catering Policy</div>
                                        <div className="text-sm font-medium text-primary bg-primary/5 border border-primary/20 px-3 py-1 rounded-md inline-flex w-fit">{venue.catering_policy || "Inhouse only"}</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                                        <div className="text-sm text-slate-500">Booking Policy</div>
                                        <div className="text-sm font-medium">{venue.booking_policy || "Advance required"}</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-sm text-slate-500">Cancellation Policy</div>
                                        <div className="text-sm font-medium text-red-600">{venue.cancellation_policy || "Check with venue"}</div>
                                    </div>
                                </div>
                            </section>

                            {/* Nearest Transport */}
                            <section className="bg-gradient-to-r from-slate-50 to-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                <h2 className="text-lg font-display font-semibold mb-4 text-slate-900">Accessibility & Landmarks</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> Nearest Landmark</span>
                                        <span className="text-sm font-medium">{venue.nearest_landmark || "Not Specified"}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5"><Plane className="w-3.5 h-3.5"/> Nearest Airport</span>
                                        <span className="text-sm font-medium">{venue.nearest_airport || "Not Specified"}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5"><BusFront className="w-3.5 h-3.5"/> Nearest Bus Stand</span>
                                        <span className="text-sm font-medium">{venue.nearest_bus_stand || "Not Specified"}</span>
                                    </div>
                                </div>
                            </section>

                            {/* Terms & Disclaimer */}
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-200">
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2 text-sm flex items-center gap-1.5"><Info className="w-4 h-4 text-slate-500"/> Policy Terms</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed text-justify">
                                        {venue.policy_terms || "Our facilities provide all the services you need. We offer a wide variety of equipment to assist you through any function. Our policy for cancellation relies heavily on the time of cancellation."}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2 text-sm flex items-center gap-1.5"><AlertCircle className="w-4 h-4 text-slate-500"/> Disclaimer</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed text-justify">
                                        {venue.disclaimer || "The prices and other information described above is indicative and is reflective of the last time this information was updated on VenueConnect. Please double check prices directly."}
                                    </p>
                                </div>
                            </section>

                            {/* Reviews Section */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200" id="reviews">
                                <ReviewsList listingId={venue.id} listingType="venue" />
                            </div>

                        </div>

                        {/* Sidebar Sticky Panel (Right, 4 cols) */}
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            
                            {/* Summary Card (NEW in Phase 7) */}
                            <div className="bg-primary/5 rounded-2xl border border-primary/20 p-5">
                                <h3 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider flex items-center gap-2"><MapPin className="w-4 h-4"/> Summary of Event Space</h3>
                                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                                    <span className="font-semibold">{venue.name}</span> has {venue.indoor_spaces + venue.outdoor_spaces || 1} space(s) located in {venue.city}.
                                    It can accommodate <span className="font-semibold">{venue.min_capacity || 0} - {venue.max_capacity || 0}</span> guest(s). 
                                    Veg Menu starting price is <span className="font-semibold font-mono">Rs. {venue.veg_price_per_plate || venue.price_per_plate}</span> per plate.
                                </p>
                                <p className="text-sm text-slate-700 leading-relaxed">
                                    Operating timings are {venue.operating_hours || "10 AM - 11 PM"}. It has {venue.rooms_count || 0} room(s), 
                                    {venue.dj_available ? " has its own DJ service" : ""}, and {venue.alcohol_served ? "serves liquor" : "does not serve liquor"}.
                                </p>
                            </div>

                            <div className="sticky top-24 space-y-6">
                                {/* Form / CTA Card */}
                                <div className="bg-white rounded-2xl border border-primary/20 p-6 shadow-xl shadow-primary/5">
                                    <h3 className="text-xl font-display font-bold text-slate-900 mb-2">Check Availability</h3>
                                    <p className="text-slate-500 text-sm mb-6">Connect directly with {venue.name} to get the best negotiated prices.</p>

                                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6">
                                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                                            <Info className="w-4 h-4 text-primary" /> Why book securely?
                                        </div>
                                        <ul className="text-xs text-slate-500 space-y-1 ml-6 list-disc">
                                            <li>Guaranteed cheapest booking rate</li>
                                            <li>Dedicated event manager assigned</li>
                                            <li>100% verified venue details</li>
                                        </ul>
                                    </div>

                                    <div className="space-y-4">
                                        <GetQuoteModal 
                                            businessName={venue.name} 
                                            listingId={venue.id}
                                            listingType="venue"
                                            ownerId={venue.owner_id}
                                        />
                                        
                                        <Button variant="outline" className="w-full border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-base h-12 font-semibold">
                                            <Phone className="w-4 h-4 mr-2" /> View Phone Number
                                        </Button>
                                    </div>
                                </div>

                                {/* Map / Location Card */}
                                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary"/> Location map</h3>
                                    <div className="w-full h-48 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center mb-4 overflow-hidden relative">
                                        {/* Mock map via placeholder logic since access token may vary */}
                                        <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                                            <span className="text-slate-400 font-medium">Map Preview Not Available</span>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-100/80 to-transparent flex items-end p-4">
                                            <Button size="sm" className="w-full shadow-lg">Open in Maps</Button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                        {venue.address || `${venue.location || ''}, ${venue.city}`}
                                    </p>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
