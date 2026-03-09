import { Search, MapPin, Filter, SlidersHorizontal, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

interface ListingFilterProps {
    type: 'venues' | 'vendors';
}

const VENUE_TYPES = ['Banquet Hall', 'Farmhouse', 'Hotel', 'Resort', 'Party Plot'];
const VENDOR_TYPES = ['Photographers', 'Makeup Artists', 'Decorators', 'Caterers', 'Mehndi Artists'];

const VENUE_CAPACITIES = ['Under 100', '100 - 500', '500 - 1000', '1000+'];

const VENUE_PRICES = ['Under ₹1000', '₹1000 - ₹2000', '₹2000 - ₹3000', 'Above ₹3000'];
const VENDOR_PRICES = ['Under ₹20k', '₹20k - ₹50k', '₹50k - ₹1L', 'Above ₹1L'];

const ListingFilter = ({ type }: ListingFilterProps) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [location, setLocation] = useState(searchParams.get("city") || "");
    const [selectedTypes, setSelectedTypes] = useState<string[]>(searchParams.getAll("type"));
    const [selectedCapacity, setSelectedCapacity] = useState<string>(searchParams.get("capacity") || "");
    const [selectedPrices, setSelectedPrices] = useState<string[]>(searchParams.getAll("price"));
    
    // New Boolean Amenities
    const [hasAc, setHasAc] = useState(searchParams.get("ac") === "true");
    const [hasWifi, setHasWifi] = useState(searchParams.get("wifi") === "true");
    const [alcoholAllowed, setAlcoholAllowed] = useState(searchParams.get("alcohol") === "true");
    const [hasRooms, setHasRooms] = useState(searchParams.get("rooms") === "true");


    // Sync state if URL changes externally
    useEffect(() => {
        setLocation(searchParams.get("city") || "");
        setSelectedTypes(searchParams.getAll("type"));
        setSelectedCapacity(searchParams.get("capacity") || "");
        setSelectedPrices(searchParams.getAll("price"));
        setHasAc(searchParams.get("ac") === "true");
        setHasWifi(searchParams.get("wifi") === "true");
        setAlcoholAllowed(searchParams.get("alcohol") === "true");
        setHasRooms(searchParams.get("rooms") === "true");
    }, [searchParams]);

    const handleTypeToggle = (t: string) => {
        setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
    };

    const handlePriceToggle = (p: string) => {
        // Allow multiple or single price selection? Usually price ranges are singular or array. 
        // We will keep it array but users typically click one.
        setSelectedPrices(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
    };

    const applyFilters = () => {
        const newParams = new URLSearchParams(searchParams);

        if (location) newParams.set("city", location);
        else newParams.delete("city");

        newParams.delete("type");
        selectedTypes.forEach(t => newParams.append("type", t));

        if (type === 'venues') {
            if (selectedCapacity) newParams.set("capacity", selectedCapacity);
            else newParams.delete("capacity");
            
            // Boolean params
            if (hasAc) newParams.set("ac", "true");
            else newParams.delete("ac");
            
            if (hasWifi) newParams.set("wifi", "true");
            else newParams.delete("wifi");
            
            if (alcoholAllowed) newParams.set("alcohol", "true");
            else newParams.delete("alcohol");
            
            if (hasRooms) newParams.set("rooms", "true");
            else newParams.delete("rooms");
        }

        newParams.delete("price");
        selectedPrices.forEach(p => newParams.append("price", p));

        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setLocation("");
        setSelectedTypes([]);
        setSelectedCapacity("");
        setSelectedPrices([]);
        setHasAc(false);
        setHasWifi(false);
        setAlcoholAllowed(false);
        setHasRooms(false);
        setSearchParams(new URLSearchParams());
    };
    return (
        <div className="bg-white rounded-xl shadow-sm border border-border p-5 sticky top-24 z-10">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-primary" />
                    Filters
                </h3>
                <span onClick={clearFilters} className="text-xs text-primary font-medium cursor-pointer hover:underline">Clear All</span>
            </div>

            <div className="space-y-6">
                {/* Location Search */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">Location</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Search city or area..."
                            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-muted/20"
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">
                        {type === 'venues' ? 'Venue Type' : 'Vendor Category'}
                    </label>
                    <div className="space-y-2">
                        {type === 'venues' ? (
                            <>
                                {VENUE_TYPES.map((cat) => (
                                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={selectedTypes.includes(cat)}
                                            onChange={() => handleTypeToggle(cat)}
                                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                                        />
                                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{cat}</span>
                                    </label>
                                ))}
                            </>
                        ) : (
                            <>
                                {VENDOR_TYPES.map((cat) => (
                                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={selectedTypes.includes(cat)}
                                            onChange={() => handleTypeToggle(cat)}
                                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                                        />
                                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{cat}</span>
                                    </label>
                                ))}
                            </>
                        )}
                    </div>
                </div>

                {/* Capacity (Venues Only) */}
                {type === 'venues' && (
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-foreground">Guest Capacity</label>
                        <div className="space-y-2">
                            {VENUE_CAPACITIES.map((cap) => (
                                <label key={cap} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="capacity"
                                        checked={selectedCapacity === cap}
                                        onChange={() => setSelectedCapacity(cap)}
                                        className="w-4 h-4 text-primary border-border focus:ring-primary/20 cursor-pointer"
                                    />
                                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{cap}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Price Range */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground text-xs uppercase tracking-wider text-slate-500">{type === 'venues' ? 'Veg Plate Price' : 'Starting Price'}</label>
                    <div className="space-y-2">
                        {(type === 'venues' ? VENUE_PRICES : VENDOR_PRICES).map((range) => (
                            <label key={range} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={selectedPrices.includes(range)}
                                    onChange={() => handlePriceToggle(range)}
                                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                                />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{range}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Amenities (Venues Only) */}
                {type === 'venues' && (
                    <div className="space-y-3 border-t pt-4">
                        <label className="text-xs uppercase tracking-wider font-semibold text-slate-500">Must Have Amenities</label>
                        <div className="space-y-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" checked={hasAc} onChange={(e) => setHasAc(e.target.checked)} className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer" />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground">Air Conditioned</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" checked={hasWifi} onChange={(e) => setHasWifi(e.target.checked)} className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer" />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground">Free WiFi</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" checked={hasRooms} onChange={(e) => setHasRooms(e.target.checked)} className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer" />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground">Rooms Available</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" checked={alcoholAllowed} onChange={(e) => setAlcoholAllowed(e.target.checked)} className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer" />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground">Liquor Permitted</span>
                            </label>
                        </div>
                    </div>
                )}

                <Button onClick={applyFilters} className="w-full bg-primary hover:bg-primary/90 text-white shadow-md">
                    Apply Filters
                </Button>
            </div>
        </div>
    );
};

export default ListingFilter;
