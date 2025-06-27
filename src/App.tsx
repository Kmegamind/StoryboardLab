
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ScreenwriterAgentPage from "./pages/agents/ScreenwriterAgentPage";
import DirectorAgentPage from "./pages/agents/DirectorAgentPage";
import CinematographerAgentPage from "./pages/agents/CinematographerAgentPage";
import ArtDirectorAgentPage from "./pages/agents/ArtDirectorAgentPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from './pages/DashboardPage';
import FreeCreationPage from './pages/FreeCreationPage';
import TestAgentsPage from "./pages/agents/TestAgentsPage";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background text-foreground min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

const App = () => (
  <React.Suspense fallback="Loading...">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<AppLayout><Index /></AppLayout>} />
            <Route path="/create" element={<AppLayout><FreeCreationPage /></AppLayout>} />
            <Route path="/dashboard" element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>} />
            <Route path="/agents/screenwriter" element={<ProtectedRoute><AppLayout><ScreenwriterAgentPage /></AppLayout></ProtectedRoute>} />
            <Route path="/agents/director" element={<ProtectedRoute><AppLayout><DirectorAgentPage /></AppLayout></ProtectedRoute>} />
            <Route path="/agents/cinematographer" element={<ProtectedRoute><AppLayout><CinematographerAgentPage /></AppLayout></ProtectedRoute>} />
            <Route path="/agents/art-director" element={<ProtectedRoute><AppLayout><ArtDirectorAgentPage /></AppLayout></ProtectedRoute>} />
            <Route path="/agents/test-config" element={<ProtectedRoute><AppLayout><TestAgentsPage /></AppLayout></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.Suspense>
);

export default App;
