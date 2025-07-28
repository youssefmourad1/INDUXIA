import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import RoleDashboard from "./pages/RoleDashboard";
import AssetHealthPage from "./pages/AssetHealthPage";
import WorkOrdersPage from "./pages/WorkOrdersPage";
import CreateWorkOrderPage from "./pages/CreateWorkOrderPage";
import QualityControlPage from "./pages/QualityControlPage";
import SupplyChainPage from "./pages/SupplyChainPage";
import ReportsPage from "./pages/ReportsPage";
import HealthHistoryPage from "./pages/HealthHistoryPage";
import ScheduleMaintenancePage from "./pages/ScheduleMaintenancePage";
import CalendarPage from "./pages/CalendarPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AppLayout><RoleDashboard /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/assets" element={
              <ProtectedRoute>
                <AppLayout><AssetHealthPage /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/work-orders" element={
              <ProtectedRoute>
                <AppLayout><WorkOrdersPage /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/work-orders/create" element={
              <ProtectedRoute>
                <AppLayout><CreateWorkOrderPage /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/quality" element={
              <ProtectedRoute>
                <AppLayout><QualityControlPage /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/supply-chain" element={
              <ProtectedRoute>
                <AppLayout><SupplyChainPage /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <AppLayout><ReportsPage /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/health-history" element={
              <ProtectedRoute>
                <AppLayout><HealthHistoryPage /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/schedule-maintenance" element={
              <ProtectedRoute>
                <AppLayout><ScheduleMaintenancePage /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute>
                <AppLayout><CalendarPage /></AppLayout>
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
