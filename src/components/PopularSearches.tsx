import { Search, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

// Each entry: label shown, and the URL it navigates to on the /venues page
const searches: { label: string; url: string }[] = [
  { label: "Wedding venues in Ahmedabad",        url: "/venues?city=Ahmedabad&q=Wedding" },
  { label: "Banquet halls in Surat",             url: "/venues?city=Surat&type=Banquet+Hall" },
  { label: "Farmhouses in Vadodara",             url: "/venues?city=Vadodara&type=Farmhouse" },
  { label: "Birthday party venues in Rajkot",    url: "/venues?city=Rajkot&q=Birthday" },
  { label: "Corporate event venues in Gandhinagar", url: "/venues?city=Gandhinagar&q=Corporate" },
  { label: "Engagement venues in Ahmedabad",     url: "/venues?city=Ahmedabad&q=Engagement" },
  { label: "Pool party venues in Surat",         url: "/venues?city=Surat&q=Pool+Party" },
  { label: "Garba venues in Vadodara",           url: "/venues?city=Vadodara&q=Garba" },
  { label: "Kitty party venues in Ahmedabad",    url: "/venues?city=Ahmedabad&q=Kitty+Party" },
  { label: "Reception halls in Surat",           url: "/venues?city=Surat&q=Reception" },
  { label: "Party plots in Vadodara",            url: "/venues?city=Vadodara&type=Party+Plot" },
  { label: "Hotels for events in Rajkot",        url: "/venues?city=Rajkot&type=Hotel" },
  { label: "Resorts in Gandhinagar",             url: "/venues?city=Gandhinagar&type=Resort" },
  { label: "Restaurant venues in Ahmedabad",     url: "/venues?city=Ahmedabad&q=Restaurant" },
  { label: "Convention centers in Surat",        url: "/venues?city=Surat&type=Convention+Centre" },
  { label: "Luxury venues in Vadodara",          url: "/venues?city=Vadodara&q=Luxury" },
  { label: "Garden venues in Ahmedabad",         url: "/venues?city=Ahmedabad&q=Garden" },
  { label: "Rooftop venues in Surat",            url: "/venues?city=Surat&q=Rooftop" },
  { label: "Heritage venues in Vadodara",        url: "/venues?city=Vadodara&q=Heritage" },
  { label: "Budget venues in Rajkot",            url: "/venues?city=Rajkot&q=Budget" },
];

const PopularSearches = () => {
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
              SEO Discovery
            </span>
            <div className="h-px w-12 bg-primary/30" />
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Popular <em className="italic text-primary">Searches</em>
          </h2>

          <p className="text-[15px] text-muted-foreground max-w-2xl mx-auto">
            Quick access to the most searched venue categories
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-3 justify-center max-w-5xl mx-auto">
          {searches.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.02 }}
            >
              <Link
                href={item.url}
                className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary/5 hover:bg-primary hover:text-white border border-primary/20 hover:border-primary transition-all duration-200"
                title={item.label}
              >
                <Search className="w-3.5 h-3.5 text-primary group-hover:text-white shrink-0" />
                <span className="text-sm font-medium text-foreground group-hover:text-white">
                  {item.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Can't find what you're looking for?
          </p>
          <Link
            href="/venues"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            Explore All Venues
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularSearches;
