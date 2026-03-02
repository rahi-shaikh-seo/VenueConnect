import { Link } from "react-router-dom";
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground pt-20 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="mb-6">
              <img 
                src="/logo.svg" 
                alt="VenueConnect" 
                className="h-14 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-background/70 text-sm leading-relaxed mb-6">
              Gujarat's leading venue discovery platform. Find, compare and book the best event venues.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold text-background mb-5">Quick Links</h4>
            <div className="space-y-3">
              <Link to="/" className="block text-sm text-background/70 hover:text-primary transition-colors">Home</Link>
              <Link to="/venues" className="block text-sm text-background/70 hover:text-primary transition-colors">All Venues</Link>
              <Link to="/list-venue" className="block text-sm text-background/70 hover:text-primary transition-colors">List Your Venue</Link>
              <Link to="/blog" className="block text-sm text-background/70 hover:text-primary transition-colors">Blog</Link>
              <Link to="/about" className="block text-sm text-background/70 hover:text-primary transition-colors">About Us</Link>
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold text-background mb-5">Top Cities</h4>
            <div className="space-y-3">
              {["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"].map(c => (
                <Link key={c} to={`/venues/${c.toLowerCase()}`} className="block text-sm text-background/70 hover:text-primary transition-colors">
                  Venues in {c}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold text-background mb-5">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm text-background/70">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" /> 
                <a href="mailto:info@venueconnect.in" className="hover:text-primary transition-colors">
                  info@venueconnect.in
                </a>
              </div>
              <div className="flex items-start gap-3 text-sm text-background/70">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" /> 
                <a href="tel:+919876543210" className="hover:text-primary transition-colors">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-start gap-3 text-sm text-background/70">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" /> 
                <span>Ahmedabad, Gujarat, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/50">
            © 2026 VenueConnect. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-background/50">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/sitemap" className="hover:text-primary transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
