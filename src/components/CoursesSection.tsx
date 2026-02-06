import { motion } from "framer-motion";
import { Clock, Users, BookOpen, Star, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { usePublishedCourses } from "@/hooks/useCourses";

const CoursesSection = () => {
  const { data: courses = [], isLoading } = usePublishedCourses();

  if (isLoading) {
    return (
      <section id="courses" className="py-20 gradient-bg">
        <div className="container mx-auto px-4 flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return null;
  }

  return (
    <section id="courses" className="py-20 gradient-bg">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            Our Courses
          </span>
          <h2 className="section-heading mb-4">
            Choose Your Trading Journey
          </h2>
          <p className="section-subheading">
            Comprehensive stock market courses designed for every skill level. 
            From beginners to advanced traders, we have the perfect program for you.
          </p>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative bg-card rounded-2xl overflow-hidden shadow-lg border border-border/50 group"
            >
              {/* Popular Badge */}
              {course.is_popular && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Header Gradient */}
              <div className={`h-2 bg-gradient-to-r ${course.color_gradient || 'from-blue-500 to-cyan-500'}`} />

              <div className="p-6">
                {/* Course Info */}
                <div className="mb-4">
                  <p className="text-sm text-primary font-medium mb-1">{course.subtitle}</p>
                  <h3 className="text-xl font-bold text-foreground mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">{course.description}</p>
                </div>

                {/* Mode & Best For */}
                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">
                    <span className="font-semibold">Mode:</span> {course.mode}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold">Best For:</span> {course.best_for}
                  </p>
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
                  <div className="flex items-center gap-1 text-sm">
                    <Clock size={16} className="text-primary" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Users size={16} className="text-primary" />
                    <span>{course.students_count}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                {/* Key Features */}
                {course.features && course.features.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-2">Key Features:</p>
                    <ul className="space-y-1">
                      {course.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle size={14} className="text-primary flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Topics */}
                {course.topics && course.topics.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm font-semibold mb-2">What You'll Learn:</p>
                    <ul className="space-y-1">
                      {course.topics.slice(0, 3).map((topic, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <BookOpen size={14} className="text-accent flex-shrink-0" />
                          {topic}
                        </li>
                      ))}
                      {course.topics.length > 3 && (
                        <li className="text-sm text-primary font-medium">+ more...</li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Pricing */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl font-bold text-foreground">{course.price}</span>
                  {course.original_price && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">{course.original_price}</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                        SAVE {Math.round((1 - parseInt(course.price.replace(/[^\d]/g, '')) / parseInt(course.original_price.replace(/[^\d]/g, ''))) * 100)}%
                      </span>
                    </>
                  )}
                </div>

                {/* CTA Button */}
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${course.color_gradient || 'from-blue-500 to-cyan-500'} transition-all duration-300 hover:shadow-lg`}
                >
                  Enroll Now
                  <ArrowRight size={18} />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
