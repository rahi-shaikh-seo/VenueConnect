import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Building2, MapPin, Camera, Info, UploadCloud, X, Users, Utensils, IndianRupee, Wifi, Wind, Map, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { gujaratCities } from "@/lib/cities";

const ListVenue = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [userId, setUserId] = useState<string | null>(null);

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

    // Comprehensive State mapped to new schema
    const [formData, setFormData] = useState({
        // Step 1: Basic Info
        businessName: "",
        category: "venue",
        city: "",
        address: "",
        contactName: "",
        phone: "",
        email: "",
        
        // Step 2: Capacity & Pricing
        minCapacity: "",
        maxCapacity: "",
        vegPrice: "",
        nonVegPrice: "",
        advancePayment: "50",

        // Step 3: Amenities & Policies
        roomsCount: "",
        indoorSpaces: "",
        outdoorSpaces: "",
        hasAc: false,
        hasWifi: false,
        alcoholServed: false,
        cateringPolicy: "Inhouse catering only",
        operatingHours: "10:00 AM - 11:00 PM",
        
        // Description
        description: "",
    });

    const [cuisines, setCuisines] = useState<string[]>([]);
    const [amenities, setAmenities] = useState<string[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<string[]>(['Cash', 'UPI']);
    
    // Multiple Images
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleArrayChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
        setter(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            
            // Limit to 5 images max
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
        setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
        setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const nextStep = () => setStep((s) => Math.min(s + 1, 5));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const imageUrls: string[] = [];

            // Upload all images (non-blocking - form submits even if upload fails)
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
                    } else {
                        console.warn('Image upload failed:', uploadError.message);
                    }
                } catch (imgErr) {
                    console.warn('Image upload skipped:', imgErr);
                }
            }

            const { error } = await supabase.from('venue_applications').insert([
                {
                    user_id: userId,
                    business_name: formData.businessName,
                    venue_type: formData.category,
                    city: formData.city,
                    address: formData.address,
                    contact_person: formData.contactName,
                    business_phone: formData.phone,
                    business_email: formData.email,
                    description: formData.description,
                    
                    // New comprehensive fields
                    min_capacity: parseInt(formData.minCapacity) || null,
                    max_capacity: parseInt(formData.maxCapacity) || null,
                    veg_price_per_plate: parseInt(formData.vegPrice) || null,
                    nonveg_price_per_plate: parseInt(formData.nonVegPrice) || null,
                    advance_payment_percentage: parseInt(formData.advancePayment) || 50,
                    
                    rooms_count: parseInt(formData.roomsCount) || 0,
                    indoor_spaces: parseInt(formData.indoorSpaces) || 0,
                    outdoor_spaces: parseInt(formData.outdoorSpaces) || 0,
                    
                    has_ac: formData.hasAc,
                    has_wifi: formData.hasWifi,
                    alcohol_served: formData.alcoholServed,
                    
                    catering_policy: formData.cateringPolicy,
                    operating_hours: formData.operatingHours,
                    
                    cuisines: cuisines,
                    amenities: amenities,
                    payment_methods: paymentMethods,
                    
                    // Store array of images, keep image_url as the first one for backwards compatibility
                    image_url: imageUrls.length > 0 ? imageUrls[0] : null,
                    images: imageUrls
                }
            ]);

            if (error) throw error;

            toast.success("Application submitted successfully!", {
                description: "Our team will review your comprehensive listing."
            });
            setStep(6); // Success step

        } catch (error: any) {
            toast.error("Failed to submit application", {
                description: error.message
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const StepProgress = () => {
        const steps = [
            { id: 1, name: "Basic Info" },
            { id: 2, name: "Capacity" },
            { id: 3, name: "Policies" },
            { id: 4, name: "Media" },
            { id: 5, name: "Review" }
        ];

        return (
            <div className="flex items-center justify-center mb-10 w-full max-w-3xl mx-auto overflow-x-auto pb-4">
                {steps.map((s, idx) => (
                    <div key={s.id} className="flex items-center shrink-0">
                        <div className={`flex flex-col items-center w-20 sm:w-24 ${step >= s.id ? 'text-primary' : 'text-muted-foreground'}`}>
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-colors ${step >= s.id ? 'bg-primary text-white shadow-md' : 'bg-muted'}`}>
                                {s.id}
                            </div>
                            <span className="text-[10px] sm:text-xs font-medium text-center">{s.name}</span>
                        </div>
                        {idx < steps.length - 1 && (
                            <div className={`h-1 w-8 sm:w-12 mx-1 sm:mx-2 rounded-full transition-colors ${step > s.id ? 'bg-primary' : 'bg-muted'}`} />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <PageHeader
                title="List Your Business"
                subtitle="List your business or services and reach thousands of customers across Gujarat."
                image="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80"
            />

            <main className="flex-grow py-12 md:py-20 bg-muted/20">
                <div className="container px-4 sm:px-6 flex justify-center">

                    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-border/50 p-6 md:p-12">

                        {step < 6 && (
                            <>
                                <div className="text-center mb-10">
                                    <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-3">Create Comprehensive Listing</h2>
                                    <p className="text-muted-foreground text-sm max-w-md mx-auto">
                                        Provide detailed information to attract more genuine leads and bookings.
                                    </p>
                                </div>
                                <StepProgress />
                            </>
                        )}

                        {step === 6 ? (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                                </div>
                                <h3 className="font-display text-3xl font-semibold mb-3">Application Submitted!</h3>
                                <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
                                    Thank you for providing a detailed listing. Our onboarding team will review your application and contact you within 24 hours to make it live.
                                </p>
                                <Button onClick={() => window.location.href = '/dashboard'} className="bg-primary hover:bg-primary/90 text-white px-8 h-12 text-lg">
                                    Go to Dashboard
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={step === 5 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>

                                {/* STEP 1: Basic Info */}
                                {step === 1 && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <h3 className="text-xl font-semibold border-b pb-2">1. Basic Information</h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Business Category *</label>
                                                <select
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleChange}
                                                    className="w-full border-border rounded-lg px-4 py-3 focus:ring-primary focus:border-primary bg-background"
                                                    required
                                                >
                                                    <option value="venue">Venue (Banquet, Hotel, Farmhouse)</option>
                                                    <option value="vendor">Vendor (Photographer, Decorator)</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Business Name *</label>
                                                <div className="relative">
                                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <input
                                                        name="businessName"
                                                        value={formData.businessName}
                                                        onChange={handleChange}
                                                        type="text"
                                                        placeholder="e.g. Royal Palace Banquet"
                                                        className="w-full pl-10 pr-4 py-3 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-background"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Full Address *</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                <textarea
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    placeholder="Enter complete street address..."
                                                    className="w-full pl-10 pr-4 py-3 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-background min-h-[80px]"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">City *</label>
                                                <select
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    className="w-full border-border rounded-lg px-4 py-3 focus:ring-primary focus:border-primary bg-background"
                                                    required
                                                >
                                                    <option value="">Select city</option>
                                                    {gujaratCities.map(city => (
                                                        <option key={city} value={city}>{city}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Contact Person *</label>
                                                <input
                                                    name="contactName"
                                                    value={formData.contactName}
                                                    onChange={handleChange}
                                                    type="text"
                                                    placeholder="John Doe"
                                                    className="w-full px-4 py-3 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-background"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Primary Contact *</label>
                                                <input
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    type="tel"
                                                    placeholder="+91"
                                                    className="w-full px-4 py-3 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-background"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-6 mt-8 flex justify-end">
                                            <Button type="submit" className="bg-primary px-8">Save & Next</Button>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 2: Capacity & Pricing */}
                                {step === 2 && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <h3 className="text-xl font-semibold border-b pb-2 flex items-center gap-2"><Users className="w-5 h-5"/> 2. Capacity & Pricing</h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4 bg-muted/10 p-5 rounded-xl border border-border/50">
                                                <h4 className="font-medium text-primary">Guest Capacity</h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-medium text-muted-foreground">Minimum Guests</label>
                                                        <input type="number" name="minCapacity" value={formData.minCapacity} onChange={handleChange} placeholder="e.g. 50" className="w-full px-4 py-2 border rounded-lg text-sm" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-medium text-muted-foreground">Maximum Guests</label>
                                                        <input type="number" name="maxCapacity" value={formData.maxCapacity} onChange={handleChange} placeholder="e.g. 500" className="w-full px-4 py-2 border rounded-lg text-sm" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4 bg-muted/10 p-5 rounded-xl border border-border/50">
                                                <h4 className="font-medium text-primary">Space Specifications</h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-medium text-muted-foreground">Indoor Halls Count</label>
                                                        <input type="number" name="indoorSpaces" value={formData.indoorSpaces} onChange={handleChange} placeholder="0" className="w-full px-4 py-2 border rounded-lg text-sm" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-medium text-muted-foreground">Outdoor Lawns Count</label>
                                                        <input type="number" name="outdoorSpaces" value={formData.outdoorSpaces} onChange={handleChange} placeholder="0" className="w-full px-4 py-2 border rounded-lg text-sm" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-muted/10 p-5 rounded-xl border border-border/50 space-y-4">
                                            <h4 className="font-medium text-primary flex items-center gap-2"><IndianRupee className="w-4 h-4"/> Pricing Details</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-muted-foreground">Veg Plate Price (Starting ₹)</label>
                                                    <input type="number" name="vegPrice" value={formData.vegPrice} onChange={handleChange} placeholder="e.g. 800" className="w-full px-4 py-2 border rounded-lg text-sm" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-muted-foreground">Non-Veg Plate Price (Optional)</label>
                                                    <input type="number" name="nonVegPrice" value={formData.nonVegPrice} onChange={handleChange} placeholder="e.g. 1000" className="w-full px-4 py-2 border rounded-lg text-sm" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-muted-foreground">Booking Advance (%)</label>
                                                    <select name="advancePayment" value={formData.advancePayment} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg text-sm bg-background">
                                                        <option value="25">25% Advance</option>
                                                        <option value="50">50% Advance</option>
                                                        <option value="100">100% Full Payment</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6 flex justify-between">
                                            <Button type="button" variant="outline" onClick={prevStep}>Back</Button>
                                            <Button type="submit" className="bg-primary px-8">Save & Next</Button>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3: Amenities & Policies */}
                                {step === 3 && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <h3 className="text-xl font-semibold border-b pb-2">3. Amenities & Policies</h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Left Column */}
                                            <div className="space-y-6">
                                                <div className="space-y-3">
                                                    <label className="text-sm font-medium">Core Amenities</label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                                            <input type="checkbox" name="hasAc" checked={formData.hasAc} onChange={handleChange} className="rounded text-primary focus:ring-primary w-4 h-4" />
                                                            <Wind className="w-4 h-4 text-muted-foreground"/> <span className="text-sm font-medium">Air Conditioning</span>
                                                        </label>
                                                        <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                                            <input type="checkbox" name="hasWifi" checked={formData.hasWifi} onChange={handleChange} className="rounded text-primary focus:ring-primary w-4 h-4" />
                                                            <Wifi className="w-4 h-4 text-muted-foreground"/> <span className="text-sm font-medium">Free WiFi</span>
                                                        </label>
                                                        <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                                            <input type="checkbox" name="alcoholServed" checked={formData.alcoholServed} onChange={handleChange} className="rounded text-primary focus:ring-primary w-4 h-4" />
                                                            <Utensils className="w-4 h-4 text-muted-foreground"/> <span className="text-sm font-medium">Alcohol Served</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-sm font-medium">Catering Policy</label>
                                                    <select name="cateringPolicy" value={formData.cateringPolicy} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg text-sm bg-background">
                                                        <option value="Inhouse catering only">Inhouse catering only</option>
                                                        <option value="Outside catering allowed">Outside catering allowed</option>
                                                        <option value="Both inhouse and outside allowed">Both inhouse and outside allowed</option>
                                                    </select>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Guest Rooms Available</label>
                                                        <input type="number" name="roomsCount" value={formData.roomsCount} onChange={handleChange} placeholder="0" className="w-full px-4 py-2 border rounded-lg text-sm" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Operating Hours</label>
                                                        <input type="text" name="operatingHours" value={formData.operatingHours} onChange={handleChange} placeholder="e.g. 10:00 AM - 11 PM" className="w-full px-4 py-2 border rounded-lg text-sm" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Column */}
                                            <div className="space-y-6">
                                                <div className="space-y-3">
                                                    <label className="text-sm font-medium flex justify-between">
                                                        <span>Cuisines Offered</span>
                                                        <span className="text-xs text-muted-foreground font-normal">Select multiple</span>
                                                    </label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {['North Indian', 'South Indian', 'Chinese', 'Italian', 'Continental', 'Gujarati', 'Jain Specific'].map(cuisine => (
                                                            <button 
                                                                type="button" 
                                                                key={cuisine}
                                                                onClick={() => handleArrayChange(setCuisines, cuisine)}
                                                                className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${cuisines.includes(cuisine) ? 'bg-primary text-white border-primary' : 'bg-white text-muted-foreground hover:border-primary/50'}`}
                                                            >
                                                                {cuisines.includes(cuisine) && <CheckCircle2 className="w-3 h-3 inline mr-1"/>}{cuisine}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-sm font-medium flex justify-between">
                                                        <span>Other Amenities</span>
                                                        <span className="text-xs text-muted-foreground font-normal">Select multiple</span>
                                                    </label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {['Parking', 'Valet', 'Wheelchair Accessible', 'DJ Allowed', 'Decorators Allowed', 'Firecrackers Allowed'].map(am => (
                                                            <button 
                                                                type="button" 
                                                                key={am}
                                                                onClick={() => handleArrayChange(setAmenities, am)}
                                                                className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${amenities.includes(am) ? 'bg-primary text-white border-primary' : 'bg-white text-muted-foreground hover:border-primary/50'}`}
                                                            >
                                                                {amenities.includes(am) && <CheckCircle2 className="w-3 h-3 inline mr-1"/>}{am}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mt-6">
                                            <label className="text-sm font-medium">Detailed Description</label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                placeholder="Write a compelling description covering history, unique selling points, and what makes your venue special..."
                                                className="w-full p-4 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-background min-h-[120px]"
                                                required
                                            />
                                        </div>

                                        <div className="pt-6 flex justify-between">
                                            <Button type="button" variant="outline" onClick={prevStep}>Back</Button>
                                            <Button type="submit" className="bg-primary px-8">Save & Next</Button>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 4: Media */}
                                {step === 4 && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <h3 className="text-xl font-semibold border-b pb-2 flex items-center gap-2"><Camera className="w-5 h-5"/> 4. High Quality Media</h3>
                                        <p className="text-sm text-muted-foreground mb-6">Venues with 5+ high-quality images receive 3x more leads. Upload clear, well-lit photos of your space, decor, and past events.</p>

                                        <div className="border-2 border-dashed border-primary/30 rounded-2xl p-10 text-center bg-primary/5 hover:bg-primary/10 transition-colors w-full cursor-pointer relative">
                                            <UploadCloud className="w-12 h-12 text-primary mx-auto mb-4" />
                                            <h4 className="font-semibold text-lg text-foreground mb-1">Click to Upload Images</h4>
                                            <p className="text-sm text-muted-foreground mb-4">PNG, JPG, WEBP up to 5MB (Max 5 images)</p>
                                            
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                disabled={imageFiles.length >= 5}
                                            />
                                            
                                            <div className="text-xs font-medium text-primary bg-white px-3 py-1 rounded-full inline-block shadow-sm">
                                                {imageFiles.length}/5 Uploaded
                                            </div>
                                        </div>

                                        {imagePreviews.length > 0 && (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-6">
                                                {imagePreviews.map((preview, idx) => (
                                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-border shadow-sm group">
                                                        <img src={preview} alt={`Upload ${idx+1}`} className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <button type="button" onClick={() => removeImage(idx)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        {idx === 0 && <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">COVER</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="pt-8 flex justify-between">
                                            <Button type="button" variant="outline" onClick={prevStep}>Back</Button>
                                            <Button type="submit" className="bg-primary px-8" disabled={imageFiles.length === 0}>Save & Review</Button>
                                        </div>
                                    </div>
                                )}


                                {/* STEP 5: Review */}
                                {step === 5 && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <h3 className="text-xl font-semibold border-b pb-2">5. Final Review</h3>
                                        
                                        <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
                                            
                                            <div className="text-center w-full">
                                                <h3 className="text-2xl font-display font-bold text-slate-800 mb-2">List Your Business on VenueConnect</h3>
                                                <p className="text-slate-500 text-sm max-w-md mx-auto">
                                                    Join thousands of other businesses reaching engaged couples daily. Fill out the application below to get started.
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                                <div className="space-y-4">
                                                    <h4 className="text-sm font-bold text-slate-400 tracking-wider uppercase border-b pb-2">Specs & Capacity</h4>
                                                    <ul className="space-y-2 text-sm text-slate-700">
                                                        <li className="flex justify-between"><span>Guest Capacity:</span> <b>{formData.minCapacity || 0} - {formData.maxCapacity || 0}</b></li>
                                                        <li className="flex justify-between"><span>Veg Plate (Starts):</span> <b>₹{formData.vegPrice || 'N/A'}</b></li>
                                                        <li className="flex justify-between"><span>Indoor / Outdoor:</span> <b>{formData.indoorSpaces || 0} / {formData.outdoorSpaces || 0}</b></li>
                                                        <li className="flex justify-between"><span>Rooms Available:</span> <b>{formData.roomsCount || 0}</b></li>
                                                    </ul>
                                                </div>
                                                <div className="space-y-4">
                                                    <h4 className="text-sm font-bold text-slate-400 tracking-wider uppercase border-b pb-2">Rules & Policies</h4>
                                                    <ul className="space-y-2 text-sm text-slate-700">
                                                        <li className="flex justify-between"><span>Catering Policy:</span> <b>{formData.cateringPolicy}</b></li>
                                                        <li className="flex justify-between"><span>Advance Payment:</span> <b>{formData.advancePayment}%</b></li>
                                                        <li className="flex justify-between"><span>Air Conditioned:</span> <b>{formData.hasAc ? 'Yes' : 'No'}</b></li>
                                                        <li className="flex justify-between"><span>Liquor Permitted:</span> <b>{formData.alcoholServed ? 'Yes' : 'No'}</b></li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="text-sm font-bold text-slate-400 tracking-wider uppercase border-b pb-2">Cuisines & Amenities</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {[...cuisines, ...amenities].map((tag, i) => (
                                                        <span key={i} className="bg-white border border-slate-200 text-slate-600 text-xs font-medium px-2 py-1 rounded shadow-sm">{tag}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6 flex justify-between items-center border-t border-border">
                                            <Button type="button" variant="ghost" onClick={prevStep} disabled={isSubmitting}>Make Changes</Button>
                                            <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white min-w-[200px] h-12 shadow-lg text-lg">
                                                {isSubmitting ? "Submitting..." : "Submit Listing"}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ListVenue;
