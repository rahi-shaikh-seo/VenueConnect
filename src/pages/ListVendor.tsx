import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { gujaratCities } from "@/lib/cities";

const VENDOR_CATEGORIES = [
    "Astrologers", "Bands", "Bridal Wear", "Bus on Rent", "Cakes",
    "Caterers", "Choreographers", "Decorators", "DJ", "Entertainers",
    "Event Planners", "Florists", "Gifts", "Groom Wear", "Jewellers",
    "Magician", "Makeup Artists", "Mehndi Artists", "Photographers",
    "Tent Houses", "Wedding Photographers", "Wedding Planners"
];

const ListVendor = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        serviceType: "",
        businessName: "",
        businessAddress: "",
        fullName: "",
        phone: "",
        email: "",
        servicedCity: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Send data to Webhook (Google Sheets + Email)
            const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;
            if (webhookUrl) {
                try {
                    await fetch(webhookUrl, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            type: 'Vendor Application',
                            businessName: formData.businessName,
                            category: formData.serviceType,
                            city: formData.servicedCity,
                            contactName: formData.fullName,
                            phone: formData.phone,
                            email: formData.email,
                            details: {
                                address: formData.businessAddress
                            }
                        })
                    });
                } catch (webhookErr) {
                    console.error("Webhook failed:", webhookErr);
                }
            }

            // Insert to Supabase for backup tracking if needed
            try {
                await supabase.from('venue_applications').insert([{
                    business_name: formData.businessName,
                    venue_type: 'vendor',
                    vendor_category: formData.serviceType,
                    city: formData.servicedCity,
                    address: formData.businessAddress,
                    contact_person: formData.fullName,
                    business_phone: formData.phone,
                    business_email: formData.email,
                    description: "Vendor Application",
                    capacity: 0,
                    status: 'pending'
                }]);
            } catch (supabaseErr) {
                console.warn("Supabase insert failed, but webhook might have succeeded:", supabaseErr);
            }

            setIsSubmitted(true);
            toast.success("Application submitted successfully!");
            
            // Redirect after 3 seconds
            setTimeout(() => {
                navigate('/');
            }, 3000);

        } catch (err: any) {
            toast.error("Submission failed: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputCls = "w-full border border-gray-300 rounded-md px-4 py-3 text-gray-700 focus:outline-none focus:border-red-500 bg-white";

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-xl bg-white rounded-lg shadow-sm border border-gray-100 p-8">
                    {isSubmitted ? (
                        <div className="text-center py-10">
                            <h2 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h2>
                            <p className="text-gray-600">We have received your application. Our team will contact you shortly.</p>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-2xl md:text-3xl font-bold text-center text-red-600 mb-8">
                                Boost your business with VenueConnect!
                            </h1>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <select 
                                        name="serviceType" 
                                        value={formData.serviceType} 
                                        onChange={handleChange} 
                                        className={inputCls} 
                                        required
                                    >
                                        <option value="">Service Type</option>
                                        {VENDOR_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <input 
                                        type="text"
                                        name="businessName" 
                                        value={formData.businessName} 
                                        onChange={handleChange} 
                                        className={inputCls} 
                                        placeholder="Your business name" 
                                        required 
                                    />
                                </div>

                                <div>
                                    <input 
                                        type="text"
                                        name="businessAddress" 
                                        value={formData.businessAddress} 
                                        onChange={handleChange} 
                                        className={inputCls} 
                                        placeholder="Your business address" 
                                        required 
                                    />
                                </div>

                                <div>
                                    <input 
                                        type="text"
                                        name="fullName" 
                                        value={formData.fullName} 
                                        onChange={handleChange} 
                                        className={inputCls} 
                                        placeholder="Your full name" 
                                        required 
                                    />
                                </div>

                                <div>
                                    <input 
                                        type="tel"
                                        name="phone" 
                                        value={formData.phone} 
                                        onChange={handleChange} 
                                        className={inputCls} 
                                        placeholder="Your phone" 
                                        required 
                                    />
                                </div>

                                <div>
                                    <input 
                                        type="email"
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        className={inputCls} 
                                        placeholder="Your email" 
                                        required 
                                    />
                                </div>

                                <div>
                                    <select 
                                        name="servicedCity" 
                                        value={formData.servicedCity} 
                                        onChange={handleChange} 
                                        className={inputCls} 
                                        required
                                    >
                                        <option value="">Your serviced city</option>
                                        {gujaratCities.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                <div className="text-center pt-4">
                                    <p className="text-sm text-gray-700 mb-4">
                                        By clicking on this button, you are accepting our terms and conditions
                                    </p>
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold py-3 px-8 rounded-md text-lg"
                                    >
                                        {isSubmitting ? "Submitting..." : "Add your business"}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ListVendor;
