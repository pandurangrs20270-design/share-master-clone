import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is the duration of the stock market course?",
    answer: "Our courses range from 6-10 weeks depending on the batch you choose. Online Daily Batch and Offline Evening Batch are 6-8 weeks, while the Live Market Trading Batch is 8-10 weeks for comprehensive learning.",
  },
  {
    question: "Do I need any prior experience to join?",
    answer: "No prior experience is required! Our courses are designed for complete beginners. We start from the basics and gradually move to advanced concepts, ensuring everyone can learn at their own pace.",
  },
  {
    question: "What is the difference between online and offline batches?",
    answer: "Online batches offer live video classes from anywhere, ideal for students and remote learners. Offline batches provide classroom experience with direct trainer interaction, perfect for those who prefer in-person learning.",
  },
  {
    question: "Will I get a certificate after completing the course?",
    answer: "Yes! Upon successful completion of the course, you will receive a recognized certification from ShareMaster that can enhance your professional profile and trading career.",
  },
  {
    question: "Is there any support after the course completion?",
    answer: "Absolutely! We provide lifetime backoffice support to all our students. You can reach out to us anytime for doubts, trading guidance, or mentorship even after completing the course.",
  },
  {
    question: "What are the fees and payment options?",
    answer: "Our fees range from ₹10,000 to ₹25,000 depending on the course type. We offer flexible payment options including EMI, UPI, bank transfer, and cash payments. Contact us for more details.",
  },
  {
    question: "Can I repeat the batch if I miss classes?",
    answer: "Yes! We offer unlimited repeat batch facility. If you miss any classes or want to revise concepts, you can join the next batch at no extra cost.",
  },
  {
    question: "Do you help with Demat account opening?",
    answer: "Yes, we provide complete assistance with Demat and trading account opening. We guide you through the process and help you choose the best broker as per your trading needs.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
            FAQ
          </span>
          <h2 className="section-heading mb-4">
            Frequently Asked Questions
          </h2>
          <p className="section-subheading">
            Get answers to common questions about our courses and training programs
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-xl border border-border/50 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="text-primary flex-shrink-0" size={20} />
                  <span className="font-semibold text-foreground">{faq.question}</span>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="text-muted-foreground" size={20} />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="px-5 pb-5 text-muted-foreground leading-relaxed pl-12">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
