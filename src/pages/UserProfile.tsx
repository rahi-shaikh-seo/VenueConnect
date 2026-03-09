import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import VenueCard, { VenueData } from "@/components/VenueCard";
import VendorCard, { VendorData } from "@/components/VendorCard";
import { User, Heart } from "lucide-react";

interface UserProfileData {
  full_name?: string;
  phone_number?: string;
  planned_event_date?: string;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profileData, setProfileData] = useState<UserProfileData>({
    full_name: "",
    phone_number: "",
    planned_event_date: ""
  });

  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      } else {
        setSession(session);
        fetchProfile(session.user.id);
        fetchFavorites(session.user.id);
      }
    });
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data && !error) {
      setProfileData({
        full_name: data.full_name || "",
        phone_number: data.phone_number || "",
        planned_event_date: data.planned_event_date || ""
      });
    }
  };

  const fetchFavorites = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (data && !error) {
      setFavorites(data);
    }
    setIsLoading(false);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    
    setIsSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profileData.full_name,
        phone_number: profileData.phone_number,
        planned_event_date: profileData.planned_event_date
      })
      .eq('id', session.user.id);

    setIsSaving(false);
    if (!error) {
      toast.success("Profile updated successfully!");
    } else {
      toast.error("Failed to update profile.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <PageHeader
          title="My Profile"
          subtitle="Manage your details and saved shortlists"
          image="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80"
      />

      <main className="flex-grow py-12">
        <div className="container max-w-5xl">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-14 bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="profile" className="rounded-lg text-base h-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <User className="w-4 h-4 mr-2" />
                Profile Information
              </TabsTrigger>
              <TabsTrigger value="favorites" className="rounded-lg text-base h-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Heart className="w-4 h-4 mr-2" />
                Saved Shortlist
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="bg-white p-8 rounded-2xl border border-border/50 shadow-sm">
                <h3 className="text-2xl font-display font-semibold mb-6">Personal Details</h3>
                <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-2xl">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" value={session?.user?.email || ""} disabled className="bg-muted text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Your email address is managed by your login provider.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input 
                                id="full_name" 
                                value={profileData.full_name} 
                                onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                                placeholder="e.g. Rahul Sharma"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input 
                                id="phone" 
                                value={profileData.phone_number} 
                                onChange={(e) => setProfileData({...profileData, phone_number: e.target.value})}
                                placeholder="+91 XXXXXXXXXX"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="event_date">Planned Event Date (Optional)</Label>
                        <Input 
                            id="event_date" 
                            type="date"
                            value={profileData.planned_event_date} 
                            onChange={(e) => setProfileData({...profileData, planned_event_date: e.target.value})}
                        />
                        <p className="text-xs text-muted-foreground">Helps venues check availability faster.</p>
                    </div>

                    <div className="pt-4">
                        <Button type="submit" disabled={isSaving} className="w-full md:w-auto px-8">
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </TabsContent>

            <TabsContent value="favorites">
                <div className="bg-white p-8 rounded-2xl border border-border/50 shadow-sm min-h-[400px]">
                    <h3 className="text-2xl font-display font-semibold mb-6">My Saved Shortlist</h3>
                    
                    {favorites.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-8 h-8" />
                            </div>
                            <h4 className="text-lg font-medium text-foreground mb-2">No saved items yet.</h4>
                            <p className="text-muted-foreground max-w-md mx-auto mb-6">
                                Start exploring venues and vendors to build your perfect event shortlist!
                            </p>
                            <Button onClick={() => navigate('/venues')}>Explore Venues</Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favorites.map((fav) => (
                                <div key={fav.id} className="h-full">
                                    {fav.item_type === 'venue' ? (
                                        <VenueCard venue={fav.item_data as VenueData} />
                                    ) : (
                                        <VendorCard vendor={fav.item_data as VendorData} />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfile;
