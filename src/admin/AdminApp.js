import React, { Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';
import SettingsProvider from '../context/SettingsContext';
import { useSettings } from '../context/SettingsContext';
import sessionService from '../services/sessionService';

// Lazy load admin pages
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

// Lazy load settings pages
const GeneralSettings = React.lazy(() => import('./pages/settings/GeneralSettings'));
const SecuritySettings = React.lazy(() => import('./pages/settings/SecuritySettings'));
const SiteConfiguration = React.lazy(() => import('./pages/settings/SiteConfiguration'));

// Lazy load contact management pages
const ContactContentManager = React.lazy(() => import('./pages/contact/ContactContentManager'));
const ContactSubmissions = React.lazy(() => import('./pages/contact/ContactSubmissions'));
const ContactAnalytics = React.lazy(() => import('./pages/contact/ContactAnalytics'));
const ContactReply = React.lazy(() => import('./pages/contact/ContactReply'));

// Lazy load media management pages
const MediaManager = React.lazy(() => import('./pages/media/MediaManager'));
const MediaAnalytics = React.lazy(() => import('./pages/media/MediaAnalytics'));


// Lazy load project management pages
const ProjectManager = React.lazy(() => import('./pages/projects/ProjectManager'));
const ProjectContentManager = React.lazy(() => import('./pages/projects/ProjectContentManager'));
const ProjectAnalytics = React.lazy(() => import('./pages/projects/ProjectAnalytics'));

// Lazy load analytics pages
const AnalyticsDashboard = React.lazy(() => import('./pages/analytics/AnalyticsDashboard'));

// Session Management Component
const SessionManager = ({ children }) => {
  const { settings } = useSettings();

  useEffect(() => {
    // Initialize session management with current settings
    if (settings && !settings.loading) {
      sessionService.initSessionManagement(settings);
    }

    // Cleanup on unmount
    return () => {
      sessionService.clearSession();
    };
  }, [settings]);

  return children;
};

const AdminApp = () => {
  return (
    <SettingsProvider>
      <SessionManager>
        <Routes>
          {/* Login Route - No Layout */}
          <Route path="/login" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminLogin />
            </Suspense>
          } />

          {/* Protected Admin Routes - With Layout */}
          <Route path="/*" element={
            <ProtectedRoute>
              <AdminLayout>
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    {/* Dashboard */}
                    <Route path="/" element={<AdminDashboard />} />
                    
                    {/* Contact Management */}
                    <Route path="/contact/content" element={<ContactContentManager />} />
                    <Route path="/contact/submissions" element={<ContactSubmissions />} />
                    <Route path="/contact/analytics" element={<ContactAnalytics />} />
                    <Route path="/contact/reply/:id" element={<ContactReply />} />

                    {/* Project Management */}
                    <Route path="/projects" element={<ProjectManager />} />
                    <Route path="/projects/content" element={<ProjectContentManager />} />
                    <Route path="/projects/analytics" element={<ProjectAnalytics />} />

                    {/* Media Management */}
                    <Route path="/media" element={<MediaManager />} />
                    <Route path="/media/analytics" element={<MediaAnalytics />} />

                    {/* Analytics */}
                    <Route path="/analytics" element={<AnalyticsDashboard />} />

                    {/* Settings */}
                    <Route path="/settings" element={<GeneralSettings />} />
                    <Route path="/settings/security" element={<SecuritySettings />} />
                    <Route path="/settings/site" element={<SiteConfiguration />} />

                    {/* Catch all - 404 for admin routes */}
                    <Route path="*" element={
                      <div className="p-6 w-full">
                        <div className="max-w-7xl mx-auto">
                          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                            <div className="text-center">
                              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                              </div>
                              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page Not Found</h1>
                              <p className="text-gray-600 dark:text-gray-400 mb-6">
                                The page you're looking for doesn't exist in the admin panel.
                              </p>
                              <a
                                href="/admin"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Dashboard
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    } />
                  </Routes>
                </Suspense>
              </AdminLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </SessionManager>
    </SettingsProvider>
  );
};

export default AdminApp; 