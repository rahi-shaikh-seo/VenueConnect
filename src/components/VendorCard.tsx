'use client';

import { Star, MapPin, Send, CheckCircle2, IndianRupee, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export interface VendorData {
    id: string;
    name: string;
    category: string;
    city: string;
    rating: number;
    reviews: number;
    startingPrice: number;
    image: string;
    featured?: boolean;
    verified?: boolean;
    owner_id?: string;
}

interface VendorCardProps {
    vendor: VendorData;
}

const VendorCard = ({ vendor }: VendorCardProps) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        checkFavoriteStatus();
    }, [vendor.id]);

    const checkFavoriteStatus = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setIsLoading(false);
            return;
        }

        const { data } = await supabase
            .from('user_favorites')
            .select('id')
            .eq('user_id', user.id)
            .eq('vendor_id', vendor.id)
            .single();

        if (data) {
            setIsFavorite(true);
        }
        setIsLoading(false);
    };

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to vendor page
        e.stopPropagation();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            toast.error("Please login to save favorites");
            return;
        }

        if (isFavorite) {
            // Remove from favorites
            const { error } = await supabase
                .from('user_favorites')
                .delete()
                .eq('user_id', user.id)
                .eq('vendor_id', vendor.id);

            if (!error) {
                setIsFavorite(false);
                toast.success("Removed from favorites");
            }
        } else {
            // Add to favorites
            const { error } = await supabase
                .from('user_favorites')
                .insert({
                    user_id: user.id,
                    vendor_id: vendor.id,
                    item_type: 'vendor',
                    item_data: vendor
                });

            if (!error) {
                setIsFavorite(true);
                toast.success("Saved to favorites!");
            } else {
                toast.error("Error saving favorite");
                console.error(error);
            }
        }
    };

    return (
        <Link href={`/vendors/${vendor.id}`} className="block group h-full">
            <div className="bg-white rounded-xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 h-full flex flex-col relative">
                
                {/* Favorite Button */}
                <button
                    onClick={toggleFavorite}
                    disabled={isLoading}
                    className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm ${isFavorite
                        ? 'bg-rose-500/90 text-white hover:bg-rose-600'
                        : 'bg-white/70 text-gray-700 hover:bg-white hover:text-rose-500'
                        }`}
                >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>

                <div className="relative h-56 overflow-hidden">
                    <img
                        src={vendor.image}
                        alt={vendor.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                        {vendor.featured && (
                            <span className="px-3 py-1.5 rounded-full bg-primary text-xs font-semibold text-white">
                                Premium
                            </span>
                        )}
                        <span className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-xs font-semibold text-white">
                            {vendor.category}
                        </span>
                    </div>

                    {(vendor.verified || vendor.owner_id) && (
                        <div className={`absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/95 backdrop-blur-sm shadow-sm border ${vendor.owner_id ? 'border-amber-200' : ''}`}>
                            <CheckCircle2 className={`w-3.5 h-3.5 ${vendor.owner_id ? 'text-amber-500' : 'text-blue-500'}`} />
                            {vendor.owner_id && <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Verified Lister</span>}
                        </div>
                    )}

                    <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-foreground/80 backdrop-blur-sm text-white text-xs font-semibold">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        {vendor.rating} <span className="text-white/60">({vendor.reviews})</span>
                    </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-display font-semibold text-foreground text-xl leading-tight group-hover:text-primary transition-colors mb-2">
                        {vendor.name}
                    </h3>

                    <div className="space-y-2 mb-4 flex-grow">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 text-primary shrink-0" />
                            <span>{vendor.city}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <IndianRupee className="w-4 h-4 text-primary shrink-0" />
                            <span>Starting from <strong className="text-foreground">₹{vendor.startingPrice.toLocaleString('en-IN')}</strong></span>
                        </div>
                    </div>

                    <Button size="sm" variant="outline" className="w-full border-primary/20 hover:bg-primary/5 text-primary">
                        <Send className="w-3.5 h-3.5 mr-2" /> Message Vendor
                    </Button>
                </div>
            </div>
        </Link>
    );
};

export default VendorCard;
