import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Clock, ArrowLeft, Tag, ArrowRight } from "lucide-react";
import { blogPosts } from "./Blog";
import SEO from "@/components/SEO";

// Full article content keyed by ID
const articleContent: Record<string, string> = {
  "how-to-choose-wedding-venue-gujarat": `
Choosing a wedding venue is one of the most important decisions you'll make while planning your big day. In Gujarat — with its rich culture, diverse landscapes and incredible hospitality — the options are truly endless. Here's a complete guide to help you find the perfect venue.

## 1. Set Your Budget First

Before shortlisting any venue, decide on your total wedding budget. In Gujarat, venue costs typically make up 30–40% of the overall wedding budget. Whether you're looking for an affordable party plot or a luxury five-star hotel ballroom, knowing your number upfront saves time.

- **Budget (₹500–₹1,500/pax):** Party plots, community halls, local banquet halls
- **Mid-range (₹1,500–₹3,000/pax):** Good banquet halls, farmhouses, mid-range hotels
- **Luxury (₹3,000+/pax):** Five-star hotels, luxury resorts, heritage properties

## 2. Decide on Indoor vs Outdoor

Gujarat's climate plays a big role in this decision. Winter weddings (November–February) are ideal for outdoor venues — farmhouses, lawns and garden venues. Summer and monsoon weddings are best suited to air-conditioned indoor halls.

**Popular outdoor options in Gujarat:**
- Farmhouses in Ahmedabad's outskirts (Bopal, SG Highway, Nal Sarovar)
- Garden venues in Vadodara (Gotri, Alkapuri)
- Riverside lawns in Surat

## 3. Check Capacity Carefully

The most common mistake couples make is overestimating or underestimating headcount. Always add 10–15% to your estimated guest count to account for last-minute additions. A venue that's too small will feel cramped; too large will look empty.

## 4. Understand the Catering Policy

In Gujarat, many venues offer their own in-house catering. Some allow outside caterers with a corkage fee. Always clarify:
- Is alcohol permitted?
- Can you bring your own caterer?
- Does the venue offer both veg and non-veg options?

## 5. Visit in Person — Always

Photos can be deceptive. Always visit the shortlisted venue in person during daylight hours to check:
- Actual size and layout
- Parking space
- Restroom facilities
- Accessibility for elderly guests
- Nearest landmark and ease of reaching

## 6. Ask About Package Inclusions

Top venues in Gujarat typically include: basic décor, tables, chairs, lighting, power backup and parking. Make sure to ask what's included vs what's extra.

## 7. Book Early — Especially in Season

Wedding season in Gujarat (October to March) is extremely busy. The best venues get booked 6–12 months in advance. If you have a fixed date in mind, start visiting at least 8–10 months before.

## Final Checklist Before Booking

✓ Venue capacity matches your guest count  
✓ Budget is within range  
✓ Catering policy suits your needs  
✓ Date is available  
✓ Parking is adequate  
✓ Restrooms are clean and sufficient  
✓ Generator backup is available  
✓ Contract terms are clear  

Start your venue search today on VenueConnect — Gujarat's largest venue discovery platform.
  `,

  "top-banquet-halls-ahmedabad-2026": `
Ahmedabad is home to some of Gujarat's finest banquet halls — from elegant air-conditioned spaces on SG Highway to sprawling party plots in Bopal. Here are the top 10, based on facilities, catering quality and customer reviews.

## 1½ Key Things to Look for in a Banquet Hall

When choosing a banquet hall in Ahmedabad, the most important factors are:
- **AC quality** — essential for summer weddings
- **Parking** — Ahmedabad's traffic demands ample parking
- **In-house kitchen** — freshness matters
- **Decoration flexibility** — can you bring your own decorator?
- **Sound system** — is a DJ allowed?

## Popular Areas for Banquet Halls in Ahmedabad

**SG Highway / Prahlad Nagar:** Premium banquet venues with modern facilities and ample parking. Slightly higher priced but worth it for grand weddings.

**Bopal / Shilaj:** Growing residential area with newer halls offering competitive pricing and good accessibility.

**Maninagar / Naranpura:** Well-established localities with traditional banquet halls that have been trusted for decades.

**Gota / Chandkheda:** Budget-friendly halls ideal for intimate gatherings and small functions.

## Average Pricing (2026)

| Type | Veg Plate Price | Capacity |
|------|----------------|----------|
| Budget Hall | ₹600–₹900 | 100–300 |
| Mid-range Hall | ₹1,000–₹1,800 | 200–600 |
| Premium Hall | ₹2,000–₹3,500 | 300–1,000 |
| Luxury Venue | ₹3,500+ | 500–2,000 |

Browse and compare all banquet halls in Ahmedabad on VenueConnect with verified reviews and real pricing.
  `,
};

// Generate generic content for posts without full content
const getContent = (id: string, post: typeof blogPosts[0]) => {
  if (articleContent[id]) return articleContent[id];
  return `
# ${post.title}

${post.excerpt}

## Introduction

Planning events in Gujarat — whether weddings, birthdays, corporate functions or festivals — starts with finding the right venue. This guide covers everything you need to know about ${post.tags.join(", ")} in Gujarat.

## Key Considerations

When searching for ${post.category.toLowerCase()} venues in Gujarat, here are the most important factors:

**1. Location & Accessibility**  
Choose a venue that's convenient for the majority of your guests. Major areas like SG Highway (Ahmedabad), Adajan (Surat), Alkapuri (Vadodara) and Kalawad Road (Rajkot) are well-connected and popular.

**2. Capacity**  
Always confirm the venue's seating capacity matches your expected guest count, with a 10–15% buffer.

**3. Budget**  
Get a detailed quote including all hidden charges — décor, parking, extra hours, outside caterer fees etc.

**4. Facilities**  
Check for: AC, parking, generator backup, clean restrooms, sound system and catering options.

**5. Reputation**  
Read verified reviews and ask for references from the venue's past clients.

## Conclusion

Gujarat offers an incredible range of venues for every occasion and budget. Start your search on VenueConnect — compare venues, check availability and get quotes from verified owners across all major Gujarat cities.

*Use VenueConnect's free search to find verified venues near you — with real photos, pricing and reviews.*
  `;
};

// Very simple markdown-to-HTML renderer
const renderMarkdown = (text: string) => {
  return text
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-semibold text-foreground mt-8 mb-3">{line.slice(3)}</h2>;
      if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-display font-semibold text-foreground mt-6 mb-4">{line.slice(2)}</h1>;
      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-foreground mb-2">{line.slice(2, -2)}</p>;
      if (line.match(/^\| /)) return <p key={i} className="text-sm text-slate-600 font-mono mb-0.5">{line}</p>;
      if (line.startsWith('- ')) return <li key={i} className="text-slate-600 text-[15px] leading-7 ml-4 list-disc">{line.slice(2)}</li>;
      if (line.startsWith('✓')) return <p key={i} className="text-green-700 text-sm mb-1">{line}</p>;
      if (line.startsWith('*') && line.endsWith('*')) return <p key={i} className="text-slate-500 italic text-sm mb-4">{line.slice(1, -1)}</p>;
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-slate-600 text-[15px] leading-7 mb-4">{line}</p>;
    });
};

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const post = blogPosts.find(p => p.id === id);

  useEffect(() => {
    // Scroll handled by ScrollToTop component
  }, [id, post]);

  if (!post) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center text-slate-400">Post not found.</div>
      <Footer />
    </div>
  );

  const related = blogPosts.filter(p => p.id !== post.id && (p.category === post.category || p.tags.some(t => post.tags.includes(t)))).slice(0, 3);
  const content = getContent(post.id, post);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title={post.title}
        description={post.excerpt}
        ogType="article"
        ogImage={post.image}
      />
      <Navbar />

      <main className="flex-grow">
        {/* Hero Image */}
        <div className="relative h-64 md:h-96 overflow-hidden bg-slate-900">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-4xl mx-auto">
            <span className="text-xs font-bold bg-primary text-white px-3 py-1 rounded-full mb-3 inline-block">{post.category}</span>
            <h1 className="font-display text-2xl md:text-4xl font-semibold text-white leading-tight">{post.title}</h1>
            <div className="flex items-center gap-4 mt-3 text-white/70 text-sm">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{post.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.readTime}</span>
            </div>
          </div>
        </div>

        <div className="container max-w-4xl mx-auto px-4 py-10">
          {/* Back */}
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          <div className="grid md:grid-cols-[1fr_280px] gap-10">
            {/* Article content */}
            <article className="bg-white rounded-2xl border border-border p-6 md:p-10">
              {renderMarkdown(content)}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t">
                {post.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 text-xs bg-primary/5 text-primary px-3 py-1 rounded-full font-medium">
                    <Tag className="w-3 h-3" />{tag}
                  </span>
                ))}
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* CTA */}
              <div className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-2xl p-6">
                <h3 className="font-semibold text-lg mb-2">Find Venues Now</h3>
                <p className="text-white/80 text-sm mb-4">Browse 500+ verified venues across Gujarat with real pricing and photos.</p>
                <Link to="/venues" className="block text-center bg-white text-primary font-semibold text-sm py-2.5 rounded-lg hover:bg-white/90 transition-colors">
                  Search Venues →
                </Link>
              </div>

              {/* Related */}
              {related.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wider mb-4">Related Articles</h3>
                  <div className="space-y-3">
                    {related.map(r => (
                      <Link key={r.id} to={`/blog/${r.id}`} className="group flex gap-3 bg-white rounded-xl border border-border p-3 hover:border-primary/30 hover:shadow-sm transition-all">
                        <img src={r.image} alt={r.title} className="w-16 h-16 object-cover rounded-lg shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-foreground group-hover:text-primary leading-snug line-clamp-2">{r.title}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{r.date}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* More blog posts */}
              <Link to="/blog" className="flex items-center justify-center gap-2 text-sm text-primary font-semibold border border-primary/30 rounded-xl py-3 hover:bg-primary/5 transition-colors">
                All Articles <ArrowRight className="w-4 h-4" />
              </Link>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
