import { TrendingUp, Eye, Clock, Star, MapPin, Users, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const trendingVenues = [
  {
    name: "The Grand Rajwada Palace",
    city: "Ahmedabad",
    area: "SG Highway",
    capacity: "500-2000",
    rating: 4.9,
    reviews: 342,
    views: "2.4k views",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
    badge: "Most Viewed"
  },
  {
    name: "Royal Greens Farmhouse",
    city: "Surat",
    area: "Adajan",
    capacity: "200-800",
    rating: 4.7,
    reviews: 218,
    views: "1.8k views",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
    badge: "Recently Searched"
  },
  {
    name: "Lakshmi Vilas Convention",
    city: "Vadodara",
    area: "Alkapuri",
    capacity: "300-1500",
    rating: 4.8,
    reviews: 289,
    views: "2.1k views",
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80",
    badge: "Trending"
  },
];

const TrendingVenues = () => {
  return (
    <section className="py-4 md:py-6 bg-gradient-to-b from-primary/5 to-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-[10.5px] font-semibold tracking-[3px] uppercase text-primary">
                Hot Right Now
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
              Trending <em className="italic text-primary">Venues</em>
            </h2>
          </div>
          
          <Link to="/venues">
            <Button variant="outline" className="hidden md:flex border-primary/30 text-primary hover:bg-primary/5">
              View All Trending
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trendingVenues.map((venue, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to="/venues"
                className="group bg-white rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 block h-full"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 rounded-full bg-primary text-white text-xs font-semibold flex items-center gap-1.5">
                      <TrendingUp className="w-3 h-3" />
                      {venue.badge}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-xs font-medium">
                    <Eye className="w-3.5 h-3.5 text-primary" />
                    <span>{venue.views}</span>
                  </div>

                  <div className="absolute bottom-4 right-4 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-foreground/80 backdrop-blur-sm text-white text-xs font-semibold">
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
                    <span>{venue.area}, {venue.city}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="w-4 h-4 text-primary" /> 
                    <span>{venue.capacity} Guests</span>
                  </div>

                  <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-white mt-3">
                    <Send className="w-3.5 h-3.5 mr-1.5" /> Send Enquiry
                  </Button>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingVenues;
