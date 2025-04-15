
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TransitionManager from "./components/TransitionManager";
import ColorSchemeProvider from "./components/ColorSchemeProvider";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import EmployeesPage from "./pages/EmployeesPage";
import MarkDetailPage from "./pages/MarkDetailPage";
import HellyDetailPage from "./pages/HellyDetailPage";
import IrvingDetailPage from "./pages/IrvingDetailPage";
import DylanDetailPage from "./pages/DylanDetailPage";
import JoinUsPage from "./pages/JoinUsPage";
import NotFound from "./pages/NotFound";
import TypographyDemo from "./components/TypographyDemo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ColorSchemeProvider>
          <TransitionManager>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/employees/mark" element={<MarkDetailPage />} />
              <Route path="/employees/helly" element={<HellyDetailPage />} />
              <Route path="/employees/irving" element={<IrvingDetailPage />} />
              <Route path="/employees/dylan" element={<DylanDetailPage />} />
              <Route path="/join-us" element={<JoinUsPage />} />
              {/* Legal pages */}
              <Route path="/privacy" element={<NotFound />} />
              <Route path="/terms" element={<NotFound />} />
              <Route path="/severance-agreement" element={<NotFound />} />
              <Route path="/cookies" element={<NotFound />} />
              {/* Typography demo route */}
              <Route path="/typography" element={<TypographyDemo />} />
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TransitionManager>
        </ColorSchemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
