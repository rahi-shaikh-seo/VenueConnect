import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Venues from "./pages/Venues";
import Vendors from "./pages/Vendors";
import Cities from "./pages/Cities";
import VenueDetails from "./pages/VenueDetails";
import VendorDetails from "./pages/VendorDetails";
import ListVenue from "./pages/ListVenue";
import ListVendor from "./pages/ListVendor";
import ListBusiness from "./pages/ListBusiness";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Dashboard from "./pages/Dashboard";
import EInvitations from "./pages/EInvitations";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { AdminRoute } from "./components/AdminRoute";
import UserProfile from "./pages/UserProfile";
import { OwnerRoute } from "./components/OwnerRoute";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import MobileBottomNav from "./components/MobileBottomNav";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import FAQs from "./pages/FAQs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MobileBottomNav />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/venues/:id" element={<VenueDetails />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendors/:id" element={<VendorDetails />} />
          <Route path="/cities" element={<Cities />} />
          <Route path="/list-business" element={<ListBusiness />} />
          <Route path="/list-venue" element={<ListVenue />} />
          <Route path="/list-vendor" element={<ListVendor />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/e-invitations" element={<EInvitations />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/faqs" element={<FAQs />} />
          
          <Route path="/admin" element={
            <AdminRoute>
               <AdminDashboard />
            </AdminRoute>
          } />

          <Route path="/owner/*" element={
            <OwnerRoute>
              <OwnerDashboard />
            </OwnerRoute>
          } />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
