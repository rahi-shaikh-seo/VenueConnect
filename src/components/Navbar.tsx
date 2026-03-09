import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/98 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="container flex items-center justify-between h-20 px-6">
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img
            src="/logo.webp"
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
          <Link to="/vendors" className="text-sm font-medium text-foreground hover:text-primary transition-colors relative group">
            Vendors
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
          <Link to="/e-invitations" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors relative group underline underline-offset-4 decoration-primary/30">
            E-Invites 💌
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

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full bg-primary/10 hover:bg-primary/20 text-primary">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-medium border-b mb-1 truncate">
                  {session.user.user_metadata?.full_name || session.user.email}
                </div>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">Saved Shortlist</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white font-medium shadow-md hover:shadow-lg transition-all"
              asChild
            >
              <Link to="/login">Login</Link>
            </Button>
          )}
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
          <Link to="/vendors" className="block text-sm font-medium py-3 hover:text-primary transition-colors" onClick={() => setOpen(false)}>
            Vendors
          </Link>
          <Link to="/cities" className="block text-sm font-medium py-3 hover:text-primary transition-colors" onClick={() => setOpen(false)}>
            Cities
          </Link>
          <Link to="/e-invitations" className="block text-sm font-medium py-3 text-primary transition-colors" onClick={() => setOpen(false)}>
            E-Invitations 💌
          </Link>
          <Link to="/list-venue" className="block text-sm font-medium py-3 hover:text-primary transition-colors" onClick={() => setOpen(false)}>
            List Your Venue
          </Link>

          {session ? (
            <>
              <div className="py-2 border-y my-2 text-sm">
                <p className="font-medium px-2 py-1 text-muted-foreground truncate">
                  Signed in as: {session.user.user_metadata?.full_name || session.user.email}
                </p>
                <Link to="/profile" className="block px-2 py-2 hover:text-primary" onClick={() => setOpen(false)}>My Profile</Link>
                <Link to="/profile" className="block px-2 py-2 hover:text-primary" onClick={() => setOpen(false)}>Saved Shortlist</Link>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={() => {
                  handleSignOut();
                  setOpen(false);
                }}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button size="sm" className="w-full bg-primary hover:bg-primary/90" asChild onClick={() => setOpen(false)}>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
