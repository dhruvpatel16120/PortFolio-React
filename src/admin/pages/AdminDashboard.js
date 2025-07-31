import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
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
  HiInformationCircle
} from 'react-icons/hi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalContacts: 0,
    newContacts: 0,
    totalProjects: 0,
    totalUsers: 0,
    recentActivity: [] // Added
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData(); // Renamed
  }, []);

  const fetchDashboardData = async () => { // Renamed
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

      // Fetch recent activity logs
      const activityQuery = query(
        collection(db, 'admin_activity_logs'),
        orderBy('timestamp', 'desc'),
        limit(5)
      );
      const activitySnapshot = await getDocs(activityQuery);
      const recentActivity = activitySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }));

      setStats({
        totalContacts,
        newContacts,
        totalProjects: 0,
        totalUsers: 0,
        recentActivity // Added
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error); // Updated message
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, link, trend }) => (
    <Link to={link} className="block">
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 ${color} hover:shadow-lg transition-shadow`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            {trend && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                +{trend}% from last month
              </p>
            )}
          </div>
          <div className="text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        </div>
      </div>
    </Link>
  );

  const QuickAction = ({ title, description, icon, link, color, badge }) => (
    <Link to={link} className="block">
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 ${color} hover:shadow-lg transition-shadow`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-gray-400 dark:text-gray-500">
              {icon}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{description}</p>
            </div>
          </div>
          {badge && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {badge}
            </span>
          )}
        </div>
      </div>
    </Link>
  );

  const ActivityItem = ({ activity }) => {
    const getActivityIcon = (type) => {
      switch (type) {
        case 'login':
          return <HiCheckCircle className="w-4 h-4 text-green-500" />;
        case 'logout':
          return <HiExclamation className="w-4 h-4 text-yellow-500" />;
        case 'error':
          return <HiExclamation className="w-4 h-4 text-red-500" />;
        default:
          return <HiInformationCircle className="w-4 h-4 text-blue-500" />;
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

    return (
      <div className="flex items-center space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <div className="flex-shrink-0">
          {getActivityIcon(activity.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatTime(activity.timestamp)}
          </p>
        </div>
      </div>
    );
  };

  const PageSummary = ({ title, description, stats, icon, color, link }) => (
    <Link to={link} className="block">
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow`}>
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg ${color}`}>
            {icon}
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index}>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="p-6 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's an overview of your portfolio management system.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Contacts"
            value={stats.totalContacts}
            icon={<HiMail className="w-6 h-6 text-blue-500" />}
            color="border-l-blue-500"
            link="/admin/contacts"
            trend={12}
          />
          <StatCard
            title="New Contacts"
            value={stats.newContacts}
            icon={<HiUserGroup className="w-6 h-6 text-green-500" />}
            color="border-l-green-500"
            link="/admin/contacts"
            trend={8}
          />
          <StatCard
            title="Total Projects"
            value={stats.totalProjects}
            icon={<HiDocumentText className="w-6 h-6 text-purple-500" />}
            color="border-l-purple-500"
            link="/admin/projects"
            trend={15}
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<HiUserGroup className="w-6 h-6 text-orange-500" />}
            color="border-l-orange-500"
            link="/admin/users"
            trend={5}
          />
        </div>

        {/* Page Summaries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PageSummary
            title="Content Management"
            description="Manage portfolio content, projects, and sections"
            stats={[
              { label: 'Projects', value: '0' },
              { label: 'Sections', value: '4' }
            ]}
            icon={<HiDocumentText className="w-5 h-5 text-blue-600" />}
            color="bg-blue-100 dark:bg-blue-900"
            link="/admin/content"
          />
          <PageSummary
            title="Contact Management"
            description="View and respond to contact form submissions"
            stats={[
              { label: 'Total', value: stats.totalContacts.toString() },
              { label: 'New', value: stats.newContacts.toString() }
            ]}
            icon={<HiMail className="w-5 h-5 text-green-600" />}
            color="bg-green-100 dark:bg-green-900"
            link="/admin/contacts"
          />
          <PageSummary
            title="Analytics & Reports"
            description="Monitor performance and visitor statistics"
            stats={[
              { label: 'Reports', value: '3' },
              { label: 'Metrics', value: '12' }
            ]}
            icon={<HiChartBar className="w-5 h-5 text-purple-600" />}
            color="bg-purple-100 dark:bg-purple-900"
            link="/admin/analytics"
          />
          <PageSummary
            title="Security & Settings"
            description="Manage security settings and system configuration"
            stats={[
              { label: 'Settings', value: '5' },
              { label: 'Security', value: '3' }
            ]}
            icon={<HiShieldCheck className="w-5 h-5 text-orange-600" />}
            color="bg-orange-100 dark:bg-orange-900"
            link="/admin/settings"
          />
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <QuickAction
                title="Manage Contacts"
                description="View and respond to contact form submissions"
                icon={<HiMail className="w-6 h-6 text-blue-500" />}
                link="/admin/contacts"
                color="border-l-blue-500"
                badge={stats.newContacts > 0 ? `${stats.newContacts} new` : null}
              />
              <QuickAction
                title="Add New Project"
                description="Create and publish new portfolio projects"
                icon={<HiPlus className="w-6 h-6 text-green-500" />}
                link="/admin/projects"
                color="border-l-green-500"
              />
              <QuickAction
                title="View Analytics"
                description="Check performance metrics and visitor statistics"
                icon={<HiChartBar className="w-6 h-6 text-purple-500" />}
                link="/admin/analytics"
                color="border-l-purple-500"
              />
              <QuickAction
                title="Security Settings"
                description="Manage account security and system settings"
                icon={<HiShieldCheck className="w-6 h-6 text-orange-500" />}
                link="/admin/settings/security"
                color="border-l-orange-500"
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
              {stats.recentActivity.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {stats.recentActivity.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  <HiClock className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p>No recent activity</p>
                  <p className="text-sm">Activity will appear here as you use the admin panel</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 