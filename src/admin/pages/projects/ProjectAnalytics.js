import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { 
  HiEye, 
  HiStar, 
  HiCode, 
  HiCalendar,
  HiTrendingUp,
  HiTrendingDown,
  HiExternalLink
} from 'react-icons/hi';
import { 
  FaReact, 
  FaPython, 
  FaHtml5, 
  FaCss3Alt, 
  FaGithub, 
  FaDatabase ,
  FaCode
} from 'react-icons/fa';
import { 
  SiDjango, 
  SiTailwindcss, 
  SiJavascript, 
  SiFirebase, 
  SiOpenai, 
  SiVercel, 
  SiNetlify, 
  SiMongodb 
} from 'react-icons/si';

const ProjectAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalProjects: 0,
    featuredProjects: 0,
    totalViews: 0,
    averageViews: 0,
    topTechnologies: [],
    categoryDistribution: {},
    recentProjects: [],
    popularProjects: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch all projects
      const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const projectsSnapshot = await getDocs(projectsQuery);
      const projects = projectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));

      // Calculate analytics
      const totalProjects = projects.length;
      const featuredProjects = projects.filter(p => p.featured).length;
      
      // Calculate technology usage
      const techCount = {};
      projects.forEach(project => {
        project.technologies?.forEach(tech => {
          techCount[tech] = (techCount[tech] || 0) + 1;
        });
      });
      
      const topTechnologies = Object.entries(techCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 8)
        .map(([tech, count]) => ({ tech, count }));

      // Calculate category distribution
      const categoryCount = {};
      projects.forEach(project => {
        categoryCount[project.category] = (categoryCount[project.category] || 0) + 1;
      });

      // Get recent projects (last 5)
      const recentProjects = projects.slice(0, 5);

      // Sort by featured status and creation date for popular projects
      const popularProjects = projects
        .sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
        .slice(0, 5);

      setAnalytics({
        totalProjects,
        featuredProjects,
        totalViews: 0, // Would be calculated from view tracking
        averageViews: 0, // Would be calculated from view tracking
        topTechnologies,
        categoryDistribution: categoryCount,
        recentProjects,
        popularProjects
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTechnologyIcon = (tech) => {
    const iconMap = {
      'React': FaReact,
      'JavaScript': SiJavascript,
      'Python': FaPython,
      'Django': SiDjango,
      'HTML5': FaHtml5,
      'CSS3': FaCss3Alt,
      'Tailwind CSS': SiTailwindcss,
      'Firebase': SiFirebase,
      'MongoDB': SiMongodb,
      'Node.js': FaCode,
      'OpenAI API': SiOpenai,
      'Vercel': SiVercel,
      'Netlify': SiNetlify
    };
    return iconMap[tech] || FaCode;
  };

  const getCategoryColor = (category) => {
    const colors = {
      web: 'bg-blue-500',
      fullstack: 'bg-green-500',
      ai: 'bg-purple-500',
      mobile: 'bg-orange-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Project Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Insights and statistics about your projects</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="all">All Time</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
          <option value="365">Last Year</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalProjects}</p>
            </div>
            <div className="text-blue-600 dark:text-blue-400">
              <HiCode className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Featured Projects</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.featuredProjects}</p>
            </div>
            <div className="text-yellow-600 dark:text-yellow-400">
              <HiStar className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalViews.toLocaleString()}</p>
            </div>
            <div className="text-green-600 dark:text-green-400">
              <HiEye className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Views</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.averageViews.toLocaleString()}</p>
            </div>
            <div className="text-purple-600 dark:text-purple-400">
              <HiTrendingUp className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Technologies */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Technologies</h3>
          <div className="space-y-3">
            {analytics.topTechnologies.map((tech, index) => {
              const Icon = getTechnologyIcon(tech.tech);
              const percentage = ((tech.count / analytics.totalProjects) * 100).toFixed(1);
              
              return (
                <div key={tech.tech} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{tech.tech}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                      {tech.count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Category Distribution</h3>
          <div className="space-y-3">
            {Object.entries(analytics.categoryDistribution).map(([category, count]) => {
              const percentage = ((count / analytics.totalProjects) * 100).toFixed(1);
              
              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)}`}></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getCategoryColor(category)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Popular Projects */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Projects</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {analytics.popularProjects.map((project) => (
            <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white truncate">
                  {project.title}
                </h4>
                {project.featured && (
                  <HiStar className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {project.description}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{formatDate(project.createdAt)}</span>
                <div className="flex gap-1">
                  {project.github && (
                    <FaGithub className="w-3 h-3" />
                  )}
                  {project.live && (
                    <HiExternalLink className="w-3 h-3" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Projects</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-400">Project</th>
                <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-400">Category</th>
                <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-400">Technologies</th>
                <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-400">Created</th>
                <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentProjects.map((project) => (
                <tr key={project.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{project.title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                        {project.description}
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(project.category)} text-white`}>
                      {project.category}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies?.slice(0, 2).map((tech, index) => (
                        <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                      {project.technologies?.length > 2 && (
                        <span className="text-xs text-gray-500">+{project.technologies.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(project.createdAt)}
                  </td>
                  <td className="py-3">
                    {project.featured ? (
                      <span className="inline-flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
                        <HiStar className="w-3 h-3" />
                        Featured
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500 dark:text-gray-400">Active</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalytics; 