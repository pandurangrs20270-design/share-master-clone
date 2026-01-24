import { motion } from "framer-motion";
import { 
  BookOpen, 
  Users, 
  Clock, 
  Award, 
  HeadphonesIcon, 
  TrendingUp,
  Shield,
  Target,
  Repeat
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Comprehensive Curriculum",
    description: "Holistic approach covering fundamentals to advanced trading strategies",
  },
  {
    icon: TrendingUp,
    title: "Expert Trading Guidance",
    description: "Learn from certified professionals with real market experience",
  },
  {
    icon: Users,
    title: "Live Market Practice",
    description: "Regular live market sessions for hands-on trading experience",
  },
  {
    icon: Repeat,
    title: "Unlimited Repeat Batches",
    description: "Continuous mentorship and post-course support for life",
  },
  {
    icon: Award,
    title: "Recognized Certification",
    description: "Earn a certification to enhance your trading career",
  },
  {
    icon: Target,
    title: "100% Practical Training",
    description: "Skill-oriented courses with real-world applications",
  },
  {
    icon: Shield,
    title: "Demat Account Opening",
    description: "Free assistance with demat & trading account setup",
  },
  {
    icon: Clock,
    title: "Flexible Learning Options",
    description: "Choose from online or offline classes as per convenience",
  },
  {
    icon: HeadphonesIcon,
    title: "Lifetime Support",
    description: "24/7 backoffice support even after course completion",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            Why Choose Us
          </span>
          <h2 className="section-heading mb-4">
            What Makes Us Different
          </h2>
          <p className="section-subheading">
            We provide a unique learning experience that sets us apart from other trading academies
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="feature-card group cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  whileHover={{ rotate: 10 }}
                  className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:from-primary group-hover:to-accent transition-all duration-300"
                >
                  <feature.icon className="text-primary group-hover:text-white transition-colors duration-300" size={28} />
                </motion.div>
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-primary to-accent text-white"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10,000+", label: "Students Trained" },
              { value: "8+", label: "Years Experience" },
              { value: "95%", label: "Success Rate" },
              { value: "4.9/5", label: "Student Rating" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <p className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</p>
                <p className="text-white/80 text-sm md:text-base">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
