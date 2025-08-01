import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase/config';
import { 
  HiMenu, 
  HiX, 
  HiSearch, 
  HiBell, 
  HiChevronDown,
  HiShieldCheck,
  HiUser,
  HiLogout
} from 'react-icons/hi';

const AdminTopbar = ({ toggleSidebar, sidebarOpen, isMobile = false }) => {
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-menu')) {
        setShowUserMenu(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 ${isMobile ? 'px-3 py-2' : 'px-4 py-3'}`}>
      <div className="flex items-center justify-between w-full">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          {/* Sidebar Toggle Button */}
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors sidebar-toggle ${isMobile ? 'p-1.5' : 'p-2'}`}
            title={isMobile ? (sidebarOpen ? 'Close Sidebar' : 'Open Sidebar') : (sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar')}
          >
            {isMobile ? (
              sidebarOpen ? (
                <HiX className="w-5 h-5" />
              ) : (
                <HiMenu className="w-5 h-5" />
              )
            ) : (
              sidebarOpen ? (
                <HiX className="w-6 h-6" />
              ) : (
                <HiMenu className="w-6 h-6" />
              )
            )}
          </button>

          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <div className={`bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`}>
              <HiShieldCheck className={`text-white ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
            </div>
            <span className={`font-semibold text-gray-900 dark:text-white ${isMobile ? 'text-sm hidden sm:block' : 'text-lg hidden sm:block'}`}>
              Admin Panel
            </span>
          </div>
        </div>

        {/* Center Section - Search (Desktop only) */}
        {!isMobile && (
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search..."
              />
            </form>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Mobile Search Button */}
          {isMobile && (
            <button
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Search"
            >
              <HiSearch className="w-5 h-5" />
            </button>
          )}

          {/* Notifications */}
          <div className="relative dropdown-menu">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative ${isMobile ? 'p-1.5' : 'p-2'}`}
            >
              <HiBell className={isMobile ? "w-5 h-5" : "w-6 h-6"} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className={`absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 ${isMobile ? 'w-72' : 'w-80'}`}>
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className={`font-semibold text-gray-900 dark:text-white ${isMobile ? 'text-base' : 'text-lg'}`}>Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((notification, index) => (
                      <div key={index} className="p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative dropdown-menu">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center space-x-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isMobile ? 'p-1.5' : 'p-2'}`}
            >
              <div className={`bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`}>
                <span className={`font-medium text-white ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <span className={`font-medium text-gray-900 dark:text-white ${isMobile ? 'text-sm hidden sm:block' : 'text-sm hidden sm:block'}`}>
                {user?.email || 'Admin'}
              </span>
              <HiChevronDown className={`text-gray-500 dark:text-gray-400 ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className={`absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 ${isMobile ? 'w-40' : 'w-48'}`}>
                <div className="py-1">
                  <Link
                    to="/admin/settings"
                    className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <HiShieldCheck className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <HiLogout className="w-4 h-4 mr-2" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTopbar; 