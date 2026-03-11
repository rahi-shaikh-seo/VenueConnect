import { Star, Users, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const venues = [
  {
    name: "The Grand Rajwada",
    city: "Ahmedabad",
    capacity: "200-1500",
    area: "25,000 sq ft",
    rating: 4.8,
    reviews: 245,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80",
    featured: true,
    verified: true,
    amenities: ["AC Banquet", "Parking", "Catering"]
  },
  {
    name: "Royal Greens Farmhouse",
    city: "Surat",
    capacity: "100-800",
    area: "15,000 sq ft",
    rating: 4.6,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80",
    featured: true,
    verified: true,
    amenities: ["Outdoor", "Pool", "Garden"]
  },
  {
    name: "Lakshmi Vilas Banquet",
    city: "Vadodara",
    capacity: "300-2000",
    area: "30,000 sq ft",
    rating: 4.9,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&q=80",
    featured: true,
    verified: true,
    amenities: ["AC Hall", "Stage", "Decor"]
  },
  {
    name: "Sapphire Convention",
    city: "Rajkot",
    capacity: "150-1000",
    area: "18,000 sq ft",
    rating: 4.5,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80",
    featured: false,
    verified: true,
    amenities: ["Conference", "WiFi", "Projector"]
  },
];

const FeaturedVenues = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-primary/30" />
            <span className="text-[10.5px] font-semibold tracking-[3px] uppercase text-primary">
              Handpicked for You
            </span>
            <div className="h-px w-12 bg-primary/30" />
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Featured <em className="italic text-primary">Venues</em>
          </h2>
          
          <p className="text-[15px] text-muted-foreground max-w-xl mx-auto">
            Discover verified venues trusted by thousands of event organizers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {venues.map((venue, i) => (
            <motion.div
              key={venue.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to="/venues"
                className="group bg-white rounded-xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 cursor-pointer block h-full"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {venue.featured && (
                    <span className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider">
                      Featured
                    </span>
                  )}
                  {venue.verified && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/95 backdrop-blur-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-[10px] font-bold text-foreground">VERIFIED</span>
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-foreground/80 backdrop-blur-sm text-white text-xs font-semibold">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> 
                    {venue.rating} <span className="text-white/60">({venue.reviews})</span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-display font-semibold text-foreground text-lg leading-tight group-hover:text-primary transition-colors">
                    {venue.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" /> 
                    <span>{venue.city}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="w-4 h-4 text-primary" /> 
                    <span>{venue.capacity} Guests</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {venue.amenities.slice(0, 3).map((amenity, idx) => (
                      <span 
                        key={idx}
                        className="text-[10px] px-2 py-1 rounded-full bg-primary/5 text-primary font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-white mt-3">
                    <Send className="w-3.5 h-3.5 mr-1.5" /> Get Best Price
                  </Button>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/venues">
            <Button variant="outline" size="lg" className="border-primary/30 text-primary hover:bg-primary/5">
              View All Venues →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVenues;
