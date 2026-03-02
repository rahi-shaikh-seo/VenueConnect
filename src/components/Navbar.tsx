import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-bold text-foreground">
            Venue<span className="text-gradient">Connect</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/venues" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Venues</Link>
          <Link to="/cities" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cities</Link>
          <Link to="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link to="/list-venue">List Your Venue</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-card p-4 space-y-3">
          <Link to="/" className="block text-sm font-medium py-2" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/venues" className="block text-sm font-medium py-2" onClick={() => setOpen(false)}>Venues</Link>
          <Link to="/cities" className="block text-sm font-medium py-2" onClick={() => setOpen(false)}>Cities</Link>
          <Link to="/list-venue" className="block text-sm font-medium py-2" onClick={() => setOpen(false)}>List Your Venue</Link>
          <Button size="sm" className="w-full" asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
