import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Store, MapPin, Camera, UploadCloud, X, IndianRupee, Plus, Trash2 } from "lucide-react";
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
    const [step, setStep] = useState(1);
    const [userId, setUserId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        businessName: "",
        category: "",
        city: "",
        address: "",
        contactName: "",
        phone: "",
        email: "",
        startingPrice: "",
        description: "",
        website: "",
        instagram: "",
    });

    const [serviceAreas, setServiceAreas] = useState<string[]>([]);
    const [specialities, setSpecialities] = useState<string[]>(["Wedding", "Engagement"]);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                toast.error("Authentication required", {
                    description: "Please log in to list your business."
                });
                navigate("/login");
            } else {
                setUserId(session.user.id);
            }
        };
        checkAuth();
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            if (imageFiles.length + newFiles.length > 5) {
                toast.error("Maximum 5 images allowed");
                return;
            }
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setImageFiles(prev => [...prev, ...newFiles]);
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (indexToRemove: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== indexToRemove));
        setImagePreviews(prev => prev.filter((_, i) => i !== indexToRemove));
    };

    const toggleItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
        setter(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    };

    const nextStep = () => setStep(s => Math.min(s + 1, 4));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.category) { toast.error("Please select a service type"); return; }
        setIsSubmitting(true);

        try {
            const imageUrls: string[] = [];
            for (const file of imageFiles) {
                try {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
                    const { error: uploadError } = await supabase.storage
                        .from('venue_applications_images')
                        .upload(fileName, file);
                    if (!uploadError) {
                        const { data: { publicUrl } } = supabase.storage
                            .from('venue_applications_images')
                            .getPublicUrl(fileName);
                        imageUrls.push(publicUrl);
                    }
                } catch (imgErr) {
                    console.warn('Image upload skipped:', imgErr);
                }
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
                image_url: imageUrls.length > 0 ? imageUrls[0] : null,
                images: imageUrls,
            }]);

            if (error) throw error;

            toast.success("Application submitted!", {
                description: "Our team will review your vendor listing and get back to you."
            });
            setStep(5); // Success step
        } catch (error: any) {
            toast.error("Failed to submit", { description: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const StepProgress = () => (
        <div className="flex items-center justify-center gap-0 mb-10">
            {[1, 2, 3, 4].map((s, i) => (
                <div key={s} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${step >= s ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>{s}</div>
                    {i < 3 && <div className={`h-0.5 w-12 md:w-20 transition-all ${step > s ? 'bg-primary' : 'bg-slate-200'}`} />}
                </div>
            ))}
        </div>
    );

    if (step === 5) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <main className="flex-grow flex items-center justify-center py-20 px-4">
                    <div className="text-center max-w-md mx-auto">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>
                        <h1 className="text-2xl font-display font-semibold text-slate-900 mb-3">Application Submitted!</h1>
                        <p className="text-slate-500 mb-8">Thank you for registering your business. Our team will review your application and approve it within 24 hours.</p>
                        <Button onClick={() => navigate('/')}>Back to Home</Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            {/* Hero Banner */}
            <div className="relative h-56 bg-gradient-to-r from-slate-900 via-primary/80 to-slate-900 flex items-center justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600&q=80" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                <div className="relative z-10 text-center text-white">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Store className="w-5 h-5 text-primary" />
                        <span className="text-xs font-semibold tracking-[3px] uppercase text-white/60">For Vendors & Service Providers</span>
                    </div>
                    <h1 className="font-display text-3xl md:text-4xl font-semibold">List Your Vendor Business</h1>
                    <p className="text-white/60 text-sm mt-2">Reach thousands of couples planning their special day</p>
                </div>
            </div>

            <main className="flex-grow py-12">
                <div className="container max-w-3xl mx-auto px-4">
                    <StepProgress />

                    <form onSubmit={handleSubmit}>

                        {/* ---- STEP 1: Basic Info ---- */}
                        {step === 1 && (
                            <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
                                <h2 className="text-xl font-semibold text-slate-900 mb-1">Business Information</h2>
                                <p className="text-sm text-slate-500 mb-6">Tell us about your service business</p>

                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Service Type *</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full border border-border rounded-lg px-4 py-3 bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                                            required
                                        >
                                            <option value="">Select Service Type</option>
                                            {VENDOR_CATEGORIES.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Business Name *</label>
                                        <input name="businessName" value={formData.businessName} onChange={handleChange}
                                            className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background" placeholder="Your business name" required />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">City *</label>
                                            <select name="city" value={formData.city} onChange={handleChange}
                                                className="w-full border border-border rounded-lg px-4 py-3 bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" required>
                                                <option value="">Select City</option>
                                                {gujaratCities.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Address *</label>
                                            <input name="address" value={formData.address} onChange={handleChange}
                                                className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background" placeholder="Business address" required />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <Button type="button" onClick={nextStep} className="px-8">
                                        Next <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* ---- STEP 2: Contact & Pricing ---- */}
                        {step === 2 && (
                            <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
                                <h2 className="text-xl font-semibold text-slate-900 mb-1">Contact & Pricing</h2>
                                <p className="text-sm text-slate-500 mb-6">How can customers reach you?</p>

                                <div className="space-y-5">
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Contact Person *</label>
                                            <input name="contactName" value={formData.contactName} onChange={handleChange}
                                                className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background" placeholder="Your full name" required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Phone *</label>
                                            <input name="phone" value={formData.phone} onChange={handleChange} type="tel"
                                                className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background" placeholder="+91 98765 43210" required />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Business Email *</label>
                                            <input name="email" value={formData.email} onChange={handleChange} type="email"
                                                className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background" placeholder="hello@yourbusiness.com" required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium flex items-center gap-1">
                                                <IndianRupee className="w-4 h-4 text-slate-400" /> Starting Price (₹)
                                            </label>
                                            <input name="startingPrice" value={formData.startingPrice} onChange={handleChange} type="number"
                                                className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background" placeholder="e.g. 15000" />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Website (optional)</label>
                                            <input name="website" value={formData.website} onChange={handleChange}
                                                className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background" placeholder="https://yourwebsite.com" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Instagram (optional)</label>
                                            <input name="instagram" value={formData.instagram} onChange={handleChange}
                                                className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background" placeholder="@yourbusiness" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-between">
                                    <Button type="button" variant="outline" onClick={prevStep}>Back</Button>
                                    <Button type="button" onClick={nextStep} className="px-8">
                                        Next <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* ---- STEP 3: Description & Specialities ---- */}
                        {step === 3 && (
                            <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
                                <h2 className="text-xl font-semibold text-slate-900 mb-1">About Your Business</h2>
                                <p className="text-sm text-slate-500 mb-6">Help customers understand what you offer</p>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Business Description *</label>
                                        <textarea name="description" value={formData.description} onChange={handleChange}
                                            className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background min-h-[120px]"
                                            placeholder="Describe your services, experience, and what makes you special..." required />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-medium">Event Specialities</label>
                                        <div className="flex flex-wrap gap-2">
                                            {["Wedding", "Engagement", "Reception", "Birthday", "Corporate", "Baby Shower", "Anniversary", "Sangeet", "Mehendi", "Haldi"].map(s => (
                                                <button key={s} type="button"
                                                    onClick={() => toggleItem(setSpecialities, s)}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${specialities.includes(s) ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-border hover:border-primary/40'}`}>
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-medium">Service Areas</label>
                                        <div className="flex flex-wrap gap-2">
                                            {gujaratCities.map(c => (
                                                <button key={c} type="button"
                                                    onClick={() => toggleItem(setServiceAreas, c)}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${serviceAreas.includes(c) ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-border hover:border-primary/40'}`}>
                                                    {c}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-between">
                                    <Button type="button" variant="outline" onClick={prevStep}>Back</Button>
                                    <Button type="button" onClick={nextStep} className="px-8">
                                        Next <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* ---- STEP 4: Photos ---- */}
                        {step === 4 && (
                            <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
                                <h2 className="text-xl font-semibold text-slate-900 mb-1">Portfolio Photos</h2>
                                <p className="text-sm text-slate-500 mb-6">Upload up to 5 photos showcasing your work</p>

                                <div className="space-y-6">
                                    <label className="block border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                                        <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                                        <UploadCloud className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                        <p className="text-sm font-medium text-slate-600">Click to upload portfolio photos</p>
                                        <p className="text-xs text-slate-400 mt-1">JPG, PNG or WebP • Max 5 images • 10MB each</p>
                                    </label>

                                    {imagePreviews.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {imagePreviews.map((src, idx) => (
                                                <div key={idx} className="relative rounded-xl overflow-hidden aspect-video group">
                                                    <img src={src} alt="" className="w-full h-full object-cover" />
                                                    <button type="button" onClick={() => removeImage(idx)}
                                                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
                                        <Camera className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                        <div className="text-sm text-blue-700">
                                            <p className="font-medium mb-1">Tips for great portfolio photos:</p>
                                            <ul className="text-blue-600 space-y-1 list-disc list-inside text-xs">
                                                <li>Show your best and most recent work</li>
                                                <li>Use high-resolution, well-lit images</li>
                                                <li>Include variety (different events or styles)</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-between">
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
