import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Links from "./pages/Links";
import NotFound from "./pages/NotFound";
import Diagnostico from "./pages/Diagnostico";
import DiagnosticoObrigadoA from "./pages/DiagnosticoObrigadoA";
import DiagnosticoObrigadoB from "./pages/DiagnosticoObrigadoB";
import Privacidade from "./pages/Privacidade";
import { Footer } from "@/components/Footer";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isFormPage = location.pathname.startsWith("/diagnostico");

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/links" element={<Links />} />
        <Route path="/diagnostico" element={<Diagnostico />} />
        <Route path="/diagnostico/obrigado-a" element={<DiagnosticoObrigadoA />} />
        <Route path="/diagnostico/obrigado-b" element={<DiagnosticoObrigadoB />} />
        <Route path="/privacidade" element={<Privacidade />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isFormPage && <Footer />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
