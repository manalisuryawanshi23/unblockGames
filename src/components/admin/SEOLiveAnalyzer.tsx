import { useState, useEffect, useMemo } from "react";
import { 
  CheckCircle2, AlertCircle, Sparkles, Laptop, Smartphone, Share2
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SEOAnalyzerProps {
  data: any;
}

export const SEOLiveAnalyzer = ({ data }: SEOAnalyzerProps) => {
  const [focusKeyword, setFocusKeyword] = useState("");
  const [googleView, setGoogleView] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    if (!focusKeyword && data.seoKeywords) {
      const firstKeyword = data.seoKeywords.split(",")[0]?.trim();
      if (firstKeyword) setFocusKeyword(firstKeyword);
    }
  }, [data.seoKeywords, focusKeyword]);

  const cleanContentText = useMemo(() => {
    return (data.content || "").replace(/<[^>]*>/g, " ");
  }, [data.content]);

  // 1. Core SEO Score Calculations
  const seoAnalysis = useMemo(() => {
    const keyword = focusKeyword.trim().toLowerCase();
    const wordCount = cleanContentText.split(/\s+/).filter(Boolean).length;
    
    let keywordCount = 0;
    if (keyword && cleanContentText) {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      keywordCount = (cleanContentText.match(regex) || []).length;
    }
    const keywordDensity = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;

    const checks = [
      {
        id: "title-length",
        label: "Title Length",
        score: (data.title || "").length >= 40 && (data.title || "").length <= 60 ? 10 : ((data.title || "").length > 0 ? 5 : 0),
        desc: "Ideal length is 40-60 characters.",
        detail: `${(data.title || "").length} chars`
      },
      {
        id: "meta-length",
        label: "Meta Description Length",
        score: (data.seoDescription || "").length >= 120 && (data.seoDescription || "").length <= 160 ? 10 : ((data.seoDescription || "").length > 0 ? 5 : 0),
        desc: "Ideal length is 120-160 characters.",
        detail: `${(data.seoDescription || "").length} chars`
      },
      {
        id: "keyword-in-title",
        label: "Keyword in SEO Title",
        score: keyword && ((data.seoTitle || data.title) || "").toLowerCase().includes(keyword) ? 15 : 0,
        desc: "Place the focus keyword inside the SEO Title tag.",
        detail: keyword ? ( ((data.seoTitle || data.title) || "").toLowerCase().includes(keyword) ? "Found" : "Missing" ) : "Define focus keyword"
      },
      {
        id: "word-count",
        label: "Content Word Count",
        score: wordCount >= 800 ? 15 : (wordCount >= 400 ? 8 : 0),
        desc: "Long-form content (800+ words) has higher organic search weight.",
        detail: `${wordCount} words`
      },
      {
        id: "keyword-density",
        label: "Keyword Density",
        score: keywordDensity >= 0.5 && keywordDensity <= 2.5 ? 10 : (keywordDensity > 0 ? 5 : 0),
        desc: "Target density: 0.5% - 2.5%.",
        detail: `${keywordDensity.toFixed(2)}%`
      }
    ];

    const maxScore = checks.reduce((acc, c) => acc + (c.id.startsWith("keyword-in-title") ? 15 : (c.id === "word-count" ? 15 : 10)), 0);
    const score = checks.reduce((acc, c) => acc + c.score, 0);
    const percentage = Math.round((score / maxScore) * 100) || 0;

    let rating = "Poor";
    let color = "bg-destructive text-destructive-foreground";
    if (percentage >= 80) {
      rating = "Excellent";
      color = "bg-green-500 text-white";
    } else if (percentage >= 50) {
      rating = "Needs Work";
      color = "bg-yellow-500 text-white";
    }

    return { checks, score, maxScore, percentage, rating, color };
  }, [focusKeyword, cleanContentText, data]);

  // 2. AI / AEO Analysis
  const aiAnalysis = useMemo(() => {
    const h2h3Tags = (data.content || "").match(/<h[23][^>]*>([^<]+)<\/h[23]>/g) || [];
    const questionHeadings = h2h3Tags.filter(h => h.includes("?") || h.toLowerCase().includes("how") || h.toLowerCase().includes("what"));

    const checks = [
      {
        id: "takeaways",
        label: "Executive Summary / Takeaways",
        score: data.excerpt && data.excerpt.trim().length >= 80 ? 15 : 0,
        desc: "A concise summary at the start matches AI answer engine targets.",
        detail: data.excerpt ? "Optimized" : "Missing"
      },
      {
        id: "question-headings",
        label: "Conversational Headings",
        score: questionHeadings.length >= 2 ? 15 : (questionHeadings.length > 0 ? 8 : 0),
        desc: "AI search targets direct query headings like 'What is...' or 'How to...'.",
        detail: `${questionHeadings.length} found`
      }
    ];

    const maxScore = checks.reduce((acc, c) => acc + 15, 0);
    const score = checks.reduce((acc, c) => acc + c.score, 0);
    const percentage = Math.round((score / maxScore) * 100) || 0;

    let rating = "Low Citation Rate";
    let color = "bg-destructive text-destructive-foreground";
    if (percentage >= 80) {
      rating = "High Citation Ready";
      color = "bg-green-500 text-white";
    }

    return { checks, score, maxScore, percentage, rating, color };
  }, [cleanContentText, data]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="focus-keyword" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Focus Keyword</Label>
        <Input 
          id="focus-keyword"
          placeholder="Enter target search keyword..."
          value={focusKeyword}
          onChange={(e) => setFocusKeyword(e.target.value)}
          className="h-9"
        />
      </div>

      <Tabs defaultValue="seo-score" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-9">
          <TabsTrigger value="seo-score" className="text-xs">SEO</TabsTrigger>
          <TabsTrigger value="ai-score" className="text-xs">AEO</TabsTrigger>
          <TabsTrigger value="previews" className="text-xs">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="seo-score" className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <h4 className="font-bold text-sm">Google SEO Grade</h4>
            </div>
            <div className="text-right">
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${seoAnalysis.color}`}>
                {seoAnalysis.rating}
              </span>
              <div className="text-2xl font-black mt-1">{seoAnalysis.percentage}%</div>
            </div>
          </div>
          <Progress value={seoAnalysis.percentage} className="h-1.5" />

          <div className="space-y-2">
            {seoAnalysis.checks.map(check => (
              <div key={check.id} className="p-3 bg-secondary/20 rounded-xl border border-border/40 text-xs flex gap-3 items-start">
                {check.score > 0 ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
                <div className="space-y-1 w-full">
                  <div className="flex justify-between font-bold">
                    <span>{check.label}</span>
                    <span className="text-[10px] opacity-60 font-mono">{check.detail}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{check.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-score" className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <h4 className="font-bold text-sm">AI Search Citation Grade</h4>
            </div>
            <div className="text-right">
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${aiAnalysis.color}`}>
                {aiAnalysis.rating}
              </span>
              <div className="text-2xl font-black mt-1">{aiAnalysis.percentage}%</div>
            </div>
          </div>
          <Progress value={aiAnalysis.percentage} className="h-1.5" />

          <div className="space-y-2">
            {aiAnalysis.checks.map(check => (
              <div key={check.id} className="p-3 bg-secondary/20 rounded-xl border border-border/40 text-xs flex gap-3 items-start">
                {check.score > 0 ? (
                  <Sparkles className="h-4 w-4 text-yellow-500 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
                <div className="space-y-1 w-full">
                  <div className="flex justify-between font-bold">
                    <span>{check.label}</span>
                    <span className="text-[10px] opacity-60 font-mono">{check.detail}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="previews" className="space-y-4 pt-4">
          <Tabs defaultValue="google" className="w-full">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-xs font-bold text-muted-foreground">Search Simulator</span>
              <TabsList className="h-7 p-0.5">
                <TabsTrigger value="google" className="text-[10px] h-6">Google</TabsTrigger>
                <TabsTrigger value="fb" className="text-[10px] h-6">Facebook</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="google" className="pt-3">
              <div className="p-4 bg-background border border-border rounded-lg text-left shadow-sm">
                <span className="text-[12px] text-muted-foreground block mb-0.5">https://unblockedgameszone.com &rsaquo; blog &rsaquo; {data.slug || "url"}</span>
                <a href="#" className="text-[#8ab4f8] hover:underline text-[20px] leading-tight block mb-1 font-medium">
                  {data.seoTitle || data.title || "Enter post title..."}
                </a>
                <p className="text-[14px] text-muted-foreground leading-relaxed font-light">
                  {data.seoDescription || "Please provide a meta description to see search snippet result simulation..."}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="fb" className="pt-3">
              <div className="bg-background border border-border rounded-lg overflow-hidden shadow-sm">
                <div className="aspect-[1.91/1] w-full bg-secondary relative">
                  {data.coverImage ? (
                    <img src={data.coverImage} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <Share2 className="h-10 w-10 opacity-30" />
                    </div>
                  )}
                </div>
                <div className="p-3 bg-secondary/50">
                  <span className="text-[10px] uppercase text-muted-foreground block mb-0.5 font-semibold">unblockedgameszone.com</span>
                  <h5 className="text-[14px] font-bold leading-tight line-clamp-1 mb-1">{data.title || "Enter title..."}</h5>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">{data.seoDescription || data.excerpt || "Enter description..."}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};
