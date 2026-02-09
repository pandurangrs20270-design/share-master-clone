import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Eye, ArrowLeft, Clock, BookOpen, User } from "lucide-react";
import { useBlogBySlug, usePublishedBlogs } from "@/hooks/useBlogs";
import type { Blog } from "@/hooks/useBlogs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogReadingProgress from "@/components/blog/BlogReadingProgress";
import BlogTableOfContents from "@/components/blog/BlogTableOfContents";
import BlogSocialShare from "@/components/blog/BlogSocialShare";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const RecentBlogsSection = ({ currentBlogId }: { currentBlogId: string }) => {
  const { data: blogs = [] } = usePublishedBlogs();
  const recent = blogs.filter((b) => b.id !== currentBlogId).slice(0, 3);

  if (recent.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-16 pt-12 border-t border-border"
    >
      <h3 className="text-2xl font-bold text-foreground mb-6">
        Continue Reading
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {recent.map((blog: Blog, index) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <Link to={`/blog/${blog.slug}`}>
              <Card className="h-full overflow-hidden group hover:shadow-lg transition-all duration-300">
                {blog.cover_image ? (
                  <div className="h-36 overflow-hidden">
                    <img
                      src={blog.cover_image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-36 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-primary/30" />
                  </div>
                )}
                <CardContent className="p-4">
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(blog.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 mt-6 text-primary font-medium hover:gap-3 transition-all"
      >
        Explore all blogs →
      </Link>
    </motion.section>
  );
};

const BlogDetailSkeleton = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="pb-20">
      <Skeleton className="h-72 md:h-96 w-full" />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-4 w-32 mt-8 mb-4" />
          <Skeleton className="h-12 w-3/4 mb-6" />
          <div className="flex gap-4 mb-8">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

const BlogDetail = () => {
  const { slug } = useParams();
  const { data: blog, isLoading, error } = useBlogBySlug(slug || "");

  if (isLoading) {
    return <BlogDetailSkeleton />;
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <BookOpen className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Blog Post Not Found
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/blog" className="btn-hero px-8 py-3">
              View All Blogs
            </Link>
          </motion.div>
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

  const wordCount = getTextFromHtml(blog.content)
    .split(/\s+/)
    .filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-screen bg-background">
      <BlogReadingProgress />
      <Header />

      <main className="pb-20">
        {/* Hero Cover Image */}
        {blog.cover_image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative h-72 md:h-[28rem] overflow-hidden"
          >
            <img
              src={blog.cover_image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </motion.div>
        )}

        <div className="container mx-auto px-4">
          <div className="relative">
            {/* Main Content */}
            <div className="max-w-4xl mx-auto">
              {/* Breadcrumb */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={blog.cover_image ? "-mt-32 relative z-10 mb-6" : "pt-10 mb-6"}
              >
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
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
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight"
              >
                {blog.title}
              </motion.h1>

              {/* Meta Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6"
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
                  {blog.views.toLocaleString()} views
                </span>
              </motion.div>

              {/* Share & Divider */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="flex items-center justify-between pb-8 mb-8 border-b border-border"
              >
                <BlogSocialShare title={blog.title} url={currentUrl} />
              </motion.div>

              {/* Content Layout with TOC */}
              <div className="flex gap-8">
                {/* Article Content */}
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex-1 min-w-0"
                >
                  <div
                    className="prose prose-lg max-w-none
                      prose-headings:font-bold prose-headings:text-foreground prose-headings:scroll-mt-24
                      prose-h1:text-3xl prose-h1:mt-10 prose-h1:mb-4
                      prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3
                      prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-2
                      prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-4
                      prose-strong:text-foreground prose-strong:font-semibold
                      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                      prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:not-italic prose-blockquote:font-normal
                      prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                      prose-pre:bg-muted prose-pre:text-foreground prose-pre:rounded-xl prose-pre:p-4
                      prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                      prose-ul:my-4 prose-ol:my-4
                      prose-li:text-foreground/90 prose-li:my-1
                      prose-hr:border-border prose-hr:my-8"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                </motion.article>

                {/* Sticky TOC Sidebar - Desktop only */}
                <aside className="hidden xl:block w-64 shrink-0">
                  <BlogTableOfContents content={blog.content} />
                </aside>
              </div>

              {/* Floating Share - Mobile */}
              <div className="fixed bottom-6 right-6 xl:hidden z-40">
                <BlogSocialShare
                  title={blog.title}
                  url={currentUrl}
                  variant="vertical"
                />
              </div>

              {/* Recent Blogs */}
              <RecentBlogsSection currentBlogId={blog.id} />

              {/* CTA Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-16 pt-12 border-t border-border"
              >
                <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                  <div className="relative">
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                      Ready to Start Your Trading Journey?
                    </h3>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                      Join ShareMaster and learn proven strategies from expert traders.
                    </p>
                    <Link to="/#contact" className="btn-hero px-10 py-4">
                      Get Started Today
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetail;
