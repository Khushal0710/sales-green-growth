import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from 'react';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Salesforce from "./pages/Salesforce";
import Analysis from "./pages/Analysis";
import Leads from "./pages/Leads";
import EmailTemplates from "./pages/EmailTemplates";
import NotFound from "./pages/NotFound";

// Lazy load the ChatWidget
const ChatWidget = lazy(() => import('@/components/ChatWidget'));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="px-[5%] py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/salesforce" element={<Salesforce />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/email-templates" element={<EmailTemplates />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Suspense fallback={null}>
            <ChatWidget />
          </Suspense>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
