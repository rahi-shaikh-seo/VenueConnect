import { Link } from "react-router-dom";
import { MapPin, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-display font-bold text-background">VenueConnect</span>
            </div>
            <p className="text-background/60 text-sm leading-relaxed">
              Gujarat's leading venue discovery platform. Find, compare and book the best event venues.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-background mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-background/60 hover:text-primary transition-colors">Home</Link>
              <Link to="/venues" className="block text-sm text-background/60 hover:text-primary transition-colors">All Venues</Link>
              <Link to="/list-venue" className="block text-sm text-background/60 hover:text-primary transition-colors">List Your Venue</Link>
              <Link to="/blog" className="block text-sm text-background/60 hover:text-primary transition-colors">Blog</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-background mb-4">Top Cities</h4>
            <div className="space-y-2">
              {["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"].map(c => (
                <Link key={c} to={`/venues/${c.toLowerCase()}`} className="block text-sm text-background/60 hover:text-primary transition-colors">
                  Venues in {c}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-background mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-background/60">
                <Mail className="w-4 h-4" /> info@venueconnect.in
              </div>
              <div className="flex items-center gap-2 text-sm text-background/60">
                <Phone className="w-4 h-4" /> +91 98765 43210
              </div>
              <div className="flex items-start gap-2 text-sm text-background/60">
                <MapPin className="w-4 h-4 mt-0.5" /> Ahmedabad, Gujarat, India
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 pt-6 text-center text-sm text-background/40">
          © 2026 VenueConnect. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
