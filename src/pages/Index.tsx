import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PartnersMarquee from "@/components/PartnersMarquee";
import AboutSection from "@/components/AboutSection";
import CoursesSection from "@/components/CoursesSection";
import FeaturesSection from "@/components/FeaturesSection";
import TargetAudienceSection from "@/components/TargetAudienceSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BlogSection from "@/components/BlogSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";

const Index = () => {
  const location = useLocation();
  const [contactFormResetKey, setContactFormResetKey] = useState(0);

  const handleGetInTouchClick = () => {
    setContactFormResetKey((k) => k + 1);
  };

  useEffect(() => {
    if (location.hash === "#contact" || location.hash === "contact") {
      const el = document.getElementById("contact");
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
      }
    }
  }, [location.pathname, location.hash, location.search]);

  return (
    <div className="min-h-screen bg-background">
      <Header onGetInTouchClick={handleGetInTouchClick} />
      <main>
        <HeroSection />
        <PartnersMarquee />
        <AboutSection />
        <CoursesSection />
        <FeaturesSection />
        <TargetAudienceSection />
        <TestimonialsSection />
        <BlogSection />
        <FAQSection />
        <ContactSection key={contactFormResetKey} />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
};

export default Index;
