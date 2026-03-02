import Navbar from "@/components/Navbar";
import HeroSearch from "@/components/HeroSearch";
import CategorySwiper from "@/components/CategorySwiper";
import PopularCities from "@/components/PopularCities";
import FeaturedVenues from "@/components/FeaturedVenues";
import VenueTypes from "@/components/VenueTypes";
import InstantMatch from "@/components/InstantMatch";
import HowItWorks from "@/components/HowItWorks";
import VenueOwnerCTA from "@/components/VenueOwnerCTA";
import Testimonials from "@/components/Testimonials";
import PopularSearches from "@/components/PopularSearches";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSearch />
      <CategorySwiper />
      <PopularCities />
      <FeaturedVenues />
      <VenueTypes />
      <InstantMatch />
      <HowItWorks />
      <VenueOwnerCTA />
      <Testimonials />
      <PopularSearches />
      <Footer />
    </div>
  );
};

export default Index;
