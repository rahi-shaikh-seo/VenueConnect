import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/98 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="container flex items-center justify-between h-20 px-6">
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img 
            src="/logo.svg" 
            alt="VenueConnect" 
            className="h-12 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors relative group">
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
          </Link>
          <Link to="/venues" className="text-sm font-medium text-foreground hover:text-primary transition-colors relative group">
            Venues
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
          </Link>
          <Link to="/cities" className="text-sm font-medium text-foreground hover:text-primary transition-colors relative group">
            Cities
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
          </Link>
          <Link to="/blog" className="text-sm font-medium text-foreground hover:text-primary transition-colors relative group">
            Blog
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-primary/30 text-primary hover:bg-primary/5 hover:border-primary font-medium" 
            asChild
          >
            <Link to="/list-venue">List Your Venue</Link>
          </Button>
          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary/90 text-white font-medium shadow-md hover:shadow-lg transition-all" 
            asChild
          >
            <Link to="/login">Login</Link>
          </Button>
        </div>

        <button 
          className="md:hidden p-2 hover:bg-primary/5 rounded-lg transition-colors" 
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-primary" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white p-6 space-y-4 shadow-lg">
          <Link to="/" className="block text-sm font-medium py-3 hover:text-primary transition-colors" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link to="/venues" className="block text-sm font-medium py-3 hover:text-primary transition-colors" onClick={() => setOpen(false)}>
            Venues
          </Link>
          <Link to="/cities" className="block text-sm font-medium py-3 hover:text-primary transition-colors" onClick={() => setOpen(false)}>
            Cities
          </Link>
          <Link to="/list-venue" className="block text-sm font-medium py-3 hover:text-primary transition-colors" onClick={() => setOpen(false)}>
            List Your Venue
          </Link>
          <Button size="sm" className="w-full bg-primary hover:bg-primary/90" asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
