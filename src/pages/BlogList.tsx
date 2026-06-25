import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import SEO from "@/components/SEO";

export default function BlogList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/blog/posts");
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        // Only show published posts publicly
        setPosts(data.filter((p: any) => p.isPublished));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <main className="bg-background pt-24 pb-16 min-h-screen">
      <SEO 
        title="Gaming Blog & News | Unblocked Games Zone" 
        description="Stay updated with the latest gaming news, tips, and unblocked games strategies." 
      />
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Gaming Blog & News</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the latest trends, strategies, and top picks for unblocked games you can play anywhere.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-border">
            <h2 className="text-2xl font-bold mb-2">No Articles Yet</h2>
            <p className="text-muted-foreground">Check back soon for awesome gaming content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-primary transition-colors flex flex-col h-full">
                <div className="aspect-[16/9] w-full bg-secondary overflow-hidden">
                  {post.coverImage ? (
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                      <span className="text-muted-foreground">No Image</span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  {post.category && (
                    <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2 block">
                      {post.category.name}
                    </span>
                  )}
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                    {post.excerpt || post.seoDescription}
                  </p>
                  <div className="text-xs text-muted-foreground flex justify-between items-center pt-4 border-t border-border/50">
                    <span>{post.authorName}</span>
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
