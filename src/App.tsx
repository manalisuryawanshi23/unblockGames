import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import GamePage from "./pages/GamePage";
import TrendingPage from "./pages/TrendingPage";
import LandingPage from "./pages/LandingPage";
import { landingPages } from "./data/seo-content";
import CategoryPage from "./pages/CategoryPage";
import CategoriesPage from "./pages/CategoriesPage";
import SearchPage from "./pages/SearchPage";
import FavoritesPage from "./pages/FavoritesPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Disclaimer from "./pages/Disclaimer";
import NotFound from "./pages/NotFound";
import StickyBottomAd from "@/components/StickyBottomAd";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import AdminBlogList from "./pages/admin/AdminBlogList";
import AdminBlogEditor from "./pages/admin/AdminBlogEditor";
import AdminLogin from "./pages/admin/AdminLogin";
import { AdminRoute } from "./components/admin/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/game/:slug" element={<GamePage />} />
              <Route path="/trending" element={<TrendingPage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/unblocked-games-for-school" element={<LandingPage {...landingPages['unblocked-games-for-school']} />} />
              <Route path="/chromebook-games" element={<LandingPage {...landingPages['chromebook-games']} />} />
              <Route path="/free-browser-games" element={<LandingPage {...landingPages['free-browser-games']} />} />
              <Route path="/games-to-play-at-school" element={<LandingPage {...landingPages['games-to-play-at-school']} />} />
              <Route path="/unblocked-racing-games" element={<LandingPage {...landingPages['unblocked-racing-games']} />} />
              <Route path="/unblocked-puzzle-games" element={<LandingPage {...landingPages['unblocked-puzzle-games']} />} />
              <Route path="/unblocked-2-player-games" element={<LandingPage {...landingPages['unblocked-2-player-games']} />} />
              <Route path="/multiplayer-games" element={<LandingPage {...landingPages['multiplayer-games']} />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/blog" element={<AdminRoute><AdminBlogList /></AdminRoute>} />
              <Route path="/admin/blog/new" element={<AdminRoute><AdminBlogEditor /></AdminRoute>} />
              <Route path="/admin/blog/edit/:slug" element={<AdminRoute><AdminBlogEditor /></AdminRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
            <StickyBottomAd />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
