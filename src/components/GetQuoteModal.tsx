"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Phone, Calendar, Users, MessageSquare, IndianRupee, Mail } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface GetQuoteModalProps {
    businessName: string;
    listingId: string;
    listingType: 'venue' | 'vendor';
    ownerId?: string | null;
    triggerButton?: React.ReactNode;
}

const GetQuoteModal = ({ businessName, listingId, listingType, ownerId, triggerButton }: GetQuoteModalProps) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    // Form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [guests, setGuests] = useState("");
    const [requirements, setRequirements] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from('leads').insert([
                {
                    listing_id: listingId,
                    listing_type: listingType,
                    owner_id: ownerId || null,
                    customer_name: name,
                    customer_email: email,
                    customer_phone: phone,
                    event_date: eventDate || null,
                    message: `Requirements: ${requirements} | Guests: ${guests}`
                }
            ]);

            if (error) throw error;

            toast.success(`Request sent to ${businessName}!`, {
                description: "They will contact you shortly with a personalized quote.",
            });

            // Reset form
            setName("");
            setEmail("");
            setPhone("");
            setEventDate("");
            setGuests("");
            setRequirements("");
            setOpen(false);
        } catch (error: any) {
            toast.error("Failed to send request", {
                description: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {triggerButton || (
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-md text-base h-12">
                        Request Pricing Details
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="font-display text-2xl">Get Free Quote</DialogTitle>
                    <DialogDescription>
                        Request latest pricing and availability from <strong className="text-foreground">{businessName}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Your Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="E.g., Rahul Sharma"
                                className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="E.g., rahul@example.com (Optional)"
                                className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+91"
                                className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Event Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="date"
                                    value={eventDate}
                                    onChange={(e) => setEventDate(e.target.value)}
                                    className="w-full pl-9 pr-2 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Guests</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="number"
                                    min="1"
                                    value={guests}
                                    onChange={(e) => setGuests(e.target.value)}
                                    placeholder="E.g., 200 (Optional)"
                                    className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Any specific requirements?</label>
                        <div className="relative">
                            <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <textarea
                                value={requirements}
                                onChange={(e) => setRequirements(e.target.value)}
                                placeholder="Any special requests or details about your event..."
                                className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[80px]"
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 mt-2" disabled={loading}>
                        {loading ? "Sending Request..." : "Send Request to Venue"}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground mt-2 flex items-center justify-center gap-1">
                        <IndianRupee className="w-3 h-3" /> No booking fees or hidden charges
                    </p>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default GetQuoteModal;
