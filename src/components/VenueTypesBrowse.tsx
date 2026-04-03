import { Building2, Home, TreePine, Hotel, Waves, UtensilsCrossed, Users2, Building } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const venueTypes = [
  {
    icon: Building2,
    name: "Banquet Halls",
    count: "2,400+",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80"
  },
  {
    icon: Home,
    name: "Party Plots",
    count: "1,800+",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80"
  },
  {
    icon: TreePine,
    name: "Farmhouses",
    count: "950+",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80"
  },
  {
    icon: Hotel,
    name: "Hotels",
    count: "1,200+",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80"
  },
  {
    icon: Waves,
    name: "Resorts",
    count: "680+",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80"
  },
  {
    icon: UtensilsCrossed,
    name: "Restaurants",
    count: "1,500+",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80"
  },
  {
    icon: Users2,
    name: "Clubs",
    count: "420+",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80"
  },
  {
    icon: Building,
    name: "Convention Centers",
    count: "340+",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80"
  },
];

const VenueTypesBrowse = () => {
  return (
    <section className="py-4 md:py-6 bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-primary/30" />
            <span className="text-[10.5px] font-semibold tracking-[3px] uppercase text-primary">
              Venue Categories
            </span>
            <div className="h-px w-12 bg-primary/30" />
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Browse by <em className="italic text-primary">Venue Type</em>
          </h2>
          
          <p className="text-[15px] text-muted-foreground max-w-2xl mx-auto">
            Find the perfect venue type that matches your event style
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {venueTypes.map((type, i) => {
            const Icon = type.icon;
            return (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/venues?type=${encodeURIComponent(type.name.replace(/s$/, ''))}`}
                  className="group relative h-48 rounded-xl overflow-hidden cursor-pointer block"
                >
                  <img
                    src={type.image}
                    alt={type.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20 group-hover:from-primary/90 group-hover:via-primary/60 transition-all duration-300" />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <Icon className="w-10 h-10 text-white mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-white text-base mb-1">
                      {type.name}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {type.count} venues
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default VenueTypesBrowse;
