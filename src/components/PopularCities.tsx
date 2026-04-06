"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { citiesData } from "@/lib/citiesData";

const PopularCities = () => {
  return (
    <section className="py-4 md:py-6 bg-gradient-to-b from-white to-primary/5">
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
              Explore Gujarat
            </span>
            <div className="h-px w-12 bg-primary/30" />
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Popular Cities in <span className="text-primary">Gujarat</span>
          </h2>

          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Discover venues in top Gujarat cities
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {citiesData.slice(0, 10).map((city, i) => (
            <motion.div
              key={city.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/${encodeURIComponent(city.name.toLowerCase())}`}
                className="group block relative rounded-2xl overflow-hidden aspect-square shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {/* City Image */}
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                  <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    <h3 className="text-xl md:text-2xl font-display font-semibold text-white leading-tight">
                      {city.name}
                    </h3>
                  </div>
                  <p className="text-white/80 text-xs md:text-sm mb-2 md:mb-3">
                    {city.venues}+ Venues
                  </p>

                  <div className="flex items-center gap-1.5 md:gap-2 text-white text-xs md:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="hidden sm:inline">Explore Venues</span>
                    <span className="sm:hidden">Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </div>
                </div>

                {/* Hover Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary transition-colors rounded-2xl" />
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
            <Link href="/cities" className="inline-flex items-center justify-center gap-2 pt-2 pb-2 pl-4 pr-6 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
                View All Cities <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularCities;
