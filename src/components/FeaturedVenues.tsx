import { Star, Users, MapPin, IndianRupee, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const venues = [
  {
    name: "The Grand Rajwada",
    city: "Ahmedabad",
    capacity: "200-1500",
    area: "25,000 sq ft",
    price: "₹2,50,000",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80",
    featured: true,
  },
  {
    name: "Royal Greens Farmhouse",
    city: "Surat",
    capacity: "100-800",
    area: "15,000 sq ft",
    price: "₹1,50,000",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80",
    featured: true,
  },
  {
    name: "Lakshmi Vilas Banquet",
    city: "Vadodara",
    capacity: "300-2000",
    area: "30,000 sq ft",
    price: "₹3,00,000",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&q=80",
    featured: true,
  },
  {
    name: "Sapphire Convention",
    city: "Rajkot",
    capacity: "150-1000",
    area: "18,000 sq ft",
    price: "₹1,80,000",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80",
    featured: false,
  },
];

const FeaturedVenues = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              Featured Venues
            </h2>
            <p className="text-muted-foreground">Handpicked premium venues across Gujarat</p>
          </div>
          <Button variant="outline" className="hidden md:flex">View All</Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {venues.map((venue, i) => (
            <motion.div
              key={venue.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {venue.featured && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full gradient-primary text-xs font-semibold text-primary-foreground">
                    Featured
                  </span>
                )}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-foreground/70 text-primary-foreground text-xs font-medium">
                  <Star className="w-3 h-3 fill-golden text-golden" /> {venue.rating}
                </div>
              </div>

              <div className="p-4 space-y-3">
                <h3 className="font-display font-bold text-foreground text-lg">{venue.name}</h3>

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" /> {venue.city}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-3.5 h-3.5" /> {venue.capacity}
                  </span>
                  <span className="font-bold text-foreground flex items-center">
                    {venue.price}
                  </span>
                </div>

                <Button size="sm" className="w-full gradient-primary text-primary-foreground border-0 hover:opacity-90">
                  <Send className="w-3.5 h-3.5 mr-1.5" /> Send Enquiry
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedVenues;
