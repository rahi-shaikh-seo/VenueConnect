"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import ListingFilter from "@/components/ListingFilter";
import VenueCard, { VenueData } from "@/components/VenueCard";
import { createClient } from "@/lib/supabase/client";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import SEOLinksDirectory from "@/components/SEOLinksDirectory";

function VenuesContent() {
    const searchParams = useSearchParams();
    const searchCity = searchParams.get("city")?.toLowerCase();
    const searchArea = searchParams.get("area");
    const searchQuery = searchParams.get("q")?.toLowerCase();
    const filterTypes = searchParams.getAll("type");
    const filterCapacity = searchParams.get("capacity");
    const filterPrices = searchParams.getAll("price");
    
    // Boolean Amenities
    const hasAc = searchParams.get("ac") === "true";
    const hasWifi = searchParams.get("wifi") === "true";
    const alcoholAllowed = searchParams.get("alcohol") === "true";
    const hasRooms = searchParams.get("rooms") === "true";

    const [venues, setVenues] = useState<VenueData[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchVenues();
    }, [searchParams]);

    const fetchVenues = async () => {
        setLoading(true);
        try {
            let query = supabase.from("venues").select("*");

            if (searchCity) {
                query = query.ilike("city", `%${searchCity}%`);
            }

            if (searchArea) {
                query = query.or(
                    `address.ilike.%${searchArea}%,city.ilike.%${searchArea}%,name.ilike.%${searchArea}%`
                );
            }

            if (searchQuery) {
                query = query.or(`name.ilike.%${searchQuery}%,address.ilike.%${searchQuery}%,type.ilike.%${searchQuery}%`);
            }

            if (filterTypes.length > 0) {
                query = query.in("type", filterTypes);
            }

            if (filterCapacity) {
                if (filterCapacity === "Under 100") query = query.lt("max_capacity", 100);
                if (filterCapacity === "100 - 500") query = query.gte("max_capacity", 100).lte("max_capacity", 500);
                if (filterCapacity === "500 - 1000") query = query.gte("max_capacity", 500).lte("max_capacity", 1000);
                if (filterCapacity === "1000+") query = query.gte("max_capacity", 1000);
            }

            if (hasAc) query = query.eq("has_ac", true);
            if (hasWifi) query = query.eq("has_wifi", true);
            if (alcoholAllowed) query = query.eq("alcohol_served", true);
            if (hasRooms) query = query.gt("rooms_count", 0);

            const { data, error } = await query;
            if (error) throw error;
            
            let mappedData: (VenueData & { rawPrice: number })[] = (data || []).map(v => ({
                id: v.id,
                name: v.name || 'Unnamed Venue',
                city: v.city || 'Unknown Location',
                area: v.address || v.location || '',
                capacity: `${v.min_capacity || 0}-${v.max_capacity || 0}`,
                rating: v.rating || 0,
                reviews: v.reviews || 0,
                image: v.images?.[0] || v.image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
                featured: v.rating >= 4.5,
                verified: true, 
                venueType: v.type || 'Venue',
                pricePerPlate: v.veg_price_per_plate || 0,
                rawPrice: v.veg_price_per_plate || 0,
                owner_id: v.owner_id
            }));

            if (filterPrices.length > 0) {
                 mappedData = mappedData.filter(v => {
                     const p = v.rawPrice;
                     return filterPrices.some(range => {
                         if (range === 'Under ₹1000') return p < 1000;
                         if (range === '₹1000 - ₹2000') return p >= 1000 && p <= 2000;
                         if (range === '₹2000 - ₹3000') return p > 2000 && p <= 3000;
                         if (range === 'Above ₹3000') return p > 3000;
                         return false;
                     });
                 });
            }

            setVenues(mappedData);
        } catch (error) {
            console.error("Error fetching venues:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <PageHeader
                title="Find Venues"
                subtitle="Discover the perfect location for your upcoming celebration"
                image="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=80"
            />

            <main className="flex-grow py-12">
                <div className="container px-4 mx-auto">
                    <div className="flex flex-col md:flex-row gap-8">
                        <aside className="w-full md:w-[300px] shrink-0 hidden md:block">
                            <ListingFilter type="venues" />
                        </aside>

                        <div className="flex-grow">
                            <div className="mb-6">
                                {(searchArea || searchCity || searchQuery) && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {searchCity && (
                                            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                                                📍 {searchCity}
                                            </span>
                                        )}
                                        {searchArea && (
                                            <span className="inline-flex items-center gap-1 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                                                🏘️ {searchArea}
                                            </span>
                                        )}
                                        {searchQuery && (
                                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full">
                                                🔍 {searchQuery}
                                            </span>
                                        )}
                                    </div>
                                )}
                                <h2 className="text-2xl font-semibold text-foreground font-display">
                                    {loading ? "Searching..." : `${venues.length} Venue${venues.length !== 1 ? 's' : ''} Found`}
                                    {searchArea && <span className="text-primary"> · {searchArea}</span>}
                                    {!searchArea && searchCity && <span className="text-primary"> in {searchCity}</span>}
                                </h2>
                            </div>

                            {/* Sort bar */}
                            <div className="flex items-center gap-2 mb-6">
                                <span className="text-sm text-muted-foreground hidden sm:inline-block">Sort by:</span>
                                <select className="text-sm border-border rounded-md px-3 py-1.5 focus:ring-primary focus:border-primary bg-background">
                                    <option>Recommended</option>
                                    <option>Rating (High to Low)</option>
                                    <option>Capacity (High to Low)</option>
                                    <option>Price (Low to High)</option>
                                </select>
                            </div>

                            {/* Mobile Filter Button */}
                            <div className="md:hidden mb-6">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <button className="w-full py-2.5 bg-white border border-border rounded-lg text-sm font-medium flex items-center justify-center gap-2 shadow-sm">
                                            Filters
                                        </button>
                                    </SheetTrigger>
                                    <SheetContent side="bottom" className="h-[85vh] overflow-y-auto px-0 pt-6">
                                        <SheetHeader className="px-5 pb-2">
                                            <SheetTitle className="text-left">Filters</SheetTitle>
                                        </SheetHeader>
                                        <div className="px-5 pb-10 border-none shadow-none">
                                            <ListingFilter type="venues" />
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {loading ? (
                                    <div className="col-span-full py-12 text-center text-muted-foreground animate-pulse">Loading amazing venues...</div>
                                ) : venues.length > 0 ? (
                                    venues.map((venue) => (
                                        <VenueCard key={venue.id} venue={venue} />
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 text-center bg-slate-50 border border-dashed rounded-xl border-slate-200">
                                        <h3 className="text-lg font-medium text-slate-800 mb-2">No venues matching your criteria</h3>
                                        <p className="text-slate-500">Try removing some filters or searching a different area.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <SEOLinksDirectory city={searchCity || undefined} />
        </div>
    );
}

export default function VenuesPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VenuesContent />
        </Suspense>
    );
}
