import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster as HotToaster } from "react-hot-toast";

import Index from "./pages/public/Index";
import NotFound from "./pages/public/NotFound";
import PreviewListPage from "./link-preview/PreviewListPage";
import Login from "./pages/public/Login";
import Signup from "./pages/public/Signup";
import IndustryHub from "./pages/public/IndustryHub";
import CourseDetail from "./pages/public/CourseDetail";
import Checkout from "./pages/public/Checkout";
import Profile from "./pages/public/Profile";

import Dashboard from "./pages/admin/Dashboard";
import Courses from "./pages/admin/Courses";
import Admins from "./pages/admin/Admins";
import CourseEditor from "./pages/admin/CourseEditor";
import Enrollments from "./pages/admin/Enrollments";

import AdminGuard from "./components/admin/AdminGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HotToaster />
      <BrowserRouter>

        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/industry-hub" element={<IndustryHub />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/website-previews" element={<PreviewListPage />} />
          <Route path="/checkout/:courseId" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <Dashboard />
              </AdminGuard>
            }
          />

          <Route
            path="/admin/courses"
            element={
              <AdminGuard>
                <Courses />
              </AdminGuard>
            }
          />

          {/* NEW CLEAN ROUTE */}
          <Route
            path="/admin/courses/:id/curriculum"
            element={
              <AdminGuard>
                <CourseEditor />
              </AdminGuard>
            }
          />

          <Route
            path="/admin/admins"
            element={
              <AdminGuard>
                <Admins />
              </AdminGuard>
            }
          />

          <Route
            path="/admin/enrollments"
            element={
              <AdminGuard>
                <Enrollments />
              </AdminGuard>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
