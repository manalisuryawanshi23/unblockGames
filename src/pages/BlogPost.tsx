import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, ArrowLeft, Share2, List, Tag } from "lucide-react";
import SEO from "@/components/SEO";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/blog/posts/${slug}`);
        if (!response.ok) throw new Error("Post not found");
        const data = await response.json();
        setPost(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
        <Link to="/blog" className="text-primary hover:underline">Return to Blog</Link>
      </div>
    );
  }

  const schemaJson = {
    "@context": "https://schema.org",
    "@type": post.schemaType || "BlogPosting",
    "headline": post.seoTitle || post.title,
    "description": post.seoDescription || post.excerpt || "",
    "image": post.coverImage ? [post.coverImage] : [],
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt,
    "author": {
      "@type": "Person",
      "name": post.authorName
    }
  };

  const faqSchema = post.faq && post.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faq.map((item: any) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  } : null;

  return (
    <main className="bg-background pt-24 pb-16 min-h-screen">
      <SEO 
        title={post.seoTitle || `${post.title} | Unblocked Games Zone`}
        description={post.seoDescription || post.excerpt}
        keywords={post.seoKeywords}
        image={post.ogImage || post.coverImage}
        type="article"
      />
      {/* Inject JSON-LD Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <article className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          {post.category && (
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-md mb-4 inline-block">
              {post.category.name}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6" style={{fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em'}}>
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-8">
            <span className="font-semibold">By {post.authorName}</span>
            <span>•</span>
            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            {post.readingTime && (
              <>
                <span>•</span>
                <span>{post.readingTime} read</span>
              </>
            )}
          </div>

          {post.coverImage && (
            <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-lg border border-border relative">
              <img 
                src={post.coverImage} 
                alt={post.coverImageAlt || post.title} 
                className="w-full h-full object-cover" 
                loading="eager"
                fetchPriority="high"
              />
            </div>
          )}
        </div>

        {/* 3-Column Layout */}
        <div className="lg:grid lg:grid-cols-[240px_1fr_280px] gap-12 relative max-w-7xl mx-auto items-start">
          
          {/* Left Sidebar */}
          <aside className="hidden lg:block sticky top-24 space-y-8">
            <Link to="/blog" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
            </Link>
            
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-bold mb-4 flex items-center">
                <Share2 className="h-4 w-4 mr-2 text-primary" /> Share Article
              </h3>
              <div className="flex gap-2">
                {/* Simplified share links */}
                <a href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${post.title}`} target="_blank" rel="noreferrer" className="p-2 bg-secondary rounded-full hover:bg-primary/20 text-primary transition-colors">Twitter</a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noreferrer" className="p-2 bg-secondary rounded-full hover:bg-primary/20 text-primary transition-colors">Facebook</a>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="min-w-0 pb-10">
            {/* AEO Executive Summary */}
            {post.excerpt && (
              <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl mb-10 shadow-sm">
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-primary mb-2 flex items-center">
                  Key Takeaways & Executive Summary
                </h3>
                <p className="text-foreground text-base leading-relaxed italic font-medium">
                  {post.excerpt}
                </p>
              </div>
            )}

            {/* FAQ Section */}
            {post.faq && post.faq.length > 0 && (
              <div className="mb-10 bg-card border border-border p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
                <Accordion type="single" collapsible className="w-full">
                  {post.faq.map((item: any, idx: number) => (
                    <AccordionItem key={idx} value={`item-${idx}`} className="border-b-0 border-border last:border-0">
                      <AccordionTrigger className="text-left font-bold hover:text-primary">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            {/* Rich Content Body */}
            <div 
              className="blog-prose ql-editor"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Right Sidebar */}
          <aside className="hidden lg:block sticky top-24 space-y-8">
            {post.tags && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-sm font-bold mb-4 flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-primary" /> Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.split(',').map((tag: string, i: number) => (
                    <span key={i} className="text-xs bg-secondary px-3 py-1.5 rounded-full text-muted-foreground">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <h3 className="text-lg font-bold mb-2">Play Premium Games</h3>
              <p className="text-sm text-muted-foreground mb-4">Discover the best unblocked games to play right now.</p>
              <Link to="/trending" className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold w-full hover:bg-primary/90 transition-colors">
                Play Now
              </Link>
            </div>
          </aside>

        </div>
      </article>
    </main>
  );
}
