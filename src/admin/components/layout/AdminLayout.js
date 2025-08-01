import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminTopbar from './AdminTopbar';
import AdminSidebar from './AdminSidebar';
import AdminFooter from './AdminFooter';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start with sidebar closed on mobile
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // For desktop collapse
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Check if device is mobile and handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on route change (mobile only)
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Handle body scroll lock when mobile sidebar is open
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }

    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [isMobile, sidebarOpen]);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <AdminTopbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} isMobile={true} />
        </div>

        {/* Mobile Sidebar Overlay */}
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isMobile={true} />

        {/* Mobile Content */}
        <main className="flex-1 p-4">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Mobile Footer */}
        <AdminFooter />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Desktop Sidebar - Only show when not collapsed */}
        {!sidebarCollapsed && (
          <AdminSidebar 
            isOpen={true} 
            onClose={() => {}} 
            isMobile={false} 
            isCollapsed={false}
          />
        )}
        
        {/* Desktop Main Content */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${!sidebarCollapsed ? 'ml-80' : ''}`}>
          {/* Desktop Topbar */}
          <AdminTopbar 
            toggleSidebar={toggleSidebar} 
            sidebarOpen={!sidebarCollapsed} 
            isMobile={false} 
          />
          
          {/* Desktop Content */}
          <main className="flex-1">
            {children}
          </main>
          
          {/* Desktop Footer */}
          <AdminFooter />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 