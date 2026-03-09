import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { gujaratCities } from "@/lib/cities";

const HeroSearch = () => {
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState("venues");
  const [city, setCity] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) params.append("city", city);
    
    if (serviceType === "venues") {
        navigate(`/venues?${params.toString()}`);
    } else {
        params.append("category", serviceType);
        navigate(`/vendors?${params.toString()}`);
    }
  };
  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80"
          alt="Luxury Event Venue"
          className="w-full h-full object-cover animate-[zoomOut_12s_ease_forwards]"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[rgba(18,8,14,0.95)] via-[rgba(18,8,14,0.55)] to-[rgba(18,8,14,0.15)]" />

      {/* Content */}
      <div className="relative z-[2] container pb-20 pt-40">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-6 bg-white/30" />
            <span className="text-[10.5px] font-semibold tracking-[3px] uppercase text-white/55">
              India's Premier Venue Platform
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
          <div className="bg-white/20 backdrop-blur-md border border-white/40 rounded-3xl p-8 max-w-3xl mx-auto mb-12 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <h3 className="font-display text-2xl text-white font-medium mb-6 text-center tracking-wide drop-shadow-md">
              Find Your Perfect Match
            </h3>

            <div className="grid md:grid-cols-[1fr_1fr_auto] gap-3">
              <div>
                <label className="text-[9px] font-semibold tracking-[2px] uppercase text-white/40 mb-2 block">
                  Looking For
                </label>
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white h-12 hover:bg-white/15">
                    <SelectValue placeholder="What are you looking for?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="venues">All Venues</SelectItem>
                    <SelectItem value="photographers">Photographers</SelectItem>
                    <SelectItem value="makeup artists">Makeup Artists</SelectItem>
                    <SelectItem value="decorators">Decorators</SelectItem>
                    <SelectItem value="caterers">Caterers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-[9px] font-semibold tracking-[2px] uppercase text-white/40 mb-2 block">
                  City
                </label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white h-12 hover:bg-white/15">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {gujaratCities.map(c => (
                        <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 text-[11px] font-semibold tracking-[2px] uppercase shadow-lg transition-all hover:scale-105 duration-300"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Popular Searches */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-white/40 mb-2">Popular Searches:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Wedding Venues", val: "venues", type: "venues" },
                  { label: "Best Photographers", val: "photographers", type: "vendors" },
                  { label: "Makeup Artists", val: "makeup artists", type: "vendors" }
                ].map((search) => (
                  <button
                    key={search.label}
                    onClick={() => {
                        if (search.type === "venues") {
                            navigate('/venues');
                        } else {
                            navigate(`/vendors?category=${search.val}`);
                        }
                    }}
                    className="text-xs text-white/60 hover:text-white transition-colors underline bg-transparent border-none p-0 cursor-pointer"
                  >
                    {search.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap mt-8">
            <Button
              size="lg"
              onClick={() => navigate('/list-venue')}
              className="bg-white/10 backdrop-blur-sm border border-white/45 text-white hover:bg-white/20 hover:border-white px-8 py-6 text-xs font-semibold tracking-wider uppercase"
            >
              List Your Business / Service
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
