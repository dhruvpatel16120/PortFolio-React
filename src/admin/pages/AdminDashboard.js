import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
  HiMail,
  HiUserGroup,
  HiDocumentText,
  HiChartBar,
  HiShieldCheck,
  HiPlus,
  HiClock,
  HiCheckCircle,
  HiExclamation,
  HiInformationCircle,
  HiEye,
  HiTrendingUp,
  HiTrendingDown,
  HiCalendar,
  HiGlobe,
  HiCog,
  HiPhotograph,
  HiChatAlt2,
  HiStar,
  HiFire,
  HiLightningBolt,
  HiRefresh,
  HiDownload,
  HiUpload,
  HiTrash,
  HiPencil,
  HiViewBoards,
  HiCollection,
  HiTemplate,
  HiColorSwatch
} from 'react-icons/hi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalContacts: 0,
    newContacts: 0,
    totalProjects: 0,
    totalUsers: 0,
    recentActivity: [],
    systemHealth: 'excellent',
    lastBackup: new Date(),
    uptime: '99.9%'
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  useEffect(() => {
    fetchDashboardData();
    // Set up real-time listener for activity logs
    const unsubscribe = onSnapshot(
      query(collection(db, 'admin_activity_logs'), orderBy('timestamp', 'desc'), limit(10)),
      (snapshot) => {
        const activities = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate()
        }));
        setStats(prev => ({ ...prev, recentActivity: activities }));
      }
    );

    return () => unsubscribe();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch contact submissions
      const contactsQuery = query(collection(db, 'contact_submissions'));
      const contactsSnapshot = await getDocs(contactsQuery);
      const totalContacts = contactsSnapshot.size;
      
      // Calculate new contacts (submitted in last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const newContactsQuery = query(
        collection(db, 'contact_submissions'),
        where('timestamp', '>=', sevenDaysAgo)
      );
      const newContactsSnapshot = await getDocs(newContactsQuery);
      const newContacts = newContactsSnapshot.size;

      // Fetch projects count
      const projectsQuery = query(collection(db, 'projects'));
      const projectsSnapshot = await getDocs(projectsQuery);
      const totalProjects = projectsSnapshot.size;

      setStats(prev => ({
        ...prev,
        totalContacts,
        newContacts,
        totalProjects
      }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, link, trend, trendValue, subtitle }) => (
    <Link to={link} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 group-hover:scale-[1.02]">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center text-sm font-medium ${
              trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {trend === 'up' ? <HiTrendingUp className="w-4 h-4 mr-1" /> : <HiTrendingDown className="w-4 h-4 mr-1" />}
              {trendValue}%
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
      </div>
    </Link>
  );

  const QuickActionCard = ({ title, description, icon, link, color, badge, gradient }) => (
    <Link to={link} className="block group">
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 group-hover:scale-[1.02] ${gradient}`}>
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
            {icon}
          </div>
          {badge && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {badge}
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </Link>
  );

  const ActivityItem = ({ activity }) => {
    const getActivityIcon = (action) => {
      switch (action) {
        case 'LOGIN_SUCCESS':
          return <HiCheckCircle className="w-5 h-5 text-green-500" />;
        case 'LOGIN_FAILED':
          return <HiExclamation className="w-5 h-5 text-red-500" />;
        case 'PASSWORD_RESET_REQUESTED':
          return <HiShieldCheck className="w-5 h-5 text-blue-500" />;
        case 'PROJECT_CREATED':
          return <HiPlus className="w-5 h-5 text-purple-500" />;
        case 'PROJECT_UPDATED':
          return <HiPencil className="w-5 h-5 text-orange-500" />;
        case 'CONTACT_SUBMISSION':
          return <HiMail className="w-5 h-5 text-indigo-500" />;
        default:
          return <HiInformationCircle className="w-5 h-5 text-gray-500" />;
      }
    };

    const getActivityColor = (action) => {
      switch (action) {
        case 'LOGIN_SUCCESS':
          return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
        case 'LOGIN_FAILED':
          return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
        case 'PASSWORD_RESET_REQUESTED':
          return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
        case 'PROJECT_CREATED':
          return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
        case 'PROJECT_UPDATED':
          return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
        case 'CONTACT_SUBMISSION':
          return 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800';
        default:
          return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
      }
    };

    const formatTime = (timestamp) => {
      if (!timestamp) return 'Unknown time';
      const now = new Date();
      const diff = now - timestamp;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      return `${days}d ago`;
    };

    const getActivityMessage = (activity) => {
      switch (activity.action) {
        case 'LOGIN_SUCCESS':
          return `Successful login from ${activity.email || 'unknown'}`;
        case 'LOGIN_FAILED':
          return `Failed login attempt from ${activity.email || 'unknown'}`;
        case 'PASSWORD_RESET_REQUESTED':
          return `Password reset requested for ${activity.email || 'unknown'}`;
        case 'PROJECT_CREATED':
          return `New project "${activity.description || 'Project'}" created`;
        case 'PROJECT_UPDATED':
          return `Project "${activity.description || 'Project'}" updated`;
        case 'CONTACT_SUBMISSION':
          return `New contact submission from ${activity.email || 'visitor'}`;
        default:
          return activity.description || 'Activity logged';
      }
    };

    return (
      <div className={`p-4 rounded-lg border ${getActivityColor(activity.action)} hover:shadow-sm transition-all duration-200`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {getActivityIcon(activity.action)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {getActivityMessage(activity)}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatTime(activity.timestamp)}
              </p>
              {activity.ipAddress && (
                <>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    IP: {activity.ipAddress}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SystemHealthCard = () => (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
            <HiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Health</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">All systems operational</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.uptime}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Uptime</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600 dark:text-gray-400">Last Backup</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {stats.lastBackup.toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Status</p>
          <p className="font-medium text-green-600 dark:text-green-400 capitalize">{stats.systemHealth}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back! Here's an overview of your portfolio management system.
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button
              onClick={fetchDashboardData}
              className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <HiRefresh className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Contacts"
            value={stats.totalContacts}
            icon={<HiMail className="w-6 h-6 text-blue-600" />}
            color="text-blue-600"
            link="/admin/contact/submissions"
            trend="up"
            trendValue={12}
            subtitle="Contact form submissions"
          />
          <StatCard
            title="New Contacts"
            value={stats.newContacts}
            icon={<HiUserGroup className="w-6 h-6 text-green-600" />}
            color="text-green-600"
            link="/admin/contact/submissions"
            trend="up"
            trendValue={8}
            subtitle="This week"
          />
          <StatCard
            title="Total Projects"
            value={stats.totalProjects}
            icon={<HiDocumentText className="w-6 h-6 text-purple-600" />}
            color="text-purple-600"
            link="/admin/projects"
            trend="up"
            trendValue={15}
            subtitle="Portfolio projects"
          />
          <StatCard
            title="System Health"
            value={stats.uptime}
            icon={<HiShieldCheck className="w-6 h-6 text-emerald-600" />}
            color="text-emerald-600"
            link="/admin/settings"
            subtitle="Uptime percentage"
          />
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionCard
            title="Contact Management"
            description="View and respond to contact form submissions"
            icon={<HiMail className="w-6 h-6 text-blue-600" />}
            color="text-blue-600"
            link="/admin/contact/submissions"
            badge={stats.newContacts > 0 ? `${stats.newContacts} new` : null}
            gradient="hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/10 dark:hover:to-indigo-900/10"
          />
          <QuickActionCard
            title="Project Management"
            description="Create and manage portfolio projects"
            icon={<HiDocumentText className="w-6 h-6 text-purple-600" />}
            color="text-purple-600"
            link="/admin/projects"
            gradient="hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/10 dark:hover:to-pink-900/10"
          />
          <QuickActionCard
            title="Media Library"
            description="Upload and manage media files"
            icon={<HiPhotograph className="w-6 h-6 text-emerald-600" />}
            color="text-emerald-600"
            link="/admin/media"
            gradient="hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 dark:hover:from-emerald-900/10 dark:hover:to-teal-900/10"
          />
          <QuickActionCard
            title="Analytics & Reports"
            description="Monitor performance and visitor statistics"
            icon={<HiChartBar className="w-6 h-6 text-orange-600" />}
            color="text-orange-600"
            link="/admin/contact/analytics"
            gradient="hover:bg-gradient-to-br hover:from-orange-50 hover:to-red-50 dark:hover:from-orange-900/10 dark:hover:to-red-900/10"
          />
          <QuickActionCard
            title="Security Settings"
            description="Manage account security and system settings"
            icon={<HiShieldCheck className="w-6 h-6 text-red-600" />}
            color="text-red-600"
            link="/admin/settings/security"
            gradient="hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/10 dark:hover:to-pink-900/10"
          />
          <QuickActionCard
            title="Site Configuration"
            description="Configure site-wide settings and SEO"
            icon={<HiCog className="w-6 h-6 text-gray-600" />}
            color="text-gray-600"
            link="/admin/settings/site"
            gradient="hover:bg-gradient-to-br hover:from-gray-50 hover:to-slate-50 dark:hover:from-gray-900/10 dark:hover:to-slate-900/10"
          />
        </div>

        {/* System Health & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Health */}
          <div className="max-h-56 lg:col-span-1">
            <SystemHealthCard />
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                <Link 
                  to="/admin/activity" 
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-3 max-h-36 overflow-y-auto">
                {stats.recentActivity.length > 0 ? (
                  stats.recentActivity.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <HiClock className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No recent activity</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Activity will appear here as you use the admin panel
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 