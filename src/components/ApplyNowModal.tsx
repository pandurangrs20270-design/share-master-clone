import { useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, X } from "lucide-react";

interface ApplyNowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApplyNowModal = ({ isOpen, onClose }: ApplyNowModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-accent p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X size={18} />
          </button>
          <h3 className="text-2xl font-bold mb-2">Get Free Counseling</h3>
          <p className="text-white/80">Take the first step towards your trading journey!</p>
        </div>

        {/* Form */}
        <form className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Phone Number *</label>
            <input
              type="tel"
              required
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="+91 9876543210"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Select Course</label>
            <select className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
              <option value="">Choose a course...</option>
              <option value="online">Online Share Market Training</option>
              <option value="offline">Offline Evening Batch</option>
              <option value="live">Live Market Trading Batch</option>
            </select>
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-hero"
          >
            Request Callback
          </motion.button>
        </form>

        {/* Quick Contact */}
        <div className="px-6 pb-6">
          <p className="text-center text-muted-foreground text-sm mb-3">Or call us directly</p>
          <a
            href="tel:7517401717"
            className="flex items-center justify-center gap-2 py-3 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors"
          >
            <Phone size={18} />
            7517401717
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ApplyNowModal;
