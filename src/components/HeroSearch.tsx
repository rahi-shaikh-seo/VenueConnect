"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { gujaratCities } from "@/lib/cities";

const EVENT_SUGGESTIONS = [
  "Wedding", "Wedding Reception", "Wedding Anniversary", "Ring Ceremony",
  "Pre Wedding Mehendi Party", "Sangeet Ceremony", "Bachelor Party", "Bridal Shower",
  "Birthday Party", "First Birthday Party", "Kids Birthday Party",
  "Holi Party",
  "Brand Promotion", "Business Dinner", "Conference", "Corporate Event",
  "Corporate Offsite", "Corporate Party", "Corporate Training", "Dealers Meet",
  "Exhibition", "Fashion Show", "Meeting", "Musical Concert", "Product Launch",
  "Team Building", "Team Outing", "Training", "Walkin Interview", "Annual Fest", "MICE",
  "Baby Shower", "Childrens Party", "Christian Communion", "Class Reunion",
  "Cocktail Dinner", "Engagement", "House Party", "Family Function",
  "Family Get Together", "Farewell", "Freshers Party", "Game Watch", "Get Together",
  "Group Dining", "Kitty Party", "Naming Ceremony", "Photo Shoots", "Pool Party",
  "Residential Conference", "Social Mixer", "Stage Event", "Adventure Party",
  "Aqueeqa Ceremony",
];

const HeroSearch = () => {
  const router = useRouter();
  const [serviceType, setServiceType] = useState("venues");
  const [city, setCity] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filtered = EVENT_SUGGESTIONS.filter(e =>
    e.toLowerCase().includes(searchText.toLowerCase())
  ).slice(0, 8);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = () => {
    // If a city is selected and there's no specific text query, use SEO route
    if (city && !searchText) {
      if (serviceType === "venues") {
        router.push(`/${encodeURIComponent(city.toLowerCase())}`);
      } else {
        const slugType = serviceType.toLowerCase().replace(/ /g, '-');
        router.push(`/${slugType}-in-${encodeURIComponent(city.toLowerCase())}`);
      }
      return;
    }

    // Fallback to query param based searching if text search is used
    const params = new URLSearchParams();
    if (city) params.append("city", city);
    if (searchText) params.append("q", searchText);
    
    if (serviceType === "venues") {
      router.push(`/venues?${params.toString()}`);
    } else {
      params.append("category", serviceType);
      router.push(`/vendors?${params.toString()}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&q=80"
          alt="Luxury Event Venue"
          className="w-full h-full object-cover animate-[zoomOut_12s_ease_forwards]"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[rgba(10,5,10,0.97)] via-[rgba(18,8,14,0.75)] to-[rgba(18,8,14,0.45)]" />

      {/* Content */}
      <div className="relative z-[2] container pb-20 pt-40">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-6 bg-white/30" />
            <span className="text-[10.5px] font-semibold tracking-[3px] uppercase text-white/55">
              Gujarat&apos;s Premier Venue Platform
            </span>
            <div className="h-px w-6 bg-white/30" />
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold leading-[1.05] text-white mb-7">
            Where Every<br />
            <em className="italic text-primary drop-shadow-[0_2px_10px_rgba(255,255,255,0.7)] bg-white/10 px-4 rounded-full">Celebration</em><br />
            Begins
          </h1>

          {/* Search Box */}
          <div className="bg-black/30 backdrop-blur-md border border-white/15 rounded-2xl p-5 max-w-3xl mx-auto mb-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <h3 className="font-display text-xl text-white font-medium mb-4 text-center tracking-wide drop-shadow-md">
              Find Your Perfect Match
            </h3>

            {/* Unified search bar */}
            <div className="flex flex-col md:flex-row gap-2 bg-white/10 border border-white/20 rounded-xl p-2">
              {/* Text search with autocomplete */}
              <div ref={searchRef} className="relative flex-1 min-w-0">
                <input
                  type="text"
                  value={searchText}
                  onChange={e => { setSearchText(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search wedding, birthday, engagement..."
                  className="w-full bg-transparent text-white placeholder-white/40 px-3 h-11 text-sm focus:outline-none"
                />
                {showSuggestions && searchText && filtered.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto border border-border">
                    {filtered.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => { setSearchText(s); setShowSuggestions(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px bg-white/20 my-1" />

              {/* Looking For */}
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger className="bg-transparent border-0 text-white h-11 w-full md:w-40 focus:ring-0 hover:bg-white/5 rounded-lg">
                  <SelectValue placeholder="Looking for..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="venues">Venues</SelectItem>
                  <SelectItem value="photographers">Photographers</SelectItem>
                  <SelectItem value="makeup artists">Makeup Artists</SelectItem>
                  <SelectItem value="decorators">Decorators</SelectItem>
                  <SelectItem value="caterers">Caterers</SelectItem>
                  <SelectItem value="mehndi artists">Mehndi Artists</SelectItem>
                  <SelectItem value="bands">Bands / DJ</SelectItem>
                  <SelectItem value="planners">Event Planners</SelectItem>
                </SelectContent>
              </Select>

              {/* Divider */}
              <div className="hidden md:block w-px bg-white/20 my-1" />

              {/* City */}
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="bg-transparent border-0 text-white h-11 w-full md:w-36 focus:ring-0 hover:bg-white/5 rounded-lg">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {gujaratCities.map(c => (
                    <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                className="bg-primary hover:bg-primary/90 text-white h-11 px-6 text-xs font-semibold tracking-wider uppercase shadow-md rounded-lg flex-shrink-0"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>

            {/* Popular Searches */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {["Wedding", "Birthday Party", "Engagement", "Corporate Event", "Sangeet Ceremony"].map(label => (
                <button
                  key={label}
                  onClick={() => {
                    setSearchText(label);
                    router.push(`/venues?q=${encodeURIComponent(label)}`);
                  }}
                  className="text-xs text-white/45 hover:text-white/80 transition-colors bg-white/5 border border-white/10 rounded-full px-3 py-1"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 justify-center flex-wrap mt-2">
            <Button
              size="lg"
              onClick={() => router.push('/list-venue')}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-xs font-semibold tracking-wider uppercase shadow-lg"
            >
              List a Venue
            </Button>
            <Button
              size="lg"
              onClick={() => router.push('/list-vendor')}
              className="bg-white/10 backdrop-blur-sm border border-white/45 text-white hover:bg-white/20 hover:border-white px-8 py-6 text-xs font-semibold tracking-wider uppercase"
            >
              List a Vendor Service
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3] flex flex-col items-center gap-2 text-white/35 text-[9px] tracking-[2px] uppercase">
        <div className="w-px h-12 bg-white/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white/50 animate-[scrollAnim_2s_ease-in-out_infinite]" />
        </div>
        <span>Scroll</span>
      </div>

      <style>{`
        @keyframes zoomOut {
          from { transform: scale(1.08); }
          to { transform: scale(1.00); }
        }
        @keyframes scrollAnim {
          0% { top: -100%; }
          100% { top: 200%; }
        }
      `}</style>
    </section>
  );
};

export default HeroSearch;
