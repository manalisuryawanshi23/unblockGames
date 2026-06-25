import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Plus, Edit, Trash2, Star, Eye, MessageCircle, Link2, LogOut, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AdminBlogList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const navigate = useNavigate();

  // Decode email from token
  const token = localStorage.getItem("admin_token") || "";
  let adminEmail = "";
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    adminEmail = payload.email || "";
  } catch {}

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/blog/posts");
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/blog/posts/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("admin_token")}` }
      });
      if (!res.ok) throw new Error("Failed to delete");
      fetchPosts();
    } catch {
      alert("Failed to delete post.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) ||
      (post.slug || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" ||
      (statusFilter === "Published" && post.isPublished) ||
      (statusFilter === "Draft" && !post.isPublished);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-background min-h-screen">
      {/* Admin Header */}
      <div className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-foreground tracking-tight">Blog Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Manage your premium SEO blog content</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{adminEmail}</span>
          <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive transition-colors" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-6 py-6 max-w-7xl mx-auto">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9 bg-card border-border text-sm placeholder:text-muted-foreground h-9"
              placeholder="Search by title or content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-card border border-border text-sm text-foreground rounded-md px-3 pr-8 py-2 h-9 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option>All Status</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>

          <Link to="/admin/blog/new">
            <Button className="h-9 px-4 font-bold text-sm bg-yellow-400 hover:bg-yellow-500 text-black border-0 shadow-none rounded-md">
              <Plus className="w-4 h-4 mr-1.5" /> New Post
            </Button>
          </Link>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-16 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground text-sm">
              No blog posts found.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/40 border-b border-border text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-semibold w-[40%]">Post Details</th>
                  <th className="text-left px-4 py-3 font-semibold">Category</th>
                  <th className="text-left px-4 py-3 font-semibold">Stats</th>
                  <th className="text-left px-4 py-3 font-semibold">Status</th>
                  <th className="text-right px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post, i) => (
                  <tr
                    key={post.id}
                    className={`border-b border-border last:border-0 hover:bg-secondary/20 transition-colors`}
                  >
                    {/* Post Details */}
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <Star className={`w-4 h-4 mt-0.5 shrink-0 ${i % 3 === 0 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/40'}`} />
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate max-w-xs">{post.title}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Link2 className="w-3 h-3 text-muted-foreground shrink-0" />
                            <span className="text-[11px] text-muted-foreground truncate max-w-[200px]">/{post.slug}</span>
                            {post.publishedAt && (
                              <span className="text-[11px] text-muted-foreground ml-2">
                                {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4">
                      {post.category ? (
                        <span className="inline-block border border-border text-xs font-medium text-foreground px-3 py-1 rounded-full whitespace-nowrap">
                          {post.category.name}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">Uncategorized</span>
                      )}
                    </td>

                    {/* Stats */}
                    <td className="px-4 py-4 text-muted-foreground">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1 text-xs">
                          <Eye className="w-3 h-3" /> 0 views
                        </span>
                        <span className="flex items-center gap-1 text-xs">
                          <MessageCircle className="w-3 h-3" /> 0 comments
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      {post.isPublished ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded border border-green-500/40 text-green-400 bg-green-500/10">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded border border-orange-400/40 text-orange-400 bg-orange-500/10">
                          Draft
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/blog/edit/${post.slug}`}>
                          <button className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-4 text-right">
          {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""} found
        </p>
      </div>
    </div>
  );
}
