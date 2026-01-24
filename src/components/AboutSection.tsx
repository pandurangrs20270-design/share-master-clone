import { motion } from "framer-motion";
import { CheckCircle, TrendingUp, Target, Lightbulb } from "lucide-react";
import trainerImg from "@/assets/trainer.jpg";

const AboutSection = () => {
  const highlights = [
    "8+ Years of Trading Experience",
    "10,000+ Students Successfully Trained",
    "100% Practical Training Approach",
    "Lifetime Mentorship Support",
    "Certified Trading Professional",
    "Regular Live Market Sessions",
  ];

  const features = [
    {
      icon: TrendingUp,
      title: "Expert Trading Skills",
      description: "Learn proven strategies for consistent profits",
    },
    {
      icon: Target,
      title: "Focused Approach",
      description: "Goal-oriented curriculum for quick results",
    },
    {
      icon: Lightbulb,
      title: "Practical Learning",
      description: "Real market experience with live trading",
    },
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10">
              <img
                src={trainerImg}
                alt="ShareMaster Trainer"
                className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl"
              />
              {/* Experience Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-8 -right-8 bg-primary text-primary-foreground p-6 rounded-2xl shadow-xl"
              >
                <p className="text-4xl font-bold">8+</p>
                <p className="text-sm opacity-90">Years of Excellence</p>
              </motion.div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute top-8 left-8 w-full h-full border-2 border-primary/20 rounded-2xl -z-10" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-4 -left-4 w-24 h-24 border-4 border-dashed border-primary/20 rounded-full"
            />
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4"
            >
              About ShareMaster
            </motion.span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Your Trusted Partner in{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Stock Market Education
              </span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              ShareMaster is Pune's leading stock market training institute, dedicated to transforming 
              beginners into confident traders. With our practical approach and expert guidance, 
              we've helped thousands achieve financial independence through smart investing.
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="text-primary flex-shrink-0" size={20} />
                  <span className="text-sm font-medium text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-4 rounded-xl bg-muted/50 text-center"
                >
                  <feature.icon className="mx-auto text-primary mb-2" size={28} />
                  <h4 className="font-semibold text-sm mb-1">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
