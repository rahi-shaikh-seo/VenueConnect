import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Building, LayoutDashboard, Settings, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import LeadsManager from "@/components/owner/LeadsManager";
import MyListings from "@/components/owner/MyListings";
import { toast } from "sonner";

export default function OwnerDashboard() {
    const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'listings'>('leads');
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            toast.success("Signed out successfully");
            navigate('/');
        } catch (error) {
            toast.error("Error signing out");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            
            <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 gap-6">
                
                {/* Sidebar */}
                <aside className="w-full md:w-64 shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sticky top-24">
                        <div className="mb-6 px-2">
                            <h2 className="text-lg font-bold text-slate-800">Owner Portal</h2>
                            <p className="text-xs text-slate-500">Manage your listings</p>
                        </div>
                        
                        <nav className="space-y-1">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-primary text-primary-foreground' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                            >
                                <LayoutDashboard className="w-4 h-4" /> Overview
                            </button>
                            
                            <button
                                onClick={() => setActiveTab('leads')}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'leads' ? 'bg-primary text-primary-foreground' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                            >
                                <Users className="w-4 h-4" /> My Leads
                            </button>

                            <button
                                onClick={() => setActiveTab('listings')}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'listings' ? 'bg-primary text-primary-foreground' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                            >
                                <Building className="w-4 h-4" /> My Listings
                            </button>
                            
                            <div className="pt-4 mt-4 border-t border-slate-200">
                                <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors w-full">
                                    <Settings className="w-4 h-4" /> Account Settings
                                </Link>
                                <button onClick={handleSignOut} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left mt-1">
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                            </div>
                        </nav>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-w-0">
                    {activeTab === 'overview' && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Dashboard Overview</h2>
                            <p className="text-slate-600 mb-4">Welcome to your Owner Portal. From here you can track your incoming leads and manage your active venues and vendors.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="border border-slate-200 rounded-lg p-5 flex items-center gap-4 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setActiveTab('leads')}>
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users className="w-6 h-6"/></div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Manage Leads</h3>
                                        <p className="text-xs text-slate-500">View and contact prospective customers</p>
                                    </div>
                                </div>
                                <div className="border border-slate-200 rounded-lg p-5 flex items-center gap-4 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setActiveTab('listings')}>
                                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Building className="w-6 h-6"/></div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Manage Listings</h3>
                                        <p className="text-xs text-slate-500">Update your venue and vendor profiles</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'leads' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <LeadsManager />
                        </div>
                    )}

                    {activeTab === 'listings' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <MyListings />
                        </div>
                    )}
                </main>

            </div>
            
            <Footer />
        </div>
    );
}
