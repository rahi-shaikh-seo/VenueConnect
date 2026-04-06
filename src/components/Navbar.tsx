"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { gujaratCities } from "@/lib/cities";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('user');
  const supabase = createClient();

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) fetchUserRole(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.id) fetchUserRole(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const fetchUserRole = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    if (data) setUserRole(data.role);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="container flex items-center justify-between h-20 px-6">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img
            src="/venue-connect.png"
            alt="VenueConnect"
            className="h-12 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors relative group">
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
          </Link>
          <a href="/venues" onClick={async (e) => {
            e.preventDefault();
            try {
              const res = await fetch("https://ipapi.co/json/");
              const data = await res.json();
              if (data.city && gujaratCities.some(c => c.toLowerCase() === data.city.toLowerCase())) {
                router.push(`/${data.city.toLowerCase()}`);
              } else {
                router.push("/ahmedabad");
              }
            } catch (err) {
              router.push("/ahmedabad");
            }
          }} className="cursor-pointer text-sm font-medium text-foreground hover:text-primary transition-colors relative group">
            Venues
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
          </a>
          <Link href="/vendors" className="text-sm font-medium text-foreground hover:text-primary transition-colors relative group">
            Vendors
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
          </Link>
          <Link href="/cities" className="text-sm font-medium text-foreground hover:text-primary transition-colors relative group">
            Cities
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
          </Link>
          <Link href="/blog" className="text-sm font-medium text-foreground hover:text-primary transition-colors relative group">
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
            <Link href="/list-business">List Your Business</Link>
          </Button>

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full bg-primary/10 hover:bg-primary/20 text-primary">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-medium border-b mb-1">
                  <div className="truncate mb-1">{session.user.user_metadata?.full_name || session.user.email}</div>
                  {userRole === 'admin' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wider">Super Admin</span>
                  )}
                  {userRole === 'owner' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wider">Verified Lister</span>
                  )}
                </div>
                {userRole === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer text-indigo-700 font-medium">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                {userRole === 'owner' && (
                  <DropdownMenuItem asChild>
                    <Link href="/owner" className="cursor-pointer text-amber-700 font-medium">Lister Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">Saved Shortlist</Link>
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
          <Link href="/login">Login</Link>
            </Button>
          )}
        </div>

        {/* Mobile right: WhatsApp + Menu */}
        <div className="md:hidden flex items-center gap-2">
          <a
            href="https://wa.me/919601015102"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-2 rounded-full transition-colors shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>
          <button
            className="p-2 hover:bg-primary/5 rounded-lg transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-primary" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white p-6 space-y-4 shadow-lg">
          <Link href="/" className="block text-sm font-medium py-3 hover:text-primary transition-colors" onClick={() => setOpen(false)}>
            Home
          </Link>
          <a href="/venues" className="block text-sm font-medium py-3 hover:text-primary transition-colors" onClick={async (e) => {
            e.preventDefault();
            try {
              const res = await fetch("https://ipapi.co/json/");
              const data = await res.json();
              if (data.city && gujaratCities.some(c => c.toLowerCase() === data.city.toLowerCase())) {
                router.push(`/${data.city.toLowerCase()}`);
              } else {
                router.push("/ahmedabad");
              }
            } catch (err) {
              router.push("/ahmedabad");
            }
            setOpen(false);
          }}>
            Venues
          </a>
          <Link href="/vendors" className="block text-sm font-medium py-3 hover:text-primary transition-colors" onClick={() => setOpen(false)}>
            Vendors
          </Link>
          <Link href="/cities" className="block text-sm font-medium py-3 hover:text-primary transition-colors" onClick={() => setOpen(false)}>
            Cities
          </Link>
          <Link href="/blog" className="block text-sm font-medium py-3 hover:text-primary transition-colors" onClick={() => setOpen(false)}>
            Blog
          </Link>
          <Link href="/faqs" className="block text-sm font-medium py-3 hover:text-primary transition-colors" onClick={() => setOpen(false)}>
            FAQs
          </Link>

          <Link href="/list-business" className="block text-sm font-medium py-3 hover:text-primary transition-colors" onClick={() => setOpen(false)}>
            List Your Business
          </Link>

          {session ? (
            <>
              <div className="py-2 border-y my-2 text-sm">
                <div className="px-2 py-1 mb-2">
                  <p className="font-medium text-muted-foreground truncate">
                    {session.user.user_metadata?.full_name || session.user.email}
                  </p>
                  {userRole === 'admin' && (
                    <span className="inline-flex items-center px-2 mt-1 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wider">Super Admin</span>
                  )}
                  {userRole === 'owner' && (
                    <span className="inline-flex items-center px-2 mt-1 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wider">Verified Lister</span>
                  )}
                </div>
                {userRole === 'admin' && (
                  <Link href="/admin" className="block px-2 py-2 text-indigo-700 font-medium" onClick={() => setOpen(false)}>Admin Dashboard</Link>
                )}
                {userRole === 'owner' && (
                  <Link href="/owner" className="block px-2 py-2 text-amber-700 font-medium" onClick={() => setOpen(false)}>Lister Dashboard</Link>
                )}
                <Link href="/profile" className="block px-2 py-2 hover:text-primary" onClick={() => setOpen(false)}>My Profile</Link>
                <Link href="/profile" className="block px-2 py-2 hover:text-primary" onClick={() => setOpen(false)}>Saved Shortlist</Link>
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
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
