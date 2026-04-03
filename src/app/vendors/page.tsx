"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import ListingFilter from "@/components/ListingFilter";
import VendorCard, { VendorData } from "@/components/VendorCard";
import { createClient } from "@/lib/supabase/client";

function VendorsContent() {
    const searchParams = useSearchParams();
    const searchCity = searchParams.get("city")?.toLowerCase();
    const queryCategory = searchParams.get("category")?.toLowerCase();
    const filterTypes = searchParams.getAll("type");
    const filterPrices = searchParams.getAll("price");

    const [vendors, setVendors] = useState<VendorData[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchVendors();
    }, [searchParams]);

    const fetchVendors = async () => {
        setLoading(true);
        try {
            let query = supabase.from("vendors").select("*");

            if (searchCity) {
                query = query.ilike("city", `%${searchCity}%`);
            }

            const typeFilters = [...filterTypes];
            if (queryCategory && queryCategory !== 'wedding' && !typeFilters.includes(queryCategory)) {
                query = query.ilike("category", `%${queryCategory}%`);
            } else if (typeFilters.length > 0) {
                query = query.in("category", typeFilters);
            }

            const { data, error } = await query;
            if (error) throw error;

            let mappedData: (VendorData & { rawPrice: number })[] = (data || []).map(v => ({
                id: v.id,
                name: v.name || 'Unnamed Vendor',
                category: v.category || 'Professional',
                city: v.city || 'Unknown Location',
                rating: 4.8,
                reviews: Math.floor(Math.random() * 200) + 50,
                startingPrice: v.starting_price || 0,
                image: v.images?.[0] || v.image || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
                featured: false,
                verified: true,
                rawPrice: v.starting_price || 0,
                owner_id: v.owner_id
            }));

            if (filterPrices.length > 0) {
                 mappedData = mappedData.filter(v => {
                     const p = v.rawPrice;
                     return filterPrices.some(range => {
                         if (range === 'Under ₹20k') return p < 20000;
                         if (range === '₹20k - ₹50k') return p >= 20000 && p <= 50000;
                         if (range === '₹50k - ₹1L') return p > 50000 && p <= 100000;
                         if (range === 'Above ₹1L') return p > 100000;
                         return false;
                     });
                 });
            }

            setVendors(mappedData);
        } catch (error) {
            console.error("Error fetching vendors:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <PageHeader
                title="Find Top Vendors"
                subtitle="Connect with the best professionals to make your event unforgettable"
                image="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80"
            />

            <main className="flex-grow py-12">
                <div className="container px-4 mx-auto">
                    <div className="flex flex-col md:flex-row gap-8">
                        <aside className="w-full md:w-[300px] shrink-0 hidden md:block">
                            <ListingFilter type="vendors" />
                        </aside>

                        <div className="flex-grow">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-semibold text-foreground font-display">
                                    {loading ? "Searching..." : `${vendors.length} Professional${vendors.length !== 1 ? 's' : ''} Found`}
                                    {searchCity && <span className="text-primary italic"> in {searchCity}</span>}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground hidden sm:inline-block">Sort by:</span>
                                    <select className="text-sm border-border rounded-md px-3 py-1.5 focus:ring-primary focus:border-primary bg-background">
                                        <option>Recommended</option>
                                        <option>Rating (High to Low)</option>
                                        <option>Price (Low to High)</option>
                                        <option>Price (High to Low)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {loading ? (
                                    <div className="col-span-full py-12 text-center text-muted-foreground animate-pulse font-medium">Analyzing listing database...</div>
                                ) : vendors.length > 0 ? (
                                    vendors.map((vendor) => (
                                        <VendorCard key={vendor.id} vendor={vendor} />
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 text-center bg-slate-50 border border-dashed rounded-xl border-slate-200">
                                        <h3 className="text-lg font-medium text-slate-800 mb-2">No professionals matching your criteria</h3>
                                        <p className="text-slate-500">Try removing some filters or searching a different area.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function VendorsPage() {
    return (
        <Suspense fallback={<div>Loading Professionals...</div>}>
            <VendorsContent />
        </Suspense>
    );
}
