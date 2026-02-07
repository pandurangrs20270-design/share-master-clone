import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Eye, ArrowLeft, Clock, BookOpen } from "lucide-react";
import { useBlogBySlug, usePublishedBlogs } from "@/hooks/useBlogs";
import type { Blog } from "@/hooks/useBlogs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const RecentBlogsSection = ({ currentBlogId }: { currentBlogId: string }) => {
  const { data: blogs = [] } = usePublishedBlogs();
  const recent = blogs.filter((b) => b.id !== currentBlogId).slice(0, 3);
  if (recent.length === 0) return null;
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="mt-12 pt-8 border-t border-border"
    >
      <h3 className="text-xl font-semibold text-foreground mb-4">Recent Blogs</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {recent.map((blog: Blog) => (
          <Link key={blog.id} to={`/blog/${blog.slug}`}>
            <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
              {blog.cover_image ? (
                <div className="h-32 overflow-hidden">
                  <img src={blog.cover_image} alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-32 bg-muted flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <CardContent className="p-3">
                <p className="font-medium text-sm line-clamp-2">{blog.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(blog.created_at).toLocaleDateString("en-IN")}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <Link to="/blog" className="inline-block mt-4 text-sm text-primary font-medium hover:underline">
        Explore more blogs →
      </Link>
    </motion.section>
  );
};

const BlogDetail = () => {
  const { slug } = useParams();
  const { data: blog, isLoading, error } = useBlogBySlug(slug || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Loading blog post...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Blog Post Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/blog" className="btn-hero px-6 py-3">
            View All Blogs
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate reading time from HTML content
  const getTextFromHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };
  
  const wordCount = getTextFromHtml(blog.content).split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-20">
        {/* Hero Section */}
        {blog.cover_image && (
          <div className="relative h-64 md:h-96 overflow-hidden">
            <img
              src={blog.cover_image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>
        )}

        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={blog.cover_image ? "-mt-20 relative z-10 mb-8" : "pt-8 mb-8"}
            >
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold text-foreground mb-6"
            >
              {blog.title}
            </motion.h1>

            {/* Meta */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8 pb-8 border-b border-border"
            >
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(blog.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {readingTime} min read
              </span>
              <span className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {blog.views} views
              </span>
            </motion.div>

            {/* Content - Renders HTML from rich text editor */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-a:text-primary prose-blockquote:border-primary prose-blockquote:text-muted-foreground"
            >
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </motion.article>

            {/* Recent Blogs */}
            <RecentBlogsSection currentBlogId={blog.id} />

            {/* Share / CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12 pt-8 border-t border-border"
            >
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Ready to Start Your Trading Journey?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Join ShareMaster and learn from the best trading experts.
                </p>
                <Link to="/#contact" className="btn-hero px-8 py-3">
                  Know More
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetail;
