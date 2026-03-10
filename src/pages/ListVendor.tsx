import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Store, UploadCloud, X, Camera } from "lucide-react";
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

const STEPS = ["Business Info", "Contact Details", "About & Specialities", "Photos"];

const ListVendor = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [userId, setUserId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [specialities, setSpecialities] = useState<string[]>([]);
    const [serviceAreas, setServiceAreas] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        category: "",
        businessName: "",
        city: "",
        address: "",
        // Step 2 — ALL MANDATORY
        contactName: "",
        phone: "",         // Phone / WhatsApp
        whatsapp: "",      // WhatsApp if different
        email: "",
        instagram: "",     // Social Media (mandatory)
        facebook: "",
        startingPrice: "",
        website: "",
        // Step 3
        description: "",
    });

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                toast.error("Please log in to list your business.");
                navigate("/login");
            } else {
                setUserId(session.user.id);
            }
        });
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            if (imageFiles.length + newFiles.length > 8) { toast.error("Max 8 images"); return; }
            setImageFiles(prev => [...prev, ...newFiles]);
            setImagePreviews(prev => [...prev, ...newFiles.map(f => URL.createObjectURL(f))]);
        }
    };

    const removeImage = (i: number) => {
        setImageFiles(prev => prev.filter((_, idx) => idx !== i));
        setImagePreviews(prev => prev.filter((_, idx) => idx !== i));
    };

    const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>, item: string) =>
        setter(prev => prev.includes(item) ? prev.filter(v => v !== item) : [...prev, item]);

    const validateStep = () => {
        if (step === 1) {
            if (!formData.category) { toast.error("Select a service type"); return false; }
            if (!formData.businessName.trim()) { toast.error("Enter business name"); return false; }
            if (!formData.city) { toast.error("Select a city"); return false; }
            if (!formData.address.trim()) { toast.error("Enter your address / location"); return false; }
        }
        if (step === 2) {
            if (!formData.contactName.trim()) { toast.error("Enter contact person name"); return false; }
            if (!formData.phone.trim()) { toast.error("Phone / WhatsApp number is required"); return false; }
            if (!formData.email.trim()) { toast.error("Email is required"); return false; }
            if (!formData.instagram.trim()) { toast.error("Instagram / Social media link is required"); return false; }
        }
        if (step === 3 && !formData.description.trim()) {
            toast.error("Please add a business description"); return false;
        }
        return true;
    };

    const nextStep = () => { if (validateStep()) setStep(s => Math.min(s + 1, 4)); };
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep()) return;
        setIsSubmitting(true);
        try {
            const imageUrls: string[] = [];
            for (const file of imageFiles) {
                try {
                    const ext = file.name.split('.').pop();
                    const name = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
                    const { error } = await supabase.storage.from('venue_applications_images').upload(name, file);
                    if (!error) {
                        const { data: { publicUrl } } = supabase.storage.from('venue_applications_images').getPublicUrl(name);
                        imageUrls.push(publicUrl);
                    }
                } catch { /* skip */ }
            }

            const { error } = await supabase.from('venue_applications').insert([{
                user_id: userId,
                business_name: formData.businessName,
                venue_type: 'vendor',
                vendor_category: formData.category,
                city: formData.city,
                address: formData.address,
                contact_person: formData.contactName,
                business_phone: formData.phone,
                business_email: formData.email,
                description: formData.description,
                veg_price_per_plate: parseInt(formData.startingPrice) || null,
                image_url: imageUrls[0] || null,
                images: imageUrls,
                // social media stored in extra fields
                website: formData.website || null,
                instagram: formData.instagram || null,
                facebook: formData.facebook || null,
                whatsapp: formData.whatsapp || formData.phone,
            }]);

            if (error) throw error;
            setStep(5);
            toast.success("Application submitted! We'll review within 24 hours.");
        } catch (err: any) {
            toast.error("Submission failed: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ---- Success Screen ----
    if (step === 5) return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-grow flex items-center justify-center py-20 px-4">
                <div className="text-center max-w-md mx-auto">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-display font-semibold mb-3">Application Submitted!</h1>
                    <p className="text-slate-500 mb-8">Our team will review your vendor listing and approve it within 24 hours.</p>
                    <Button onClick={() => navigate('/')}>Back to Home</Button>
                </div>
            </main>
            <Footer />
        </div>
    );

    const inputCls = "w-full border border-border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background";
    const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            {/* Banner */}
            <div className="relative h-48 flex items-center justify-center overflow-hidden bg-gradient-to-r from-purple-900 to-slate-900">
                <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600&q=80" alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
                <div className="relative z-10 text-center text-white px-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Store className="w-5 h-5 text-purple-300" />
                        <span className="text-xs font-semibold tracking-[3px] uppercase text-white/60">Vendor Registration</span>
                    </div>
                    <h1 className="font-display text-3xl md:text-4xl font-semibold">List Your Vendor Business</h1>
                    <p className="text-white/60 text-sm mt-2">Reach thousands of couples planning their special day</p>
                </div>
            </div>

            <main className="flex-grow py-12 bg-slate-50">
                <div className="container max-w-2xl mx-auto px-4">

                    {/* Progress */}
                    <div className="flex items-center justify-center gap-0 mb-10">
                        {[1, 2, 3, 4].map((s, i) => (
                            <div key={s} className="flex items-center">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? 'bg-primary text-white shadow-md' : 'bg-white border border-border text-slate-400'}`}>
                                    {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                                </div>
                                {i < 3 && <div className={`h-0.5 w-14 md:w-20 transition-all ${step > s ? 'bg-primary' : 'bg-slate-200'}`} />}
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-xs text-slate-400 mb-8 -mt-6">
                        Step {step} of 4 — <span className="font-semibold text-slate-600">{STEPS[step - 1]}</span>
                    </p>

                    <form onSubmit={handleSubmit}>

                        {/* STEP 1 — Business Info */}
                        {step === 1 && (
                            <div className="bg-white rounded-2xl border border-border shadow-sm p-8 space-y-5">
                                <div>
                                    <h2 className="text-xl font-semibold">Business Information</h2>
                                    <p className="text-sm text-slate-500 mt-1">Tell us about your service</p>
                                </div>

                                <div>
                                    <label className={labelCls}>Service / Category *</label>
                                    <select name="category" value={formData.category} onChange={handleChange} className={inputCls} required>
                                        <option value="">Select Service Type</option>
                                        {VENDOR_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className={labelCls}>Business Name *</label>
                                    <input name="businessName" value={formData.businessName} onChange={handleChange} className={inputCls} placeholder="Your business name" required />
                                </div>

                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label className={labelCls}>City *</label>
                                        <select name="city" value={formData.city} onChange={handleChange} className={inputCls} required>
                                            <option value="">Select City</option>
                                            {gujaratCities.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Starting Price (₹)</label>
                                        <input name="startingPrice" value={formData.startingPrice} onChange={handleChange} type="number" className={inputCls} placeholder="e.g. 15000" />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelCls}>Full Address / Location *</label>
                                    <input name="address" value={formData.address} onChange={handleChange} className={inputCls} placeholder="Shop/Studio address" required />
                                </div>

                                <div className="flex justify-end pt-2">
                                    <Button type="button" onClick={nextStep} className="px-8">
                                        Next <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* STEP 2 — Contact Details (all mandatory) */}
                        {step === 2 && (
                            <div className="bg-white rounded-2xl border border-border shadow-sm p-8 space-y-5">
                                <div>
                                    <h2 className="text-xl font-semibold">Contact Details</h2>
                                    <p className="text-sm text-slate-500 mt-1">All fields are required so customers can reach you</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label className={labelCls}>Contact Person *</label>
                                        <input name="contactName" value={formData.contactName} onChange={handleChange} className={inputCls} placeholder="Your full name" required />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Phone / WhatsApp Number *</label>
                                        <input name="phone" value={formData.phone} onChange={handleChange} type="tel" className={inputCls} placeholder="+91 98765 43210" required />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label className={labelCls}>Business Email *</label>
                                        <input name="email" value={formData.email} onChange={handleChange} type="email" className={inputCls} placeholder="you@business.com" required />
                                    </div>
                                    <div>
                                        <label className={labelCls}>WhatsApp (if different)</label>
                                        <input name="whatsapp" value={formData.whatsapp} onChange={handleChange} type="tel" className={inputCls} placeholder="+91 98765 43210" />
                                    </div>
                                </div>

                                {/* Social Media — MANDATORY */}
                                <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl space-y-4">
                                    <p className="text-sm font-semibold text-purple-800">Social Media (Required)</p>
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div>
                                            <label className={labelCls}>Instagram Profile / Page *</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">@</span>
                                                <input name="instagram" value={formData.instagram} onChange={handleChange} className={inputCls + " pl-7"} placeholder="yourbusiness" required />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelCls}>Facebook Page (optional)</label>
                                            <input name="facebook" value={formData.facebook} onChange={handleChange} className={inputCls} placeholder="fb.com/yourbusiness" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Website (optional)</label>
                                        <input name="website" value={formData.website} onChange={handleChange} className={inputCls} placeholder="https://yourwebsite.com" />
                                    </div>
                                </div>

                                <div className="flex justify-between pt-2">
                                    <Button type="button" variant="outline" onClick={prevStep}>Back</Button>
                                    <Button type="button" onClick={nextStep} className="px-8">Next <ArrowRight className="ml-2 w-4 h-4" /></Button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3 — About & Specialities */}
                        {step === 3 && (
                            <div className="bg-white rounded-2xl border border-border shadow-sm p-8 space-y-5">
                                <div>
                                    <h2 className="text-xl font-semibold">About Your Business</h2>
                                    <p className="text-sm text-slate-500 mt-1">Help customers understand what you offer</p>
                                </div>

                                <div>
                                    <label className={labelCls}>Business Description *</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange}
                                        className={inputCls + " min-h-[130px]"}
                                        placeholder="Describe your services, experience, style and package details..." required />
                                </div>

                                <div>
                                    <label className={labelCls}>Event Specialities</label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {["Wedding", "Engagement", "Reception", "Birthday", "Corporate", "Baby Shower", "Anniversary", "Sangeet", "Mehendi", "Haldi", "Other"].map(s => (
                                            <button key={s} type="button"
                                                onClick={() => toggle(setSpecialities, s)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${specialities.includes(s) ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-border hover:border-primary/40'}`}>
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className={labelCls}>Cities You Serve</label>
                                    <div className="flex flex-wrap gap-2 mt-1 max-h-40 overflow-y-auto">
                                        {gujaratCities.map(c => (
                                            <button key={c} type="button"
                                                onClick={() => toggle(setServiceAreas, c)}
                                                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${serviceAreas.includes(c) ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-border hover:border-primary/40'}`}>
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-between pt-2">
                                    <Button type="button" variant="outline" onClick={prevStep}>Back</Button>
                                    <Button type="button" onClick={nextStep} className="px-8">Next <ArrowRight className="ml-2 w-4 h-4" /></Button>
                                </div>
                            </div>
                        )}

                        {/* STEP 4 — Photos */}
                        {step === 4 && (
                            <div className="bg-white rounded-2xl border border-border shadow-sm p-8 space-y-5">
                                <div>
                                    <h2 className="text-xl font-semibold">Portfolio Photos</h2>
                                    <p className="text-sm text-slate-500 mt-1">Upload up to 8 photos showcasing your best work</p>
                                </div>

                                <label className="block border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                                    <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                                    <UploadCloud className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                    <p className="text-sm font-medium text-slate-600">Click to upload portfolio photos</p>
                                    <p className="text-xs text-slate-400 mt-1">JPG, PNG • Max 8 images • 10MB each</p>
                                </label>

                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                        {imagePreviews.map((src, i) => (
                                            <div key={i} className="relative rounded-xl overflow-hidden aspect-square group">
                                                <img src={src} alt="" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => removeImage(i)}
                                                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
                                    <Camera className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-blue-700">Show your best and most recent work. High-quality images get 3× more inquiries.</p>
                                </div>

                                <div className="flex justify-between pt-2">
                                    <Button type="button" variant="outline" onClick={prevStep}>Back</Button>
                                    <Button type="submit" className="px-8" disabled={isSubmitting}>
                                        {isSubmitting ? "Submitting..." : "Submit Application"}
                                        {!isSubmitting && <CheckCircle2 className="ml-2 w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>
                        )}

                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ListVendor;
