import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Calendar,
  Eye,
  ArrowLeft,
  BookOpen,
  Search,
  Radio,
  TrendingUp,
  ArrowRight,
  Clock,
} from "lucide-react";
import { usePublishedBlogs } from "@/hooks/useBlogs";
import type { Blog } from "@/hooks/useBlogs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

// Placeholder live news items
const LIVE_NEWS = [
  { id: "1", title: "Nifty 50 up 0.5% in morning trade", time: "Live", tag: "Markets" },
  { id: "2", title: "Sensex gains 200 points; banking stocks lead", time: "2m ago", tag: "Indices" },
  { id: "3", title: "RBI keeps repo rate unchanged at 6.5%", time: "15m ago", tag: "Policy" },
  { id: "4", title: "Gold prices hit fresh high; silver follows", time: "1h ago", tag: "Commodities" },
  { id: "5", title: "FIIs turn net buyers in Indian equities", time: "2h ago", tag: "FII" },
];

// Featured Blog Card - Large display
const FeaturedBlogCard = ({ blog }: { blog: Blog }) => {
  const getTextFromHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };
  const wordCount = getTextFromHtml(blog.content).split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <Link to={`/blog/${blog.slug}`}>
      <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 h-full">
        <div className="grid md:grid-cols-2 h-full">
          {blog.cover_image ? (
            <div className="relative h-64 md:h-full overflow-hidden">
              <img
                src={blog.cover_image}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent md:bg-gradient-to-t" />
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                <TrendingUp className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            </div>
          ) : (
            <div className="h-64 md:h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-primary/30" />
            </div>
          )}
          <CardContent className="p-6 md:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(blog.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {readingTime} min
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-3">
              {blog.title}
            </h2>
            {blog.excerpt && (
              <p className="text-muted-foreground line-clamp-3 mb-6">
                {blog.excerpt}
              </p>
            )}
            <div className="flex items-center text-primary font-semibold group-hover:gap-3 transition-all">
              Read Article
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
};

// Regular Blog Card
const BlogCard = ({ blog, index }: { blog: Blog; index: number }) => {
  const getTextFromHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };
  const wordCount = getTextFromHtml(blog.content).split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/blog/${blog.slug}`}>
        <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
          {blog.cover_image ? (
            <div className="relative h-48 overflow-hidden">
              <img
                src={blog.cover_image}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          ) : (
            <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-primary/30" />
            </div>
          )}
          <CardContent className="p-5">
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(blog.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {readingTime} min
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {blog.views}
              </span>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {blog.title}
            </h3>
            {blog.excerpt && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {blog.excerpt}
              </p>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

const BlogList = () => {
  const { data: blogs = [], isLoading } = usePublishedBlogs();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "popular">("newest");

  const filteredAndSortedBlogs = useMemo(() => {
    let result = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    result = [...result].sort((a, b) => {
      if (sortOrder === "popular") {
        return b.views - a.views;
      }
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
    return result;
  }, [blogs, searchQuery, sortOrder]);

  const featuredBlog = filteredAndSortedBlogs[0];
  const remainingBlogs = filteredAndSortedBlogs.slice(1);

  const popularBlogs = useMemo(
    () => [...blogs].sort((a, b) => b.views - a.views).slice(0, 5),
    [blogs]
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-8 pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </motion.div>

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Our <span className="text-gradient">Blog</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Insights, strategies, and market analysis from our trading experts.
            </p>
          </motion.div>

          {/* Live News Ticker */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-3">
              <Radio className="h-4 w-4 text-red-500 animate-pulse" />
              <h2 className="text-sm font-semibold text-foreground">Market Updates</h2>
            </div>
            <div className="bg-muted/50 rounded-xl border p-4 overflow-x-auto">
              <div className="flex gap-3 min-w-max">
                {LIVE_NEWS.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 py-2 px-4 rounded-lg bg-background border shadow-sm"
                  >
                    <span className={cn(
                      "text-xs font-semibold shrink-0",
                      item.time === "Live" ? "text-red-500" : "text-muted-foreground"
                    )}>
                      {item.time}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {item.title}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {item.tag}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-8 flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={sortOrder}
              onValueChange={(v) => setSortOrder(v as "newest" | "oldest" | "popular")}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="popular">Most popular</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Loading articles...
              </div>
            </div>
          ) : filteredAndSortedBlogs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <BookOpen className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-3">No Articles Found</h2>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? "Try a different search term."
                  : "Stay tuned for valuable insights and trading strategies."}
              </p>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear search
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main content area */}
              <div className="lg:col-span-2 space-y-8">
                {/* Featured Blog */}
                {featuredBlog && !searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <FeaturedBlogCard blog={featuredBlog} />
                  </motion.div>
                )}

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(searchQuery ? filteredAndSortedBlogs : remainingBlogs).map(
                    (blog, index) => (
                      <BlogCard key={blog.id} blog={blog} index={index} />
                    )
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Popular Blogs */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card>
                      <CardContent className="p-5">
                        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          Popular Articles
                        </h3>
                        <div className="space-y-4">
                          {popularBlogs.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              No articles yet.
                            </p>
                          ) : (
                            popularBlogs.map((blog, index) => (
                              <Link
                                key={blog.id}
                                to={`/blog/${blog.slug}`}
                                className="flex gap-3 group"
                              >
                                <span className="text-2xl font-bold text-muted-foreground/30 group-hover:text-primary/50 transition-colors">
                                  {String(index + 1).padStart(2, "0")}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                    {blog.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {blog.views.toLocaleString()} views
                                  </p>
                                </div>
                              </Link>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Newsletter CTA */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                      <CardContent className="p-5">
                        <h3 className="text-lg font-bold text-foreground mb-2">
                          📬 Stay Updated
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Get the latest trading insights delivered to your inbox.
                        </p>
                        <Link to="/#contact">
                          <Button className="w-full">Subscribe Now</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogList;
