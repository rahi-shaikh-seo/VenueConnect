import { Search, MapPin, Users, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-venue.jpg";

const eventTypes = [
  "Wedding", "Engagement", "Birthday Party", "Corporate Event",
  "Reception", "Kitty Party", "Conference", "Pool Party"
];

const cities = [
  "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar",
  "Bhavnagar", "Jamnagar", "Anand", "Mehsana"
];

const HeroSearch = () => {
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Beautiful wedding venue in Gujarat" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-foreground/30" />
      </div>

      <div className="container relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-primary-foreground">Gujarat's #1 Venue Discovery Platform</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground leading-tight mb-4">
            Find Your Perfect <br />
            <span className="text-gradient">Event Venue</span>
          </h1>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl">
            Discover and book the best venues across Gujarat for weddings, parties, corporate events and more.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="glass rounded-2xl p-4 md:p-6 max-w-4xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Event Type
              </label>
              <select className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary/30 outline-none">
                <option value="">Select event</option>
                {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-3 h-3" /> City
              </label>
              <select className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary/30 outline-none">
                <option value="">Select city</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Users className="w-3 h-3" /> Guests
              </label>
              <select className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary/30 outline-none">
                <option value="">How many?</option>
                <option value="50">Up to 50</option>
                <option value="100">50 - 100</option>
                <option value="300">100 - 300</option>
                <option value="500">300 - 500</option>
                <option value="1000">500 - 1000</option>
                <option value="1001">1000+</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3 h-3" /> Date
              </label>
              <input
                type="date"
                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary/30 outline-none"
              />
            </div>
          </div>

          <Button className="w-full md:w-auto mt-4 gradient-primary text-primary-foreground border-0 px-8 h-11 text-base font-semibold hover:opacity-90 transition-opacity">
            <Search className="w-4 h-4 mr-2" /> Search Venues
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSearch;
