import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Building2, Store, ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const ListBusiness = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            {/* Hero Banner */}
            <div className="relative h-52 flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
                <img
                    src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=80"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                />
                <div className="relative z-10 text-center text-white px-4">
                    <h1 className="font-display text-3xl md:text-4xl font-semibold mb-2">List Your Business</h1>
                    <p className="text-white/60 text-sm">Join thousands of vendors and venues on VenueConnect</p>
                </div>
            </div>

            <main className="flex-grow py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <p className="text-center text-slate-500 mb-12 text-base">
                        What type of business are you listing?
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Venue Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            onClick={() => navigate('/list-venue')}
                            className="group cursor-pointer bg-white rounded-3xl border-2 border-border hover:border-primary shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            <div className="h-48 overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80"
                                    alt="Venue"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-8">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                                    <Building2 className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="font-display text-2xl font-semibold text-slate-900 mb-3">List a Venue</h2>
                                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                                    Banquet halls, hotels, resorts, gardens, farmhouses, rooftops and more. Reach couples and event organizers across Gujarat.
                                </p>
                                <ul className="space-y-2 mb-8">
                                    {["Banquet Halls", "Wedding Resorts", "Hotels & Convention Centers", "Garden & Outdoor Spaces", "Farmhouses"].map(v => (
                                        <li key={v} className="flex items-center gap-2 text-sm text-slate-600">
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            {v}
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-primary">Register as Venue</span>
                                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                        <ArrowRight className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Vendor Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            onClick={() => navigate('/list-vendor')}
                            className="group cursor-pointer bg-white rounded-3xl border-2 border-border hover:border-primary shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            <div className="h-48 overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80"
                                    alt="Vendor"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-8">
                                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                                    <Store className="w-6 h-6 text-purple-600" />
                                </div>
                                <h2 className="font-display text-2xl font-semibold text-slate-900 mb-3">List a Vendor Service</h2>
                                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                                    Photographers, makeup artists, decorators, caterers and 18+ more categories. Connect with couples planning their big day.
                                </p>
                                <ul className="space-y-2 mb-8">
                                    {["Photographers & Videographers", "Makeup & Mehndi Artists", "Decorators & Florists", "Caterers & Cakes", "DJs, Bands & Entertainers"].map(v => (
                                        <li key={v} className="flex items-center gap-2 text-sm text-slate-600">
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            {v}
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-purple-600">Register as Vendor</span>
                                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                        <ArrowRight className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Benefits Row */}
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {[
                            { label: "Free Listing", sub: "No upfront cost" },
                            { label: "Direct Leads", sub: "Customers contact you directly" },
                            { label: "Verified Badge", sub: "Build instant trust" },
                            { label: "24hr Approval", sub: "Go live quickly" },
                        ].map(b => (
                            <div key={b.label} className="bg-muted/40 rounded-2xl p-5">
                                <p className="font-semibold text-slate-800 text-sm">{b.label}</p>
                                <p className="text-xs text-slate-500 mt-1">{b.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ListBusiness;
