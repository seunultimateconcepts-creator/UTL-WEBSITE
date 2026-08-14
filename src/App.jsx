import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatBot from './components/ChatBot'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Portfolio from './pages/Portfolio'
import Shop from './pages/Shop'
import Blog from './pages/Blog'
import Contact from './pages/Contact'
import WhoWeAre from './pages/about/WhoWeAre'
import Values from './pages/about/Values'
import Vision from './pages/about/Vision'
import FAQs from './pages/about/FAQs'
import WebDevelopment from './pages/services/WebDevelopment'
import CryptoServices from './pages/services/CryptoServices'
import ShoppingAssistance from './pages/services/ShoppingAssistance'
import BecomeSeller from './pages/BecomeSeller'
import SignUp from './pages/auth/SignUp'
import Login from './pages/auth/Login'
import Dashboard from './pages/auth/Dashboard'
import NotFound from './pages/NotFound'
import SignUpSuccess from './pages/auth/SignUpSuccess'
import VerifyEmail from './pages/auth/VerifyEmail'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import VerifyEmailPending from './pages/auth/VerifyEmailPending'
import TechHub from './pages/TechHub'
import JsonFormatter from './pages/tools/JsonFormatter'
import ScrollToTop from './components/ScrollToTop'
import PasswordGenerator from './pages/tools/PasswordGenerator'
import WordCounter from './pages/tools/WordCounter'
import QRGenerator from './pages/tools/QRGenerator'
import CVBuilder from './pages/tools/CVBuilder'

function App() {
  const location = useLocation()

  // ✅ Pages that should NOT show Navbar and Footer
  const authPages = ['/signup', '/login', '/dashboard',
                  '/signup-success', '/verify-email',
                '/forgot-password', '/reset-password'
  ]
  const isAuthPage = authPages.some(page =>
    location.pathname.startsWith(page)
  )

  return (
    <div>
      <ScrollToTop />
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/about/who-we-are" element={<WhoWeAre />} />
        <Route path="/about/values" element={<Values />} />
        <Route path="/about/vision" element={<Vision />} />
        <Route path="/about/faqs" element={<FAQs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/web-development" element={<WebDevelopment />} />
        <Route path="/services/crypto" element={<CryptoServices />} />
        <Route path="/services/shopping" element={<ShoppingAssistance />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/become-seller" element={<BecomeSeller />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/signup-success" element={<SignUpSuccess />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email-pending" element={<VerifyEmailPending />} />
        <Route path="/tech-hub" element={<TechHub />} />
        <Route path="/tech-hub/json-formatter" element={<JsonFormatter />} />
        <Route path="/tech-hub/password-generator" element={<PasswordGenerator />} />
        <Route path="/tech-hub/word-counter" element={<WordCounter />} />
        <Route path="/tech-hub/qr-generator" element={<QRGenerator />} />
        <Route path="/tech-hub/cv-builder" element={<CVBuilder />} />
      </Routes>
      {!isAuthPage && <Footer />}
      {!isAuthPage && <ChatBot />}
    </div>
  )
}

export default App