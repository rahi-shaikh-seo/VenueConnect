import { Check, Minus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingPackagesProps {
    onSelect: (pkg: string) => void;
    isLoading: boolean;
}

export default function PricingPackages({ onSelect, isLoading }: PricingPackagesProps) {
    const packages = [
        {
            name: "Starter",
            originalPrice: "₹999",
            price: "Free",
            period: "for now",
            leads: "10 leads / month",
            features: [
                "10 leads forwarded to your WhatsApp every month",
                "Each lead includes: name, phone number & event type",
                "Basic listing on VenueConnect (name, city, category)",
                "Appear in city & category search results"
            ],
            notIncluded: [
                "Verified badge on listing",
                "Budget & guest count in lead details",
                "Priority leads (high-intent enquiries)",
                "Top-up extra leads",
                "Featured placement"
            ],
            extraLeads: null
        },
        {
            name: "Professional",
            badge: "Most popular",
            verifiedBadge: true,
            originalPrice: null,
            price: "₹2,499",
            period: "/ month",
            leads: "30 leads / month",
            features: [
                "30 leads forwarded to your WhatsApp every month",
                "Full lead details — name, phone, event type, budget & guest count",
                "Verified badge shown on your listing page",
                "Priority leads — high-intent enquiries forwarded first",
                "Enhanced listing — more photos & description",
                "Featured placement in category page",
                "Top-up extra leads at ₹150/lead"
            ],
            notIncluded: [
                "Category page #1 placement",
                "Exclusive leads",
                "Monthly performance report"
            ],
            extraLeads: "Extra leads: ₹150 per additional lead"
        },
        {
            name: "Elite",
            verifiedBadge: true,
            originalPrice: null,
            price: "₹4,999",
            period: "/ month",
            leads: "75 leads / month",
            features: [
                "75 leads forwarded to your WhatsApp every month",
                "Full lead details — name, phone, event type, budget, guest count",
                "Verified badge shown on your listing page",
                "Exclusive leads — same lead not sent to any competitor",
                "Category page #1 placement",
                "Top-up extra leads at ₹100/lead (best rate)",
                "Monthly performance report",
                "Dedicated account manager"
            ],
            notIncluded: [],
            extraLeads: "Extra leads: ₹100 per additional lead"
        }
    ];

    return (
        <div className="w-full">
            <div className="max-w-5xl mx-auto mb-12 bg-[#1A1A1A] rounded-2xl p-6 md:p-8 border border-slate-800 shadow-xl overflow-hidden">
                <h3 className="text-xl font-bold text-white mb-8 text-center">How Lead Forwarding Works</h3>
                <div className="flex flex-wrap items-center justify-center gap-y-5 gap-x-2 text-[13px] md:text-sm font-medium">
                    <span className="bg-[#2A2A2A] text-slate-200 border border-slate-700 px-4 py-2 rounded-full inline-block">User sees listing</span>
                    <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                    
                    <span className="bg-[#2A2A2A] text-slate-200 border border-slate-700 px-4 py-2 rounded-full inline-block">Clicks "Send Enquiry"</span>
                    <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                    
                    <span className="bg-[#2A2A2A] text-slate-200 border border-slate-700 px-4 py-2 rounded-full inline-block">Fills form (name, phone, budget, date)</span>
                    <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                    
                    <span className="bg-[#E8F5E9] text-emerald-800 px-5 py-2 rounded-full font-bold shadow-lg shadow-emerald-500/10 inline-block">Lead goes to VenueConnect</span>
                    <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                    
                    <span className="bg-[#2A2A2A] text-slate-200 border border-slate-700 px-4 py-2 rounded-full inline-block">Forwarded to paid subscriber via WhatsApp</span>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto py-4">
                {packages.map((pkg) => (
                <div 
                    key={pkg.name} 
                    className={`relative bg-[#1A1A1A] text-white rounded-2xl p-6 md:p-8 flex flex-col border ${
                        pkg.name === 'Professional' 
                            ? 'border-emerald-500 shadow-lg shadow-emerald-900/20' 
                            : 'border-slate-800'
                    }`}
                >
                    {pkg.badge && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                            {pkg.badge}
                        </div>
                    )}
                    
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold">{pkg.name}</h3>
                            {pkg.verifiedBadge && (
                                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Verified
                                </span>
                            )}
                        </div>
                        
                        <div className="flex items-baseline gap-2 mb-3">
                            {pkg.originalPrice && (
                                <span className="text-xl text-slate-400 line-through decoration-slate-400">{pkg.originalPrice}</span>
                            )}
                            <span className="text-4xl font-bold text-white">{pkg.price}</span>
                            <span className="text-slate-400 text-sm">{pkg.period}</span>
                        </div>
                        
                        <div className="bg-[#E8F5E9] text-emerald-800 text-sm font-semibold px-4 py-1.5 rounded-full inline-block mt-2">
                            {pkg.leads}
                        </div>
                    </div>
                    
                    <div className="flex-grow space-y-6 text-sm">
                        <div className="space-y-4">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">What you get</p>
                            {pkg.features.map((feat, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <span className="text-slate-300 leading-relaxed text-[13px]">{feat}</span>
                                </div>
                            ))}
                        </div>
                        
                        {pkg.notIncluded.length > 0 && (
                            <div className="space-y-4 pt-4 border-t border-slate-800">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Not included</p>
                                {pkg.notIncluded.map((feat, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <Minus className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                                        <span className="text-slate-500 leading-relaxed text-[13px]">{feat}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-slate-800">
                        {pkg.extraLeads && (
                            <div className="bg-[#2A2A2A] text-slate-300 text-xs text-center p-3 rounded-lg mb-4">
                                {pkg.extraLeads}
                            </div>
                        )}
                        <Button 
                            onClick={() => onSelect(pkg.name)}
                            disabled={isLoading}
                            className={`w-full h-12 rounded-xl font-bold text-base transition-all border ${
                                pkg.name === 'Professional' 
                                    ? 'bg-transparent text-white border-white hover:bg-white/10' 
                                    : 'bg-transparent border-slate-600 text-white hover:bg-slate-800'
                            }`}
                        >
                            Get started {pkg.name === 'Starter' && '(Free)'}
                        </Button>
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
}
