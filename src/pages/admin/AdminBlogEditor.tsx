import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SEOLiveAnalyzer } from "@/components/admin/SEOLiveAnalyzer";

export default function AdminBlogEditor() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!slug);
  const [postId, setPostId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    coverImage: "",
    isPublished: false,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    canonicalUrl: "",
    tags: "",
    indexing: "index",
    schemaType: "BlogPosting",
    faq: [] as { question: string; answer: string }[]
  });

  useEffect(() => {
    if (slug) {
      const fetchPost = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/blog/posts/${slug}`);
          if (!res.ok) throw new Error("Post not found");
          const data = await res.json();
          setPostId(data.id);
          setFormData({
            title: data.title,
            slug: data.slug,
            content: data.content,
            excerpt: data.excerpt || "",
            coverImage: data.coverImage || "",
            isPublished: data.isPublished,
            seoTitle: data.seoTitle || "",
            seoDescription: data.seoDescription || "",
            seoKeywords: data.seoKeywords || "",
            canonicalUrl: data.canonicalUrl || "",
            tags: data.tags || "",
            indexing: data.indexing || "index",
            schemaType: data.schemaType || "BlogPosting",
            faq: data.faq || []
          });
        } catch (err) {
          console.error(err);
          alert("Failed to load post");
          navigate("/admin/blog");
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [slug, navigate]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setFormData(prev => ({ ...prev, title, slug }));
  };

  const handleSubmit = async (isPublished: boolean) => {
    setSaving(true);
    try {
      const payload = { ...formData, isPublished };
      const url = postId ? `http://localhost:5000/api/blog/posts/${postId}` : "http://localhost:5000/api/blog/posts";
      const method = postId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Failed to save post");
      alert(postId ? "Post updated successfully!" : "Post saved successfully!");
      navigate("/admin/blog");
    } catch (err) {
      console.error(err);
      alert("Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading editor...</div>;
  }

  return (
    <div className="bg-background min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{postId ? "Edit Post" : "New Blog Post"}</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => handleSubmit(false)} disabled={saving}>Save Draft</Button>
            <Button onClick={() => handleSubmit(true)} disabled={saving}>Publish Post</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-2">
              <Label>Post Title</Label>
              <Input 
                value={formData.title} 
                onChange={handleTitleChange} 
                className="text-2xl font-bold h-auto py-3" 
                placeholder="Enter post title..." 
              />
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={(content) => setFormData(p => ({ ...p, content }))}
                className="min-h-[500px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label>AEO Executive Summary (Takeaways)</Label>
              <Textarea 
                value={formData.excerpt}
                onChange={(e) => setFormData(p => ({ ...p, excerpt: e.target.value }))}
                placeholder="Write a concise summary optimized for AI answer engines..."
                className="h-24"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <SEOLiveAnalyzer data={formData} />
            </div>

            <Accordion type="multiple" defaultValue={["seo", "media"]} className="space-y-4">
              <AccordionItem value="media" className="bg-card border border-border rounded-xl px-4">
                <AccordionTrigger className="font-bold">Cover Media</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-0 pb-4">
                  <div className="space-y-2">
                    <Label>Cover Image</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={formData.coverImage} 
                        onChange={(e) => setFormData(p => ({ ...p, coverImage: e.target.value }))} 
                        placeholder="https://... or upload an image" 
                        className="flex-1"
                      />
                      <Label 
                        htmlFor="image-upload" 
                        className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md flex items-center justify-center font-medium transition-colors text-sm"
                      >
                        Upload Image
                        <input 
                          id="image-upload" 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={async (e) => {
                            if (!e.target.files || !e.target.files[0]) return;
                            const file = e.target.files[0];
                            const uploadData = new FormData();
                            uploadData.append("image", file);
                            
                            try {
                              const res = await fetch("http://localhost:5000/api/upload/image", {
                                method: "POST",
                                headers: {
                                  "Authorization": `Bearer ${localStorage.getItem('admin_token')}`
                                },
                                body: uploadData
                              });
                              if (!res.ok) throw new Error("Upload failed");
                              const data = await res.json();
                              setFormData(p => ({ ...p, coverImage: data.url }));
                            } catch (err) {
                              console.error(err);
                              alert("Failed to upload image");
                            }
                          }}
                        />
                      </Label>
                    </div>
                  </div>
                  {formData.coverImage && (
                    <img src={formData.coverImage} alt="Cover Preview" className="w-full aspect-video object-cover rounded-lg" />
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="seo" className="bg-card border border-border rounded-xl px-4">
                <AccordionTrigger className="font-bold">Advanced SEO</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-0 pb-4">
                  <div className="space-y-2">
                    <Label>URL Slug</Label>
                    <Input 
                      value={formData.slug} 
                      onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value }))} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SEO Title</Label>
                    <Input 
                      value={formData.seoTitle} 
                      onChange={(e) => setFormData(p => ({ ...p, seoTitle: e.target.value }))} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Meta Description</Label>
                    <Textarea 
                      value={formData.seoDescription} 
                      onChange={(e) => setFormData(p => ({ ...p, seoDescription: e.target.value }))} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Target Keywords</Label>
                    <Input 
                      value={formData.seoKeywords} 
                      onChange={(e) => setFormData(p => ({ ...p, seoKeywords: e.target.value }))} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Schema Type</Label>
                    <Select value={formData.schemaType} onValueChange={(v) => setFormData(p => ({ ...p, schemaType: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BlogPosting">Blog Posting</SelectItem>
                        <SelectItem value="Article">Article</SelectItem>
                        <SelectItem value="FAQPage">FAQ Page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq" className="bg-card border border-border rounded-xl px-4">
                <AccordionTrigger className="font-bold">Rich Snippets (FAQ)</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-0 pb-4">
                  {formData.faq.map((item, index) => (
                    <div key={index} className="space-y-2 p-4 border border-border rounded-lg bg-secondary/10 relative">
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="sm" 
                        className="absolute top-2 right-2 h-6 px-2 text-[10px]"
                        onClick={() => {
                          const newFaq = [...formData.faq];
                          newFaq.splice(index, 1);
                          setFormData(p => ({ ...p, faq: newFaq }));
                        }}
                      >Remove</Button>
                      <div className="space-y-1 pt-4">
                        <Label>Question</Label>
                        <Input 
                          value={item.question} 
                          onChange={(e) => {
                            const newFaq = [...formData.faq];
                            newFaq[index].question = e.target.value;
                            setFormData(p => ({ ...p, faq: newFaq }));
                          }}
                          placeholder="e.g., What are unblocked games?"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Answer</Label>
                        <Textarea 
                          value={item.answer} 
                          onChange={(e) => {
                            const newFaq = [...formData.faq];
                            newFaq[index].answer = e.target.value;
                            setFormData(p => ({ ...p, faq: newFaq }));
                          }}
                          placeholder="Provide a concise answer..."
                          className="h-20"
                        />
                      </div>
                    </div>
                  ))}
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full mt-2 border-dashed border-2"
                    onClick={() => setFormData(p => ({ ...p, faq: [...p.faq, { question: "", answer: "" }] }))}
                  >
                    + Add FAQ Pair
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
