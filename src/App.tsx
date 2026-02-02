import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
