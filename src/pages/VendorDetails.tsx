import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star, MapPin, CheckCircle2, ChevronLeft, Phone, Mail, Globe, Share2, Heart, Award, IndianRupee, Camera, Video, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import GetQuoteModal from "@/components/GetQuoteModal";
import ReviewsList from "@/components/ReviewsList";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";

const VendorDetails = () => {
    const { id } = useParams();
    const [userSession, setUserSession] = useState<any>(null);
    const [vendor, setVendor] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVendor();
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUserSession(session);
        });
    }, [id]);

    const fetchVendor = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('vendors')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                if (error.code === '22P02') console.warn("Invalid UUID format for vendor ID.");
                else throw error;
            } else {
                setVendor(data);
            }
        } catch (error) {
            console.error("Error fetching vendor:", error);
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

    // Default Images if null/empty
    const images = vendor?.images && vendor.images.length > 0 ? vendor.images : (vendor?.portfolio && vendor.portfolio.length > 0 ? vendor.portfolio : [
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80",
        "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=800&q=80",
        "https://images.unsplash.com/photo-1583939411023-14783179e581?w=800&q=80",
        "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800&q=80",
        "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80"
    ]);

    if (!vendor) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center flex-col">
                    <h2 className="text-2xl font-bold mb-2">Vendor Not Found</h2>
                    <p className="text-muted-foreground mb-4">The vendor you are looking for does not exist or has been removed.</p>
                    <Link to="/vendors">
                        <Button>Browse Vendors</Button>
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SEO 
                title={`${vendor.name} - ${vendor.category} in ${vendor.city}`}
                description={`Connect with ${vendor.name}, a top-rated ${vendor.category} in ${vendor.city}. View their work, check pricing, and book for your next event on VenueConnect.`}
                ogType="article"
                ogImage={images[0]}
            />
            <Navbar />

            <main className="flex-grow py-8 bg-slate-50">
                <div className="container px-4 md:px-6">
                    <Link to="/vendors" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Vendors
                    </Link>

                    {userSession?.user?.id === vendor.owner_id && (
                        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="font-semibold text-amber-800 flex items-center gap-2">
                                    <Award className="w-5 h-5" /> You are the Lister for this Vendor
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
                                <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900">{vendor.name}</h1>
                                {vendor.verified && (
                                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[11px] font-bold tracking-wider uppercase">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified Pro
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-2 text-muted-foreground mb-3 text-sm md:text-base">
                                <MapPin className="w-4 h-4 text-primary" /> 
                                <span>{vendor.address || `${vendor.city}`}</span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm font-medium">
                                <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded">
                                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                    <span>{vendor.rating} ({vendor.reviews} Reviews)</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-600 bg-white border px-3 py-1 rounded-full shadow-sm">
                                    <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-0.5 rounded uppercase">{vendor.category}</span>
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
                            <img src={images[0]} alt={vendor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
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
                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white backdrop-blur-[2px] opacity-0 md:group-hover:opacity-100 transition-opacity">
                                <Camera className="w-8 h-8 mb-2" />
                                <span className="font-semibold">View Portfolio</span>
                            </div>
                        </div>
                    </div>


                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        
                        {/* Main Content */}
                        <div className="lg:col-span-8 space-y-10">

                            {/* Service Highlights */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                <h2 className="text-xl font-semibold mb-6">Service Highlights</h2>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0"><Award className="w-5 h-5"/></div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Experience</p>
                                            <p className="font-semibold text-slate-900">{vendor.yearsExperience || "5+ Years"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0"><Globe className="w-5 h-5"/></div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Travel</p>
                                            <p className="font-semibold text-slate-900">{vendor.travelsOutstation ? "Travels Outstation" : "Local Only"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0"><Clock className="w-5 h-5"/></div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Delivery In</p>
                                            <p className="font-semibold text-slate-900 text-sm">{vendor.deliveryTime || "Not specified"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0"><Calendar className="w-5 h-5"/></div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Advance</p>
                                            <p className="font-semibold text-slate-900 text-sm">{vendor.advancePayment || "50"}% to book</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* About Section */}
                            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                <h2 className="text-2xl font-display font-semibold mb-4">About {vendor.name}</h2>
                                <div className="prose text-slate-600 max-w-none">
                                    <p className="leading-relaxed">
                                        {vendor.description}
                                    </p>
                                </div>
                            </section>

                            {/* Services Offered */}
                            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                <h2 className="text-2xl font-display font-semibold mb-6 flex items-center gap-2">
                                    <Award className="w-6 h-6 text-primary" />
                                    Services Offered
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {vendor.services && vendor.services.map((item: string, idx: number) => (
                                        <span key={idx} className="px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            {/* Portfolio Preview */}
                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-semibold font-display">Portfolio Snippets</h2>
                                    <Button variant="link" className="text-primary pr-0">View All Work &rarr;</Button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {images.slice(1, 4).map((img: string, idx: number) => (
                                        <div key={idx} className="h-48 rounded-xl overflow-hidden cursor-pointer group border border-slate-200">
                                            <img src={img} alt={`Work ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Reviews Section */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                <ReviewsList listingId={vendor.id || id || "vd1"} listingType="vendor" />
                            </div>

                        </div>

                        {/* Sidebar Pricing & CTA */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-24 space-y-6">

                                <div className="bg-white rounded-2xl border border-primary/20 p-6 shadow-xl shadow-primary/5">
                                    <h3 className="text-xl font-display font-bold text-slate-900 mb-6 border-b pb-4">Starting Pricing</h3>

                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                            <Camera className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 font-bold uppercase tracking-wide mb-1">Standard Package Starts</div>
                                            <div className="text-3xl font-bold text-slate-900">₹{(vendor.startingPrice || 50000).toLocaleString('en-IN')} <span className="text-sm font-normal text-slate-500">/ day</span></div>
                                            <div className="text-xs text-slate-500 mt-1">Pricing depends on event & requirements</div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <GetQuoteModal 
                                            businessName={vendor.name} 
                                            listingId={vendor.id || id || "vd1"}
                                            listingType="vendor"
                                            ownerId={vendor.owner_id}
                                        />
                                        <Button variant="outline" className="w-full border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-base h-12 font-semibold">
                                            <Phone className="w-4 h-4 mr-2" /> Show Contact Number
                                        </Button>
                                        <Button variant="ghost" className="w-full text-slate-500 hover:text-slate-900 text-sm">
                                            <Mail className="w-4 h-4 mr-2" /> Send Email Enquiry
                                        </Button>
                                    </div>
                                </div>
                                
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default VendorDetails;
