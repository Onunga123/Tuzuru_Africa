import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import SiteLayout from '@/components/layout/SiteLayout';
// Add page imports here
import Home from '@/pages/Home';
import About from '@/pages/About';
import Tours from '@/pages/Tours';
import TourDetail from '@/pages/TourDetail';
import Destinations from '@/pages/Destinations';
import DestinationDetail from '@/pages/DestinationDetail';
import Experiences from '@/pages/Experiences';
import Gallery from '@/pages/Gallery';
import TravelGuides from '@/pages/TravelGuides';
import TravelGuideDetail from '@/pages/TravelGuideDetail';
import WhenToTravel from '@/pages/WhenToTravel';
import WildlifeCalendar from '@/pages/WildlifeCalendar';
import Faqs from '@/pages/Faqs';
import PlanYourTrip from '@/pages/PlanYourTrip';
import Contact from '@/pages/Contact';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfUse from '@/pages/TermsOfUse';
import BookingPolicy from '@/pages/BookingPolicy';
import EnquiryConfirmation from '@/pages/EnquiryConfirmation';
import NotFound from '@/pages/NotFound';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/tours/:slug" element={<TourDetail />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/destinations/:slug" element={<DestinationDetail />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/travel-guides" element={<TravelGuides />} />
        <Route path="/travel-guides/:slug" element={<TravelGuideDetail />} />
        <Route path="/when-to-travel" element={<WhenToTravel />} />
        <Route path="/wildlife-calendar" element={<WildlifeCalendar />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/plan-your-trip" element={<PlanYourTrip />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/booking-policy" element={<BookingPolicy />} />
        <Route path="/enquiry-confirmation" element={<EnquiryConfirmation />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App