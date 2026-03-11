import Navbar from "@/components/Navbar";
import HeroSearch from "@/components/HeroSearch";
import OccasionSlider from "@/components/OccasionSlider";
import EventTypeExplorer from "@/components/EventTypeExplorer";
import VendorCategories from "@/components/VendorCategories";
import PopularCities from "@/components/PopularCities";
import TrendingVenues from "@/components/TrendingVenues";
import VenueTypesBrowse from "@/components/VenueTypesBrowse";
import FeaturedVenues from "@/components/FeaturedVenues";
import VenueMoodExplorer from "@/components/VenueMoodExplorer";
import GetQuoteCTA from "@/components/GetQuoteCTA";
import RecentlyAddedVenues from "@/components/RecentlyAddedVenues";
import HowItWorks from "@/components/HowItWorks";
import VenueOwnerCTA from "@/components/VenueOwnerCTA";
import LocalAreaDiscovery from "@/components/LocalAreaDiscovery";
import EventGallery from "@/components/EventGallery";
import Testimonials from "@/components/Testimonials";
import PopularSearches from "@/components/PopularSearches";
import StatsBand from "@/components/StatsBand";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="VenueConnect Gujarat | Find & Book Wedding Venues, Banquet Halls & Party Plots"
        description="Gujarat's premier venue discovery platform. Find the perfect banquet halls, farmhouses, hotels, and party plots for weddings and events across Ahmedabad, Surat, Rajkot, and Vadodara."
      />
      <Navbar />
      <HeroSearch />
      <OccasionSlider />
      <VendorCategories />
      <EventTypeExplorer />
      <PopularCities />
      <TrendingVenues />
      <VenueTypesBrowse />
      <FeaturedVenues />
      <VenueMoodExplorer />
      <GetQuoteCTA />
      <RecentlyAddedVenues />
      <HowItWorks />
      <VenueOwnerCTA />
      <LocalAreaDiscovery />
      <EventGallery />
      <Testimonials />
      <PopularSearches />
      <StatsBand />
      <Footer />
    </div>
  );
};

export default Index;
