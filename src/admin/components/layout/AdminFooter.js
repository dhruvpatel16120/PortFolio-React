import React from 'react';
import { Link } from 'react-router-dom';
import { HiShieldCheck } from 'react-icons/hi';

const AdminFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-3 py-4 lg:px-4 lg:py-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6">
          {/* System Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-2 lg:mb-3">
              <div className="w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <HiShieldCheck className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
              </div>
              <span className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">Admin Panel</span>
            </div>
            <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-2 lg:mb-3">
              Professional portfolio management system with advanced security features and comprehensive analytics.
            </p>
            <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1 lg:mr-2"></div>
                System Online
              </span>
              <span className="hidden lg:inline">•</span>
              <span>v1.0.0</span>
              <span className="hidden lg:inline">•</span>
              <span className="text-xs">Updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs lg:text-sm font-semibold text-gray-900 dark:text-white mb-2 lg:mb-3">Quick Links</h3>
            <ul className="space-y-1 lg:space-y-2 text-xs lg:text-sm">
              <li>
                <Link to="/admin" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/contacts" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Contact Management
                </Link>
              </li>
              <li>
                <Link to="/admin/settings" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Settings
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  View Portfolio
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs lg:text-sm font-semibold text-gray-900 dark:text-white mb-2 lg:mb-3">Support</h3>
            <ul className="space-y-1 lg:space-y-2 text-xs lg:text-sm">
              <li>
                <Link to="/admin/settings/help" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/admin/settings/security" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Security Guide
                </Link>
              </li>
              <li>
                <a href="mailto:support@example.com" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Contact Support
                </a>
              </li>
              <li>
                <Link to="/admin/activity" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Activity Logs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
              © {currentYear} Portfolio Admin Panel. All rights reserved.
            </div>
            <div className="flex items-center space-x-2 lg:space-x-4 text-xs lg:text-sm text-gray-500 dark:text-gray-400">
              <span>Built with React & Firebase</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter; 