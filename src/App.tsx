import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MetricProvider } from "@/contexts/MetricContext";
import DashboardPage from "./pages/DashboardPage";
import DiagnosesPage from "./pages/DiagnosesPage";
import HealthOverviewPage from "./pages/HealthOverviewPage";
import EventsPage from "./pages/EventsPage";
import AppointmentPrepPage from "./pages/AppointmentPrepPage";
import DocumentsPage from "./pages/DocumentsPage";
import AccessibilityPlanPage from "./pages/AccessibilityPlanPage";

import ResultsExplorerPage from "./pages/ResultsExplorerPage";
import MedicalResourcesPage from "./pages/MedicalResourcesPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MetricProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/upload" element={<Navigate to="/documents" replace />} />
            <Route path="/results" element={<ResultsExplorerPage />} />
            <Route path="/diagnoses" element={<DiagnosesPage />} />
            <Route path="/health-overview" element={<HealthOverviewPage />} />
            <Route path="/health-trends" element={<Navigate to="/health-overview" replace />} />
            <Route path="/healthspan" element={<Navigate to="/health-overview" replace />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/appointment-prep" element={<AppointmentPrepPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/accessibility-plan" element={<AccessibilityPlanPage />} />
            <Route path="/medical-resources" element={<MedicalResourcesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </MetricProvider>
  </QueryClientProvider>
);

export default App;
