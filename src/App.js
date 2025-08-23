// src/App.js
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

// Public Routes Component
const PublicRoutes = () => {
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
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Admin Routes - No Navbar/Footer */}
          <Route path="/admin/*" element={<AdminApp />} />
          
          {/* Public Routes - With Navbar/Footer */}
          <Route path="/*" element={<PublicRoutes />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
