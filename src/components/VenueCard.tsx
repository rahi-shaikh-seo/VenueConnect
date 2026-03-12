import { Star, Users, MapPin, Send, CheckCircle2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import GetQuoteModal from "./GetQuoteModal";

export interface VenueData {
    id: string;
    name: string;
    city: string;
    area?: string;
    capacity: string;
    rating: number;
    reviews: number;
    image: string;
    featured?: boolean;
    verified?: boolean;
    amenities?: string[];
    venueType?: string;
    pricePerPlate?: number;
    owner_id?: string;
}

interface VenueCardProps {
    venue: VenueData;
}

const VenueCard = ({ venue }: VenueCardProps) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkFavoriteStatus();
    }, [venue.id]);

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
            .eq('venue_id', venue.id)
            .single();

        if (data) {
            setIsFavorite(true);
        }
        setIsLoading(false);
    };

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to venue page
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
                .eq('venue_id', venue.id);

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
                    venue_id: venue.id,
                    item_type: 'venue',
                    item_data: venue
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
        <div className="bg-white rounded-xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 h-full flex flex-col relative group">
            <Link to={`/venues/${venue.id}`} className="block relative">
                {/* Favorite Button */}
                <button
                    onClick={toggleFavorite}
                    disabled={isLoading}
                    className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${isFavorite
                        ? 'bg-rose-500/90 text-white hover:bg-rose-600'
                        : 'bg-white/70 text-gray-700 hover:bg-white hover:text-rose-500'
                        }`}
                >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>

                <div className="relative h-56 overflow-hidden">
                    <img
                        src={venue.image}
                        alt={venue.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {venue.featured && (
                        <span className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-primary text-xs font-semibold text-white z-10">
                            Featured
                        </span>
                    )}
                    {(venue.verified || venue.owner_id) && (
                        <div className={`absolute top-12 right-3 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/95 backdrop-blur-sm z-10 border ${venue.owner_id ? 'border-amber-200 shadow-sm' : ''}`}>
                            <CheckCircle2 className={`w-3.5 h-3.5 ${venue.owner_id ? 'text-amber-500' : 'text-green-600'}`} />
                            <span className={`text-[10px] font-medium uppercase tracking-wider ${venue.owner_id ? 'text-amber-700 font-bold' : 'text-foreground'}`}>
                                {venue.owner_id ? 'Verified Lister' : 'Verified'}
                            </span>
                        </div>
                    )}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-foreground/80 backdrop-blur-sm text-white text-xs font-semibold z-10">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        {venue.rating} <span className="text-white/60">({venue.reviews})</span>
                    </div>
                </div>
            </Link>

            <div className="p-5 flex flex-col flex-grow relative overflow-hidden bg-white">
                <Link to={`/venues/${venue.id}`} className="block hover:text-primary transition-colors">
                    <h3 className="font-display font-semibold text-foreground text-xl leading-tight mb-2 z-10 relative truncate">
                        {venue.name}
                    </h3>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 text-primary shrink-0" />
                            <span className="truncate">{venue.area ? `${venue.area}, ` : ""}{venue.city}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="w-4 h-4 text-primary shrink-0" />
                            <span>{venue.capacity} Guests</span>
                        </div>
                    </div>
                </Link>

                <div className="mt-auto pt-2 space-y-3">
                    {/* The GetQuoteModal CTA is always visible on mobile, and part of the card on desktop */}
                    <div onClick={(e) => e.stopPropagation()}>
                        <GetQuoteModal 
                            businessName={venue.name}
                            listingId={venue.id}
                            listingType="venue"
                            ownerId={venue.owner_id}
                            triggerButton={
                                <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase py-6 shadow-md transition-transform active:scale-[0.98]">
                                    GET FREE QUOTES
                                </Button>
                            }
                        />
                    </div>

                    <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs text-blue-500 font-semibold uppercase tracking-wider">
                        <Link to={`/venues/${venue.id}#amenities`} className="hover:text-blue-700 transition-colors">Amenities</Link>
                        <span className="text-gray-300">|</span>
                        <Link to={`/venues/${venue.id}#about`} className="hover:text-blue-700 transition-colors">Best For</Link>
                        <span className="text-gray-300">|</span>
                        <Link to={`/venues/${venue.id}#photos`} className="hover:text-blue-700 transition-colors">Photos</Link>
                        <span className="text-gray-300">|</span>
                        <Link to={`/venues/${venue.id}#reviews`} className="hover:text-blue-700 transition-colors">Reviews</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VenueCard;
