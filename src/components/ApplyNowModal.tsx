import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone, X } from "lucide-react";
import { validateName, validatePhone } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";

interface ApplyNowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApplyNowModal = ({ isOpen, onClose }: ApplyNowModalProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const { toast } = useToast();

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

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setPhone("");
      setCourse("");
      setErrors({});
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameErr = validateName(name, "Full name");
    const phoneErr = validatePhone(phone);
    if (nameErr || phoneErr) {
      setErrors({ name: nameErr || undefined, phone: phoneErr || undefined });
      return;
    }
    setErrors({});
    toast({ title: "Request received", description: "We'll call you shortly." });
    onClose();
  };

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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
              required
              minLength={2}
              maxLength={100}
              className={`w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${errors.name ? "border-destructive" : "border-border"}`}
              placeholder="Enter your name"
            />
            {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Phone Number *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: undefined })); }}
              required
              className={`w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${errors.phone ? "border-destructive" : "border-border"}`}
              placeholder="10-digit mobile e.g. 9876543210"
            />
            {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Select Course</label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
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
