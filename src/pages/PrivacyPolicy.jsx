import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'

function PrivacyPolicy() {
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
            <span className="text-amber-400">Privacy Policy</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 mb-6">
            <ShieldCheck size={13} className="text-amber-400" />
            <span className="text-amber-300 text-xs font-medium tracking-wide">PRIVACY POLICY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3">Privacy Policy</h1>
          <p className="text-gray-400 text-sm">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose-sections space-y-10 text-gray-700 text-sm leading-relaxed">

          <div>
            <p>
              Ultimate Tech Lab ("UTL," "we," "us," or "our") operates ultechlab.com and its related
              services, including U-Come, U Tech Hub, and our web development, crypto information,
              and shopping assistance services (collectively, the "Platform"). This Privacy Policy
              explains what personal data we collect, why we collect it, how we use it, and the rights
              you have over it, in accordance with the Nigeria Data Protection Act 2023 (NDPA) and
              applicable regulations of the Nigeria Data Protection Commission (NDPC).
            </p>
            <p className="mt-3">
              By creating an account or otherwise using the Platform, you acknowledge that you have
              read and understood this Privacy Policy.
            </p>
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-3">1. Information We Collect</h2>
            <p className="mb-3">We collect the following categories of information:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Account information:</strong> first name, last name, email address, phone number, and a securely hashed password.</li>
              <li><strong>Social sign-in information:</strong> if you sign up or log in with Google or Facebook, we receive your name, email address, and profile photo from that provider. We do not receive or store your Google/Facebook password.</li>
              <li><strong>Order and transaction information:</strong> details of products or services you order, including delivery information you provide, so vendors and our team can fulfill your order.</li>
              <li><strong>Product inquiry and chat data:</strong> questions you ask our AI shopping assistant, and any messages exchanged with a vendor through the Platform's escalation chat.</li>
              <li><strong>Seller/vendor information:</strong> if you apply to sell on U-Come, we collect your business name, product category, and business description in addition to your account information.</li>
              <li><strong>Technical information:</strong> IP address, browser type, device information, and basic usage data collected automatically when you use the Platform.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-3">2. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Create and manage your account, and verify your identity.</li>
              <li>Process and fulfill orders, and communicate with you about them.</li>
              <li>Connect buyers and vendors on U-Come, including through our AI-assisted product chat.</li>
              <li>Review and process seller applications.</li>
              <li>Send transactional emails (verification, password reset, order updates, seller approval notices) and, where you have not opted out, occasional service updates.</li>
              <li>Maintain the security of the Platform, including detecting attempts to circumvent our vendor-communication safeguards (see Section 6).</li>
              <li>Improve our services and develop new features.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-3">3. Legal Basis for Processing</h2>
            <p>
              We process your personal data on the basis of: your consent (for example, when you create
              an account or sign in with Google/Facebook); the necessity of processing to perform a
              contract with you (for example, fulfilling an order); and our legitimate interests in
              operating, securing, and improving the Platform, balanced against your rights as a data
              subject under the NDPA.
            </p>
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-3">4. How We Share Your Information</h2>
            <p className="mb-3">We do not sell your personal data. We share information only as follows:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>With vendors:</strong> when you place an order or escalate a product chat to a vendor, we share the information necessary for them to fulfill or respond to your request (such as your name and order details). We do not share your phone number or email with a vendor through the Platform's chat feature — see Section 6.</li>
              <li><strong>With service providers:</strong> we use third-party providers to operate the Platform, including hosting (Vercel, Railway, MongoDB Atlas), transactional email (Resend), authentication (Google, Facebook), and AI-assisted chat (Anthropic). These providers process data on our behalf and are bound to handle it securely.</li>
              <li><strong>Payment processors:</strong> once payment processing is enabled on the Platform, payment details will be handled directly by our licensed payment processor and will not be stored on our own servers.</li>
              <li><strong>Legal requirements:</strong> we may disclose information if required to do so by law, regulation, or a valid legal request from a Nigerian regulatory or law enforcement authority.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-3">5. International Data Transfers</h2>
            <p>
              Some of our service providers process and store data on servers located outside Nigeria.
              Where this occurs, we take reasonable steps to ensure such transfers are conducted in a
              manner consistent with the NDPA's requirements for cross-border data transfer, including
              relying on providers with appropriate data protection safeguards in place.
            </p>
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-3">6. Protecting Buyer–Vendor Communication</h2>
            <p>
              To protect both buyers and vendors, direct exchange of personal contact information
              (phone numbers, email addresses, social media handles) is not permitted within the
              Platform's product chat feature, and messages are automatically screened for this
              purpose. This is designed to keep transactions, communications, and any related disputes
              within the protections the Platform provides. Attempting to circumvent this may result
              in restriction of your account, as described in our Terms of Service.
            </p>
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-3">7. Data Retention</h2>
            <p>
              We retain your personal data for as long as your account remains active, and for a
              reasonable period afterward to comply with legal obligations, resolve disputes, and
              enforce our agreements. You may request deletion of your account and associated data at
              any time, subject to Section 9 below.
            </p>
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-3">8. Data Security</h2>
            <p>
              We apply reasonable technical and organizational measures to protect your data, including
              password hashing, encrypted connections (HTTPS), and access controls on our systems.
              No method of transmission or storage is completely secure, and we cannot guarantee
              absolute security.
            </p>
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-3">9. Your Rights</h2>
            <p className="mb-3">Under the NDPA, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate or incomplete data.</li>
              <li>Request deletion of your personal data, subject to our legal retention obligations.</li>
              <li>Object to or request restriction of certain processing.</li>
              <li>Withdraw consent at any time, where processing is based on consent.</li>
              <li>Lodge a complaint with the Nigeria Data Protection Commission (NDPC) if you believe your data protection rights have been violated.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us using the details in Section 12.
            </p>
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-3">10. Cookies and Local Storage</h2>
            <p>
              The Platform uses browser local storage to keep you logged in and remember your
              preferences. We do not currently use third-party advertising cookies. Sign-in features
              from Google and Facebook may set their own cookies as part of their authentication
              process, governed by their respective privacy policies.
            </p>
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-3">11. Children's Privacy</h2>
            <p>
              The Platform is not directed at, and we do not knowingly collect personal data from,
              individuals under the age of 18. If you believe a minor has provided us with personal
              data, please contact us so we can remove it.
            </p>
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-3">12. Contact Us</h2>
            <p>
              For questions about this Privacy Policy or to exercise your data protection rights,
              contact us at{' '}
              <a href="mailto:seunultimateconcepts@gmail.com" className="text-amber-600 font-semibold hover:underline">
                seunultimateconcepts@gmail.com
              </a>{' '}
              or via WhatsApp at{' '}
              <a href="https://wa.me/2348038786037" target="_blank" rel="noopener noreferrer" className="text-amber-600 font-semibold hover:underline">
                +234 803 878 6037
              </a>.
            </p>
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-3">13. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will post the updated version on
              this page with a revised "Last updated" date. Material changes will be communicated to
              registered users by email where appropriate.
            </p>
          </div>

        </div>
      </section>

    </div>
  )
}

export default PrivacyPolicy