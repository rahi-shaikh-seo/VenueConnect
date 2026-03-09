import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VenueCard, { VenueData } from "@/components/VenueCard";
import { Heart, LayoutDashboard, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [favorites, setFavorites] = useState<VenueData[]>([]);
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("favorites");
    const [savingProfile, setSavingProfile] = useState(false);
    const [fullName, setFullName] = useState("");

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate('/login');
                return;
            }
            setUser(session.user);
            
            // Fetch profile to get role
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
                
            setProfile(profileData);
            if (profileData) {
                setFullName(profileData.full_name || "");
            }
            
            fetchFavorites(session.user.id);
            if (profileData?.role === 'owner') {
                fetchLeads(session.user.id);
                setActiveTab("leads");
            }
        };

        checkAuth();
    }, [navigate]);

    const fetchFavorites = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('user_favorites')
                .select('venue_data')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching favorites:", error);
                return;
            }

            if (data) {
                // The venue_data column contains the JSON object we stored
                const venues = data.map(item => item.venue_data as unknown as VenueData);
                setFavorites(venues);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchLeads = async (ownerId: string) => {
        try {
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .eq('owner_id', ownerId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching leads:", error);
                return;
            }
            setLeads(data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLeadStatusChange = async (leadId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'new' ? 'contacted' : currentStatus === 'contacted' ? 'closed' : 'new';
        
        try {
            const { error } = await supabase
                .from('leads')
                .update({ status: newStatus })
                .eq('id', leadId);
                
            if (error) throw error;
            
            // Update local state
            setLeads(leads.map(lead => lead.id === leadId ? { ...lead, status: newStatus } : lead));
        } catch (err) {
            console.error("Error updating lead status:", err);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ full_name: fullName })
                .eq('id', user.id);
            if (error) throw error;
            
            // Also update Auth user metadata for consistency
            await supabase.auth.updateUser({
              data: { full_name: fullName }
            });
            
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile.");
        } finally {
            setSavingProfile(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-muted/20">
            <Navbar />

            <main className="flex-grow container px-4 sm:px-6 py-12">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-display font-semibold mb-8">My Dashboard</h1>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar */}
                        <aside className="w-full md:w-64 shrink-0">
                            <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
                                <div className="p-4 border-b border-border bg-slate-50">
                                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xl mb-3">
                                        {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                                    </div>
                                    <h3 className="font-medium truncate">{user?.user_metadata?.full_name || "User"}</h3>
                                    <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                                </div>

                                <nav className="p-2 space-y-1">
                                    {profile?.role === 'owner' && (
                                        <button
                                            onClick={() => setActiveTab("leads")}
                                            className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'leads' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-muted'}`}
                                        >
                                            <span className="flex items-center gap-3"><LayoutDashboard className="w-4 h-4" /> CRM Leads</span>
                                            {leads.filter(l => l.status === 'new').length > 0 && (
                                                <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                                    {leads.filter(l => l.status === 'new').length}
                                                </span>
                                            )}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setActiveTab("favorites")}
                                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'favorites' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-muted'}`}
                                    >
                                        <Heart className="w-4 h-4" /> My Favorites
                                    </button>
                                    {profile?.role !== 'owner' && (
                                        <button
                                            onClick={() => setActiveTab("bookings")}
                                            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'bookings' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-muted'}`}
                                        >
                                            <LayoutDashboard className="w-4 h-4" /> Requested Quotes
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setActiveTab("settings")}
                                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'settings' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-muted'}`}
                                    >
                                        <Settings className="w-4 h-4" /> Settings
                                    </button>
                                </nav>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div className="flex-grow">
                            <div className="bg-white rounded-xl shadow-sm border border-border p-6 min-h-[500px]">
                                {activeTab === "favorites" && (
                                    <div>
                                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" /> Saved Venues & Vendors
                                        </h2>

                                        {favorites.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {favorites.map((venue) => (
                                                    <div key={venue.id} className="h-full">
                                                        <VenueCard venue={venue} />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-20 flex flex-col items-center">
                                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                                    <Heart className="w-8 h-8 text-muted-foreground" />
                                                </div>
                                                <h3 className="text-lg font-medium text-foreground mb-2">No favorites yet</h3>
                                                <p className="text-muted-foreground text-sm max-w-sm mb-6">
                                                    Start exploring venues and vendors around Gujarat and click the heart icon to save them here for easy comparison later.
                                                </p>
                                                <Button onClick={() => navigate('/venues')} className="bg-primary text-white">
                                                    Explore Venues
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === "leads" && profile?.role === 'owner' && (
                                    <div>
                                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                            <LayoutDashboard className="w-5 h-5 text-primary" /> Lead CRM
                                        </h2>
                                        
                                        {leads.length > 0 ? (
                                            <div className="bg-white rounded-lg border border-border overflow-hidden">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="bg-slate-50 border-b border-border text-slate-600">
                                                        <tr>
                                                            <th className="px-4 py-3 font-medium">Customer</th>
                                                            <th className="px-4 py-3 font-medium">Contact</th>
                                                            <th className="px-4 py-3 font-medium hidden md:table-cell">Event Date</th>
                                                            <th className="px-4 py-3 font-medium">Status</th>
                                                            <th className="px-4 py-3 font-medium text-right">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-border">
                                                        {leads.map((lead) => (
                                                            <tr key={lead.id} className="hover:bg-slate-50/50">
                                                                <td className="px-4 py-3 font-medium">{lead.customer_name}</td>
                                                                <td className="px-4 py-3">
                                                                    <div className="text-xs">{lead.customer_email}</div>
                                                                    <div className="text-xs text-muted-foreground">{lead.customer_phone}</div>
                                                                </td>
                                                                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{lead.event_date ? new Date(lead.event_date).toLocaleDateString() : 'Not specified'}</td>
                                                                <td className="px-4 py-3">
                                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${lead.status === 'new' ? 'bg-green-50 text-green-700 border-green-200' : lead.status === 'contacted' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                                                                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3 text-right">
                                                                    <Button 
                                                                        variant="outline" 
                                                                        size="sm"
                                                                        onClick={() => handleLeadStatusChange(lead.id, lead.status)}
                                                                        className="h-8 text-xs"
                                                                    >
                                                                        {lead.status === 'new' ? 'Mark Contacted' : lead.status === 'contacted' ? 'Close Lead' : 'Reopen Lead'}
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="text-center py-20 flex flex-col items-center border border-dashed rounded-lg border-border">
                                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                                    <LayoutDashboard className="w-8 h-8 text-muted-foreground" />
                                                </div>
                                                <h3 className="text-lg font-medium text-foreground mb-2">No leads yet</h3>
                                                <p className="text-muted-foreground text-sm max-w-sm">
                                                    When customers request quotes or availability from your listings, they will appear here.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === "bookings" && profile?.role !== 'owner' && (
                                    <div className="text-center py-20">
                                        <LayoutDashboard className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                                        <h3 className="text-xl font-medium mb-2">Requested Quotes</h3>
                                        <p className="text-muted-foreground">This feature is coming soon in Phase 4.</p>
                                    </div>
                                )}

                                {activeTab === "settings" && (
                                    <div className="max-w-md mx-auto py-10">
                                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border">
                                            <Settings className="w-6 h-6 text-primary" />
                                            <h3 className="text-xl font-medium">Account Settings</h3>
                                        </div>
                                        
                                        <form onSubmit={handleSaveProfile} className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Email Address</label>
                                                <input 
                                                    type="email" 
                                                    value={user?.email || ""} 
                                                    disabled
                                                    className="w-full bg-muted/50 text-muted-foreground px-4 py-2 border border-border rounded-lg"
                                                />
                                                <p className="text-xs text-muted-foreground">Email address cannot be changed currently.</p>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Full Name</label>
                                                <input 
                                                    type="text" 
                                                    value={fullName} 
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    placeholder="Enter your full name"
                                                    className="w-full bg-background px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Account Role</label>
                                                <div className="capitalize font-medium text-sm inline-flex px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                                                    {profile?.role || "User"}
                                                </div>
                                            </div>
                                            
                                            <Button type="submit" disabled={savingProfile} className="w-full bg-primary hover:bg-primary/90 text-white">
                                                {savingProfile ? "Saving..." : "Save Changes"}
                                            </Button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;
