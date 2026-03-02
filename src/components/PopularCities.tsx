import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const cities = [
  { name: "Ahmedabad", venues: 250, slug: "ahmedabad" },
  { name: "Surat", venues: 180, slug: "surat" },
  { name: "Vadodara", venues: 150, slug: "vadodara" },
  { name: "Rajkot", venues: 120, slug: "rajkot" },
  { name: "Gandhinagar", venues: 80, slug: "gandhinagar" },
  { name: "Bhavnagar", venues: 60, slug: "bhavnagar" },
  { name: "Jamnagar", venues: 55, slug: "jamnagar" },
  { name: "Anand", venues: 45, slug: "anand" },
  { name: "Mehsana", venues: 40, slug: "mehsana" },
];

const gradients = [
  "from-primary to-accent",
  "from-accent to-golden",
  "from-venue-green to-accent",
  "from-golden to-primary",
  "from-primary to-venue-green",
  "from-accent to-primary",
  "from-golden to-accent",
  "from-venue-green to-golden",
  "from-primary to-golden",
];

const PopularCities = () => {
  return (
    <section className="py-16 bg-secondary/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Popular Cities in Gujarat
          </h2>
          <p className="text-muted-foreground">Discover venues in top Gujarat cities</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {cities.map((city, i) => (
            <motion.div
              key={city.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/venues/${city.slug}`}
                className="group block rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className={`bg-gradient-to-br ${gradients[i]} p-6 text-center relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_120%,white_0%,transparent_60%)]" />
                  <MapPin className="w-8 h-8 mx-auto mb-3 text-primary-foreground group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-bold text-primary-foreground">{city.name}</h3>
                  <p className="text-sm text-primary-foreground/80 mt-1">{city.venues}+ Venues</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCities;
