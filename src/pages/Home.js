import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaPython, 
  FaLinux, FaArrowRight, FaStar, FaRocket, FaCode, FaChartLine, 
  FaPaintBrush, FaCloud , FaGithub
} from 'react-icons/fa';
import { 
  SiDjango, SiTailwindcss, SiJavascript, SiFirebase, SiOpenai, 
  SiGooglegemini, SiVercel , SiNetlify
} from 'react-icons/si';

// Components
import PageLayout from '../components/layout/PageLayout';
import Section from '../components/layout/Section';
import Container from '../components/layout/Container';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Home = () => {
  const technologies = [
    { icon: FaReact, name: 'React', color: 'text-blue-500' },
    { icon: SiJavascript, name: 'JavaScript', color: 'text-yellow-500' },
    { icon: FaHtml5, name: 'HTML5', color: 'text-orange-500' },
    { icon: FaCss3Alt, name: 'CSS3', color: 'text-blue-600' },
    { icon: SiTailwindcss, name: 'Tailwind', color: 'text-cyan-500' },
    { icon: FaPython, name: 'Python', color: 'text-blue-600' },
    { icon: SiDjango, name: 'Django', color: 'text-green-600' },
    { icon: SiFirebase, name: 'Firebase', color: 'text-yellow-600' },
    { icon: FaNodeJs, name: 'Node.js', color: 'text-green-500' },
    { icon: SiOpenai, name: 'OpenAI', color: 'text-green-700' },
    { icon: SiGooglegemini, name: 'Gemini', color: 'text-purple-500' },
    { icon: FaLinux, name: 'Linux', color: 'text-orange-600' },
    { icon: FaGithub, name: 'Github', color: 'text-black' },
    { icon: SiVercel, name: 'Vercel', color: 'text-gray-600' },
    { icon: SiNetlify, name: 'Netlify', color: 'text-blue-600' },
  ];

  const services = [
    {
      icon: FaCode,
      title: 'Full-Stack Development',
      description: 'Modern web applications with React, Django & Firebase',
      color: 'text-blue-500'
    },
    {
      icon: FaChartLine,
      title: 'SEO & Digital Marketing',
      description: 'Data-driven strategies to boost online presence',
      color: 'text-green-500'
    },
    {
      icon: FaPaintBrush,
      title: 'UI/UX Design',
      description: 'Beautiful, user-friendly interfaces that convert',
      color: 'text-purple-500'
    },
    {
      icon: FaCloud,
      title: 'Cloud Solutions',
      description: 'Scalable cloud infrastructure and deployment',
      color: 'text-orange-500'
    }
  ];

  return (
    <PageLayout
      title="Home"
      description="Dhruv Patel - Full-Stack Developer & Digital Marketing Expert. Building modern web applications and helping brands grow online."
      keywords={['full-stack developer', 'digital marketing', 'web development', 'React', 'Django', 'SEO']}
    >
      {/* Hero Section */}
      <Section variant="fullHeight" className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-20 blur-xl"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              x: [0, 30, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full opacity-20 blur-xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
              x: [0, -40, 0],
              y: [0, 40, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-40 left-1/4 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 blur-xl"
            animate={{ 
              scale: [1, 1.5, 1],
              rotate: [0, 360, 0],
              x: [0, 20, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <Container>
          <div className="relative z-10 text-center">
            {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <FaStar className="text-yellow-400 text-xl animate-pulse" />
              <span className="text-sm font-medium bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Full-Stack Developer & Digital Marketer
              </span>
              <FaStar className="text-yellow-400 text-xl animate-pulse" />
            </div>
          </motion.div>

            {/* Main Heading */}
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="bg-gradient-to-r from-lightText to-gray-600 dark:from-darkText dark:to-gray-400 bg-clip-text text-transparent">
              Welcome to
            </span>
            <br />
            <span className="bg-gradient-to-r from-lightAccent via-purple-500 to-pink-500 dark:from-darkAccent dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent animate-gradient-x">
              My Portfolio
            </span>
          </motion.h1>

            {/* Description */}
          <motion.p 
            className="text-xl md:text-2xl lg:text-3xl max-w-4xl mx-auto mb-8 leading-relaxed font-light"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            I'm a <span className="font-semibold text-lightAccent dark:text-darkAccent">software engineer</span> & 
            <span className="font-semibold text-lightAccent dark:text-darkAccent"> digital marketing expert</span>. 
            <br />
            I build modern web apps and help brands grow online.
          </motion.p>

            {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
              <Button as={Link} to="/projects" size="lg" className="group">
                View My Work
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" as={Link} to="/contact" size="lg">
                Get In Touch
              </Button>
          </motion.div>
          </div>
        </Container>
      </Section>

      {/* Technologies Section */}
      <Section>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-lightAccent dark:text-darkAccent">
              Technologies I Work With
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Modern tools and frameworks for building exceptional digital experiences
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
        viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6"
          >
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                variants={fadeInUp}
                whileHover={{ scale: 1.1, y: -5 }}
                className="text-center group"
              >
                <Card variant="glass" className="p-6 hover:bg-white/30 dark:hover:bg-gray-800/70 transition-all duration-300">
                  <tech.icon className={`text-4xl mb-3 mx-auto ${tech.color} group-hover:scale-110 transition-transform`} />
                  <h3 className="font-semibold text-sm">{tech.name}</h3>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>

      {/* Services Section */}
      <Section className="bg-white/5 dark:bg-gray-900/20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-lightAccent dark:text-darkAccent">
              What I Do
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Comprehensive solutions for modern digital needs
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card className="p-6 text-center h-full">
                  <service.icon className={`text-4xl mb-4 mx-auto ${service.color} group-hover:scale-110 transition-transform`} />
                  <h3 className="text-xl font-bold mb-3 text-lightAccent dark:text-darkAccent">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {service.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
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
                Ready to Start Your Project?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Let's work together to bring your ideas to life. I'm here to help you build something amazing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button as={Link} to="/contact" size="lg" className="group">
                  <FaRocket className="mr-2 group-hover:animate-bounce" />
                  Start Your Project
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

export default Home;
