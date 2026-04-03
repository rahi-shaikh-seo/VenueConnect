import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { 
  Star, MapPin, CheckCircle2, ChevronLeft, Heart, Share2, 
  Camera, Music, Info, Phone, Award, Mail, Instagram, Globe, MessageSquare
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
  const { data: vendor } = await supabase.from('vendors').select('name, description, image, category').eq('id', id).single();

  if (!vendor) return { title: "Vendor Not Found | VenueConnect" };

  return {
    title: `${vendor.name} - ${vendor.category} in Gujarat | VenueConnect`,
    description: vendor.description || `Book ${vendor.name} for your wedding or event. Best ${vendor.category} in Gujarat on VenueConnect.`,
    openGraph: {
      images: [vendor.image || ""],
    },
  };
}

export default async function VendorDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: vendor, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !vendor) {
    notFound();
  }

  const galleryImages = [
    vendor.image || "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80",
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80"
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="py-8">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <Link href="/vendors" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Vendors
          </Link>

          {/* Business Card Header */}
          <div className="mb-10 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
            <div className="flex flex-col lg:flex-row min-h-[400px]">
              {/* Image Section */}
              <div className="lg:w-1/2 h-[300px] lg:h-auto relative overflow-hidden">
                <img src={vendor.image || galleryImages[0]} alt={vendor.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                   <span className="bg-slate-900/80 text-white px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm tracking-wide uppercase">
                    {vendor.category || "Professional"}
                   </span>
                   {vendor.is_approved !== false && (
                    <span className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                    </span>
                   )}
                </div>
              </div>

              {/* Info Section */}
              <div className="lg:w-1/2 p-10 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h1 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-2 leading-tight">{vendor.name}</h1>
                      <div className="flex items-center gap-2 text-slate-500 text-lg font-light">
                        <MapPin className="w-5 h-5 text-primary" /> {vendor.location || `${vendor.city}, Gujarat`}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" className="rounded-full bg-slate-50 text-slate-400 hover:text-slate-900"><Heart className="w-5 h-5"/></Button>
                      <Button size="icon" variant="ghost" className="rounded-full bg-slate-50 text-slate-400 hover:text-slate-900"><Share2 className="w-5 h-5"/></Button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <GetQuoteModal 
                    businessName={vendor.name} 
                    listingId={vendor.id}
                    listingType="vendor"
                    ownerId={vendor.owner_id}
                    triggerButton={
                        <Button className="flex-grow h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg shadow-xl shadow-slate-200">
                          Connect Now
                        </Button>
                    }
                  />
                  <Button variant="outline" className="h-14 w-14 rounded-2xl border-2 border-slate-100 p-0 shrink-0">
                    <Phone className="w-6 h-6 text-slate-900" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-8 space-y-10">
              {/* Description */}
              <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                <h2 className="text-2xl font-display font-bold mb-6 text-slate-900">Professional Profile</h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed text-lg font-light">{vendor.description || "Top-tier wedding professional providing world-class services across Gujarat."}</p>
                </div>
              </section>

              {/* Portfolio */}
              <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                <h2 className="text-2xl font-display font-bold mb-6 text-slate-900 flex items-center gap-3">
                  <Camera className="w-6 h-6 text-primary" /> Work Portfolio
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryImages.map((img, i) => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden group">
                      <img src={img} alt="Work Portfolio" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                  ))}
                </div>
              </section>

              <ReviewsList listingId={vendor.id} listingType="vendor" />
            </div>

            {/* Sidebar Stats */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" /> Professional Metrics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-50">
                    <span className="text-slate-500 text-sm">Experience</span>
                    <span className="font-bold">5+ Years</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-50">
                    <span className="text-slate-500 text-sm">Service Area</span>
                    <span className="font-bold">All Over Gujarat</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-slate-500 text-sm">Booking Advance</span>
                    <span className="font-bold">25% Required</span>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10">
                 <h3 className="font-bold text-lg mb-4 text-primary">Need urgent booking?</h3>
                 <p className="text-sm text-slate-600 mb-6">Connect with VenueConnect experts to fast-track your booking with {vendor.name}.</p>
                 <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold">
                   Call Advisor
                 </Button>
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
    console.warn("Supabase client is null during vendors/[id] static generation. Skipping.");
    return [];
  }
  
  const { data } = await supabase.from('vendors').select('id').limit(50);
  return data?.map((v: any) => ({ id: v.id })) || [];
}
