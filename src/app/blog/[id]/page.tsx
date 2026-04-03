import Link from "next/link";
import { Calendar, Clock, ArrowLeft, Tag, ArrowRight } from "lucide-react";
import { blogPosts, articleContent } from "@/lib/blog-data";
import { Button } from "@/components/ui/button";

// Full article content logic
const getContent = (id: string, post: any) => {
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

// Very simple markdown-to-HTML renderer - now returns JSX arrays for server rendering
const renderMarkdown = (text: string) => {
  return text
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-semibold text-foreground mt-8 mb-3 font-display">{line.slice(3)}</h2>;
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

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <p className="text-slate-400">Post not found.</p>
          <Button asChild variant="outline">
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  const related = blogPosts.filter(p => p.id !== post.id && (p.category === post.category || p.tags.some(t => post.tags.includes(t)))).slice(0, 3);
  const content = getContent(post.id, post);

  return (
    <div className="min-h-screen bg-background font-sans">
      <main className="flex-grow">
        {/* Hero Image */}
        <div className="relative h-64 md:h-96 overflow-hidden bg-slate-900">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-4xl mx-auto">
            <span className="text-xs font-bold bg-primary text-white px-3 py-1 rounded-full mb-3 inline-block uppercase tracking-wider">{post.category}</span>
            <h1 className="font-display text-2xl md:text-4xl font-semibold text-white leading-tight">{post.title}</h1>
            <div className="flex items-center gap-4 mt-3 text-white/70 text-sm">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{post.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.readTime}</span>
            </div>
          </div>
        </div>

        <div className="container max-w-4xl mx-auto px-4 py-10">
          {/* Back */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          <div className="grid md:grid-cols-[1fr_280px] gap-10">
            {/* Article content */}
            <article className="bg-white rounded-2xl border border-border p-6 md:p-10 shadow-sm">
              {renderMarkdown(content)}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-100">
                {post.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 text-[11px] bg-primary/5 text-primary px-3 py-1 rounded-full font-medium uppercase tracking-tight">
                    <Tag className="w-3 h-3" />{tag}
                  </span>
                ))}
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* CTA */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xl">
                <h3 className="font-semibold text-lg mb-2 font-display">Find Venues Now</h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">Browse 500+ verified venues across Gujarat with real pricing and photos.</p>
                <Link href="/cities" className="block text-center bg-primary text-white font-bold text-sm py-3 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                  Search by City →
                </Link>
              </div>

              {/* Related */}
              {related.length > 0 && (
                <div>
                  <h3 className="font-bold text-xs text-slate-400 uppercase tracking-[2px] mb-4">Related Articles</h3>
                  <div className="space-y-3">
                    {related.map(r => (
                      <Link key={r.id} href={`/blog/${r.id}`} className="group flex gap-3 bg-white rounded-xl border border-border p-3 hover:border-primary/30 hover:shadow-md transition-all text-left">
                        <img src={r.image} alt={r.title} className="w-16 h-16 object-cover rounded-lg shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-foreground group-hover:text-primary leading-snug line-clamp-2 transition-colors">{r.title}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{r.date}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* More blog posts */}
              <Link href="/blog" className="flex items-center justify-center gap-2 text-sm text-primary font-bold border border-primary/20 rounded-xl py-3.5 hover:bg-primary/5 transition-all">
                All Articles <ArrowRight className="w-4 h-4" />
              </Link>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

// Optimization: Pre-render blog posts
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    id: post.id,
  }));
}
