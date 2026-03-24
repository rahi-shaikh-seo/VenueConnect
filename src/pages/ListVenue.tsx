import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { gujaratCities } from "@/lib/cities";

const localities: Record<string, string[]> = {
    'Ahmedabad': ["SG Highway","Bopal","Vastrapur","Satellite","Prahlad Nagar","Thaltej","Bodakdev","Maninagar","Naranpura","Chandkheda","Paldi","Navrangpura","Ellisbridge","Motera","Gota","New CG Road","Ambawadi","Memnagar","Other"],
    'Surat': ["Adajan","Vesu","Pal","Althan","Piplod","Citylight","Ghod Dod Road","Udhna","Katargam","Rander","Athwa","Varachha","Bhatar","Dumas","Other"],
    'Rajkot': ["Kalawad Road","University Road","Raiya Road","150 Feet Ring Road","Mavdi","Kotecha Chowk","Yagnik Road","Jamnagar Road","Gondal Road","Bhaktinagar","Aji Dam Road","Tagore Road","Other"],
    'Vadodara': ["Alkapuri","Waghodia","Manjalpur","Gotri","Vasna","Akota","Fatehgunj","Sayajigunj","Karelibaug","Sama","Harni","Makarpura","Other"]
};

const ListVenue = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        city: "",
        locality: "",
        address: "",
        maxCapacity: "",
        landline: "",
        description: "",
        website: "",
        facebook: "",
        twitter: "",

        contactName: "",
        mobile: "",
        email: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: value,
            ...(name === 'city' ? { locality: '' } : {}) // Reset locality on city change
        }));
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
                            type: 'Venue Application',
                            businessName: formData.contactName + "'s Venue", // Provide a fallback business name
                            category: "venue",
                            city: formData.city,
                            contactName: formData.contactName,
                            phone: formData.mobile,
                            email: formData.email,
                            details: {
                                address: formData.address,
                                locality: formData.locality,
                                maxCapacity: formData.maxCapacity,
                                landline: formData.landline,
                                description: formData.description,
                                website: formData.website,
                                facebook: formData.facebook,
                                twitter: formData.twitter
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
                    business_name: formData.address.split(',')[0] || 'Unknown Venue', // Venue name was not in the form design
                    venue_type: 'venue',
                    city: formData.city,
                    address: `${formData.locality}, ${formData.address}`,
                    contact_person: formData.contactName,
                    business_phone: formData.mobile,
                    business_email: formData.email,
                    description: formData.description,
                    capacity: parseInt(formData.maxCapacity) || 0,
                    status: 'pending'
                }]);
            } catch (supabaseErr) {
                console.warn("Supabase insert failed, but webhook might have succeeded:", supabaseErr);
            }

            setIsSubmitted(true);
            toast.success("Application submitted successfully!");
            
            setTimeout(() => {
                navigate('/');
            }, 3000);

        } catch (err: any) {
            toast.error("Submission failed: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputCls = "w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:border-red-500 bg-white placeholder:text-gray-400";
    
    // Available localities for the selected city
    const availableLocalities = localities[formData.city] || (formData.city ? ['Other'] : []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow py-12 px-4 flex justify-center">
                {isSubmitted ? (
                    <div className="w-full max-w-3xl bg-white rounded-lg shadow-sm border border-gray-100 p-10 text-center">
                        <h2 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h2>
                        <p className="text-gray-600">We have received your venue application. Our team will contact you shortly.</p>
                    </div>
                ) : (
                    <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm border border-gray-100 p-8 md:p-12">
                        <form onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-3 gap-8 mb-12">
                                <div className="md:col-span-2 space-y-4">
                                    <div>
                                        <input 
                                            type="text" 
                                            value="India" 
                                            disabled 
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 bg-gray-100 cursor-not-allowed" 
                                        />
                                    </div>
                                    
                                    <div>
                                        <select 
                                            name="city" 
                                            value={formData.city} 
                                            onChange={handleChange} 
                                            className={inputCls} 
                                            required
                                        >
                                            <option value="">Select City Name *</option>
                                            {gujaratCities.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <select 
                                            name="locality" 
                                            value={formData.locality} 
                                            onChange={handleChange} 
                                            className={inputCls} 
                                            required
                                        >
                                            <option value="">Select City Locality *</option>
                                            {availableLocalities.map(l => <option key={l} value={l}>{l}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <input 
                                            type="text" 
                                            name="address" 
                                            value={formData.address} 
                                            onChange={handleChange} 
                                            placeholder="Complete address of venue *" 
                                            className={inputCls} 
                                            required 
                                        />
                                    </div>

                                    <div>
                                        <input 
                                            type="number" 
                                            name="maxCapacity" 
                                            value={formData.maxCapacity} 
                                            onChange={handleChange} 
                                            placeholder="Venue max capacity *" 
                                            className={inputCls} 
                                            required 
                                        />
                                    </div>

                                    <div>
                                        <input 
                                            type="tel" 
                                            name="landline" 
                                            value={formData.landline} 
                                            onChange={handleChange} 
                                            placeholder="Landline number (if any)" 
                                            className={inputCls} 
                                        />
                                    </div>

                                    <div>
                                        <textarea 
                                            name="description" 
                                            value={formData.description} 
                                            onChange={handleChange} 
                                            placeholder="Description" 
                                            className={inputCls} 
                                            rows={3} 
                                        />
                                    </div>

                                    <div>
                                        <input 
                                            type="url" 
                                            name="website" 
                                            value={formData.website} 
                                            onChange={handleChange} 
                                            placeholder="Venue website Url" 
                                            className={inputCls} 
                                        />
                                    </div>

                                    <div>
                                        <input 
                                            type="url" 
                                            name="facebook" 
                                            value={formData.facebook} 
                                            onChange={handleChange} 
                                            placeholder="Venue facebook Url" 
                                            className={inputCls} 
                                        />
                                    </div>

                                    <div>
                                        <input 
                                            type="url" 
                                            name="twitter" 
                                            value={formData.twitter} 
                                            onChange={handleChange} 
                                            placeholder="Venue twitter Url" 
                                            className={inputCls} 
                                        />
                                    </div>
                                </div>

                                <div className="hidden md:block">
                                    {/* Promotional banner equivalent to the image */}
                                    <div className="bg-red-50 border border-red-100 rounded-lg p-6 text-center h-full flex flex-col items-center justify-center">
                                        <h3 className="text-xl font-bold text-red-600 mb-2">LIST YOUR BUSINESS</h3>
                                        <p className="text-gray-700 font-semibold mb-2">Get More Leads & Bookings</p>
                                        <p className="text-sm text-gray-500">Fast tracking. Grow your business rapidly with VenueConnect today!</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info Section */}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-center text-gray-900 mb-4 uppercase">Add Contact Information</h3>
                                <div className="bg-red-50 py-3 text-center text-red-800 text-sm font-semibold mb-6">
                                    Lead notifications and updates from VenueConnect will be sent to this contact.
                                </div>

                                <div className="max-w-2xl mx-auto space-y-4">
                                    <div>
                                        <input 
                                            type="text" 
                                            name="contactName" 
                                            value={formData.contactName} 
                                            onChange={handleChange} 
                                            placeholder="Venue owner / Authorized person name *" 
                                            className={inputCls} 
                                            required 
                                        />
                                    </div>
                                    <div className="flex bg-white border border-gray-300 rounded-md focus-within:border-red-500 overflow-hidden">
                                        <div className="flex items-center px-3 bg-gray-50 border-r border-gray-300 text-gray-500 text-sm">
                                            +91
                                        </div>
                                        <input 
                                            type="tel" 
                                            name="mobile" 
                                            value={formData.mobile} 
                                            onChange={handleChange} 
                                            placeholder="Mobile number *" 
                                            className="w-full px-3 py-2 text-gray-700 focus:outline-none" 
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

                            <div className="text-center pt-6">
                                <p className="text-xs text-gray-600 mb-4 font-medium">
                                    By clicking on Submit and Get me Started button, I hereby agree to VenueConnect terms and Privacy Policy, and to receive emails, sms & updates
                                </p>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold py-3 px-8 rounded-md"
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

export default ListVenue;
