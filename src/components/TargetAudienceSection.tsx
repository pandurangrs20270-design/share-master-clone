import { motion } from "framer-motion";
import { 
  Briefcase, 
  GraduationCap, 
  Building2, 
  Home, 
  Cog, 
  Calculator,
  Users,
  Clock
} from "lucide-react";

const audiences = [
  { icon: Briefcase, title: "Salaried Professionals", description: "Build passive income alongside your job" },
  { icon: Building2, title: "Businessmen", description: "Grow your wealth through smart investing" },
  { icon: GraduationCap, title: "Students", description: "Start early and build your financial future" },
  { icon: Home, title: "Housewives", description: "Achieve financial independence from home" },
  { icon: Cog, title: "Engineers", description: "Apply analytical skills to trading" },
  { icon: Calculator, title: "MBA Professionals", description: "Enhance financial management skills" },
  { icon: Users, title: "Chartered Accountants", description: "Expand expertise to market analysis" },
  { icon: Clock, title: "Retired Individuals", description: "Grow your savings with smart trades" },
];

const TargetAudienceSection = () => {
  return (
    <section className="py-20 gradient-bg">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            Who Can Join
          </span>
          <h2 className="section-heading mb-4">
            This Program is Designed For
          </h2>
          <p className="section-subheading">
            Our courses are suitable for everyone who wants to learn stock market trading
          </p>
        </motion.div>

        {/* Audience Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8, scale: 1.05 }}
              className="bg-card p-6 rounded-2xl text-center shadow-lg border border-border/50 cursor-pointer group"
            >
              <motion.div
                whileHover={{ rotate: 10 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:from-primary group-hover:to-accent transition-all duration-300"
              >
                <audience.icon className="text-primary group-hover:text-white transition-colors" size={32} />
              </motion.div>
              <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {audience.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {audience.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetAudienceSection;
