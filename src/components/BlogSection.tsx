import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Eye, ArrowRight, BookOpen } from "lucide-react";
import { usePublishedBlogs } from "@/hooks/useBlogs";
import { Card, CardContent } from "@/components/ui/card";

const BlogSection = () => {
  const { data: blogs = [], isLoading } = usePublishedBlogs();

  // Show only latest 3 blogs on homepage
  const latestBlogs = blogs.slice(0, 3);

  return (
    <section id="blog" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Latest Insights
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Our <span className="text-gradient">Blog</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay updated with the latest market trends, trading strategies, and
            educational content from our experts.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading blogs...</p>
          </div>
        ) : latestBlogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Blog posts coming soon! Stay tuned for valuable insights.
            </p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestBlogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
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
                            {new Date(blog.created_at).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
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
                          <p className="text-muted-foreground line-clamp-3">
                            {blog.excerpt}
                          </p>
                        )}
                        <div className="mt-4 flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                          Read More
                          <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            {blogs.length > 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="text-center mt-12"
              >
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-primary font-semibold text-lg hover:gap-3 transition-all"
                >
                  View All Articles
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
