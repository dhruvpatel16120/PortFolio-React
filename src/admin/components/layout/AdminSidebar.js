import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HiHome,
  HiDocumentText,
  HiCog,
  HiShieldCheck,
  HiX,
  HiChevronDown,
  HiCheckCircle,
  HiMail,
  HiSearch,
  HiTrendingUp,
  HiKey,
  HiGlobeAlt,
  HiChatAlt2,
  HiCode,
  HiCollection,
  HiChartBar,
  HiPhotograph
} from 'react-icons/hi';

const AdminSidebar = ({ isOpen, onClose, isMobile = false }) => {
  const [expandedSections, setExpandedSections] = useState({
    dashboard: true,
    contact: true,
    projects: true,
    media: true,
    analytics: true,
    settings: false
  });
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const navigationItems = [
    {
      title: 'Dashboard',
      path: '/admin',
      icon: <HiHome className="w-5 h-5" />,
      badge: null
    },
    {
      title: 'Contact Management',
      section: 'contact',
      icon: <HiMail className="w-5 h-5" />,
      badge: null,
      items: [
        { 
          title: 'Contact Content', 
          path: '/admin/contact/content',
          icon: <HiDocumentText className="w-4 h-4" />,
          description: 'Edit contact page content'
        },
        { 
          title: 'Contact Submissions', 
          path: '/admin/contact/submissions',
          icon: <HiChatAlt2 className="w-4 h-4" />,
          description: 'View and manage submissions',
          badge: '3'
        },
        { 
          title: 'Contact Analytics', 
          path: '/admin/contact/analytics',
          icon: <HiTrendingUp className="w-4 h-4" />,
          description: 'Contact form analytics'
        },
      ]
    },
    {
      title: 'Project Management',
      section: 'projects',
      icon: <HiCode className="w-5 h-5" />,
      items: [
        { 
          title: 'Project Manager', 
          path: '/admin/projects',
          icon: <HiCollection className="w-4 h-4" />,
          description: 'Manage project cards and content'
        },
        { 
          title: 'Content Manager', 
          path: '/admin/projects/content',
          icon: <HiDocumentText className="w-4 h-4" />,
          description: 'Edit projects page content'
        },
        { 
          title: 'Project Analytics', 
          path: '/admin/projects/analytics',
          icon: <HiChartBar className="w-4 h-4" />,
          description: 'Project statistics and insights'
        },
      ]
    },
    {
      title: 'Media Management',
      section: 'media',
      icon: <HiPhotograph className="w-5 h-5" />,
      items: [
        { 
          title: 'Media Manager', 
          path: '/admin/media',
          icon: <HiPhotograph className="w-4 h-4" />,
          description: 'Upload, edit, and manage media files'
        },
        { 
          title: 'Media Analytics', 
          path: '/admin/media/analytics',
          icon: <HiChartBar className="w-4 h-4" />,
          description: 'Media statistics and insights'
        },
      ]
    },
    {
      title: 'Analytics',
      section: 'analytics',
      icon: <HiTrendingUp className="w-5 h-5" />,
      items: [
        { 
          title: 'Analytics Dashboard', 
          path: '/admin/analytics',
          icon: <HiChartBar className="w-4 h-4" />,
          description: 'Website analytics and user behavior'
        },
      ]
    },
    {
      title: 'Settings',
      section: 'settings',
      icon: <HiCog className="w-5 h-5" />,
      items: [
        { 
          title: 'General Settings', 
          path: '/admin/settings',
          icon: <HiCog className="w-4 h-4" />,
          description: 'Basic configuration'
        },
        { 
          title: 'Security Settings', 
          path: '/admin/settings/security',
          icon: <HiKey className="w-4 h-4" />,
          description: 'Security and authentication'
        },
        { 
          title: 'Site Configuration', 
          path: '/admin/settings/site',
          icon: <HiGlobeAlt className="w-4 h-4" />,
          description: 'Site-wide settings'
        }
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

  const filteredNavigationItems = navigationItems.filter(item => {
    if (searchQuery === '') return true;
    
    const matchesTitle = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesItems = item.items?.some(subItem => 
      subItem.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return matchesTitle || matchesItems;
  });

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && isMobile && !event.target.closest('.sidebar') && !event.target.closest('.sidebar-toggle')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, isMobile]);

  // Sidebar styles
  const sidebarClasses = isMobile 
    ? `fixed top-0 left-0 h-full w-80 bg-gray-900 border-r border-gray-700 shadow-2xl transform transition-all duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`
    : 'fixed top-0 left-0 h-screen w-80 bg-gray-900 border-r border-gray-700 shadow-2xl flex-shrink-0 z-40';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`${sidebarClasses} sidebar`}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <HiShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Admin Panel</h2>
                <p className="text-xs text-gray-400">Portfolio Management</p>
              </div>
            </div>
            {isMobile && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
              >
                <HiX className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-700">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search navigation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredNavigationItems.map((item, index) => (
              <div key={index} className="space-y-1">
                {item.path ? (
                  // Single navigation item
                  <Link
                    to={item.path}
                    onClick={() => isMobile && onClose()}
                    className={`
                      flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group
                      ${isActive(item.path)
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`
                        p-1.5 rounded-md transition-colors
                        ${isActive(item.path)
                          ? 'bg-white/20'
                          : 'bg-gray-700 group-hover:bg-gray-600'
                        }
                      `}>
                        {item.icon}
                      </div>
                      <span className="font-medium text-sm">{item.title}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ) : (
                  // Expandable section
                  <div>
                    <button
                      onClick={() => toggleSection(item.section)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group
                        ${isSectionActive(item.items)
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`
                          p-1.5 rounded-md transition-colors
                          ${isSectionActive(item.items)
                            ? 'bg-white/20'
                            : 'bg-gray-700 group-hover:bg-gray-600'
                          }
                        `}>
                          {item.icon}
                        </div>
                        <span className="font-medium text-sm">{item.title}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                        <HiChevronDown 
                          className={`w-4 h-4 transition-transform duration-200 ${
                            expandedSections[item.section] ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </button>
                    
                    {expandedSections[item.section] && (
                      <div className="mt-2 ml-4 space-y-1">
                        {item.items.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            to={subItem.path}
                            onClick={() => isMobile && onClose()}
                            className={`
                              flex items-center justify-between px-3 py-2 rounded-md transition-all duration-200 group
                              ${isActive(subItem.path)
                                ? 'bg-blue-600/20 text-blue-300 border-l-2 border-blue-500'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                              }
                            `}
                          >
                            <div className="flex items-center space-x-2">
                              <div className={`
                                p-1 rounded-md transition-colors
                                ${isActive(subItem.path)
                                  ? 'bg-blue-600/30'
                                  : 'bg-gray-700 group-hover:bg-gray-600'
                                }
                              `}>
                                {subItem.icon}
                              </div>
                              <div>
                                <span className="text-sm font-medium">{subItem.title}</span>
                                <p className="text-xs text-gray-500 group-hover:text-gray-400">
                                  {subItem.description}
                                </p>
                              </div>
                            </div>
                            {subItem.badge && (
                              <span className="px-1.5 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                                {subItem.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700 bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <HiCheckCircle className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white">System Status</p>
                  <p className="text-xs text-green-400">All systems operational</p>
                </div>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;