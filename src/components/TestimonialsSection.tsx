import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Software Engineer",
    content: "ShareMaster completely changed my perspective on trading. The practical approach helped me become a confident trader within months. Highly recommend to anyone serious about learning!",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Priya Patel",
    role: "Business Owner",
    content: "As a business owner, I was skeptical about trading courses. But ShareMaster's structured curriculum and expert guidance proved invaluable. Now trading is my second income source!",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Amit Kumar",
    role: "Bank Manager",
    content: "The live market sessions were game-changers for me. Learning to trade alongside experts gave me the confidence I needed. Best investment I made in my education!",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/52.jpg",
  },
  {
    id: 4,
    name: "Sneha Desai",
    role: "Homemaker",
    content: "I joined ShareMaster to achieve financial independence. The flexible online classes fit perfectly with my schedule. Today, I proudly manage my family's investments!",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: 5,
    name: "Vikram Singh",
    role: "Retired Professional",
    content: "Post-retirement, I wanted to grow my savings. ShareMaster taught me safe trading strategies. Their lifetime support is truly exceptional!",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/67.jpg",
  },
  {
    id: 6,
    name: "Ananya Joshi",
    role: "College Student",
    content: "Started learning while still in college. The beginner-friendly approach helped me understand complex concepts easily. Now I trade part-time and earn while I learn!",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/28.jpg",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
    testimonials[(currentIndex + 2) % testimonials.length],
  ];

  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            Testimonials
          </span>
          <h2 className="section-heading mb-4">
            What Our Students Say
          </h2>
          <p className="section-subheading">
            Hear from our successful students who transformed their trading journey with us
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-card shadow-lg border flex items-center justify-center hover:bg-primary hover:text-white transition-colors hidden md:flex"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-card shadow-lg border flex items-center justify-center hover:bg-primary hover:text-white transition-colors hidden md:flex"
          >
            <ChevronRight size={24} />
          </button>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6 px-4">
            <AnimatePresence mode="wait">
              {visibleTestimonials.map((testimonial, index) => (
                <motion.div
                  key={`${testimonial.id}-${currentIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card p-6 rounded-2xl shadow-lg border border-border/50 relative"
                >
                  {/* Quote Icon */}
                  <Quote className="absolute top-4 right-4 text-primary/10" size={40} />

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="text-yellow-500 fill-yellow-500" size={18} />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary w-8"
                    : "bg-primary/30 hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex justify-center gap-4 mt-6 md:hidden">
          <button
            onClick={prevTestimonial}
            className="w-12 h-12 rounded-full bg-card shadow-lg border flex items-center justify-center"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextTestimonial}
            className="w-12 h-12 rounded-full bg-card shadow-lg border flex items-center justify-center"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
