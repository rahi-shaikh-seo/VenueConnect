import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";

export const blogPosts = [
  {
    id: "how-to-choose-wedding-venue-gujarat",
    title: "How to Choose the Perfect Wedding Venue in Gujarat: A Complete Guide",
    excerpt: "From banquet halls in Ahmedabad to farmhouses in Vadodara — everything you need to know before booking your dream wedding venue in Gujarat.",
    content: "",
    category: "Wedding Tips",
    date: "March 10, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
    tags: ["Wedding", "Venue", "Gujarat", "Tips"],
  },
  {
    id: "top-banquet-halls-ahmedabad-2026",
    title: "Top 10 Banquet Halls in Ahmedabad for 2026 Weddings",
    excerpt: "Looking for the best banquet halls in Ahmedabad? Here are the top 10 venues that offer great facilities, catering and affordable pricing.",
    content: "",
    category: "Top Lists",
    date: "March 8, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
    tags: ["Banquet Hall", "Ahmedabad", "Top 10"],
  },
  {
    id: "farmhouse-wedding-ideas-gujarat",
    title: "Farmhouse Wedding Ideas in Gujarat: 15 Stunning Themes",
    excerpt: "Farmhouse weddings are trending in Gujarat. Explore 15 beautiful outdoor theme ideas perfect for farmhouses in Vadodara, Surat and Ahmedabad.",
    content: "",
    category: "Inspiration",
    date: "March 6, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
    tags: ["Farmhouse", "Wedding Themes", "Gujarat"],
  },
  {
    id: "birthday-party-venues-rajkot",
    title: "Best Birthday Party Venues in Rajkot — All Budgets",
    excerpt: "Planning a birthday party in Rajkot? From budget-friendly halls to luxury venues on Kalawad Road and Mavdi — discover your perfect party spot.",
    content: "",
    category: "Birthday",
    date: "March 4, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
    tags: ["Birthday Party", "Rajkot", "Venues"],
  },
  {
    id: "corporate-event-venues-gujarat",
    title: "Corporate Event Venues in Gujarat: Hotels, Convention Centres & More",
    excerpt: "Hosting a corporate conference, seminar or team outing in Gujarat? Here are the best-rated corporate venues across Ahmedabad, Surat and Gandhinagar.",
    content: "",
    category: "Corporate",
    date: "March 2, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
    tags: ["Corporate Events", "Conference", "Gujarat"],
  },
  {
    id: "wedding-venue-booking-checklist",
    title: "Wedding Venue Booking Checklist: 20 Things to Ask Before You Sign",
    excerpt: "Never miss a detail. Use this expert checklist of 20 key questions to ask any wedding venue before making the booking in Gujarat.",
    content: "",
    category: "Wedding Tips",
    date: "February 28, 2026",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    tags: ["Checklist", "Wedding Planning", "Tips"],
  },
  {
    id: "garba-venues-navratri-gujarat",
    title: "Best Garba Venues for Navratri in Gujarat 2026",
    excerpt: "Navratri is just around the corner! Find spacious, well-decorated garba venues in Ahmedabad, Vadodara, Surat and Rajkot for a memorable celebration.",
    content: "",
    category: "Events",
    date: "February 25, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
    tags: ["Garba", "Navratri", "Events"],
  },
  {
    id: "outdoor-wedding-venues-surat",
    title: "Outdoor Wedding Venues in Surat: Gardens, Lawns & Riverfront",
    excerpt: "Surat has some of Gujarat's most beautiful outdoor wedding spaces. Discover the top garden venues, riverside lawns and open-air event spaces in the city.",
    content: "",
    category: "Inspiration",
    date: "February 22, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=80",
    tags: ["Outdoor Wedding", "Surat", "Garden Venues"],
  },
];

const CATEGORIES = ["All", "Wedding Tips", "Top Lists", "Inspiration", "Birthday", "Corporate", "Events"];

const categoryColors: Record<string, string> = {
  "Wedding Tips": "bg-rose-50 text-rose-600",
  "Top Lists": "bg-blue-50 text-blue-600",
  "Inspiration": "bg-purple-50 text-purple-600",
  "Birthday": "bg-yellow-50 text-yellow-700",
  "Corporate": "bg-slate-100 text-slate-700",
  "Events": "bg-green-50 text-green-700",
};

const Blog = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title="Wedding & Event Blog | VenueConnect Gujarat"
        description="Expert tips, venue guides, and event inspiration for weddings, birthdays, and corporate functions across Gujarat. Plan your perfect event with VenueConnect."
      />
      <Navbar />

      {/* Hero */}
      <div className="relative h-56 md:h-72 flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/90 to-slate-900">
        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=80"
          alt="Blog Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 text-center text-white px-4">
          <span className="text-xs font-semibold tracking-[3px] uppercase text-white/60 mb-3 block">Resources & Ideas</span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold mb-3">The VenueConnect Blog</h1>
          <p className="text-white/70 text-base max-w-xl mx-auto">Wedding tips, venue guides, event ideas and everything you need to plan your perfect celebration in Gujarat</p>
        </div>
      </div>

      <main className="flex-grow py-14 bg-slate-50">
        <div className="container max-w-6xl mx-auto px-4">

          {/* Featured Post */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Link to={`/blog/${blogPosts[0].id}`} className="group block">
              <div className="grid md:grid-cols-2 gap-0 bg-white rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-64 md:h-auto overflow-hidden">
                  <img
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">Featured</span>
                  </div>
                </div>
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full w-fit mb-4 ${categoryColors[blogPosts[0].category] || 'bg-slate-100 text-slate-600'}`}>
                    {blogPosts[0].category}
                  </span>
                  <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors leading-snug">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed">{blogPosts[0].excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-6">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{blogPosts[0].date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{blogPosts[0].readTime}</span>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                    Read Article <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(1).map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/blog/${post.id}`} className="group block bg-white rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${categoryColors[post.category] || 'bg-white text-slate-600'}`}>
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 text-xs mb-4 leading-relaxed line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {post.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="inline-flex items-center gap-0.5 text-[10px] bg-primary/5 text-primary px-2 py-0.5 rounded-full">
                          <Tag className="w-2.5 h-2.5" />{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* SEO content block */}
          <div className="mt-16 bg-white rounded-2xl border border-border p-8 md:p-10">
            <h2 className="font-display text-2xl font-semibold mb-4 text-foreground">About VenueConnect Blog</h2>
            <p className="text-slate-500 text-sm leading-7 mb-4">
              The VenueConnect Blog is Gujarat's go-to resource for wedding planning, event venue tips and celebration ideas. We help couples, families and event planners across Ahmedabad, Surat, Rajkot, Vadodara and Gandhinagar find the best venues and plan unforgettable events.
            </p>
            <p className="text-slate-500 text-sm leading-7">
              From detailed guides on choosing the right banquet hall, to inspiration for outdoor farmhouse weddings — our blog covers everything you need to make your special occasion perfect. Browse our articles, save your favourites and start planning today.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
