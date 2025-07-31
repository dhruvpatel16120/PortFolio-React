import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HiHome,
  HiDocumentText,
  HiUsers,
  HiChartBar,
  HiCog,
  HiShieldCheck,
  HiX,
  HiChevronDown,
  HiCheckCircle,
  HiMail
} from 'react-icons/hi';

const AdminSidebar = ({ isOpen, onClose }) => {
  const [expandedSections, setExpandedSections] = useState({
    content: true,
    contact: true,
    management: true,
    analytics: false,
    settings: false
  });
  const location = useLocation();

  const navigationItems = [
    {
      title: 'Dashboard',
      path: '/admin',
      icon: <HiHome className="w-5 h-5" />
    },
    {
      title: 'Content Management',
      section: 'content',
      icon: <HiDocumentText className="w-5 h-5" />,
      items: [
        { title: 'Portfolio Content', path: '/admin/content' },
        { title: 'Projects', path: '/admin/projects' },
        { title: 'Skills & Experience', path: '/admin/skills' },
        { title: 'About Section', path: '/admin/about' }
      ]
    },
    {
      title: 'Contact Management',
      section: 'contact',
      icon: <HiMail className="w-5 h-5" />,
      items: [
        { title: 'Contact Content Manager', path: '/admin/contact/content' },
        { title: 'Contact Submissions', path: '/admin/contact/submissions' },
        { title: 'Contact Analytics', path: '/admin/contact/analytics' }
      ]
    },
    {
      title: 'Management',
      section: 'management',
      icon: <HiUsers className="w-5 h-5" />,
      items: [
        { title: 'User Management', path: '/admin/users' },
        { title: 'Activity Logs', path: '/admin/activity' }
      ]
    },
    {
      title: 'Analytics',
      section: 'analytics',
      icon: <HiChartBar className="w-5 h-5" />,
      items: [
        { title: 'Dashboard Analytics', path: '/admin/analytics' },
        { title: 'Visitor Statistics', path: '/admin/analytics/visitors' },
        { title: 'Performance Reports', path: '/admin/analytics/performance' }
      ]
    },
    {
      title: 'Settings',
      section: 'settings',
      icon: <HiCog className="w-5 h-5" />,
      items: [
        { title: 'General Settings', path: '/admin/settings' },
        { title: 'Security Settings', path: '/admin/settings/security' },
        { title: 'Profile Settings', path: '/admin/settings/profile' }
      ]
    }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isSectionActive = (items) => {
    return items?.some(item => isActive(item.path));
  };

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.sidebar') && window.innerWidth < 1024) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:relative lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <HiX className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navigationItems.map((item, index) => (
                <li key={index}>
                  {item.path ? (
                    // Single navigation item
                    <Link
                      to={item.path}
                      className={`
                        flex items-center px-3 py-2 rounded-lg transition-colors
                        ${isActive(item.path)
                          ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      {item.icon}
                      <span className="ml-3">{item.title}</span>
                    </Link>
                  ) : (
                    // Expandable section
                    <div>
                      <button
                        onClick={() => toggleSection(item.section)}
                        className={`
                          w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors
                          ${isSectionActive(item.items)
                            ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                            : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                      >
                        <div className="flex items-center">
                          {item.icon}
                          <span className="ml-3">{item.title}</span>
                        </div>
                        <HiChevronDown 
                          className={`w-4 h-4 transition-transform ${
                            expandedSections[item.section] ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      
                      {expandedSections[item.section] && (
                        <ul className="mt-2 ml-6 space-y-1">
                          {item.items.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <Link
                                to={subItem.path}
                                className={`
                                  flex items-center px-3 py-2 rounded-lg transition-colors text-sm
                                  ${isActive(subItem.path)
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                                  }
                                `}
                              >
                                <span className="ml-3">{subItem.title}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <HiShieldCheck className="w-4 h-4 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">Admin</p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
              <HiCheckCircle className="w-4 h-4 text-green-500" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar; 