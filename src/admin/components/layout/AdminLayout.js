import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminTopbar from './AdminTopbar';
import AdminSidebar from './AdminSidebar';
import AdminFooter from './AdminFooter';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Start with sidebar open on desktop
  const location = useLocation();

  // Close sidebar on route change (mobile only)
  useEffect(() => {
    if (window.innerWidth < 1024) { // Only auto-close on mobile
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
          {/* Topbar */}
          <AdminTopbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
          
          {/* Page Content */}
          <main className="flex-1 flex flex-col">
            {/* Main Content Area */}
            <div className="flex-1">
              {children}
            </div>
            
            {/* Footer */}
            <AdminFooter />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 