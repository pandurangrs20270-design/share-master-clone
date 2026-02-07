import { motion } from "framer-motion";
import { Phone } from "lucide-react";

const FloatingCTA = () => {
  return (
    <>
      {/* Mobile Fixed Get in Touch Button */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card border-t shadow-lg p-4"
      >
        <div className="flex gap-3">
          <a
            href="tel:7517401717"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-primary text-primary font-semibold"
          >
            <Phone size={20} />
            Call Now
          </a>
          <a
            href="#contact"
            className="flex-1 btn-hero py-3 text-center"
          >
            Get in Touch
          </a>
        </div>
      </motion.div>

      {/* Floating Call Button - Desktop */}
      <motion.a
        href="tel:7517401717"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-24 right-6 z-50 hidden lg:flex items-center gap-2 bg-green-500 text-white px-5 py-3 rounded-full shadow-lg hover:bg-green-600 transition-colors"
      >
        <Phone size={20} className="animate-pulse" />
        <span className="font-semibold">Call: 7517401717</span>
      </motion.a>
    </>
  );
};

export default FloatingCTA;
