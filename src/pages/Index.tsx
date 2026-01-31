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
  return (
    <div className="min-h-screen bg-background">
      <Header />
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
        <ContactSection />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
};

export default Index;
