import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { citiesData } from "@/lib/citiesData";

const Cities = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SEO 
                title="Venues by City in Gujarat"
                description="Explore the best wedding venues and event professionals across Ahmedabad, Surat, Rajkot, Vadodara, and other major cities in Gujarat. Your local event planning partner."
            />
            <Navbar />

            <PageHeader
                title="Explore by City"
                subtitle="Find the perfect venues and vendors in your preferred location"
                image="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&q=80"
            />

            <main className="flex-grow py-20 bg-muted/20">
                <div className="container">
                    <div className="text-center mb-16">
                        <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
                            Top Desinations in Gujarat
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Browse through our curated list of cities offering the best event spaces and services.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {citiesData.map((city) => (
                            <Link
                                key={city.name}
                                to={`/venues?city=${city.name}`}
                                className="group relative h-80 rounded-2xl overflow-hidden block"
                            >
                                <img
                                    src={city.image}
                                    alt={city.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <h3 className="font-display text-3xl font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                                        {city.name}
                                    </h3>
                                    <div className="flex items-center gap-4 text-white/80 text-sm">
                                        <span><strong>{city.venues}</strong> Venues</span>
                                        <span className="w-1 h-1 rounded-full bg-white/50" />
                                        <span><strong>{city.vendors}</strong> Vendors</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Cities;
