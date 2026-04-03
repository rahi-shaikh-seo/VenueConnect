'use client';

import { Search, MapPin, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface ListingFilterProps {
    type: 'venues' | 'vendors';
}

const VENUE_TYPES = ['Banquet Hall', 'Farmhouse', 'Hotel', 'Resort', 'Party Plot', 'Lawn', 'Convention Centre'];
const VENDOR_TYPES = ['Photographers', 'Makeup Artists', 'Decorators', 'Caterers', 'Mehndi Artists', 'DJ', 'Florists', 'Event Planners'];

const VENUE_CAPACITIES = ['Under 100', '100 - 500', '500 - 1000', '1000+'];

const VENUE_PRICES = ['Under ₹1000', '₹1000 - ₹2000', '₹2000 - ₹3000', 'Above ₹3000'];
const VENDOR_PRICES = ['Under ₹20k', '₹20k - ₹50k', '₹50k - ₹1L', 'Above ₹1L'];

const AMENITIES = [
    { key: 'ac', label: '❄️ AC' },
    { key: 'wifi', label: '📶 WiFi' },
    { key: 'rooms', label: '🛏️ Rooms' },
    { key: 'alcohol', label: '🍾 Liquor OK' },
];

// Pill toggle button
const Pill = ({
    label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer select-none
            ${active
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-slate-600 border-border hover:border-primary/50 hover:bg-primary/5'
            }`}
    >
        {active && <X className="w-3 h-3" />}
        {label}
    </button>
);

const ListingFilter = ({ type }: ListingFilterProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [location, setLocation] = useState(searchParams.get("city") || "");
    const [area, setArea] = useState(searchParams.get("area") || "");
    const [selectedTypes, setSelectedTypes] = useState<string[]>(searchParams.getAll("type"));
    const [selectedCapacity, setSelectedCapacity] = useState<string>(searchParams.get("capacity") || "");
    const [selectedPrices, setSelectedPrices] = useState<string[]>(searchParams.getAll("price"));
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(() => {
        const a: string[] = [];
        if (searchParams.get("ac") === "true") a.push("ac");
        if (searchParams.get("wifi") === "true") a.push("wifi");
        if (searchParams.get("rooms") === "true") a.push("rooms");
        if (searchParams.get("alcohol") === "true") a.push("alcohol");
        return a;
    });

    // Sync state when URL changes externally
    useEffect(() => {
        setLocation(searchParams.get("city") || "");
        setArea(searchParams.get("area") || "");
        setSelectedTypes(searchParams.getAll("type"));
        setSelectedCapacity(searchParams.get("capacity") || "");
        setSelectedPrices(searchParams.getAll("price"));
        const a: string[] = [];
        if (searchParams.get("ac") === "true") a.push("ac");
        if (searchParams.get("wifi") === "true") a.push("wifi");
        if (searchParams.get("rooms") === "true") a.push("rooms");
        if (searchParams.get("alcohol") === "true") a.push("alcohol");
        setSelectedAmenities(a);
    }, [searchParams]);

    const toggle = <T,>(arr: T[], item: T): T[] =>
        arr.includes(item) ? arr.filter(v => v !== item) : [...arr, item];

    const activeFilterCount = [
        location, area,
        ...selectedTypes, selectedCapacity,
        ...selectedPrices, ...selectedAmenities,
    ].filter(Boolean).length;

    const applyFilters = () => {
        const p = new URLSearchParams(searchParams.toString());
        
        // Reset location and area first to avoid stale data
        p.delete("city");
        p.delete("area");
        p.delete("type");
        p.delete("price");
        p.delete("capacity");
        p.delete("ac");
        p.delete("wifi");
        p.delete("alcohol");
        p.delete("rooms");

        if (location.trim()) p.set("city", location.trim());
        if (area.trim()) p.set("area", area.trim());
        selectedTypes.forEach(t => p.append("type", t));
        if (type === 'venues') {
            if (selectedCapacity) p.set("capacity", selectedCapacity);
            if (selectedAmenities.includes("ac")) p.set("ac", "true");
            if (selectedAmenities.includes("wifi")) p.set("wifi", "true");
            if (selectedAmenities.includes("alcohol")) p.set("alcohol", "true");
            if (selectedAmenities.includes("rooms")) p.set("rooms", "true");
        }
        selectedPrices.forEach(pr => p.append("price", pr));
        
        router.push(`${pathname}?${p.toString()}`);
    };

    const clearAll = () => {
        setLocation(""); setArea("");
        setSelectedTypes([]); setSelectedCapacity("");
        setSelectedPrices([]); setSelectedAmenities([]);
        router.push(pathname);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-border p-5 sticky top-24 z-10 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-primary" />
                    Filters
                    {activeFilterCount > 0 && (
                        <span className="bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                            {activeFilterCount}
                        </span>
                    )}
                </h3>
                {activeFilterCount > 0 && (
                    <button onClick={clearAll} className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                        <X className="w-3 h-3" /> Clear all
                    </button>
                )}
            </div>

            {/* City */}
            <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">City</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && applyFilters()}
                        placeholder="Ahmedabad, Surat, Rajkot..."
                        className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-muted/20"
                    />
                </div>
            </div>

            {/* Area / Locality (venues only) */}
            {type === 'venues' && (
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Area / Locality</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={area}
                            onChange={e => setArea(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && applyFilters()}
                            placeholder="Paldi, Bopal, Mavdi..."
                            className="w-full pl-9 pr-4 py-2 text-sm border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-primary/5"
                        />
                    </div>
                    {area && <p className="text-[11px] text-primary font-medium">Showing venues in "{area}"</p>}
                </div>
            )}

            <div className="border-t pt-4 space-y-5">

                {/* Venue / Vendor Type Pills */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {type === 'venues' ? 'Venue Type' : 'Category'}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {(type === 'venues' ? VENUE_TYPES : VENDOR_TYPES).map(t => (
                            <Pill
                                key={t} label={t}
                                active={selectedTypes.includes(t)}
                                onClick={() => setSelectedTypes(prev => toggle(prev, t))}
                            />
                        ))}
                    </div>
                </div>

                {/* Capacity Pills (venues only) */}
                {type === 'venues' && (
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Guest Capacity</label>
                        <div className="flex flex-wrap gap-2">
                            {VENUE_CAPACITIES.map(cap => (
                                <Pill
                                    key={cap} label={cap}
                                    active={selectedCapacity === cap}
                                    onClick={() => setSelectedCapacity(prev => prev === cap ? '' : cap)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Price Pills */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {type === 'venues' ? 'Veg Plate Price' : 'Starting Price'}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {(type === 'venues' ? VENUE_PRICES : VENDOR_PRICES).map(p => (
                            <Pill
                                key={p} label={p}
                                active={selectedPrices.includes(p)}
                                onClick={() => setSelectedPrices(prev => toggle(prev, p))}
                            />
                        ))}
                    </div>
                </div>

                {/* Amenity Pills (venues only) */}
                {type === 'venues' && (
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Amenities</label>
                        <div className="flex flex-wrap gap-2">
                            {AMENITIES.map(a => (
                                <Pill
                                    key={a.key} label={a.label}
                                    active={selectedAmenities.includes(a.key)}
                                    onClick={() => setSelectedAmenities(prev => toggle(prev, a.key))}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Active selections summary */}
            {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                    {[...selectedTypes, ...selectedPrices, selectedCapacity, ...selectedAmenities.map(k => AMENITIES.find(a => a.key === k)?.label || '')]
                        .filter(Boolean)
                        .map((tag, i) => (
                            <span key={i} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                                {tag}
                            </span>
                        ))}
                </div>
            )}

            {/* Apply Button */}
            <Button onClick={applyFilters} className="w-full bg-primary hover:bg-primary/90 text-white shadow-md font-semibold">
                Apply Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
        </div>
    );
};

export default ListingFilter;
