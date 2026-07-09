import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Loader2 } from "lucide-react";

import DiagnosticoPro from "./pages/DiagnosticoPro";

const Index = lazy(() => import("./pages/Index"));
const Links = lazy(() => import("./pages/Links"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Diagnostico = lazy(() => import("./pages/Diagnostico"));
const DiagnosticoDondoka = lazy(() => import("./pages/DiagnosticoDondoka"));
const DiagnosticoObrigadoA = lazy(() => import("./pages/DiagnosticoObrigadoA"));
const Privacidade = lazy(() => import("./pages/Privacidade"));
const Termos = lazy(() => import("./pages/Termos"));
const Footer = lazy(() => import("@/components/Footer").then(m => ({ default: m.Footer })));

declare global {
  interface Window {
    fbq: any;
  }
}

const queryClient = new QueryClient();

// Loader simplificado para o Suspense Fallback
const PageLoader = () => (
  <div className="w-full h-screen flex justify-center items-center bg-[#050D18]">
     <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-cyan-500 animate-spin opacity-50" />
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const isFormPage = location.pathname.startsWith("/diagnostico");

  // Dispara o PageView do Meta Pixel sempre que a rota mudar (Browser + CAPI deduplication)
  useEffect(() => {
    if (typeof window !== "undefined" && window.fbq) {
      const eventId = crypto.randomUUID ? crypto.randomUUID() : 'id_' + Math.random().toString(36).substr(2, 9);
      
      // Dispara no Browser
      window.fbq("track", "PageView", {}, { eventID: eventId });
      
      // Envia para o CAPI (backend Next.js) para deduplicação
      fetch('https://diagnostico.cineze.com.br/api/meta-capi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: 'PageView',
          event_id: eventId,
          source_url: window.location.href,
        })
      }).catch(err => console.error("Erro CAPI PageView:", err));
    }
  }, [location.pathname]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/links" element={<Links />} />
        <Route path="/diagnostico" element={<Diagnostico />} />
        <Route path="/diagnostico-dondoka" element={<DiagnosticoDondoka />} />
        <Route path="/diagnostico/obrigado-a" element={<DiagnosticoObrigadoA />} />
        <Route path="/diagnostico-pro" element={<DiagnosticoPro />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/termos" element={<Termos />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isFormPage && <Footer />}
    </Suspense>
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
