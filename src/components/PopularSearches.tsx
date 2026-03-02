import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const searches = [
  "Wedding venues in Ahmedabad",
  "Banquet halls in Surat",
  "Farmhouses in Vadodara",
  "Party plots in Rajkot",
  "Birthday party venues in Ahmedabad",
  "Corporate event venues Surat",
  "Engagement venues Gandhinagar",
  "Pool party venues Ahmedabad",
  "Reception halls Vadodara",
  "Garba venues Ahmedabad",
  "Conference halls Surat",
  "Kitty party venues Rajkot",
  "Resorts for wedding near Ahmedabad",
  "Budget wedding venues Surat",
  "Luxury banquet halls Vadodara",
];

const PopularSearches = () => {
  return (
    <section className="py-16 bg-secondary/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Trending</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Popular Searches
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3">
          {searches.map((s) => (
            <Link
              key={s}
              to={`/search?q=${encodeURIComponent(s)}`}
              className="px-4 py-2 rounded-full bg-card border border-border text-sm text-foreground hover:border-primary hover:text-primary transition-colors shadow-sm"
            >
              {s}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularSearches;
