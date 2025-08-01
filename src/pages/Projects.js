import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaReact, FaPython, FaHtml5, FaCss3Alt, FaGithub, 
  FaExternalLinkAlt, FaCode, FaDatabase
} from 'react-icons/fa';
import { 
  SiDjango, SiTailwindcss, SiJavascript, SiFirebase, 
  SiOpenai, SiVercel, SiNetlify, SiMongodb
} from 'react-icons/si';

// Components
import PageLayout from '../components/layout/PageLayout';
import Section from '../components/layout/Section';
import Container from '../components/layout/Container';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Services
import projectService from '../services/projectService';

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState([]);
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsData, contentData] = await Promise.all([
        projectService.getAllProjects(),
        projectService.getPageContent()
      ]);
      
      setProjects(projectsData);
      setPageContent(contentData);
    } catch (error) {
      console.error('Error fetching projects data:', error);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error Loading Projects</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  // Use page content or fallback to defaults
  const content = pageContent || {
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

  return (
    <PageLayout
      title="Projects"
      description={content.hero.description}
      keywords={['projects', 'portfolio', 'web development', 'React', 'Django', 'full-stack']}
    >
      {/* Hero Section */}
      <Section variant="centered">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
            className="text-center mb-12"
      >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-lightAccent dark:text-darkAccent">
              {content.hero.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {content.hero.subtitle}
            </p>
          </motion.div>
        </Container>
      </Section>

      {/* Filter Section */}
      <Section>
        <Container>
      <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex flex-wrap justify-center gap-4">
              {content.filters.map((filter) => (
                <Button
                  key={filter.key}
                  variant={activeFilter === filter.key ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter(filter.key)}
                  className="transition-all duration-200"
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Projects Grid */}
      <Section>
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card className="h-full overflow-hidden">
                  {/* Project Image */}
                  <div className="relative overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {project.featured && (
                      <div className="absolute top-4 left-4 bg-lightAccent dark:bg-darkAccent text-darkText dark:text-lightText px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-colors"
                        >
                          <FaGithub className="text-white text-xl" />
                        </a>
                      )}
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-colors"
                        >
                          <FaExternalLinkAlt className="text-white text-xl" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-lightAccent dark:text-darkAccent group-hover:text-lightAccent/80 dark:group-hover:text-darkAccent/80 transition-colors">
                        {project.title}
                      </h3>
                      <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {project.year}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => {
                          const Icon = getTechnologyIcon(tech);
                          return (
                            <span
                              key={tech}
                              className="flex items-center gap-1 bg-lightAccent/10 dark:bg-darkAccent/10 text-lightAccent dark:text-darkAccent px-2 py-1 rounded text-xs font-medium"
                            >
                              <Icon className="text-xs" />
                              {tech}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        as={Link}
                        to={project.link}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        View Details
                      </Button>
                      {project.live && (
                        <Button
                          as="a"
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="sm"
                          className="flex-1"
                        >
                          Live Demo
                        </Button>
                      )}
                    </div>
            </div>
                </Card>
          </motion.div>
        ))}
      </motion.div>

          {/* No Projects Message */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2 text-lightAccent dark:text-darkAccent">
                No projects found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No projects match the selected filter. Try selecting a different category.
              </p>
            </motion.div>
          )}
        </Container>
      </Section>

      {/* Stats Section */}
      <Section className="bg-white/5 dark:bg-gray-900/20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-lightAccent dark:text-darkAccent">
              {content.stats.title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {content.stats.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {content.stats.items.map((statItem, index) => {
              const getStatNumber = () => {
                switch (statItem.label) {
                  case 'Total Projects':
                    return projects.length;
                  case 'Featured Projects':
                    return projects.filter(p => p.featured).length;
                  case 'Full Stack Apps':
                    return projects.filter(p => p.category === 'fullstack').length;
                  case 'AI Projects':
                    return projects.filter(p => p.category === 'ai').length;
                  default:
                    return 0;
                }
              };

              const getStatIcon = () => {
                const iconMap = {
                  'FaCode': FaCode,
                  'FaReact': FaReact,
                  'FaDatabase': FaDatabase,
                  'SiOpenai': SiOpenai
                };
                return iconMap[statItem.icon] || FaCode;
              };

              const Icon = getStatIcon();
              const number = getStatNumber();

              return (
                              <motion.div
                  key={statItem.label}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 bg-lightAccent/10 dark:bg-darkAccent/10 rounded-lg flex items-center justify-center">
                        <Icon className="text-lightAccent dark:text-darkAccent text-xl" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-lightAccent dark:text-darkAccent mb-2">
                      {number}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {statItem.label}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card variant="elevated" className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-lightAccent dark:text-darkAccent">
                {content.cta.title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                {content.cta.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button as={Link} to="/contact" size="lg">
                  {content.cta.primaryButton}
                </Button>
                <Button variant="outline" as={Link} to="/about" size="lg">
                  {content.cta.secondaryButton}
                </Button>
              </div>
            </Card>
          </motion.div>
        </Container>
      </Section>
    </PageLayout>
  );
};

export default Projects;
