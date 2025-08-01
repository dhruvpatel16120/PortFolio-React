import { collection, getDocs, query, orderBy, where, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

class ProjectService {
  async getAllProjects() {
    try {
      const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(projectsQuery);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  async getProjectsByCategory(category) {
    try {
      const projectsQuery = query(
        collection(db, 'projects'),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(projectsQuery);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));
    } catch (error) {
      console.error('Error fetching projects by category:', error);
      throw error;
    }
  }

  async getFeaturedProjects() {
    try {
      const projectsQuery = query(
        collection(db, 'projects'),
        where('featured', '==', true),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(projectsQuery);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));
    } catch (error) {
      console.error('Error fetching featured projects:', error);
      throw error;
    }
  }

  async getProjectById(projectId) {
    try {
      const projectDoc = await getDoc(doc(db, 'projects', projectId));
      
      if (projectDoc.exists()) {
        return {
          id: projectDoc.id,
          ...projectDoc.data(),
          createdAt: projectDoc.data().createdAt?.toDate(),
          updatedAt: projectDoc.data().updatedAt?.toDate()
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching project by ID:', error);
      throw error;
    }
  }

  async getProjectStatistics() {
    try {
      const projects = await this.getAllProjects();
      
      const stats = {
        totalProjects: projects.length,
        featuredProjects: projects.filter(p => p.featured).length,
        totalViews: 0, // Would be calculated from view tracking
        averageViews: 0, // Would be calculated from view tracking
        categoryDistribution: {},
        topTechnologies: []
      };

      // Calculate category distribution
      projects.forEach(project => {
        stats.categoryDistribution[project.category] = 
          (stats.categoryDistribution[project.category] || 0) + 1;
      });

      // Calculate technology usage
      const techCount = {};
      projects.forEach(project => {
        project.technologies?.forEach(tech => {
          techCount[tech] = (techCount[tech] || 0) + 1;
        });
      });
      
      stats.topTechnologies = Object.entries(techCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 8)
        .map(([tech, count]) => ({ tech, count }));

      return stats;
    } catch (error) {
      console.error('Error calculating project statistics:', error);
      throw error;
    }
  }

  async getPageContent() {
    try {
      const contentDoc = await getDoc(doc(db, 'content', 'projects'));
      
      if (contentDoc.exists()) {
        return contentDoc.data();
      }
      
      // Return default content if none exists
      return {
        hero: {
          title: 'My Projects',
          subtitle: 'A collection of projects that showcase my skills in web development, full-stack applications, and innovative solutions.',
          description: 'Explore my portfolio of web development projects, including full-stack applications, AI integrations, and modern web solutions.'
        },
        filters: [
          { key: 'all', label: 'All Projects' },
          { key: 'web', label: 'Web Development' },
          { key: 'fullstack', label: 'Full Stack' },
          { key: 'ai', label: 'AI & ML' },
          { key: 'mobile', label: 'Mobile Apps' }
        ],
        stats: {
          title: 'Project Statistics',
          subtitle: 'Overview of my development work and achievements',
          items: [
            { label: 'Total Projects', icon: 'FaCode' },
            { label: 'Featured Projects', icon: 'FaReact' },
            { label: 'Full Stack Apps', icon: 'FaDatabase' },
            { label: 'AI Projects', icon: 'SiOpenai' }
          ]
        },
        cta: {
          title: 'Have a Project in Mind?',
          subtitle: "I'm always excited to work on new and challenging projects. Let's discuss how we can bring your ideas to life.",
          primaryButton: 'Start a Project',
          secondaryButton: 'Learn More About Me'
        }
      };
    } catch (error) {
      console.error('Error fetching page content:', error);
      throw error;
    }
  }
}

export default new ProjectService(); 