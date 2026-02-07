import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const RefundPolicy = () => {
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

        <h1 className="text-4xl font-bold text-foreground mb-2">Refund Policy</h1>
        <p className="text-muted-foreground mb-10">Last updated: February 2026</p>

        <div className="prose prose-lg max-w-none text-foreground/90 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">1. Overview</h2>
            <p>
              ShareMaster, a product of Vodunaya Technologies, is committed to fair and transparent practices. This
              Refund Policy explains the conditions under which we may provide a refund for our stock market training
              courses and related services. Please read this policy before making any payment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">2. Eligibility for Refund</h2>
            <p className="mb-3">Refund requests may be considered in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Before course start:</strong> If you cancel your enrollment before the official start date of the batch/course, you may be eligible for a full or partial refund as per the schedule below.</li>
              <li><strong>Technical or service failure:</strong> If we are unable to deliver the course or a significant part of it due to our error (e.g., repeated technical issues, cancellation of the batch by us), we will offer a full refund or credit toward a future batch.</li>
              <li><strong>Duplicate payment:</strong> In case of accidental duplicate payment, we will refund the duplicate amount after verification.</li>
            </ul>
            <p className="mt-3">
              Refund eligibility and amount may vary by course and batch. Specific terms communicated at the time of
              enrollment (e.g., on the course page or via email) will apply.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">3. Refund Schedule (Course Fees)</h2>
            <p className="mb-3">Unless otherwise stated at enrollment:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>More than 7 days before course start:</strong> Full refund minus any non-refundable processing or administrative charges (if communicated at the time of payment).</li>
              <li><strong>Between 3 and 7 days before course start:</strong> Up to 50% refund, subject to our discretion and any administrative charges.</li>
              <li><strong>Less than 3 days before course start or after course has started:</strong> No refund, except in cases of our failure to deliver the service (see Section 2) or as required by law.</li>
            </ul>
            <p className="mt-3">
              Refunds are not provided for partial attendance, change of mind after accessing course content, or failure
              to attend due to personal reasons after the course has begun.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">4. How to Request a Refund</h2>
            <p>
              To request a refund, contact us with your enrollment details (name, email, course/batch name, and payment
              reference) at{" "}
              <a href="mailto:share.master.171@gmail.com" className="text-primary hover:underline">
                share.master.171@gmail.com
              </a>{" "}
              or call 7517401717 / 7373401717. We will respond within 5–7 business days and may ask for additional
              information to process your request. Approval and amount will be determined in accordance with this
              policy and any course-specific terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">5. Processing of Refunds</h2>
            <p>
              Approved refunds will be processed to the same payment method or bank account used for the original
              transaction, unless otherwise agreed. Processing may take 7–14 business days (or longer depending on your
              bank or payment provider). We are not responsible for delays caused by third-party payment processors or
              banks.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">6. Non-Refundable Items</h2>
            <p>
              The following are generally non-refundable: (a) any administrative or processing fees explicitly stated
              as non-refundable at the time of payment, (b) fees for services already fully rendered (e.g., completed
              one-time workshops where no refund was promised), and (c) fees for add-ons or materials already provided
              in physical or digital form and consumed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">7. Changes to This Policy</h2>
            <p>
              ShareMaster may update this Refund Policy from time to time. The “Last updated” date at the top reflects
              the latest version. For enrollments made after a policy update, the updated policy applies. For existing
              enrollments, the policy in effect at the time of enrollment may apply unless we notify you otherwise.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">8. Contact Us</h2>
            <p>
              For refund-related questions or disputes, contact ShareMaster at{" "}
              <a href="mailto:share.master.171@gmail.com" className="text-primary hover:underline">
                share.master.171@gmail.com
              </a>{" "}
              or call 7517401717 / 7373401717. You can also use our{" "}
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

export default RefundPolicy;
