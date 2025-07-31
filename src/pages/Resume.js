import React, { useState } from 'react';
import { 
  FiDownload, FiMail, FiLinkedin, FiGithub, FiFileText, 
  FiBriefcase, FiBookOpen, FiAward, FiStar, FiTarget, 
  FiTrendingUp, FiUsers, FiInstagram, FiExternalLink
} from 'react-icons/fi';

// Components
import PageLayout from '../components/layout/PageLayout';
import Section from '../components/layout/Section';
import Container from '../components/layout/Container';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Resume = () => {
  const [activeTab, setActiveTab] = useState('experience');

  const personalInfo = {
    name: 'Dhruv Patel',
    title: 'Full Stack Developer',
    email: 'dhruvpatel16120@gmail.com',
    instagram: '@dhruv_patel_16120',
    linkedin: 'https://linkedin.com/in/dhruvpatel16120',
    github: 'https://github.com/dhruvpatel16120',
    location: 'Gujarat, India',
    website: 'https://dhruvpatel.dev'
  };

  const resumeData = {
    personalInfo: {
      name: 'Dhruv Patel',
      title: 'Full-Stack Developer & Digital Marketing Expert',
      email: 'dhruvpatel16120@gmail.com',
      instagram: '@dhruv_patel_16120',
      location: 'Gujarat, India',
      linkedin: 'https://linkedin.com/in/dhruvpatel16120',
      github: 'https://github.com/dhruvpatel16120'
    },
    summary: `Passionate full-stack developer with expertise in modern web technologies including React, Django, and Firebase. 
    Specialized in creating responsive, scalable applications and implementing effective digital marketing strategies. 
    Committed to delivering high-quality solutions that drive business growth and user engagement.`,
    skills: {
      technical: [
        'React.js', 'JavaScript (ES6+)', 'Python', 'Django', 'Firebase',
        'HTML5/CSS3', 'Tailwind CSS', 'Node.js', 'MongoDB', 'PostgreSQL',
        'Git/GitHub', 'RESTful APIs', 'SEO', 'Google Analytics'
      ],
      soft: [
        'Problem Solving', 'Team Collaboration', 'Communication',
        'Project Management', 'Client Relations', 'Time Management'
      ]
    },
    experience: [
      {
        title: 'Full-Stack Developer',
        company: 'Freelance',
        period: '2023 - Present',
        description: [
          'Developed responsive web applications using React and Django',
          'Implemented SEO strategies and digital marketing campaigns',
          'Collaborated with clients to deliver custom solutions',
          'Maintained and optimized existing applications'
        ]
      },
      {
        title: 'Digital Marketing Specialist',
        company: 'Various Clients',
        period: '2022 - 2023',
        description: [
          'Created and executed SEO strategies for small businesses',
          'Managed social media campaigns and content creation',
          'Analyzed website performance and provided optimization recommendations',
          'Increased client website traffic by 40% on average'
        ]
      },
      {
        title: 'Web Developer',
        company: 'Personal Projects',
        period: '2021 - 2022',
        description: [
          'Built various web applications and learned modern technologies',
          'Developed portfolio websites and e-commerce solutions',
          'Practiced responsive design and user experience optimization',
          'Contributed to open-source projects'
        ]
      }
    ],
    education: [
      {
        degree: 'Bachelor of Technology',
        field: 'Computer Science',
        institution: 'University Name',
        period: '2020 - 2024',
        description: 'Focused on software engineering, web development, and computer science fundamentals.'
      }
    ],
    certifications: [
      {
        name: 'React Developer Certification',
        issuer: 'Meta',
        date: '2023'
      },
      {
        name: 'Python Programming',
        issuer: 'Coursera',
        date: '2022'
      },
      {
        name: 'Digital Marketing',
        issuer: 'Google',
        date: '2022'
      }
    ],
    achievements: [
      {
        title: '100+ Projects Completed',
        description: 'Successfully delivered over 100 web development projects',
        icon: FiTarget
      },
      {
        title: '40% Traffic Increase',
        description: 'Average improvement in client website traffic',
        icon: FiTrendingUp
      },
      {
        title: '50+ Happy Clients',
        description: 'Built long-term relationships with satisfied clients',
        icon: FiUsers
      },
      {
        title: '5-Star Reviews',
        description: 'Consistently received excellent feedback from clients',
        icon: FiStar
      }
    ],
    testimonials: [
      {
        name: 'Sarah Johnson',
        role: 'CEO, TechStart',
        content: 'Dhruv delivered our website ahead of schedule with exceptional quality. His attention to detail and communication skills are outstanding.',
        rating: 5
      },
      {
        name: 'Mike Chen',
        role: 'Founder, Digital Solutions',
        content: 'Working with Dhruv was a game-changer for our business. His SEO expertise helped us increase our online visibility significantly.',
        rating: 5
      },
      {
        name: 'Emily Rodriguez',
        role: 'Marketing Director',
        content: 'Dhruv is not just a developer, he\'s a strategic partner. He understands our business needs and delivers solutions that drive results.',
        rating: 5
      }
    ],
    projects: [
      {
        name: 'Personal Portfolio',
        description: 'Modern portfolio website with React and Tailwind CSS',
        technologies: ['React', 'Tailwind CSS', 'Framer Motion']
      },
      {
        name: 'Agani Jyot Gas System',
        description: 'Full-stack gas agency management system',
        technologies: ['Django', 'React', 'PostgreSQL']
      },
      {
        name: 'Task Master App',
        description: 'Advanced to-do application with Firebase',
        technologies: ['React', 'Firebase', 'JavaScript']
      }
    ]
  };

  const renderStars = (rating) => {
    return Array.from({ length: rating }, (_, i) => (
      <FiStar key={i} className="text-yellow-400 fill-current" size={16} />
    ));
  };

  return (
    <PageLayout
      title="Resume"
      description="Download Dhruv Patel's resume - Full-Stack Developer and Digital Marketing Expert with expertise in React, Django, and modern web technologies."
      keywords={['resume', 'CV', 'developer', 'full-stack', 'React', 'Django', 'digital marketing']}
    >
      {/* Hero Section */}
      <Section variant="centered">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-lightAccent dark:text-darkAccent">
        My Resume
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
              Download my detailed resume or explore my professional background below.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                as="a"
                href="/resume.pdf"
        download
                size="lg"
                className="group"
              >
                <FiDownload className="mr-2 group-hover:animate-bounce" />
                Download CV
              </Button>
              <Button
                variant="outline"
                as="a"
                href="/contact"
                size="lg"
              >
                <FiMail className="mr-2" />
                Get In Touch
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Personal Info */}
      <Section>
        <Container>
          <Card variant="elevated" className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div>
                <h2 className="text-3xl font-bold mb-4 text-lightAccent dark:text-darkAccent">
                  {personalInfo.name}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                  {personalInfo.title}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FiMail className="text-lightAccent dark:text-darkAccent" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {personalInfo.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiInstagram className="text-lightAccent dark:text-darkAccent" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {personalInfo.instagram}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiBriefcase className="text-lightAccent dark:text-darkAccent" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {personalInfo.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col justify-center">
                <div className="flex gap-4">
                  <Button
                    as="a"
                    href={personalInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    size="sm"
                  >
                    <FiLinkedin className="mr-2" />
                    LinkedIn
                  </Button>
                  <Button
                    as="a"
                    href={personalInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    size="sm"
                  >
                    <FiGithub className="mr-2" />
                    GitHub
                  </Button>
                  <Button
                    as="a"
                    href={`https://instagram.com/${personalInfo.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    size="sm"
                  >
                    <FiInstagram className="mr-2" />
                    Instagram
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </Container>
      </Section>

      {/* Summary */}
      <Section>
        <Container>
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-lightAccent dark:text-darkAccent flex items-center gap-2">
              <FiFileText />
              Professional Summary
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {resumeData.summary}
            </p>
          </Card>
        </Container>
      </Section>

      {/* Achievements */}
      <Section className="bg-white/5 dark:bg-gray-900/20">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-lightAccent dark:text-darkAccent">
              Key Achievements
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Milestones that showcase my impact and success
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {resumeData.achievements.map((achievement, index) => (
              <div key={achievement.title}>
                <Card className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-lightAccent/10 dark:bg-darkAccent/10 rounded-lg flex items-center justify-center">
                      <achievement.icon className="text-lightAccent dark:text-darkAccent text-xl" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-lightAccent dark:text-darkAccent mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {achievement.description}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Skills */}
      <Section>
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-lightAccent dark:text-darkAccent">
              Skills & Expertise
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Technical and soft skills that drive successful project delivery
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Technical Skills */}
            <div>
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 text-lightAccent dark:text-darkAccent">
                  Technical Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.technical.map((skill, index) => (
                    <span
                      key={skill}
                      className="bg-lightAccent/10 dark:bg-darkAccent/10 text-lightAccent dark:text-darkAccent px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            </div>

            {/* Soft Skills */}
            <div>
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 text-lightAccent dark:text-darkAccent">
                  Soft Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.soft.map((skill, index) => (
                    <span
                      key={skill}
                      className="bg-lightAccent/10 dark:bg-darkAccent/10 text-lightAccent dark:text-darkAccent px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* Experience & Education Tabs */}
      <Section className="bg-white/5 dark:bg-gray-900/20">
        <Container>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-lightAccent dark:text-darkAccent">
              Experience & Education
            </h2>
            <div className="flex justify-center gap-4 mb-8">
              <Button
                variant={activeTab === 'experience' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('experience')}
              >
                <FiBriefcase className="mr-2" />
                Experience
              </Button>
              <Button
                variant={activeTab === 'education' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('education')}
              >
                <FiBookOpen className="mr-2" />
                Education
              </Button>
            </div>
          </div>

          {activeTab === 'experience' && (
            <div className="space-y-6">
              {resumeData.experience.map((exp, index) => (
                <Card key={exp.title} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-lightAccent dark:text-darkAccent">
                        {exp.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">
                        {exp.company}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                      {exp.period}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {exp.description.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-lightAccent dark:bg-darkAccent rounded-full mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-6">
              {resumeData.education.map((edu, index) => (
                <Card key={index} className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lightAccent dark:text-darkAccent">
                      {edu.degree} - {edu.field}
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {edu.period}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                    {edu.institution}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {edu.description}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* Certifications */}
      <Section>
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-lightAccent dark:text-darkAccent flex items-center justify-center gap-2">
              <FiAward />
              Certifications
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Professional certifications that validate my expertise
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {resumeData.certifications.map((cert, index) => (
              <Card key={index} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lightAccent dark:text-darkAccent">
                      {cert.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {cert.issuer}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {cert.date}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Testimonials */}
      <Section className="bg-white/5 dark:bg-gray-900/20">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-lightAccent dark:text-darkAccent">
              Client Testimonials
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              What clients say about working with me
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {resumeData.testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <h4 className="font-bold text-lightAccent dark:text-darkAccent">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {testimonial.role}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Featured Projects */}
      <Section>
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-lightAccent dark:text-darkAccent">
              Featured Projects
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Key projects that demonstrate my technical capabilities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {resumeData.projects.map((project, index) => (
              <Card key={project.name} className="p-6 h-full">
                <h3 className="text-lg font-bold mb-3 text-lightAccent dark:text-darkAccent">
                  {project.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="bg-lightAccent/10 dark:bg-darkAccent/10 text-lightAccent dark:text-darkAccent px-2 py-1 rounded text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section>
        <Container>
          <div className="text-center">
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
                  <FiMail className="mr-2" />
                  Get In Touch
                </Button>
                <Button variant="outline" as="a" href="/projects" size="lg">
                  <FiExternalLink className="mr-2" />
                  View Projects
                </Button>
              </div>
            </Card>
    </div>
        </Container>
      </Section>
    </PageLayout>
  );
};

export default Resume;
