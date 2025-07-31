import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { HiPlus } from 'react-icons/hi';

// Lazy load admin pages
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const SecuritySettings = React.lazy(() => import('./pages/SecuritySettings'));

// Lazy load contact management pages
const ContactContentManager = React.lazy(() => import('./pages/contact/ContactContentManager'));
const ContactSubmissions = React.lazy(() => import('./pages/contact/ContactSubmissions'));
const ContactAnalytics = React.lazy(() => import('./pages/contact/ContactAnalytics'));
const ContactReply = React.lazy(() => import('./pages/contact/ContactReply'));

// Placeholder components for other admin pages
const PlaceholderPage = ({ title, description }) => (
  <div className="p-6 w-full">
    <div className="max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiPlus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This page is under development. Check back soon for full functionality.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AdminApp = () => {
  return (
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
                
                {/* Content Management */}
                <Route path="/content" element={
                  <PlaceholderPage 
                    title="Portfolio Content Management" 
                    description="Manage your portfolio content, sections, and dynamic content updates."
                  />
                } />
                <Route path="/projects" element={
                  <PlaceholderPage 
                    title="Projects Management" 
                    description="Add, edit, and manage your portfolio projects with images and descriptions."
                  />
                } />
                <Route path="/skills" element={
                  <PlaceholderPage 
                    title="Skills & Experience" 
                    description="Update your skills, experience, and professional information."
                  />
                } />
                <Route path="/about" element={
                  <PlaceholderPage 
                    title="About Section" 
                    description="Manage your about section content and personal information."
                  />
                } />

                {/* Contact Management */}
                <Route path="/contact/content" element={<ContactContentManager />} />
                <Route path="/contact/submissions" element={<ContactSubmissions />} />
                <Route path="/contact/analytics" element={<ContactAnalytics />} />
                <Route path="/contact/reply/:id" element={<ContactReply />} />

                {/* Management */}
                <Route path="/users" element={
                  <PlaceholderPage 
                    title="User Management" 
                    description="Manage admin users, roles, and permissions for the admin panel."
                  />
                } />
                <Route path="/activity" element={
                  <PlaceholderPage 
                    title="Activity Logs" 
                    description="View detailed activity logs and system events for security monitoring."
                  />
                } />

                {/* Analytics */}
                <Route path="/analytics" element={
                  <PlaceholderPage 
                    title="Dashboard Analytics" 
                    description="View comprehensive analytics and performance metrics for your portfolio."
                  />
                } />
                <Route path="/analytics/visitors" element={
                  <PlaceholderPage 
                    title="Visitor Statistics" 
                    description="Detailed visitor analytics, traffic sources, and user behavior insights."
                  />
                } />
                <Route path="/analytics/performance" element={
                  <PlaceholderPage 
                    title="Performance Reports" 
                    description="System performance metrics and optimization recommendations."
                  />
                } />

                {/* Settings */}
                <Route path="/settings" element={
                  <PlaceholderPage 
                    title="General Settings" 
                    description="Configure general admin panel settings and preferences."
                  />
                } />
                <Route path="/settings/security" element={<SecuritySettings />} />
                <Route path="/settings/profile" element={
                  <PlaceholderPage 
                    title="Profile Settings" 
                    description="Update your admin profile information and preferences."
                  />
                } />
                <Route path="/settings/help" element={
                  <PlaceholderPage 
                    title="Help Center" 
                    description="Access help documentation, tutorials, and support resources."
                  />
                } />

                {/* Profile */}
                <Route path="/profile" element={
                  <PlaceholderPage 
                    title="Admin Profile" 
                    description="View and manage your admin profile and account settings."
                  />
                } />

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
  );
};

export default AdminApp; 