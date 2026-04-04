"use client";

import { useEffect, useState } from "react";
import { citiesData } from "@/lib/citiesData";
import { Search, MapPin, ArrowRight, Building2, Store } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/PageHeader";

export default function CitiesPage() {
    const [search, setSearch] = useState("");
    const [filteredCities, setFilteredCities] = useState(citiesData);

    useEffect(() => {
        const filtered = citiesData.filter(city => 
            city.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredCities(filtered);
    }, [search]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <PageHeader 
                title="Browse Cities"
                subtitle="Find top-rated wedding venues and vendors across Gujarat"
                image="https://images.unsplash.com/photo-1621250284428-1b2f4477699f?w=1600&q=80"
            />

            <main className="flex-grow py-16">
                <div className="container px-4 mx-auto max-w-7xl">
                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-16 relative">
                        <div className="relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input 
                                type="text"
                                placeholder="Search city in Gujarat..."
                                className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-light"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        {search && (
                            <p className="mt-4 text-center text-slate-500 font-light">
                                Showing {filteredCities.length} results for "{search}"
                            </p>
                        )}
                    </div>

                    {/* Cities Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredCities.map((city, index) => (
                                <motion.div
                                    key={city.slug}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Link 
                                        href={`/venues?city=${encodeURIComponent(city.name)}`}
                                        className="group block bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 hover:border-primary/30 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col"
                                    >
                                        <div className="relative h-64 overflow-hidden">
                                            <img 
                                                src={city.image} 
                                                alt={city.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                                            
                                            <div className="absolute bottom-6 left-6 right-6">
                                                <div className="flex items-center gap-2 text-white mb-1">
                                                    <MapPin className="w-4 h-4 text-primary" />
                                                    <h3 className="text-2xl font-display font-bold">{city.name}</h3>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                                                        <Building2 className="w-3 h-3" /> {city.venues} Venues
                                                    </span>
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                                                        <Store className="w-3 h-3" /> {city.vendors} Vendors
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 flex flex-col flex-grow">
                                            <div className="mt-auto flex items-center justify-between text-primary font-bold text-sm tracking-wide uppercase">
                                                <span>Explore Now</span>
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {filteredCities.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">No Cities Found</h3>
                            <p className="text-slate-500 font-light">We couldn't find any city matching "{search}".<br/>Please try a different search term.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
