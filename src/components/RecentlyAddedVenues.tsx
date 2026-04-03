"use client";

import { Clock, MapPin, Users, Send, CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

const recentVenues = [
  {
    name: "Emerald Gardens",
    city: "Ahmedabad",
    area: "Bopal",
    capacity: "300-1000",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
    addedDays: "2 days ago",
    verified: true
  },
  {
    name: "Crystal Palace Banquet",
    city: "Surat",
    area: "Vesu",
    capacity: "500-1500",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&q=80",
    addedDays: "3 days ago",
    verified: true
  },
  {
    name: "Sunset Farmhouse",
    city: "Vadodara",
    area: "Waghodia",
    capacity: "200-800",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    addedDays: "5 days ago",
    verified: true
  },
  {
    name: "Royal Convention Center",
    city: "Rajkot",
    area: "Kalawad Road",
    capacity: "400-1200",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    addedDays: "1 week ago",
    verified: true
  },
];

const RecentlyAddedVenues = () => {
  return (
    <section className="py-4 md:py-6 bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-[10.5px] font-semibold tracking-[3px] uppercase text-primary">
                Fresh Listings
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
              Recently <em className="italic text-primary">Added Venues</em>
            </h2>
          </div>
          
          <Link href="/venues">
            <Button variant="outline" className="hidden md:flex border-primary/30 text-primary hover:bg-primary/5">
              View All New
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentVenues.map((venue, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link 
                href="/venues"
                className="group bg-white rounded-xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 block h-full"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 rounded-full bg-green-500 text-white text-xs font-semibold flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      New
                    </span>
                  </div>

                  {venue.verified && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/95 backdrop-blur-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-xs font-medium text-foreground">Verified</span>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 text-white/90 text-xs font-medium">
                    Added {venue.addedDays}
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

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="w-4 h-4 text-primary" /> 
                      <span>{venue.capacity}</span>
                    </div>
                    <div className="flex items-center gap-1 text-foreground font-semibold">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      {venue.rating}
                    </div>
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

export default RecentlyAddedVenues;
