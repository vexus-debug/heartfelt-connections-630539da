import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop, FloatingBookButton } from "@/components/layout";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import BookAppointment from "./pages/BookAppointment";
import Contact from "./pages/Contact";
import Testimonials from "./pages/Testimonials";
import Gallery from "./pages/Gallery";
import Promotions from "./pages/Promotions";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

// Service Pages
import GeneralPreventive from "./pages/services/GeneralPreventive";
import CosmeticDentistry from "./pages/services/CosmeticDentistry";
import Orthodontics from "./pages/services/Orthodontics";
import Restorative from "./pages/services/Restorative";
import DentalImplants from "./pages/services/DentalImplants";
import OralSurgery from "./pages/services/OralSurgery";
import Periodontics from "./pages/services/Periodontics";

// Dashboard Pages
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import PatientsPage from "./pages/dashboard/PatientsPage";
import AppointmentsPage from "./pages/dashboard/AppointmentsPage";
import DentalChartsPage from "./pages/dashboard/DentalChartsPage";
import TreatmentsPage from "./pages/dashboard/TreatmentsPage";
import PrescriptionsPage from "./pages/dashboard/PrescriptionsPage";
import BillingPage from "./pages/dashboard/BillingPage";
import ReportsPage from "./pages/dashboard/ReportsPage";
import LabWorkPage from "./pages/dashboard/LabWorkPage";
import StaffPage from "./pages/dashboard/StaffPage";
import InventoryPage from "./pages/dashboard/InventoryPage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <FloatingBookButton />
        <Routes>
          {/* Core Pages */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Service Sub-Pages */}
          <Route path="/services/general-preventive" element={<GeneralPreventive />} />
          <Route path="/services/cosmetic" element={<CosmeticDentistry />} />
          <Route path="/services/orthodontics" element={<Orthodontics />} />
          <Route path="/services/restorative" element={<Restorative />} />
          <Route path="/services/implants" element={<DentalImplants />} />
          <Route path="/services/oral-surgery" element={<OralSurgery />} />
          <Route path="/services/periodontics" element={<Periodontics />} />
          
          {/* Trust & Conversion Pages */}
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/promotions" element={<Promotions />} />
          
          {/* Utility Pages */}
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout><DashboardHome /></DashboardLayout>} />
          <Route path="/dashboard/patients" element={<DashboardLayout><PatientsPage /></DashboardLayout>} />
          <Route path="/dashboard/appointments" element={<DashboardLayout><AppointmentsPage /></DashboardLayout>} />
          <Route path="/dashboard/dental-charts" element={<DashboardLayout><DentalChartsPage /></DashboardLayout>} />
          <Route path="/dashboard/treatments" element={<DashboardLayout><TreatmentsPage /></DashboardLayout>} />
          <Route path="/dashboard/prescriptions" element={<DashboardLayout><PrescriptionsPage /></DashboardLayout>} />
          <Route path="/dashboard/billing" element={<DashboardLayout><BillingPage /></DashboardLayout>} />
          <Route path="/dashboard/reports" element={<DashboardLayout><ReportsPage /></DashboardLayout>} />
          <Route path="/dashboard/lab-work" element={<DashboardLayout><LabWorkPage /></DashboardLayout>} />
          <Route path="/dashboard/staff" element={<DashboardLayout><StaffPage /></DashboardLayout>} />
          <Route path="/dashboard/inventory" element={<DashboardLayout><InventoryPage /></DashboardLayout>} />
          <Route path="/dashboard/notifications" element={<DashboardLayout><NotificationsPage /></DashboardLayout>} />
          <Route path="/dashboard/settings" element={<DashboardLayout><SettingsPage /></DashboardLayout>} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
