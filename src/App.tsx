
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useState } from "react";
import TransitionManager from "./components/TransitionManager";
import ColorSchemeProvider from "./components/ColorSchemeProvider";
import HomePage from "./pages/HomePage";

const LoadingAnimation = lazy(() => import("./components/LoadingAnimation/LoadingAnimation"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const DepartmentsPage = lazy(() => import("./pages/DepartmentsPage"));
const EmployeesPage = lazy(() => import("./pages/EmployeesPage"));
const MarkDetailPage = lazy(() => import("./pages/MarkDetailPage"));
const HellyDetailPage = lazy(() => import("./pages/HellyDetailPage"));
const IrvingDetailPage = lazy(() => import("./pages/IrvingDetailPage"));
const DylanDetailPage = lazy(() => import("./pages/DylanDetailPage"));
const JoinUsPage = lazy(() => import("./pages/JoinUsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const TypographyDemo = lazy(() => import("./components/TypographyDemo"));

const App = () => {
  const [isLoading, setIsLoading] = useState(
    () => sessionStorage.getItem("hasVisited") !== "true"
  );
  const [loadingComplete, setLoadingComplete] = useState(!isLoading);

  if (isLoading) {
    sessionStorage.setItem("hasVisited", "true");
  }

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Set loading complete flag to trigger animations
    setLoadingComplete(true);
  };

  return (
    <>
      {isLoading && (
        <Suspense fallback={null}>
          <LoadingAnimation onLoadingComplete={handleLoadingComplete} />
        </Suspense>
      )}
      <BrowserRouter>
        <ColorSchemeProvider>
          <TransitionManager>
            <Suspense fallback={<div className="min-h-screen bg-severance-midnight" />}>
            <Routes>
              <Route path="/" element={<HomePage loadingComplete={loadingComplete} />} />
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
            </Suspense>
          </TransitionManager>
        </ColorSchemeProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
