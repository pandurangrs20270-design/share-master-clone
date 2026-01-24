import { motion } from "framer-motion";
import { Clock, Users, BookOpen, Star, ArrowRight, CheckCircle } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Online Share Market Training",
    subtitle: "Daily Batch",
    mode: "Online (Live Classes)",
    bestFor: "Students, Beginners, Remote Learners",
    description: "Learn the share market from the comfort of your home with our structured daily online classes.",
    duration: "6-8 Weeks",
    price: "₹10,000",
    originalPrice: "₹15,000",
    students: "5000+",
    rating: 4.9,
    features: [
      "Daily live online sessions",
      "Recorded class access",
      "Beginner-friendly teaching",
      "Doubt-clearing support",
    ],
    topics: [
      "Basics of Stock Market (NSE, BSE)",
      "Technical Analysis Fundamentals",
      "Chart Reading & Indicators",
      "Intraday & Swing Trading",
      "Risk & Money Management",
    ],
    popular: false,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "Offline Evening Batch",
    subtitle: "Working Professionals",
    mode: "Offline (Classroom Training)",
    bestFor: "Working Professionals & Office-Goers",
    description: "Designed specially for working professionals. Learn trading after office hours with classroom-based learning.",
    duration: "6-8 Weeks",
    price: "₹15,000",
    originalPrice: "₹20,000",
    students: "3000+",
    rating: 4.8,
    features: [
      "Evening batch timings",
      "Classroom learning environment",
      "Personal guidance from trainers",
      "Ideal for job holders",
    ],
    topics: [
      "Stock Market Basics to Advanced",
      "Technical Analysis & Indicators",
      "Trading Strategies for Part-Time",
      "Risk Management & Psychology",
      "Live Examples & Case Studies",
    ],
    popular: true,
    color: "from-primary to-accent",
  },
  {
    id: 3,
    title: "Live Market Trading Batch",
    subtitle: "Institute's Best Program",
    mode: "Offline + Live Market Trading",
    bestFor: "Serious Traders & Career-Focused Learners",
    description: "Our most premium batch where students trade live with us during market hours. Real-time learning!",
    duration: "8-10 Weeks",
    price: "₹25,000",
    originalPrice: "₹35,000",
    students: "2000+",
    rating: 5.0,
    features: [
      "Trade live during market hours",
      "Sit with trainers & trade together",
      "Real-time decision making",
      "Institute's most recommended batch",
    ],
    topics: [
      "Live Market Analysis (Real Trades)",
      "Advanced Technical & Price Action",
      "Options & Futures Trading",
      "Professional Trading Strategies",
      "Capital & Risk Management",
    ],
    popular: false,
    color: "from-orange-500 to-red-500",
  },
];

const CoursesSection = () => {
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
              {course.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Header Gradient */}
              <div className={`h-2 bg-gradient-to-r ${course.color}`} />

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
                    <span className="font-semibold">Best For:</span> {course.bestFor}
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
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                {/* Key Features */}
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

                {/* Topics */}
                <div className="mb-6">
                  <p className="text-sm font-semibold mb-2">What You'll Learn:</p>
                  <ul className="space-y-1">
                    {course.topics.slice(0, 3).map((topic, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen size={14} className="text-accent flex-shrink-0" />
                        {topic}
                      </li>
                    ))}
                    <li className="text-sm text-primary font-medium">+ more...</li>
                  </ul>
                </div>

                {/* Pricing */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl font-bold text-foreground">{course.price}</span>
                  <span className="text-lg text-muted-foreground line-through">{course.originalPrice}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                    SAVE {Math.round((1 - parseInt(course.price.replace(/[^\d]/g, '')) / parseInt(course.originalPrice.replace(/[^\d]/g, ''))) * 100)}%
                  </span>
                </div>

                {/* CTA Button */}
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${course.color} transition-all duration-300 hover:shadow-lg`}
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
