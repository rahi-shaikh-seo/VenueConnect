import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { 
  CheckCircle2, ChevronLeft, Heart, Share2, 
  MapPin, Camera, Phone
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

          {/* Header Info */}
          <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-display text-3xl md:text-5xl font-bold text-slate-900 leading-tight">{venue.name}</h1>
                {venue.is_approved !== false && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-[11px] font-black tracking-widest uppercase border border-green-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-lg font-light mt-2">
                <MapPin className="w-5 h-5 text-primary" /> 
                <span>{venue.address || `${venue.location || ''}, ${venue.city}`}</span>
              </div>
            </div>
            <div className="flex gap-3 md:self-start">
              <Button variant="outline" className="h-12 px-6 rounded-xl border-2 border-slate-100 bg-white shadow-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
                <Heart className="w-5 h-5 mr-2 text-slate-300" /> Save
              </Button>
              <Button variant="outline" className="h-12 px-6 rounded-xl border-2 border-slate-100 bg-white shadow-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
                <Share2 className="w-5 h-5 mr-2 text-slate-300" /> Share
              </Button>
            </div>
          </div>

          {/* Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 mb-10 h-[45vh] md:h-[60vh] min-h-[400px]">
            <div className="md:col-span-2 md:row-span-2 rounded-[2rem] overflow-hidden relative group shadow-2xl shadow-slate-200/50">
              <img src={images[0]} alt={venue.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            </div>
            <div className="hidden md:block rounded-[1.5rem] overflow-hidden shadow-lg shadow-slate-200/50">
              <img src={images[1 % images.length]} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
            </div>
            <div className="hidden md:block rounded-[1.5rem] overflow-hidden shadow-lg shadow-slate-200/50">
              <img src={images[2 % images.length]} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
            </div>
            <div className="hidden md:block rounded-[1.5rem] overflow-hidden shadow-lg shadow-slate-200/50">
              <img src={images[3 % images.length]} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
            </div>
            <div className="hidden md:block rounded-[1.5rem] overflow-hidden relative group cursor-pointer shadow-lg shadow-slate-200/50">
              <img src={images[4 % images.length] || images[0]} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
              <div className="absolute inset-0 bg-slate-900/40 flex flex-col items-center justify-center text-white backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500">
                <Camera className="w-10 h-10 mb-2 transition-transform duration-500 translate-y-4 group-hover:translate-y-0" />
                <span className="font-bold tracking-widest uppercase text-sm">View Work</span>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-8 space-y-10">
              <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                <h2 className="text-3xl font-display font-bold mb-8 text-slate-900 border-l-4 border-primary pl-6 py-2">Property Description</h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed text-lg font-light whitespace-pre-wrap">{venue.description || "Premium wedding venue with modern amenities, offering a sophisticated setting for your most cherished celebrations across Gujarat."}</p>
                </div>
              </section>

              <ReviewsList listingId={venue.id} listingType="venue" />
            </div>

            <div className="lg:col-span-4 gap-6 flex flex-col">
              <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50 sticky top-24 border border-slate-800">
                <h3 className="text-3xl font-display font-bold mb-4 text-white">Direct Enquiry</h3>
                <p className="text-slate-400 font-light mb-10 text-lg">Receive a personalized quote and availability status directly from the property manager within 24 hours.</p>
                
                <div className="space-y-4">
                  <GetQuoteModal 
                    businessName={venue.name} 
                    listingId={venue.id}
                    listingType="venue"
                    ownerId={venue.owner_id}
                    triggerButton={
                        <Button className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xl shadow-xl shadow-primary/20 transition-all active:scale-95">
                          Check Your Date
                        </Button>
                    }
                  />
                  <Button variant="outline" className="w-full h-16 rounded-2xl border-2 border-slate-800 bg-transparent text-slate-300 font-bold text-lg hover:bg-slate-800 hover:text-white transition-all">
                    <Phone className="w-5 h-5 mr-3" /> Call Manager
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
  return data?.map((v: any) => ({ id: v.id })) || [];
}
