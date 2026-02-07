import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-10">Last updated: February 2026</p>

        <div className="prose prose-lg max-w-none text-foreground/90 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">1. Introduction</h2>
            <p>
              ShareMaster (“we,” “our,” or “us”) is a stock market training institute operated as a product of
              Vodunaya Technologies. We are committed to protecting your privacy. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you use our website, enroll in our courses, or
              contact us for inquiries.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
            <p className="mb-3">We may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account information:</strong> Name, email address, and password when you sign up or log in.</li>
              <li><strong>Contact & inquiry data:</strong> Name, email, phone number, and message when you submit contact forms or “Get in Touch” requests.</li>
              <li><strong>Course-related information:</strong> Details you provide when expressing interest in or enrolling in our courses (e.g., batch preference, course type).</li>
              <li><strong>Usage data:</strong> How you use our website (e.g., pages visited, blog views) to improve our services.</li>
              <li><strong>Communications:</strong> Records of correspondence when you email us or contact us via the provided phone numbers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
            <p className="mb-3">We use the collected information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our stock market training courses and website.</li>
              <li>Respond to your inquiries and process your requests (e.g., contact form, course enrollment).</li>
              <li>Send you relevant updates about courses, batches, or events (with your consent where required).</li>
              <li>Authenticate your account and manage your access to our services.</li>
              <li>Analyze usage to enhance user experience and content (e.g., blog, courses).</li>
              <li>Comply with applicable laws and protect our rights and the safety of our users.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">4. Sharing of Information</h2>
            <p>
              We do not sell your personal information. We may share your data with service providers (e.g., hosting,
              email) who assist us in operating our website and services, under strict confidentiality. We may also
              disclose information if required by law or to protect our rights. ShareMaster and Vodunaya Technologies
              may share information within the same group for the purpose of delivering and improving the product.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against
              unauthorized access, alteration, disclosure, or destruction. Your account credentials are stored
              securely. Please keep your login details confidential.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">6. Your Rights</h2>
            <p>
              Depending on applicable law, you may have the right to access, correct, or delete your personal
              information, or to withdraw consent for certain processing. To exercise these rights or for any privacy-related
              queries, contact us at{" "}
              <a href="mailto:share.master.171@gmail.com" className="text-primary hover:underline">
                share.master.171@gmail.com
              </a>{" "}
              or call 7517401717 / 7373401717.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">7. Cookies and Tracking</h2>
            <p>
              Our website may use cookies and similar technologies to improve functionality, remember your preferences,
              and analyze usage. You can manage cookie settings through your browser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The “Last updated” date at the top will reflect
              changes. Continued use of our services after updates constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">9. Contact Us</h2>
            <p>
              For privacy-related questions or complaints, contact ShareMaster at{" "}
              <a href="mailto:share.master.171@gmail.com" className="text-primary hover:underline">
                share.master.171@gmail.com
              </a>
              , or visit our{" "}
              <Link to="/#contact" className="text-primary hover:underline">Contact</Link> section. ShareMaster is a
              product of Vodunaya Technologies.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
