import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Eye, ArrowLeft, BookOpen, Search, Radio } from "lucide-react";
import { usePublishedBlogs } from "@/hooks/useBlogs";
import type { Blog } from "@/hooks/useBlogs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Placeholder live news items (can be replaced with API later)
const LIVE_NEWS = [
  { id: "1", title: "Nifty 50 up 0.5% in morning trade", time: "Live", tag: "Markets" },
  { id: "2", title: "Sensex gains 200 points; banking stocks lead", time: "2m ago", tag: "Indices" },
  { id: "3", title: "RBI keeps repo rate unchanged at 6.5%", time: "15m ago", tag: "Policy" },
  { id: "4", title: "Gold prices hit fresh high; silver follows", time: "1h ago", tag: "Commodities" },
  { id: "5", title: "FIIs turn net buyers in Indian equities", time: "2h ago", tag: "FII" },
];

const BlogCard = ({ blog, index }: { blog: Blog; index: number }) => (
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
          <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-primary/50" />
          </div>
        )}
        <CardContent className="p-6">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(blog.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {blog.views} views
            </span>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {blog.title}
          </h3>
          {blog.excerpt && (
            <p className="text-muted-foreground line-clamp-3">{blog.excerpt}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  </motion.div>
);

const BlogList = () => {
  const { data: blogs = [], isLoading } = usePublishedBlogs();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const filteredAndSortedBlogs = useMemo(() => {
    let result = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    result = [...result].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
    return result;
  }, [blogs, searchQuery, sortOrder]);

  const recentBlogs = useMemo(
    () => [...blogs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5),
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
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
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
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              All <span className="text-gradient">Blogs</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Insights, strategies, and market analysis from our trading experts.
            </p>
          </motion.div>

          {/* Live News Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-4">
              <Radio className="h-5 w-5 text-red-500 animate-pulse" />
              <h2 className="text-lg font-semibold text-foreground">Live News</h2>
            </div>
            <div className="bg-muted/50 rounded-xl border p-4 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
                {LIVE_NEWS.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 py-2 px-3 rounded-lg bg-background border shadow-sm min-w-0"
                  >
                    <span className="text-xs font-medium text-red-600 shrink-0">
                      {item.time}
                    </span>
                    <span className="text-sm font-medium text-foreground truncate">
                      {item.title}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-8 flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search blogs by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as "newest" | "oldest")}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main blog grid */}
            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading blogs...</p>
                </div>
              ) : filteredAndSortedBlogs.length === 0 ? (
                <div className="text-center py-20">
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">No Blog Posts Found</h2>
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
                  {!searchQuery && (
                    <Link to="/">
                      <Button>Go Home</Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredAndSortedBlogs.map((blog, index) => (
                    <BlogCard key={blog.id} blog={blog} index={index} />
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar - Recent blogs */}
            <aside className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Recent Blogs
                </h3>
                <div className="space-y-4">
                  {recentBlogs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No posts yet.</p>
                  ) : (
                    recentBlogs.map((blog) => (
                      <Link
                        key={blog.id}
                        to={`/blog/${blog.slug}`}
                        className="block group"
                      >
                        <div className="flex gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                          {blog.cover_image ? (
                            <img
                              src={blog.cover_image}
                              alt=""
                              className="w-16 h-16 rounded object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded bg-muted shrink-0 flex items-center justify-center">
                              <BookOpen className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                              {blog.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {new Date(blog.created_at).toLocaleDateString("en-IN")}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </motion.div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogList;
