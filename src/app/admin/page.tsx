"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Check, X, Building2, MapPin, Phone, Mail, FileText, ChevronDown, ChevronUp, Users, IndianRupee, Layers, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [liveListings, setLiveListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'pending' | 'live'>('pending');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      // Fetch Pending Applications
      const { data: apps, error: appsError } = await supabase
        .from('venue_applications')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (appsError) throw appsError;
      setApplications(apps || []);

      // Fetch Live Listings (Venues + Vendors combined)
      const { data: venues, error: vError } = await supabase.from('venues').select('*');
      const { data: vendors, error: vrError } = await supabase.from('vendors').select('*');
      
      if (vError || vrError) throw (vError || vrError);

      const combined = [
        ...(venues || []).map(v => ({ ...v, type: 'venue' })),
        ...(vendors || []).map(v => ({ ...v, type: 'vendor' }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setLiveListings(combined);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (app: any) => {
    try {
      // 1. Mark as approved in applications table first
      const { error: updateError } = await supabase
        .from('venue_applications')
        .update({ status: 'approved' })
        .eq('id', app.id);

      if (updateError) throw updateError;

      // 2. Prepare data for venues/vendors table
      const isVendor = app.venue_type === 'vendor';
      const targetTable = isVendor ? 'vendors' : 'venues';
      
      let insertData: any = {
        name: app.business_name,
        city: app.city,
        location: `${app.city}, Gujarat`,
        address: app.address,
        rating: 4.5, // Default for new approved members
        reviews: 0,
        image: app.images?.[0] || app.image_url || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
        images: app.images || [],
        owner_id: app.user_id,
        description: app.description,
        starting_price: app.veg_price_per_plate || app.starting_price || 0,
      };

      if (!isVendor) {
        insertData = {
          ...insertData,
          type: app.venue_type,
          min_capacity: app.min_capacity || 0,
          max_capacity: app.max_capacity || 0,
          rooms_count: app.rooms_count || 0,
          veg_price_per_plate: app.veg_price_per_plate || 0,
          nonveg_price_per_plate: app.nonveg_price_per_plate || 0,
          has_ac: app.has_ac,
          has_wifi: app.has_wifi,
          alcohol_served: app.alcohol_served,
          cuisines: app.cuisines || [],
          amenities: app.amenities || [],
          catering_policy: app.catering_policy,
          operating_hours: app.operating_hours,
          advance_payment_percentage: app.advance_payment_percentage,
        };
      } else {
        insertData = {
          ...insertData,
          category: app.vendor_category || 'Photographers',
        };
      }

      const { error: insertError } = await supabase.from(targetTable).insert([insertData]);
      
      if (insertError) {
        // Rollback status
        await supabase.from('venue_applications').update({ status: 'pending' }).eq('id', app.id);
        throw insertError;
      }

      // 3. Upgrade user role if they are currently just a 'user'
      if (app.user_id) {
        await supabase.from('profiles').update({ role: 'owner' }).eq('id', app.user_id);
      }

      toast.success(`${app.business_name} is now LIVE on VenueConnect!`);
      setApplications(applications.filter(a => a.id !== app.id));
    } catch (error: any) {
      console.error("Error approving:", error);
      toast.error("Failed to approve: " + error.message);
    }
  };

  const handleReject = async (appId: string) => {
    if (!confirm("Are you sure you want to reject this business application?")) return;
    
    try {
      const { error } = await supabase
        .from('venue_applications')
        .update({ status: 'rejected' })
        .eq('id', appId);

      if (error) throw error;
      toast.success("Application rejected.");
      setApplications(applications.filter(a => a.id !== appId));
    } catch (error) {
      console.error("Error rejecting:", error);
      toast.error("Failed to reject application.");
    }
  };

  const handleToggleApproval = async (item: any) => {
    try {
      const table = item.type === 'vendor' ? 'vendors' : 'venues';
      const newStatus = !item.is_approved;
      
      const { error } = await supabase
        .from(table)
        .update({ is_approved: newStatus })
        .eq('id', item.id);

      if (error) throw error;
      
      toast.success(newStatus ? "Listing visibility: PUBLIC" : "Listing visibility: HIDDEN");
      fetchApplications();
    } catch (error: any) {
      toast.error("Status update failed: " + error.message);
    }
  };

  const handleToggleFeatured = async (item: any) => {
    try {
      const table = item.type === 'vendor' ? 'vendors' : 'venues';
      const newFeatured = !item.is_featured;
      
      const { error } = await supabase
        .from(table)
        .update({ is_featured: newFeatured })
        .eq('id', item.id);

      if (error) throw error;
      
      toast.success(newFeatured ? "Featured on Home!" : "Removed from Featured");
      fetchApplications();
    } catch (error: any) {
      toast.error("Feature update failed: " + error.message);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="container px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight font-display mb-2">Admin Control Center</h1>
                <p className="text-slate-500 font-light text-lg">Moderating and launching the next generation of Gujarat's event venues.</p>
            </div>
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
                <button 
                  onClick={() => setView('pending')}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${view === 'pending' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    {applications.length} PENDING
                </button>
                <button 
                  onClick={() => setView('live')}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${view === 'live' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    {liveListings.length} LIVE
                </button>
            </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-10 border-b border-slate-100 flex items-center gap-4 bg-slate-50/30">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Layers className="w-6 h-6 text-primary" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-900 font-display">
                  {view === 'pending' ? 'New Listing Requests' : 'Active Marketplace Listings'}
                </h2>
                <p className="text-slate-400 text-sm">
                  {view === 'pending' ? 'Review full business profiles before they go public.' : 'Moderating the live Gujarat venue finder ecosystem.'}
                </p>
            </div>
          </div>

          <div className="p-0">
            {loading ? (
              <div className="p-24 text-center">
                  <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-400 font-medium">Analyzing live queue...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="p-24 text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <Check className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-2 font-display">Queue Cleared!</h3>
                <p className="text-lg text-slate-500 font-light">All business applications have been processed. Great job!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {(view === 'pending' ? applications : liveListings).map((item) => (
                  <div key={item.id} className="group hover:bg-slate-50/80 transition-all duration-300">
                    <div className="p-8 flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center">
                        <div className="flex gap-6 flex-grow items-center">
                            <div className="w-24 h-24 rounded-3xl bg-white flex items-center justify-center shrink-0 overflow-hidden border-2 border-slate-100 shadow-sm group-hover:shadow-md transition-shadow">
                                {item.image_url || item.image || (item.images && item.images.length > 0) ? (
                                    <img src={item.images?.[0] || item.image || item.image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <Building2 className="w-10 h-10 text-slate-300" />
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h3 className="font-bold text-2xl text-slate-900 font-display">{item.business_name || item.name}</h3>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${ (item.venue_type || item.type) === 'vendor' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>
                                        {item.venue_type || item.type}
                                    </span>
                                    {item.is_featured && <span className="bg-amber-100 text-amber-600 px-2 py-0.5 rounded text-[10px] font-bold">FEATURED</span>}
                                    {view === 'live' && !item.is_approved && <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold">HIDDEN</span>}
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 font-light">
                                    <MapPin className="w-4 h-4 text-primary/60" /> {item.city}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full lg:w-auto pt-6 lg:pt-0 border-t lg:border-t-0 justify-end">
                            <Button variant="ghost" className="text-slate-400 hover:text-slate-900 h-14 px-6 rounded-2xl" onClick={() => toggleExpand(item.id)}>
                                {expandedId === item.id ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5"/>}
                            </Button>
                            
                            {view === 'pending' ? (
                              <>
                                <Button variant="outline" className="h-14 px-8 rounded-2xl text-red-600 hover:text-red-700 hover:bg-red-50 border-slate-200 font-bold" onClick={() => handleReject(item.id)}>
                                    <X className="w-4 h-4 mr-2" /> REJECT
                                </Button>
                                <Button className="h-14 px-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xl shadow-slate-200 flex items-center gap-2 transition-transform active:scale-95" onClick={() => handleApprove(item)}>
                                    <Sparkles className="w-4 h-4 text-amber-400" /> LAUNCH LIVE 
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button 
                                  variant="outline" 
                                  className={`h-14 px-6 rounded-2xl font-bold border-slate-200 ${item.is_featured ? 'bg-amber-50 text-amber-600 border-amber-200' : 'text-slate-500'}`} 
                                  onClick={() => handleToggleFeatured(item)}
                                >
                                    <Sparkles className="w-4 h-4 mr-2" /> {item.is_featured ? 'UNFEATURE' : 'FEATURE'}
                                </Button>
                                <Button 
                                  className={`h-14 px-8 rounded-2xl font-bold flex items-center gap-2 transition-transform active:scale-95 ${item.is_approved ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`} 
                                  onClick={() => handleToggleApproval(item)}
                                >
                                    {item.is_approved ? <><X className="w-4 h-4" /> HIDE LISTING</> : <><Check className="w-4 h-4" /> SHOW LISTING</>}
                                </Button>
                              </>
                            )}
                        </div>
                    </div>

                    {expandedId === item.id && (
                        <div className="px-10 pb-10 animate-in slide-in-from-top-4 duration-300">
                           <div className="bg-slate-50/50 rounded-[2rem] border border-slate-200/60 p-10 shadow-inner">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Intel</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center"><Users className="w-5 h-5 text-slate-400"/></div>
                                                <div><p className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Contact</p><p className="font-semibold text-slate-900">{item.contact_person || 'N/A'}</p></div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center"><Phone className="w-5 h-5 text-slate-400"/></div>
                                                <div><p className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Mobile</p><p className="font-semibold text-slate-900">{item.business_phone || 'N/A'}</p></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-2">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] mb-4">Description</h4>
                                        <p className="text-slate-600 leading-relaxed font-light italic text-base">"{item.description || 'No detailed description provided.'}"</p>
                                    </div>
                                </div>
                           </div>
                        </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
