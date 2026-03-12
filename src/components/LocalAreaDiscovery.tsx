import { MapPin, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const areas: Record<string, string[]> = {
  Ahmedabad: [
    "SG Highway", "Bopal", "Vastrapur", "Satellite", "Prahlad Nagar",
    "Thaltej", "Bodakdev", "Maninagar", "Naranpura", "Chandkheda"
  ],
  Surat: [
    "Adajan", "Vesu", "Pal", "Althan", "Piplod",
    "Citylight", "Ghod Dod Road", "Udhna", "Katargam", "Rander"
  ],
  Vadodara: [
    "Alkapuri", "Waghodia", "Manjalpur", "Gotri", "Vasna",
    "Akota", "Fatehgunj", "Sayajigunj", "Karelibaug", "Sama"
  ],
  Rajkot: [
    "Kalawad Road", "University Road", "Raiya Road", "150 Feet Ring Road", "Mavdi",
    "Kotecha Chowk", "Yagnik Road", "Jamnagar Road", "Gondal Road", "Bhaktinagar"
  ]
};

const LocalAreaDiscovery = () => {
  return (
    <section className="py-4 md:py-6 bg-gradient-to-b from-primary/5 to-white">
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
              Local Discovery
            </span>
            <div className="h-px w-12 bg-primary/30" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Explore Venues by <em className="italic text-primary">Area</em>
          </h2>
          <p className="text-[15px] text-muted-foreground max-w-2xl mx-auto">
            Find the perfect venue in your preferred locality
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(areas).map(([city, localities], cityIndex) => (
            <motion.div
              key={city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: cityIndex * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-2 mb-5">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="font-display text-2xl font-semibold text-foreground">{city}</h3>
                <Link
                  to={`/venues?city=${encodeURIComponent(city)}`}
                  className="ml-auto text-xs text-primary hover:underline font-medium"
                >
                  All in {city} →
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {localities.map((area) => (
                  <Link
                    key={area}
                    to={`/venues?city=${encodeURIComponent(city)}&area=${encodeURIComponent(area)}`}
                    className="group flex items-center justify-between px-4 py-3 rounded-lg bg-primary/5 hover:bg-primary hover:text-white transition-all duration-200"
                    title={`Venues in ${area}, ${city}`}
                  >
                    <span className="text-sm font-medium text-foreground group-hover:text-white">
                      {area}
                    </span>
                    <ChevronRight className="w-4 h-4 text-primary group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocalAreaDiscovery;
