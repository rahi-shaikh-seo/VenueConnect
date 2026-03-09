import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, X, Building2, MapPin, Phone, Mail, FileText, ChevronDown, ChevronUp, Users, IndianRupee, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('venue_applications')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (app: any) => {
    try {
      // Set to approved
      const { error: updateError } = await supabase
        .from('venue_applications')
        .update({ status: 'approved' })
        .eq('id', app.id);

      if (updateError) throw updateError;

      // Note: we are currently assigning to venues/vendors depending on venue_type with dummy data for missing fields. 
      // In a real application, the venues/vendors tables would match these fields perfectly.
      const table = app.venue_type === 'vendor' ? 'vendors' : 'venues';
      const insertData = {
        name: app.business_name,
        location: app.city + ', Gujarat',
        address: app.address,
        price: app.veg_price_per_plate ? `₹${app.veg_price_per_plate}` : 'Contact for price',
        rating: 0,
        reviews: 0,
        image: app.images && app.images.length > 0 ? app.images[0] : (app.image_url || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600&auto=format&fit=crop"),
        type: app.venue_type,
        owner_id: app.user_id,
      };

      const { error: insertError } = await supabase.from(table).insert([insertData]);
      
      if (insertError) {
        // If it fails, revert status back to pending
        await supabase.from('venue_applications').update({ status: 'pending' }).eq('id', app.id);
        throw insertError;
      }

      // Upgrade the user to an 'owner' role so they can access the Owner Dashboard
      if (app.user_id) {
        await supabase
          .from('profiles')
          .update({ role: 'owner' })
          .eq('id', app.user_id);
      }

      toast.success("Application approved successfully.");
      setApplications(applications.filter(a => a.id !== app.id));
    } catch (error: any) {
      console.error("Error approving:", error);
      toast.error("Failed to approve application: " + error.message);
    }
  };

  const handleReject = async (appId: string) => {
    if (!window.confirm("Are you sure you want to reject this application?")) return;
    
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

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <Navbar />

      <main className="flex-grow container px-4 py-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-display font-semibold mb-8">Admin Dashboard</h1>

        <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center bg-slate-50/50">
            <div>
                <h2 className="text-xl font-semibold text-slate-900">Pending Applications</h2>
                <p className="text-sm text-slate-500 mt-1">Review and approve new comprehensive venue listings.</p>
            </div>
            <div className="bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm">
              {applications.length} Pending
            </div>
          </div>

          <div className="p-0">
            {loading ? (
              <div className="p-12 text-center text-slate-500 animate-pulse font-medium text-lg">Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="p-16 text-center text-muted-foreground flex flex-col items-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">All Caught Up!</h3>
                <p className="text-sm">No pending applications to review right now.</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {applications.map((app) => (
                  <li key={app.id} className="hover:bg-slate-50 transition-colors">
                    
                    {/* Header Row (Always Visible) */}
                    <div className="p-6 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                        <div className="flex gap-4 flex-grow">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 overflow-hidden border shadow-sm">
                            {app.image_url ? (
                                <img src={app.image_url} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform" />
                            ) : (
                                <Building2 className="w-8 h-8 text-primary/40" />
                            )}
                            </div>
                            
                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-lg text-slate-900">{app.business_name}</h3>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold capitalize border ${app.venue_type === 'vendor' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                        {app.venue_type}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-slate-600 mb-2">
                                    <MapPin className="w-4 h-4 text-slate-400" /> {app.city}
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 bg-white border px-3 py-1.5 rounded-lg shadow-sm inline-flex">
                                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5"/> Cap: {app.min_capacity || 0}-{app.max_capacity || 0}</span>
                                    <span className="flex items-center gap-1 text-green-600"><IndianRupee className="w-3.5 h-3.5"/> Veg: ₹{app.veg_price_per_plate || 'N/A'}</span>
                                    <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5"/> Media: {app.images?.length || (app.image_url ? 1 : 0)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full lg:w-auto mt-2 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 justify-end">
                            <Button variant="ghost" className="text-slate-500 hover:text-slate-900" onClick={() => toggleExpand(app.id)}>
                                {expandedId === app.id ? (
                                    <span className="flex items-center"><ChevronUp className="w-4 h-4 mr-1"/> Hide Details</span>
                                ) : (
                                    <span className="flex items-center"><ChevronDown className="w-4 h-4 mr-1"/> View Full Form</span>
                                )}
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 bg-white" onClick={() => handleReject(app.id)}>
                                <X className="w-4 h-4 mr-1.5" /> Reject
                            </Button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white shadow-sm" onClick={() => handleApprove(app)}>
                                <Check className="w-4 h-4 mr-1.5" /> Approve
                            </Button>
                        </div>
                    </div>

                    {/* Expanded Content View */}
                    {expandedId === app.id && (
                        <div className="px-6 pb-6 pt-2 bg-slate-50/50 border-t border-slate-100 animate-in slide-in-from-top-2">
                            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    {/* Contact Block */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Info</h4>
                                        <div className="space-y-2 text-sm">
                                            <p className="flex items-start gap-2 text-slate-700"><MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0"/> {app.address}, {app.city}</p>
                                            <p className="flex items-center gap-2 text-slate-700"><Users className="w-4 h-4 text-slate-400 shrink-0"/> {app.contact_person}</p>
                                            <p className="flex items-center gap-2 text-slate-700"><Phone className="w-4 h-4 text-slate-400 shrink-0"/> {app.business_phone}</p>
                                            <p className="flex items-center gap-2 text-slate-700"><Mail className="w-4 h-4 text-slate-400 shrink-0"/> {app.business_email || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {/* Capacity & Pricing */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Specs & Pricing</h4>
                                        <div className="space-y-2 text-sm text-slate-700">
                                            <p className="flex justify-between items-center"><span className="text-slate-500">Capacity:</span> <span className="font-semibold">{app.min_capacity || 0} - {app.max_capacity || 0}</span></p>
                                            <p className="flex justify-between items-center"><span className="text-slate-500">Veg Plate:</span> <span className="font-semibold text-green-600">₹{app.veg_price_per_plate || 'N/A'}</span></p>
                                            <p className="flex justify-between items-center"><span className="text-slate-500">Non-Veg Plate:</span> <span className="font-semibold text-red-600">{app.nonveg_price_per_plate ? `₹${app.nonveg_price_per_plate}` : 'N/A'}</span></p>
                                            <p className="flex justify-between items-center"><span className="text-slate-500">Advance %:</span> <span className="font-semibold">{app.advance_payment_percentage || 50}%</span></p>
                                        </div>
                                    </div>

                                    {/* Policies & Facilities */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Policies</h4>
                                        <div className="space-y-2 text-sm text-slate-700">
                                            <p className="flex justify-between items-center"><span className="text-slate-500">Timings:</span> <span className="font-medium text-right">{app.operating_hours || 'N/A'}</span></p>
                                            <p className="flex justify-between items-center"><span className="text-slate-500">Catering:</span> <span className="font-medium text-right line-clamp-1" title={app.catering_policy}>{app.catering_policy || 'N/A'}</span></p>
                                            <p className="flex justify-between items-center"><span className="text-slate-500">Rooms:</span> <span className="font-semibold">{app.rooms_count || 0}</span></p>
                                            <p className="flex justify-between items-center">
                                                <span className="text-slate-500">Features:</span> 
                                                <span className="flex gap-1">
                                                    {app.has_ac && <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-bold">AC</span>}
                                                    {app.has_wifi && <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-bold">WIFI</span>}
                                                    {app.alcohol_served && <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-bold">ALC</span>}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Arrays */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tags & Arrays</h4>
                                        <div className="space-y-2 text-sm text-slate-700">
                                            <div>
                                                <span className="text-slate-500 block text-xs mb-1">Cuisines:</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {(app.cuisines || []).map((c: string, i: number) => <span key={i} className="bg-slate-100 text-[10px] px-1.5 py-0.5 rounded border">{c}</span>)}
                                                    {(!app.cuisines || app.cuisines.length === 0) && <span className="text-xs text-slate-400">None</span>}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 block text-xs mb-1">Amenities:</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {(app.amenities || []).map((a: string, i: number) => <span key={i} className="bg-slate-100 text-[10px] px-1.5 py-0.5 rounded border">{a}</span>)}
                                                    {(!app.amenities || app.amenities.length === 0) && <span className="text-xs text-slate-400">None</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="border-t border-slate-100 pt-4 mb-6">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><FileText className="w-4 h-4"/> Business Description</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">{app.description || 'No description provided.'}</p>
                                </div>

                                {/* Media Gallery */}
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Uploaded Media ({app.images?.length || (app.image_url ? 1 : 0)})</h4>
                                    {app.images && app.images.length > 0 ? (
                                        <div className="flex gap-4 overflow-x-auto pb-2">
                                            {app.images.map((img: string, idx: number) => (
                                                <a href={img} target="_blank" rel="noreferrer" key={idx} className="block shrink-0 relative group">
                                                    <img src={img} alt={`Upload ${idx+1}`} className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl border border-slate-200" />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl"></div>
                                                </a>
                                            ))}
                                        </div>
                                    ) : app.image_url ? (
                                        <a href={app.image_url} target="_blank" rel="noreferrer" className="block shrink-0 relative group w-fit">
                                            <img src={app.image_url} alt="Cover" className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl border border-slate-200" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl"></div>
                                        </a>
                                    ) : (
                                        <p className="text-sm text-slate-400 italic">No media uploaded.</p>
                                    )}
                                </div>

                            </div>
                        </div>
                    )}

                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
