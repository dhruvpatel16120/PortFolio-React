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
  HiMail,
  HiFolder,
  HiPhotograph,
  HiPresentationChartLine,
  HiUserGroup,
  HiSearch,
  HiViewBoards,
  HiClock,
  HiStar,
  HiTrendingUp,
  HiKey,
  HiDocumentDuplicate,
  HiGlobeAlt,
  HiChatAlt2
} from 'react-icons/hi';

const AdminSidebar = ({ isOpen, onClose }) => {
  const [expandedSections, setExpandedSections] = useState({
    dashboard: true,
    content: true,
    contact: true,
    analytics: false,
    management: false,
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
      title: 'Content Management',
      section: 'content',
      icon: <HiDocumentText className="w-5 h-5" />,
      items: [
        { 
          title: 'Portfolio Content', 
          path: '/admin/content',
          icon: <HiDocumentDuplicate className="w-4 h-4" />,
          description: 'Manage portfolio sections'
        },
        { 
          title: 'Projects', 
          path: '/admin/projects',
          icon: <HiFolder className="w-4 h-4" />,
          description: 'Add and edit projects'
        },
        { 
          title: 'Skills & Experience', 
          path: '/admin/skills',
          icon: <HiStar className="w-4 h-4" />,
          description: 'Update skills and experience'
        },
        { 
          title: 'About Section', 
          path: '/admin/about',
          icon: <HiUserGroup className="w-4 h-4" />,
          description: 'Edit about page content'
        },
        { 
          title: 'Media Gallery', 
          path: '/admin/media',
          icon: <HiPhotograph className="w-4 h-4" />,
          description: 'Manage images and files'
        }
      ]
    },
    {
      title: 'Contact Management',
      section: 'contact',
      icon: <HiMail className="w-5 h-5" />,
      badge: '3',
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
        { 
          title: 'Contact Reply', 
          path: '/admin/contact/reply',
          icon: <HiMail className="w-4 h-4" />,
          description: 'Reply to contact messages'
        }
      ]
    },
    {
      title: 'Analytics & Reports',
      section: 'analytics',
      icon: <HiChartBar className="w-5 h-5" />,
      items: [
        { 
          title: 'Dashboard Analytics', 
          path: '/admin/analytics',
          icon: <HiPresentationChartLine className="w-4 h-4" />,
          description: 'Overview of site metrics'
        },
        { 
          title: 'Visitor Statistics', 
          path: '/admin/analytics/visitors',
          icon: <HiViewBoards className="w-4 h-4" />,
          description: 'Detailed visitor data'
        },
        { 
          title: 'Performance Reports', 
          path: '/admin/analytics/performance',
          icon: <HiTrendingUp className="w-4 h-4" />,
          description: 'Site performance metrics'
        },
        { 
          title: 'Activity Logs', 
          path: '/admin/analytics/activity',
          icon: <HiClock className="w-4 h-4" />,
          description: 'System activity tracking'
        }
      ]
    },
    {
      title: 'User Management',
      section: 'management',
      icon: <HiUsers className="w-5 h-5" />,
      items: [
        { 
          title: 'User Accounts', 
          path: '/admin/users',
          icon: <HiUserGroup className="w-4 h-4" />,
          description: 'Manage user accounts'
        },
        { 
          title: 'Permissions', 
          path: '/admin/users/permissions',
          icon: <HiShieldCheck className="w-4 h-4" />,
          description: 'User role management'
        },
        { 
          title: 'Activity Logs', 
          path: '/admin/users/activity',
          icon: <HiClock className="w-4 h-4" />,
          description: 'User activity tracking'
        }
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
          title: 'Profile Settings', 
          path: '/admin/settings/profile',
          icon: <HiUserGroup className="w-4 h-4" />,
          description: 'Admin profile management'
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
         fixed top-0 left-0 h-screen bg-gray-900 border-r border-gray-700
         shadow-2xl transform transition-all duration-300 ease-in-out z-50
         ${isOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full lg:translate-x-0 lg:w-0'}
         lg:sticky lg:top-0 sidebar
       `}>
                 <div className="flex flex-col h-full overflow-hidden">
           {/* Header */}
           <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800">
             <div className="flex items-center space-x-3">
               <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                 <HiShieldCheck className="w-6 h-6 text-white" />
               </div>
               {isOpen && (
                 <div>
                   <h2 className="text-lg font-bold text-white">Admin Panel</h2>
                   <p className="text-xs text-gray-400">Portfolio Management</p>
                 </div>
               )}
             </div>
             <button
               onClick={onClose}
               className="lg:hidden p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
             >
               <HiX className="w-5 h-5" />
             </button>
           </div>

          {/* Search */}
          {isOpen && (
            <div className="p-4 border-b border-gray-700">
              <div className="relative">
                <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search navigation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

                    {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredNavigationItems.map((item, index) => (
              <div key={index} className="space-y-1">
                {item.path ? (
                  // Single navigation item
                  <Link
                    to={item.path}
                    className={`
                      flex items-center justify-center lg:justify-start px-4 py-3 rounded-xl transition-all duration-200 group
                      ${isActive(item.path)
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }
                    `}
                    title={isOpen ? undefined : item.title}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`
                        p-2 rounded-lg transition-colors
                        ${isActive(item.path)
                          ? 'bg-white/20'
                          : 'bg-gray-700 group-hover:bg-gray-600'
                        }
                      `}>
                        {item.icon}
                      </div>
                      {isOpen && <span className="font-medium">{item.title}</span>}
                    </div>
                    {isOpen && item.badge && (
                      <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full">
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
                        w-full flex items-center justify-center lg:justify-start px-4 py-3 rounded-xl transition-all duration-200 group
                        ${isSectionActive(item.items)
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }
                      `}
                      title={isOpen ? undefined : item.title}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`
                          p-2 rounded-lg transition-colors
                          ${isSectionActive(item.items)
                            ? 'bg-white/20'
                            : 'bg-gray-700 group-hover:bg-gray-600'
                          }
                        `}>
                          {item.icon}
                        </div>
                        {isOpen && <span className="font-medium">{item.title}</span>}
                      </div>
                      {isOpen && (
                        <div className="flex items-center space-x-2">
                          {item.badge && (
                            <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full">
                              {item.badge}
                            </span>
                          )}
                          <HiChevronDown 
                            className={`w-4 h-4 transition-transform duration-200 ${
                              expandedSections[item.section] ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      )}
                    </button>
                    
                    {isOpen && expandedSections[item.section] && (
                      <div className="mt-3 ml-4 space-y-2">
                        {item.items.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            to={subItem.path}
                            className={`
                              flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group
                              ${isActive(subItem.path)
                                ? 'bg-blue-600/20 text-blue-300 border-l-2 border-blue-500'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                              }
                            `}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`
                                p-1.5 rounded-md transition-colors
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
                              <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
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
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <HiCheckCircle className="w-4 h-4 text-white" />
                </div>
                {isOpen && (
                  <div>
                    <p className="text-sm font-medium text-white">System Status</p>
                    <p className="text-xs text-green-400">All systems operational</p>
                  </div>
                )}
              </div>
              {isOpen && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;