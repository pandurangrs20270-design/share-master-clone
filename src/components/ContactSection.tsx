import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  MessageCircle,
  Clock,
  CheckCircle,
  Loader2
} from "lucide-react";
import { useCreateInquiry } from "@/hooks/useInquiries";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { usePublishedCourses } from "@/hooks/useCourses";
import { validateName, validateEmail, validatePhone, validateMessage } from "@/lib/validation";

const defaultFormState = {
  name: "",
  email: "",
  phone: "",
  course: "",
  message: "",
};

const ContactSection = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const courseFromUrl = searchParams.get("course");
  const courseIdFromUrl = searchParams.get("courseId");
  const { data: courses = [] } = usePublishedCourses();

  const [formData, setFormData] = useState(defaultFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const createInquiry = useCreateInquiry();
  const { toast } = useToast();

  const validateContactForm = (): boolean => {
    const nameErr = validateName(formData.name, "Full name");
    const emailErr = validateEmail(formData.email);
    const phoneErr = validatePhone(formData.phone);
    const messageErr = validateMessage(formData.message);
    const newErrors: Record<string, string> = {};
    if (nameErr) newErrors.name = nameErr;
    if (emailErr) newErrors.email = emailErr;
    if (phoneErr) newErrors.phone = phoneErr;
    if (messageErr) newErrors.message = messageErr;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    let err: string | null = null;
    if (name === "name") err = validateName(value, "Full name");
    else if (name === "email") err = validateEmail(value);
    else if (name === "phone") err = validatePhone(value);
    else if (name === "message") err = validateMessage(value);
    setErrors((prev) => {
      const next = { ...prev };
      if (err) next[name] = err;
      else delete next[name];
      return next;
    });
  };

  // Prefill form when user lands with ?course= & ?courseId= (Know More) or when logged-in user data is available
  useEffect(() => {
    const name = (user?.user_metadata?.full_name || user?.user_metadata?.name) as string | undefined;
    const email = user?.email ?? "";
    const phone = (user?.user_metadata?.phone as string | undefined) ?? "";
    const courseLabel = courseFromUrl ? decodeURIComponent(courseFromUrl) : "";
    const message = courseLabel
      ? `I want to join and learn more about this (${courseLabel}) in details. Thank you so much.`
      : "";
    const courseValue = courseIdFromUrl || "";

    setFormData((prev) => ({
      name: name || prev.name,
      email: email || prev.email,
      phone: phone || prev.phone,
      course: courseValue || prev.course,
      message: message || prev.message,
    }));
  }, [user, courseFromUrl, courseIdFromUrl, courses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, message: true });
    if (!validateContactForm()) return;

    try {
      await createInquiry.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        course: formData.course || undefined,
        message: formData.message || "No message provided",
      });
      
      setIsSubmitted(true);
      setErrors({});
      setTouched({});
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: "", email: "", phone: "", course: "", message: "" });
      }, 3000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit inquiry. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (touched[name] && errors[name]) {
      let err = "";
      if (name === "name") err = validateName(value, "Full name") || "";
      else if (name === "email") err = validateEmail(value) || "";
      else if (name === "phone") err = validatePhone(value) || "";
      else if (name === "message") err = validateMessage(value) || "";
      setErrors((prev) => (err ? { ...prev, [name]: err } : { ...prev, [name]: "" }));
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone Numbers",
      details: ["7517401717", "7373401717"],
      link: "tel:7517401717",
    },
    {
      icon: Mail,
      title: "Email Address",
      details: ["share.master.171@gmail.com"],
      link: "mailto:share.master.171@gmail.com",
    },
    {
      icon: MapPin,
      title: "Office Address",
      details: ["A-601, Nyati Empress,", "Near Giga Space, Viman Nagar, Pune"],
      link: "https://maps.google.com/?q=Nyati+Empress+Viman+Nagar+Pune",
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: ["Mon - Sat: 9:00 AM - 8:00 PM", "Sunday: Closed"],
    },
  ];

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            Contact Us
          </span>
          <h2 className="section-heading mb-4">
            Get In Touch With Us
          </h2>
          <p className="section-subheading">
            Have questions? We're here to help. Reach out to us for any queries about our courses.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card p-8 rounded-2xl shadow-lg border border-border/50"
          >
            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <MessageCircle className="text-primary" size={28} />
              Send Us a Message
            </h3>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <CheckCircle className="text-green-500 mb-4" size={64} />
                <h4 className="text-xl font-bold text-foreground mb-2">Thank You!</h4>
                <p className="text-muted-foreground">
                  We've received your message. Our team will contact you shortly.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      minLength={2}
                      maxLength={100}
                      className={`w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none ${errors.name ? "border-destructive" : "border-border"}`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none ${errors.phone ? "border-destructive" : "border-border"}`}
                      placeholder="10-digit mobile e.g. 9876543210"
                    />
                    {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none ${errors.email ? "border-destructive" : "border-border"}`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Select Course
                  </label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  >
                    <option value="">Choose a course...</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} {c.price && `(${c.price})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows={4}
                    maxLength={2000}
                    className={`w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none ${errors.message ? "border-destructive" : "border-border"}`}
                    placeholder="Tell us about your goals and any questions you have..."
                  />
                  {errors.message && <p className="text-destructive text-sm mt-1">{errors.message}</p>}
                  <p className="text-muted-foreground text-xs mt-1">{formData.message.length}/2000</p>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-hero flex items-center justify-center gap-2"
                  disabled={createInquiry.isPending}
                >
                  {createInquiry.isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Contact Info & Map */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Contact Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card p-5 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <info.icon className="text-primary" size={24} />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">{info.title}</h4>
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-sm text-muted-foreground">
                      {info.link && i === 0 ? (
                        <a 
                          href={info.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors"
                        >
                          {detail}
                        </a>
                      ) : (
                        detail
                      )}
                    </p>
                  ))}
                </motion.div>
              ))}
            </div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl overflow-hidden shadow-lg border border-border/50 h-[300px]"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.4969823990837!2d73.91451797591662!3d18.56053836837867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c147b8b3a3e7%3A0x6f7c12d87f4e8ab1!2sNyati%20Empress%2C%20Viman%20Nagar%2C%20Pune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1705909200000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="ShareMaster Office Location"
              />
            </motion.div>

            {/* WhatsApp CTA */}
            <motion.a
              href="https://wa.me/917517401717?text=Hi%2C%20I%27m%20interested%20in%20your%20stock%20market%20training%20course"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-green-500 text-white font-semibold text-lg hover:bg-green-600 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
