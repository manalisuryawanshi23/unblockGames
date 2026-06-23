import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { getCategories, getCategoryIcon, type Category } from "@/data/games";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then(cats => {
      setCategories(cats.filter(c => c.total_games > 0));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-black text-foreground mb-8">All Game Categories</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map(cat => (
          <Link
            key={cat.id}
            to={`/category/${cat.slug}`}
            className="group p-6 rounded-xl bg-card hover:bg-card-hover border border-border/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-4xl mb-3">{getCategoryIcon(cat.slug)}</div>
            <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{cat.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{cat.total_games.toLocaleString()} games</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
