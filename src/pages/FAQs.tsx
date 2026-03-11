import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown, ChevronUp, HelpCircle, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const FAQ_CATEGORIES = [
  {
    label: "Finding a Venue",
    icon: "🔍",
    faqs: [
      {
        q: "How do I search for venues on VenueConnect?",
        a: "Use the search bar on the home page or go to the Venues section. You can filter by city, area/locality, venue type, guest capacity, price range and amenities. You can also click any area in the 'Explore Venues by Area' section to see venues in that specific locality."
      },
      {
        q: "Can I search for venues by area like Mavdi in Rajkot or Bopal in Ahmedabad?",
        a: "Yes! VenueConnect has an area/locality search. Either use the sidebar filter on the Venues page, or browse the 'Explore Venues by Area' section on the home page. Clicking any area — like Mavdi, Adajan, Alkapuri, or SG Highway — will show all venues in that locality."
      },
      {
        q: "What types of venues are listed on VenueConnect?",
        a: "We list Banquet Halls, Farmhouses, Hotels, Resorts, Party Plots, Convention Centres, Garden Venues, Lawn Venues, Rooftop Venues, Restaurant Event Spaces and more — all across Gujarat."
      },
      {
        q: "Which cities does VenueConnect cover?",
        a: "We cover all major cities in Gujarat: Ahmedabad, Surat, Rajkot, Vadodara, Gandhinagar, Anand, Bharuch, Bhavnagar, Jamnagar, Junagadh, Mehsana, Morbi, Nadiad, Navsari, Porbandar, Valsad and more."
      },
      {
        q: "Are all venue photos on the platform real?",
        a: "Yes. Venue photos are uploaded by the venue owners themselves and verified by our team before the listing goes live. We do not use stock photos for venue listings."
      },
    ]
  },
  {
    label: "Booking & Pricing",
    icon: "💰",
    faqs: [
      {
        q: "Is it free to use VenueConnect to search for venues?",
        a: "Yes, searching, browsing and comparing venues on VenueConnect is completely free for customers. You only pay the venue directly once you decide to book."
      },
      {
        q: "How do I get a price quote from a venue?",
        a: "Visit any venue's detail page and click the 'Get Quote' or 'Contact Venue' button. The venue owner will respond to your enquiry directly via WhatsApp or email, typically within a few hours."
      },
      {
        q: "What is the typical veg plate price for venues in Gujarat?",
        a: "Veg plate prices for Gujarat venues range from ₹500–₹600 for budget halls to ₹2,500–₹4,000+ for luxury properties. Mid-range banquet halls typically charge ₹1,000–₹1,800 per plate. All visible prices on VenueConnect are starting rates — final pricing depends on your specific date and requirements."
      },
      {
        q: "Do venues charge advance booking amounts?",
        a: "Most venues require an advance payment of 25%–50% to block your date. This is paid directly to the venue. VenueConnect does not collect any payments on behalf of venues."
      },
      {
        q: "Can I negotiate venue prices?",
        a: "Yes, many venue owners are open to negotiation, especially for weekday bookings or off-season dates. When contacting a venue, mention your date, expected guest count and budget — venues often offer customised packages."
      },
    ]
  },
  {
    label: "Weddings & Events",
    icon: "💍",
    faqs: [
      {
        q: "How early should I book a wedding venue in Gujarat?",
        a: "For peak season (October–March), we strongly recommend booking 6–12 months in advance. The best venues, especially in Ahmedabad, Surat and Rajkot, get booked very quickly. For off-season weddings, 3–4 months in advance may be sufficient."
      },
      {
        q: "Can VenueConnect help with venues for events other than weddings?",
        a: "Absolutely. We cover venues for all types of events: Weddings, Engagement Ceremonies, Receptions, Birthday Parties, Baby Showers, Anniversary Celebrations, Garba Nights, Corporate Events, Conferences, Kitty Parties, Product Launches and more."
      },
      {
        q: "Do venues on VenueConnect allow outside caterers?",
        a: "This depends on the individual venue. Some allow outside caterers (with or without a corkage fee), while others only allow in-house catering. The catering policy for each venue is mentioned on its detail page."
      },
      {
        q: "Do venues allow alcohol at events?",
        a: "Alcohol policies vary by venue. Venues that permit alcohol indicate this on their listing page. Always confirm the alcohol policy directly with the venue before booking."
      },
    ]
  },
  {
    label: "Listing Your Business",
    icon: "🏢",
    faqs: [
      {
        q: "How do I list my venue or vendor business on VenueConnect?",
        a: "Click 'List Your Business' in the top navigation. Select whether you're listing a venue (banquet hall, hotel, farmhouse etc.) or a vendor (photographer, decorator, caterer etc.) and complete the simple multi-step form. Your listing will be reviewed and published within 24 hours."
      },
      {
        q: "Is listing on VenueConnect free?",
        a: "We offer a free basic listing for venues and vendors. Premium listings with featured placement, additional photos and priority search results are available with our paid plans. Contact us on WhatsApp for current pricing."
      },
      {
        q: "What information do I need to list my venue?",
        a: "You'll need: Business name, city, area/locality, full address, contact details (phone, WhatsApp, email), social media links (Instagram required), venue capacity, pricing details, description and photos of your venue."
      },
      {
        q: "How long does it take for my listing to be approved?",
        a: "Our team reviews new listings within 24 hours on business days. Once approved, your venue will appear in search results immediately."
      },
      {
        q: "Can I edit my listing after it's published?",
        a: "Yes. Log in to your Owner Dashboard and you can update your venue's photos, pricing, description, amenities and contact details at any time."
      },
    ]
  },
  {
    label: "Common Questions",
    icon: "❓",
    faqs: [
      {
        q: "Is VenueConnect only for Gujarat?",
        a: "Currently, VenueConnect focuses exclusively on Gujarat, making it the most detailed and complete venue discovery platform for the state. We cover 50+ cities and hundreds of localities across Gujarat."
      },
      {
        q: "How do I contact VenueConnect for support?",
        a: "You can reach us via WhatsApp at +91 9601015102 or through our Contact page. We typically respond within a few hours during business hours (9 AM – 7 PM, Monday to Saturday)."
      },
      {
        q: "Are the venue reviews on VenueConnect genuine?",
        a: "Yes, all reviews on VenueConnect are submitted by real users who have visited or used the venue. We verify and moderate reviews to ensure authenticity."
      },
      {
        q: "How do I report incorrect information about a venue?",
        a: "Use the 'Report Issue' option on the venue detail page, or contact us on WhatsApp with the venue name and the incorrect information. We'll update it within 24 hours."
      },
    ]
  },
];

const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${open ? 'border-primary/30 bg-primary/5' : 'border-border bg-white'}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold text-foreground leading-snug">{q}</span>
        {open
          ? <ChevronUp className="w-4 h-4 text-primary shrink-0" />
          : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
        }
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm text-slate-600 leading-7 border-t border-primary/10 pt-3">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQs = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    document.title = "FAQs – Venue Booking Questions Answered | VenueConnect Gujarat";
  }, []);

  const filtered = FAQ_CATEGORIES.map(cat => ({
    ...cat,
    faqs: cat.faqs.filter(f =>
      (!search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())) &&
      (activeCategory === "All" || cat.label === activeCategory)
    )
  })).filter(cat => cat.faqs.length > 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-primary/90 to-slate-900 py-20 text-center text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="relative z-10 container max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Help Centre</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-white/70 text-base mb-8 max-w-xl mx-auto">
            Everything you need to know about finding venues, booking events and listing your business on VenueConnect Gujarat
          </p>
          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-foreground bg-white border border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none shadow-lg"
            />
          </div>
        </div>
      </div>

      <main className="flex-grow py-14 bg-slate-50">
        <div className="container max-w-4xl mx-auto px-4">

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {["All", ...FAQ_CATEGORIES.map(c => c.label)].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${activeCategory === cat ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-border hover:border-primary/40'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Sections */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400 mb-3">No questions found for "{search}"</p>
              <button onClick={() => { setSearch(""); setActiveCategory("All"); }} className="text-sm text-primary font-medium hover:underline">Clear search</button>
            </div>
          ) : (
            <div className="space-y-10">
              {filtered.map(cat => (
                <motion.div
                  key={cat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-2xl">{cat.icon}</span>
                    <h2 className="font-display text-xl font-semibold text-foreground">{cat.label}</h2>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{cat.faqs.length} questions</span>
                  </div>
                  <div className="space-y-3">
                    {cat.faqs.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Still have questions CTA */}
          <div className="mt-16 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8 text-center">
            <h3 className="font-display text-2xl font-semibold text-foreground mb-2">Still have questions?</h3>
            <p className="text-slate-500 text-sm mb-6">Our team is available on WhatsApp to help you find the perfect venue or answer any questions about listing your business.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/919601015102"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors"
              >
                💬 Chat on WhatsApp
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white border border-border text-foreground font-semibold text-sm px-6 py-3 rounded-full hover:border-primary/40 transition-colors"
              >
                📧 Send a Message
              </Link>
            </div>
          </div>

          {/* Schema.org FAQ structured data */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": FAQ_CATEGORIES.flatMap(cat => cat.faqs.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.a
                }
              })))
            })
          }} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQs;
