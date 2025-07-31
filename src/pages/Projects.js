import React, { useState } from 'react';
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

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const projects = [
    {
      id: 1,
      title: 'Personal Portfolio',
      description: 'Modern portfolio website built with React, Tailwind CSS & Framer Motion. Features dark mode, responsive design, and smooth animations.',
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop&crop=center',
      link: '/projects/personal-portfolio',
      github: 'https://github.com/yourusername/portfolio',
      live: 'https://yourportfolio.com',
      technologies: ['React', 'Tailwind CSS', 'Framer Motion', 'JavaScript'],
      category: 'web',
      featured: true,
      year: '2024'
    },
    {
      id: 2,
      title: 'Agani Jyot Gas',
      description: 'Full‑stack gas agency management system with Django backend & React frontend. Includes inventory management, customer tracking, and payment processing.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop&crop=center',
      link: '/projects/agani-jyot-gas',
      github: 'https://github.com/yourusername/gas-system',
      live: 'https://aganijyotgas.com',
      technologies: ['Django', 'React', 'PostgreSQL', 'Docker'],
      category: 'fullstack',
      featured: true,
      year: '2023'
    },
    {
      id: 3,
      title: 'Task Master',
      description: 'Advanced to‑do application with Firebase authentication, dark mode, reminders, and real-time synchronization across devices.',
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&fit=crop&crop=center',
      link: '/projects/task-master',
      github: 'https://github.com/yourusername/task-master',
      live: 'https://taskmaster.app',
      technologies: ['React', 'Firebase', 'Tailwind CSS', 'JavaScript'],
      category: 'web',
      featured: false,
      year: '2023'
    },
    {
      id: 4,
      title: 'E‑Commerce Dashboard',
      description: 'Admin dashboard with analytics, payment integration, inventory management, and customer relationship tools.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=center',
      link: '/projects/ecommerce-dashboard',
      github: 'https://github.com/yourusername/ecommerce-dashboard',
      live: 'https://dashboard.example.com',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      category: 'fullstack',
      featured: true,
      year: '2023'
    },
    {
      id: 5,
      title: 'Blog Platform',
      description: 'Modern blog platform with markdown editor, comments system, SEO optimization, and content management.',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop&crop=center',
      link: '/projects/blog-platform',
      github: 'https://github.com/yourusername/blog-platform',
      live: 'https://blog.example.com',
      technologies: ['Next.js', 'MongoDB', 'Tailwind CSS', 'Vercel'],
      category: 'web',
      featured: false,
      year: '2023'
    },
    {
      id: 6,
      title: 'AI Chatbot',
      description: 'Conversational AI chatbot powered by OpenAI API with natural language processing and context awareness.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&crop=center',
      link: '/projects/ai-chatbot',
      github: 'https://github.com/yourusername/ai-chatbot',
      live: 'https://chatbot.example.com',
      technologies: ['Python', 'OpenAI API', 'React', 'FastAPI'],
      category: 'ai',
      featured: true,
      year: '2024'
    }
  ];

  const filters = [
    { key: 'all', label: 'All Projects' },
    { key: 'web', label: 'Web Development' },
    { key: 'fullstack', label: 'Full Stack' },
    { key: 'ai', label: 'AI & ML' },
    { key: 'mobile', label: 'Mobile Apps' }
  ];

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

  return (
    <PageLayout
      title="Projects"
      description="Explore my portfolio of web development projects, including full-stack applications, AI integrations, and modern web solutions."
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
        My Projects
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              A collection of projects that showcase my skills in web development, 
              full-stack applications, and innovative solutions.
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
              {filters.map((filter) => (
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
              Project Statistics
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Overview of my development work and achievements
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: projects.length, label: 'Total Projects', icon: FaCode },
              { number: projects.filter(p => p.featured).length, label: 'Featured Projects', icon: FaReact },
              { number: projects.filter(p => p.category === 'fullstack').length, label: 'Full Stack Apps', icon: FaDatabase },
              { number: projects.filter(p => p.category === 'ai').length, label: 'AI Projects', icon: SiOpenai }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-lightAccent/10 dark:bg-darkAccent/10 rounded-lg flex items-center justify-center">
                      <stat.icon className="text-lightAccent dark:text-darkAccent text-xl" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-lightAccent dark:text-darkAccent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </Card>
              </motion.div>
            ))}
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
                Have a Project in Mind?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                I'm always excited to work on new and challenging projects. 
                Let's discuss how we can bring your ideas to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button as={Link} to="/contact" size="lg">
                  Start a Project
                </Button>
                <Button variant="outline" as={Link} to="/about" size="lg">
                  Learn More About Me
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
