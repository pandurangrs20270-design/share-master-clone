import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsAndConditions = () => {
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

        <h1 className="text-4xl font-bold text-foreground mb-2">Terms and Conditions</h1>
        <p className="text-muted-foreground mb-10">Last updated: February 2026</p>

        <div className="prose prose-lg max-w-none text-foreground/90 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the ShareMaster website and services (“Services”), you agree to be bound by these
              Terms and Conditions. ShareMaster is a product of Vodunaya Technologies. If you do not agree with any
              part of these terms, you must not use our website or enroll in our courses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">2. Description of Services</h2>
            <p>
              ShareMaster provides stock market and trading education, including but not limited to online and offline
              courses, live market sessions, technical analysis, and options trading training. Course content, schedule,
              and format may be updated from time to time. Access to certain content or features may require
              registration or payment as specified at the time of enrollment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">3. User Accounts and Conduct</h2>
            <p className="mb-3">When you create an account or use our Services, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and complete information and keep it updated.</li>
              <li>Maintain the confidentiality of your login credentials.</li>
              <li>Use the Services only for lawful purposes and in accordance with these terms.</li>
              <li>Not share course materials, recordings, or login details with third parties without our written consent.</li>
              <li>Not use the Services to distribute spam, malware, or any content that is harmful or infringes others’ rights.</li>
            </ul>
            <p className="mt-3">
              We reserve the right to suspend or terminate accounts that violate these terms or for any other reason we
              deem appropriate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">4. Fees, Payment, and Enrollment</h2>
            <p>
              Course fees and payment terms will be communicated at the time of enrollment or through our official
              channels. Payment may be required in full or in installments as per the chosen plan. By making a payment,
              you agree to our Refund Policy (available on this website). Failure to pay as agreed may result in
              suspension of access to course content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">5. Intellectual Property</h2>
            <p>
              All content on the ShareMaster website and within our courses—including text, graphics, videos, slides,
              and materials—is owned by ShareMaster / Vodunaya Technologies or our licensors. You may not copy,
              modify, distribute, or create derivative works without our prior written permission. Use of our content
              is limited to personal, non-commercial learning in connection with your enrollment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">6. Disclaimer</h2>
            <p>
              Our training is for educational purposes only. We do not provide investment advice, and no content on our
              platform should be construed as a recommendation to buy or sell any security. Trading in the stock market
              involves risk; past performance does not guarantee future results. You are solely responsible for your
              trading and investment decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, ShareMaster and Vodunaya Technologies shall not be liable for any
              indirect, incidental, special, or consequential damages arising from your use of the Services or any
              trading or investment decisions you make. Our total liability shall not exceed the amount you have paid
              to us in the twelve (12) months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">8. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party sites (e.g., Vodunaya Technologies at vodunaya.com). We are
              not responsible for the content or practices of those sites. Your use of third-party links is at your own
              risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">9. Modifications</h2>
            <p>
              We may modify these Terms and Conditions at any time. Updated terms will be posted on this page with a
              revised “Last updated” date. Your continued use of the Services after changes constitutes acceptance of
              the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">10. Governing Law and Contact</h2>
            <p>
              These terms shall be governed by the laws of India. For any questions regarding these Terms and
              Conditions, contact us at{" "}
              <a href="mailto:share.master.171@gmail.com" className="text-primary hover:underline">
                share.master.171@gmail.com
              </a>{" "}
              or call 7517401717 / 7373401717. ShareMaster is a product of{" "}
              <a href="https://vodunaya.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Vodunaya Technologies
              </a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
