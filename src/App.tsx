import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public / User Pages
import Index from "./pages/Index";
import SignupPage from "./pages/SignupPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyDocumentPage from "./pages/VerifyDocumentPage";
import VerificationSuccessPage from "./pages/VerificationSuccessPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import ThirdPartyLoginPage from "./pages/ThirdPartyLoginPage";
import ThirdPartyRegisterPage from "./pages/ThirdPartyRegisterPage";
import ThirdPartyDashboardPage from "./pages/ThirdPartyDashboardPage";
import ThirdPartyApplyPage from "./pages/ThirdPartyApplyPage";

// Admin Pages
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminVerificationPage from "./pages/AdminVerificationPage";
import AdminReportsPage from "./pages/AdminReportsPage";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/**
 * App Routing
 * -------------------------
 * NOTE:
 * - Routes are intentionally kept minimal
 * - Actual verification flow is controlled via
 *   page-level state (as per university process)
 * - This mirrors real NMIMS internal portals
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          {/* Landing */}
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Applicant Flow */}
          <Route path="/verify-document" element={<VerifyDocumentPage />} />
          <Route
            path="/verification-success"
            element={<VerificationSuccessPage />}
          />
          <Route path="/user-dashboard" element={<UserDashboardPage />} />

          {/* Third Party Flow */}
          <Route path="/third-party/login" element={<ThirdPartyLoginPage />} />
          <Route path="/third-party/register" element={<ThirdPartyRegisterPage />} />
          <Route path="/third-party/dashboard" element={<ThirdPartyDashboardPage />} />
          <Route path="/third-party/apply" element={<ThirdPartyApplyPage />} />

          {/* Admin Flow */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route
            path="/admin/verification/:id"
            element={<AdminVerificationPage />}
          />
          <Route path="/admin/reports" element={<AdminReportsPage />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
