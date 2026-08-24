import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'

function TermsOfService() {
  const lastUpdated = 'August 20, 2026'

  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="bg-[#0a0f2c] py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <span className="text-amber-400">Terms of Service</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 mb-6">
            <FileText size={13} className="text-amber-400" />
            <span className="text-amber-300 text-xs font-medium tracking-wide">TERMS OF SERVICE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3">Terms of Service</h1>
          <p className="text-gray-400 text-sm">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-gray-700 text-sm leading-relaxed">

          <div>
            <p>
              These Terms of Service ("Terms") govern your access to and use of ultechlab.com and its
              related services, including UTL Market, U Tech Hub, and our web development, crypto
              information, and shopping assistance services (collectively, the "Platform"), operated by
              Ultimate Tech Lab ("UTL," "we," "us," or "our"). By creating an account or using the
              Platform, you agree to be bound by these Terms. If you do not agree, please do not use
              the Platform.
            </p>
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-3">1. Eligibility</h2>
            <p>
              You must be at least 18 years old, or the age of majority in your jurisdiction, to create
              an account or transact on the Platform. By using the Platform, you represent that the
              information you provide is accurate and that you meet this requirement.
            </p>
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-3">2. Our Services</h2>
            <p className="mb-3">The Platform provides:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Web development services,</strong> provided directly by UTL under separate arrangement following an initial consultation.</li>
              <li><strong>Shopping assistance,</strong> where UTL sources and facilitates delivery of products from third-party retailers on your behalf.</li>
              <li><strong>UTL Market,</strong> a marketplace where independent, verified vendors list and sell their own products. UTL acts as an intermediary platform for these listings — see Section 5 for details on our role.</li>
              <li><strong>U Tech Hub,</strong> a set of free productivity tools available to all visitors.</li>
              <li><strong>Crypto information and mentorship services,</strong> arranged and conducted directly between you and UTL outside the Platform's own payment infrastructure — see Section 8.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-3">3. Your Account</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and
              for all activity that occurs under your account. Notify us immediately if you suspect
              unauthorized use of your account. We reserve the right to suspend or terminate accounts
              that provide false information or violate these Terms.
            </p>
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-3">4. Dashboard Access</h2>
            <p>
              New accounts do not automatically receive access to the account dashboard. Dashboard
              access is unlocked once you place your first order on the Platform. This is a product
              design choice, not a restriction on your account rights under Section 9 of our Privacy
              Policy — you may still request access to, correction of, or deletion of your data at any
              time by contacting us directly, regardless of dashboard status.
            </p>
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-3">5. UTL Market — Marketplace Terms</h2>
            <p className="mb-3">
              UTL Market allows independent vendors ("Vendors") to list and sell products to buyers
              ("Buyers"). UTL is not the seller of Vendor products and is not a party to the contract
              of sale between a Buyer and a Vendor. UTL's role is limited to:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-3">
              <li>Reviewing and approving Vendor applications before they may list products;</li>
              <li>Providing the technology platform through which listings, orders, and communications occur; and</li>
              <li>Facilitating an AI-assisted and, where necessary, human-moderated communication channel between Buyers and Vendors.</li>
            </ul>
            <p>
              Vendors are solely responsible for the accuracy of their product listings, the quality,
              legality, and safety of their products, and fulfilling orders in accordance with the
              delivery and return policies they publish. UTL reserves the right to remove any listing,
              or suspend or revoke a Vendor's approved status, at its sole discretion, including where a
              Vendor is found to have violated Section 7 below.
            </p>
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-3">6. AI-Assisted Product Chat</h2>
            <p>
              Product questions on UTL Market are answered first by an AI assistant, grounded in the
              information provided by the Vendor for that product. While we take care to keep these
              answers accurate, the AI assistant may occasionally be incomplete or mistaken, and its
              responses do not constitute a binding representation by UTL or the Vendor. Where the AI
              assistant cannot answer a question, you may request to speak with the Vendor directly
              through the Platform's escalation feature.
            </p>
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-3">7. Prohibited Conduct</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Share or solicit personal contact information (phone numbers, email, social media handles) within the Platform's chat features, or otherwise attempt to move a transaction off-Platform to avoid its protections;</li>
              <li>List or attempt to sell prohibited, counterfeit, stolen, or illegal goods;</li>
              <li>Use the Platform to harass, defraud, or mislead another user;</li>
              <li>Attempt to interfere with, disrupt, or gain unauthorized access to the Platform or its systems;</li>
              <li>Use automated means to scrape or extract data from the Platform without our written consent.</li>
            </ul>
            <p className="mt-3">
              Violation of this section may result in message filtering, account warnings, suspension,
              or termination, at UTL's discretion.
            </p>
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-3">8. Crypto Information and Mentorship Services</h2>
            <p>
              Any cryptocurrency-related trading, buying, or selling facilitated through UTL is
              arranged and conducted directly between you and UTL via direct communication (e.g.
              WhatsApp), outside of the Platform's own payment processing infrastructure, and is not
              part of the UTL Market marketplace or subject to Section 5 above. Cryptocurrency trading
              carries significant financial risk, including the risk of total loss. Nothing on the
              Platform constitutes financial or investment advice, and UTL is not a licensed financial
              advisor or broker-dealer.
            </p>
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-3">9. Payments</h2>
            <p>
              Orders are currently confirmed and coordinated via WhatsApp following a request made on
              the Platform. As our payment infrastructure develops, some or all payments may be
              processed directly through the Platform via a licensed third-party payment processor,
              subject to that processor's own terms.
            </p>
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-3">10. Intellectual Property</h2>
            <p>
              The Platform, including its design, branding, logos, and original content, is owned by
              UTL and protected by applicable intellectual property laws. Vendors retain ownership of
              the content and images they upload for their own product listings, and grant UTL a
              license to display that content on the Platform for the purpose of operating UTL Market.
            </p>
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-3">11. Disclaimers and Limitation of Liability</h2>
            <p>
              The Platform is provided "as is" without warranties of any kind, express or implied. To
              the fullest extent permitted by law, UTL shall not be liable for any indirect,
              incidental, or consequential damages arising from your use of the Platform, disputes
              between Buyers and Vendors, or reliance on AI-assisted responses. UTL's total liability
              arising from your use of the Platform shall not exceed the amount you paid to UTL in the
              twelve (12) months preceding the claim.
            </p>
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-3">12. Termination</h2>
            <p>
              You may stop using the Platform and request deletion of your account at any time. We may
              suspend or terminate your access to the Platform, with or without notice, if we
              reasonably believe you have violated these Terms.
            </p>
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-3">13. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the Federal Republic of Nigeria. Any dispute
              arising from these Terms or your use of the Platform shall be subject to the exclusive
              jurisdiction of the courts of Nigeria.
            </p>
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-3">14. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. We will post the updated version on this
              page with a revised "Last updated" date. Continued use of the Platform after changes take
              effect constitutes acceptance of the revised Terms.
            </p>
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-3">15. Contact Us</h2>
            <p>
              For questions about these Terms, contact us at{' '}
              <a href="mailto:seunultimateconcepts@gmail.com" className="text-amber-600 font-semibold hover:underline">
                seunultimateconcepts@gmail.com
              </a>{' '}
              or via WhatsApp at{' '}
              <a href="https://wa.me/2348038786037" target="_blank" rel="noopener noreferrer" className="text-amber-600 font-semibold hover:underline">
                +234 803 878 6037
              </a>.
            </p>
          </div>

        </div>
      </section>

    </div>
  )
}

export default TermsOfService