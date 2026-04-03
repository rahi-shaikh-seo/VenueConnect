import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { 
  Star, MapPin, CheckCircle2, ChevronLeft, Heart, Share2, 
  Users, Calendar, Clock, IndianRupee, Wind, Utensils, 
  Info, Camera, Music, CarFront, CreditCard, AlertCircle, Award, Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import GetQuoteModal from "@/components/GetQuoteModal";
import ReviewsList from "@/components/ReviewsList";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: venue } = await supabase.from('venues').select('name, description, image').eq('id', id).single();

  if (!venue) return { title: "Venue Not Found | VenueConnect" };

  return {
    title: `${venue.name} | Best Wedding Venues in Gujarat`,
    description: venue.description || `Book ${venue.name} for your next event. Best prices and verified details on VenueConnect.`,
    openGraph: {
      images: [venue.image || ""],
    },
  };
}

export default async function VenueDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: venue, error } = await supabase
    .from('venues')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !venue) {
    notFound();
  }

  const images = venue.images && venue.images.length > 0 ? venue.images : [
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
    "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80"
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="py-8 bg-slate-50">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <Link href="/venues" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Venues
          </Link>

          {/* Quick Facts */}
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
                <span className="text-lg font-black text-slate-800">
                  {venue.veg_price_per_plate || venue.price_per_plate 
                    ? `₹${venue.veg_price_per_plate || venue.price_per_plate}` 
                    : "Price on Request"}
                  {(venue.veg_price_per_plate || venue.price_per_plate) && <span className="text-[10px] text-slate-500 font-normal ml-1">/plate</span>}
                </span>
              </div>
              <div className="p-4 flex flex-col gap-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Guest Capacity</span>
                <span className="text-lg font-black text-slate-800">
                  {venue.max_capacity ? `${venue.max_capacity} max` : "Contact for Capacity"}
                </span>
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

          {/* Header Info */}
          <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900">{venue.name}</h1>
                {venue.is_approved !== false && (
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
                  <span>Capacity: {venue.max_capacity ? `${venue.min_capacity || 0} - ${venue.max_capacity}` : "Contact for Details"}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 md:self-start">
              <Button variant="outline" className="gap-2 bg-white shadow-sm">
                <Heart className="w-4 h-4" /> Save
              </Button>
              <Button variant="outline" className="gap-2 bg-white shadow-sm">
                <Share2 className="w-4 h-4" /> Share
              </Button>
            </div>
          </div>

          {/* Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3 mb-10 h-[40vh] md:h-[55vh] min-h-[350px]">
            <div className="md:col-span-2 md:row-span-2 rounded-xl overflow-hidden relative group">
              <img src={images[0]} alt={venue.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
            </div>
            <div className="hidden md:block rounded-xl overflow-hidden">
              <img src={images[1 % images.length]} alt="Gallery" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
            </div>
            <div className="hidden md:block rounded-xl overflow-hidden">
              <img src={images[2 % images.length]} alt="Gallery" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
            </div>
            <div className="hidden md:block rounded-xl overflow-hidden relative group">
              <img src={images[3 % images.length]} alt="Gallery" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
            </div>
            <div className="hidden md:block rounded-xl overflow-hidden relative group cursor-pointer">
              <img src={images[4 % images.length] || images[0]} alt="Gallery" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 mb-2" />
                <span className="font-semibold">View All Photos</span>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-8 space-y-10">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-xl font-semibold mb-4 border-b pb-3 font-display">Pricing Quick View</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1">Veg Plate</span>
                    <div className="text-2xl font-black text-slate-900">{venue.veg_price_per_plate ? `₹${venue.veg_price_per_plate}` : "On Request"}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1">Non-Veg Plate</span>
                    <div className="text-2xl font-black text-slate-900">{venue.nonveg_price_per_plate ? `₹${venue.nonveg_price_per_plate}` : "On Request"}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1">Advance</span>
                    <div className="text-2xl font-black text-slate-900">{venue.advance_payment_percentage || 25}%</div>
                  </div>
                </div>
              </div>

              <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-2xl font-display font-bold mb-4 text-slate-900">About {venue.name}</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{venue.description || "Premium wedding venue with modern amenities."}</p>
              </section>

              <ReviewsList listingId={venue.id} listingType="venue" />
            </div>

            <div className="lg:col-span-4 gap-6 flex flex-col">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl shadow-slate-200/50 sticky top-24">
                <h3 className="text-xl font-display font-bold mb-2">Check Availability</h3>
                <p className="text-slate-500 text-sm mb-6">Get a personalized quote directly from {venue.name}.</p>
                
                <div className="space-y-4">
                  <GetQuoteModal 
                    businessName={venue.name} 
                    listingId={venue.id}
                    listingType="venue"
                    ownerId={venue.owner_id}
                  />
                  <Button variant="outline" className="w-full h-12 text-base font-semibold border-2 border-slate-100">
                    <Phone className="w-4 h-4 mr-2" /> View Phone Number
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const { createClient: createStaticClient } = await import("@/lib/supabase/static");
  const supabase = createStaticClient();

  if (!supabase) {
    console.warn("Supabase client is null during venues/[id] static generation. Skipping.");
    return [];
  }

  const { data } = await supabase.from('venues').select('id').limit(50);
  return data?.map((v) => ({ id: v.id })) || [];
}
