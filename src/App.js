// src/App.js
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SettingsProvider from './context/SettingsContext';
import AnalyticsProvider from './context/AnalyticsContext';
import { useSettings } from './context/SettingsContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/error/ErrorBoundary';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Projects = React.lazy(() => import('./pages/Projects'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Resume = React.lazy(() => import('./pages/Resume'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Lazy load admin app
const AdminApp = React.lazy(() => import('./admin/AdminApp'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-lightBgFrom via-lightBgVia to-lightBgTo dark:from-darkBgFrom dark:via-darkBgVia dark:to-darkBgTo">
    <LoadingSpinner size="lg" text="Loading page..." />
  </div>
);

// Maintenance Mode Component
const MaintenanceMode = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-lightBgFrom via-lightBgVia to-lightBgTo dark:from-darkBgFrom dark:via-darkBgVia dark:to-darkBgTo">
    <div className="text-center p-8 bg-white/10 dark:bg-gray-800/10 backdrop-blur-md rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-2xl">
      <div className="text-6xl mb-4">🔧</div>
      <h1 className="text-3xl font-bold text-lightText dark:text-darkText mb-4">
        Under Maintenance
      </h1>
      <p className="text-lg text-lightText/80 dark:text-darkText/80 mb-6">
        We're currently performing some maintenance on our site. We'll be back shortly!
      </p>
      <div className="text-sm text-lightText/60 dark:text-darkText/60">
        Thank you for your patience.
      </div>
    </div>
  </div>
);

// Public Routes Component
const PublicRoutes = () => {
  const { isMaintenanceMode } = useSettings();

  // Show maintenance mode if enabled
  if (isMaintenanceMode()) {
    return <MaintenanceMode />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <SettingsProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AnalyticsProvider>
            <Routes>
              {/* Admin Routes - No Navbar/Footer */}
              <Route path="/admin/*" element={<AdminApp />} />
              
              {/* Public Routes - With Navbar/Footer */}
              <Route path="/*" element={<PublicRoutes />} />
            </Routes>
          </AnalyticsProvider>
        </Router>
      </SettingsProvider>
    </ErrorBoundary>
  );
}
