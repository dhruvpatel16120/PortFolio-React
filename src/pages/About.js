import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaLaptopCode, FaChartLine, FaMagic, FaBinoculars, 
  FaGraduationCap, FaBriefcase, FaHeart, FaLightbulb,
  FaAward, FaRocket
} from 'react-icons/fa';

// Components
import PageLayout from '../components/layout/PageLayout';
import Section from '../components/layout/Section';
import Container from '../components/layout/Container';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const About = () => {
  const skills = [
    { name: 'React', level: 90, color: 'bg-blue-500' },
    { name: 'JavaScript', level: 85, color: 'bg-yellow-500' },
    { name: 'Python', level: 80, color: 'bg-blue-600' },
    { name: 'Django', level: 75, color: 'bg-green-600' },
    { name: 'Firebase', level: 70, color: 'bg-yellow-600' },
    { name: 'SEO', level: 85, color: 'bg-purple-500' }
  ];

  const experiences = [
    {
      year: '2023 - Present',
      title: 'Full-Stack Developer',
      company: 'Freelance',
      description: 'Building modern web applications and helping businesses grow online.'
    },
    {
      year: '2022 - 2023',
      title: 'Digital Marketing Specialist',
      company: 'Various Clients',
      description: 'SEO optimization and digital marketing strategies for small businesses.'
    },
    {
      year: '2021 - 2022',
      title: 'Web Developer',
      company: 'Personal Projects',
      description: 'Developed various web applications and learned modern technologies.'
    }
  ];

  const education = [
    {
      degree: 'Bachelor of Technology',
      institution: 'Computer Science',
      year: '2020 - 2024',
      description: 'Focused on software engineering and web development.'
    }
  ];

  return (
    <PageLayout
      title="About"
      description="Learn more about Dhruv Patel - a passionate full-stack developer and digital marketing expert based in India."
      keywords={['about', 'developer', 'digital marketing', 'portfolio', 'experience']}
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
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent 
        bg-gradient-to-r from-lightAccent via-pink-500 to-lightAccent 
              dark:from-darkAccent dark:via-purple-500 dark:to-darkAccent">
          Get to know me
        </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Hi! I'm Dhruv Patel — a full‑stack developer & digital marketer who loves to blend code with creativity.
        </p>
          </motion.div>
        </Container>
      </Section>

      {/* About Me Section */}
      <Section>
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
              className="text-center md:text-left"
      >
        <img
          src="/dhruv.jpg"
          alt="Dhruv Patel"
                className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-full shadow-2xl border-4 border-lightAccent dark:border-darkAccent mx-auto"
              />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-lightAccent dark:text-darkAccent mb-4">
            Who I am
          </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                I'm Dhruv Patel, a passionate full‑stack developer & digital marketing expert based in India. 
                I specialize in building clean, high‑performance web applications and helping brands grow online.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                I combine modern technologies like React, Django, Firebase, and Tailwind CSS with creative 
                design and SEO strategies — turning ideas into beautiful, user‑friendly products that drive results.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <FaHeart className="text-red-500" />
                  <span className="text-sm">Passionate about code</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaLightbulb className="text-yellow-500" />
                  <span className="text-sm">Creative problem solver</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaRocket className="text-blue-500" />
                  <span className="text-sm">Fast learner</span>
                </div>
              </div>
            </motion.div>
        </div>
        </Container>
      </Section>

      {/* Mission Section */}
      <Section className="bg-white/5 dark:bg-gray-900/20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
            className="text-center"
          >
            <Card variant="elevated" className="p-8 md:p-12">
              <FaAward className="text-6xl mx-auto mb-6 text-lightAccent dark:text-darkAccent" />
              <blockquote className="text-2xl md:text-3xl font-semibold text-lightText dark:text-darkText italic max-w-4xl mx-auto leading-relaxed">
                "My mission is to blend creative design, clean code & smart marketing — so every project is fast, modern, and truly meaningful."
        </blockquote>
            </Card>
          </motion.div>
        </Container>
      </Section>

      {/* Skills Section */}
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
              My Skills
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Technologies and tools I use to bring ideas to life
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Skills List */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 text-lightAccent dark:text-darkAccent">
                Technical Skills
              </h3>
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-gray-500">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${skill.color}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* What I Do */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
              <h3 className="text-2xl font-bold mb-6 text-lightAccent dark:text-darkAccent">
          What I Do
              </h3>
              <div className="space-y-4">
          {[
            {
                    icon: FaLaptopCode,
              title: 'Full‑Stack Development',
                    description: 'Modern web apps with React, Django & Firebase — responsive, secure & scalable.'
            },
            {
                    icon: FaChartLine,
              title: 'SEO & Digital Strategy',
                    description: 'Drive traffic & boost brand presence with data‑driven SEO & marketing.'
            },
            {
                    icon: FaMagic,
              title: 'Creative UI/UX',
                    description: 'Design sleek, user‑friendly interfaces that delight users.'
                  },
                  {
                    icon: FaBinoculars,
                    title: 'Analytics & Optimization',
                    description: 'Track performance & optimize for better user experience & conversions.'
                  }
                ].map((service, index) => (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-lightAccent/10 dark:bg-darkAccent/10 rounded-lg flex items-center justify-center">
                      <service.icon className="text-lightAccent dark:text-darkAccent text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lightAccent dark:text-darkAccent mb-1">
                        {service.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {service.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Experience Section */}
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
              Experience & Education
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              My journey in technology and digital marketing
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Experience */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 text-lightAccent dark:text-darkAccent flex items-center gap-2">
                <FaBriefcase />
                Experience
              </h3>
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <motion.div
                    key={exp.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-lightAccent dark:text-darkAccent">
                          {exp.title}
                        </h4>
                        <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {exp.year}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {exp.company}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {exp.description}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Education */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 text-lightAccent dark:text-darkAccent flex items-center gap-2">
                <FaGraduationCap />
                Education
              </h3>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <motion.div
                    key={edu.degree}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-lightAccent dark:text-darkAccent">
                          {edu.degree}
                        </h4>
                        <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {edu.year}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {edu.institution}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {edu.description}
                      </p>
                    </Card>
            </motion.div>
          ))}
        </div>
            </motion.div>
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
                Ready to Work Together?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                I'm always excited to take on new challenges and help bring your ideas to life. 
                Let's discuss your project and see how we can work together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button as="a" href="/contact" size="lg">
                  Get In Touch
                </Button>
                <Button variant="outline" as="a" href="/resume" size="lg">
                  View Resume
                </Button>
    </div>
            </Card>
          </motion.div>
        </Container>
      </Section>
    </PageLayout>
  );
};

export default About;
