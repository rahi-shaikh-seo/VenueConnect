import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ListVendor = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        contactName: "",
        mobile: "",
        email: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                            businessName: formData.contactName + "'s Business",
                            category: "vendor",
                            city: "Not Provided",
                            contactName: formData.contactName,
                            phone: formData.mobile,
                            email: formData.email,
                            details: {
                                address: "Not Provided"
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
                    business_name: formData.contactName + "'s Business",
                    venue_type: 'vendor',
                    city: 'Not Provided',
                    address: 'Not Provided',
                    contact_person: formData.contactName,
                    business_phone: formData.mobile,
                    business_email: formData.email,
                    description: "Vendor Lead",
                    capacity: 0,
                    status: 'pending'
                }]);
            } catch (supabaseErr) {
                console.warn("Supabase insert failed, but webhook might have succeeded:", supabaseErr);
            }

            setIsSubmitted(true);
            toast.success("Details submitted successfully!");
            
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

    const inputCls = "w-full border border-gray-300 rounded-md px-3 py-3 text-gray-700 focus:outline-none focus:border-red-500 bg-white placeholder:text-gray-400";

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow flex items-center justify-center py-12 px-4">
                {isSubmitted ? (
                    <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm border border-gray-100 p-10 text-center">
                        <h2 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h2>
                        <p className="text-gray-600">We have received your details. Our team will contact you shortly.</p>
                    </div>
                ) : (
                    <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm border border-gray-100 p-8 md:p-12">
                        <form onSubmit={handleSubmit}>
                            {/* Contact Info Section */}
                            <div className="mb-8">
                                <h3 className="text-xl md:text-2xl font-serif text-center text-gray-900 mb-6 uppercase tracking-wider">
                                    ADD CONTACT INFORMATION
                                </h3>
                                
                                <div className="bg-red-50/80 py-4 px-4 text-center text-red-700 text-sm font-semibold mb-8 border border-red-100/50">
                                    Lead notifications and updates from VenueConnect will be sent to this contact.
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <input 
                                            type="text" 
                                            name="contactName" 
                                            value={formData.contactName} 
                                            onChange={handleChange} 
                                            placeholder="Vendor owner / Authorized person name *" 
                                            className={inputCls} 
                                            required 
                                        />
                                    </div>
                                    
                                    <div className="flex bg-white border border-gray-300 rounded-md focus-within:border-red-500 overflow-hidden">
                                        <div className="flex items-center px-4 bg-gray-50 border-r border-gray-300 text-gray-500 text-sm font-medium">
                                            +91
                                        </div>
                                        <input 
                                            type="tel" 
                                            name="mobile" 
                                            value={formData.mobile} 
                                            onChange={handleChange} 
                                            placeholder="Mobile number *" 
                                            className="w-full px-4 py-3 text-gray-700 focus:outline-none placeholder:text-gray-400" 
                                            required 
                                        />
                                    </div>
                                    
                                    <div>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            value={formData.email} 
                                            onChange={handleChange} 
                                            placeholder="Official email - id *" 
                                            className={inputCls} 
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="text-center pt-8 border-t border-gray-100">
                                <p className="text-xs text-gray-500 mb-6 font-medium px-4">
                                    By clicking on Submit and Get me Started button, I hereby agree to VenueConnect terms and Privacy Policy, and to receive emails, sms & updates
                                </p>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold py-3.5 px-8 rounded flex mx-auto disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? "Submitting..." : "Submit and Get me Started"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default ListVendor;
