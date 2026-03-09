import { Link } from "react-router-dom";
import { Building2, Mail, Phone, MapPin, Instagram, Facebook, Twitter, Linkedin, Heart } from "lucide-react";
import { gujaratCities } from "@/lib/cities";

const Footer = () => {
  return (
    <footer className="bg-[#0A0508] relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      <div className="container relative z-10 pt-24 pb-12">
        {/* Newsletter Section */}
        <div className="max-w-4xl mx-auto text-center mb-24 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-10 md:p-14 shadow-2xl">
          <h3 className="font-display text-3xl md:text-5xl font-semibold text-white mb-4">
            Join the <span className="italic font-light text-primary">Guest List</span>
          </h3>
          <p className="text-white/60 mb-8 max-w-xl mx-auto font-light">
            Subscribe to our newsletter for exclusive venue deals, event inspiration, and the latest trends in luxury celebrations.
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors font-light"
            />
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold tracking-[2px] uppercase text-xs rounded-full px-8 py-4 transition-all shadow-lg hover:shadow-primary/25">
              Subscribe
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16 mb-20">
          <div className="lg:col-span-1">
            <div className="mb-8">
              <img
                src="/logo.webp"
                alt="VenueConnect"
                className="h-14 w-auto brightness-0 invert opacity-90"
              />
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-8 font-light">
              Gujarat's premier venue discovery platform. Curating the finest spaces for your most extraordinary moments and celebrations.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 flex items-center justify-center transition-all group">
                <Facebook className="w-4 h-4 text-white/70 group-hover:text-primary transition-colors" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 flex items-center justify-center transition-all group">
                <Instagram className="w-4 h-4 text-white/70 group-hover:text-primary transition-colors" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 flex items-center justify-center transition-all group">
                <Twitter className="w-4 h-4 text-white/70 group-hover:text-primary transition-colors" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 flex items-center justify-center transition-all group">
                <Linkedin className="w-4 h-4 text-white/70 group-hover:text-primary transition-colors" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] tracking-[3px] uppercase font-semibold text-white/80 mb-8 border-b border-white/10 pb-4 inline-block">Quick Links</h4>
            <ul className="space-y-3 mt-4">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors inline-block">About Us</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors inline-block">Contact Us</Link></li>
              <li><Link to="/list-venue" className="text-muted-foreground hover:text-primary transition-colors inline-block">List Your Business</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors inline-block">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] tracking-[3px] uppercase font-semibold text-white/80 mb-8 border-b border-white/10 pb-4 inline-block">Top Destinations</h4>
            <div className="space-y-4">
              {gujaratCities.slice(0, 5).map(c => (
                <Link key={c} to={`/venues/${c.toLowerCase()}`} className="block text-sm text-white/50 hover:text-primary transition-colors font-light">
                  Luxury Venues in {c}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] tracking-[3px] uppercase font-semibold text-white/80 mb-8 border-b border-white/10 pb-4 inline-block">Get in Touch</h4>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                </div>
                <a href="mailto:info@venueconnect.in" className="text-sm text-white/50 hover:text-primary transition-colors font-light mt-1.5">
                  info@venueconnect.in
                </a>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                </div>
                <a href="tel:+919876543210" className="text-sm text-white/50 hover:text-primary transition-colors font-light mt-1.5">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm text-white/50 font-light mt-1.5">
                  Ahmedabad, Gujarat, India
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-white/40 font-light">
            © {new Date().getFullYear()} VenueConnect. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-white/40 font-light">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <Link to="/sitemap" className="hover:text-primary transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
