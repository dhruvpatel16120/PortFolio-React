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
  HiExternalLink,
  HiChartBar,
  HiClock,
  HiFire
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
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Project Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Insights and statistics about your projects
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
            <HiChartBar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-sm focus:shadow-md"
          >
            <option value="all">All Time</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last Year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Total Projects</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{analytics.totalProjects}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Portfolio items</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <HiCode className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-1">Featured Projects</p>
              <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">{analytics.featuredProjects}</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Highlighted work</p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
              <HiStar className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Total Views</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">{analytics.totalViews.toLocaleString()}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">Page visits</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <HiEye className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">Avg. Views</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{analytics.averageViews.toLocaleString()}</p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Per project</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
              <HiTrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Technologies */}
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
              <HiCode className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Top Technologies</h3>
          </div>
          <div className="space-y-4">
            {analytics.topTechnologies.map((tech, index) => {
              const Icon = getTechnologyIcon(tech.tech);
              const percentage = ((tech.count / analytics.totalProjects) * 100).toFixed(1);
              
              return (
                <div key={tech.tech} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{tech.tech}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      {tech.count} projects
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {percentage}% of projects
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
              <HiChartBar className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Category Distribution</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(analytics.categoryDistribution).map(([category, count]) => {
              const percentage = ((count / analytics.totalProjects) * 100).toFixed(1);
              
              return (
                <div key={category} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${getCategoryColor(category)}`}></div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {category}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      {count} projects
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${getCategoryColor(category)}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {percentage}% of portfolio
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Popular Projects */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
            <HiFire className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Popular Projects</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {analytics.popularProjects.map((project) => (
            <div key={project.id} className="group bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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
                <div className="flex items-center gap-1">
                  <HiCalendar className="w-3 h-3" />
                  <span>{formatDate(project.createdAt)}</span>
                </div>
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
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
            <HiClock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Projects</h3>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Project</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Technologies</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Created</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {analytics.recentProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white text-sm">{project.title}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                            {project.description}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(project.category)} text-white`}>
                          {project.category}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {project.technologies?.slice(0, 2).map((tech, index) => (
                            <span key={index} className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded border border-blue-200 dark:border-blue-800">
                              {tech}
                            </span>
                          ))}
                          {project.technologies?.length > 2 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              +{project.technologies.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(project.createdAt)}
                      </td>
                      <td className="py-4 px-4">
                        {project.featured ? (
                          <span className="inline-flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 rounded">
                            <HiStar className="w-3 h-3" />
                            Featured
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            Active
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalytics; 