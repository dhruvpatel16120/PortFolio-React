import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiTag, FiMessageCircle, FiSend, FiMapPin, FiPhone, FiClock, FiInstagram } from 'react-icons/fi';
import { HiMail, HiPhone, HiLocationMarker, HiClock, HiGlobe, HiChat, HiUser, HiAcademicCap, HiBriefcase, HiHeart, HiStar, HiLightningBolt, HiSparkles } from 'react-icons/hi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { submitContactForm, getContactContent } from '../firebase/contactService';

// Components
import PageLayout from '../components/layout/PageLayout';
import Section from '../components/layout/Section';
import Container from '../components/layout/Container';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Card from '../components/ui/Card';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStartTime, setFormStartTime] = useState(null);
  const [errors, setErrors] = useState({});
  const [contactContent, setContactContent] = useState(null);
  const formRef = useRef();
  
  // Icon mapping function
  const getIconComponent = (iconName) => {
    const iconMap = {
      'HiMail': HiMail,
      'HiPhone': HiPhone,
      'HiLocationMarker': HiLocationMarker,
      'HiClock': HiClock,
      'HiGlobe': HiGlobe,
      'HiChat': HiChat,
      'HiUser': HiUser,
      'HiAcademicCap': HiAcademicCap,
      'HiBriefcase': HiBriefcase,
      'HiHeart': HiHeart,
      'HiStar': HiStar,
      'HiLightningBolt': HiLightningBolt,
      'HiSparkles': HiSparkles,
      'FiMail': FiMail,
      'FiPhone': FiPhone,
      'FiMapPin': FiMapPin,
      'FiClock': FiClock,
      'FiInstagram': FiInstagram
    };
    return iconMap[iconName] || FiMail; // Default to FiMail if icon not found
  };

  // Load contact content from Firebase
  useEffect(() => {
    const loadContactContent = async () => {
      try {
        setContentLoading(true);
        const result = await getContactContent();
        if (result.success && result.data) {
          setContactContent(result.data);
        } else {
          console.warn('Failed to load contact content, using defaults');
        }
      } catch (error) {
        console.error('Error loading contact content:', error);
      } finally {
        setContentLoading(false);
      }
    };

    loadContactContent();
  }, []);

  // Track form start time when user starts interacting
  useEffect(() => {
    const handleFormInteraction = () => {
      if (!formStartTime) {
        setFormStartTime(Date.now());
      }
    };

    const form = formRef.current;
    if (form) {
      form.addEventListener('focusin', handleFormInteraction);
      return () => form.removeEventListener('focusin', handleFormInteraction);
    }
  }, [formStartTime]);

  // Default contact info (fallback)
  const defaultContactInfo = [
    {
      icon: FiMail,
      title: 'Email',
      value: 'dhruvpatel16120@gmail.com',
      link: 'mailto:dhruvpatel16120@gmail.com',
      description: 'Send me an email anytime'
    },
    {
      icon: FiInstagram,
      title: 'Instagram',
      value: '@dhruv_patel_16120',
      link: 'https://instagram.com/dhruv_patel_16120',
      description: 'Follow me on Instagram'
    },
    {
      icon: FiMapPin,
      title: 'Location',
      value: 'Gujarat, India',
      description: 'Available for remote work worldwide'
    },
    {
      icon: FiClock,
      title: 'Response Time',
      value: 'Within 24 hours',
      description: 'I usually respond quickly'
    }
  ];

  // Use dynamic content or fallback to defaults
  const contactInfo = contactContent?.contactInfo?.filter(info => info.active) || defaultContactInfo;
  const pageContent = contactContent?.pageContent || {
    heroTitle: 'Get In Touch',
    heroDescription: 'Ready to start your next project? Let\'s discuss how I can help bring your ideas to life.',
    sectionTitle: 'Let\'s Connect',
    sectionDescription: 'I\'m always excited to hear about new opportunities and interesting projects.',
    formTitle: 'Send a Message',
    formDescription: 'Tell me about your project and I\'ll get back to you as soon as possible.',
    ctaTitle: 'Ready to Start Your Project?',
    ctaDescription: 'Whether you have a specific project in mind or just want to explore possibilities, I\'m here to help you achieve your goals.',
    services: [
      'Full-stack web development',
      'UI/UX design and optimization',
      'SEO and digital marketing',
      'Technical consulting',
      'Project collaboration'
    ],
    responseTimes: [
      { label: 'Initial response', time: 'Within 24 hours' },
      { label: 'Project discussion', time: '1-2 business days' },
      { label: 'Proposal delivery', time: '3-5 business days' }
    ]
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    setLoading(true);

    try {
      // Calculate form duration
      const formDuration = formStartTime ? Math.round((Date.now() - formStartTime) / 1000) : 0;
      
      // Prepare submission data with form duration
      const submissionData = {
        ...formData,
        formDuration
      };

      // Submit to Firebase
      const result = await submitContactForm(submissionData);
      
      if (result.success) {
        toast.success("Message sent successfully! I'll get back to you soon.");
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setErrors({});
        setFormStartTime(null);
        
        // Reset form
        if (formRef.current) {
          formRef.current.reset();
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (contentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <PageLayout
      title="Contact"
      description="Get in touch with Dhruv Patel for web development, digital marketing, and collaboration opportunities."
      keywords={['contact', 'get in touch', 'hire developer', 'collaboration', 'freelance']}
    >
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

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
              {pageContent.heroTitle}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {pageContent.heroDescription}
            </p>
          </motion.div>
        </Container>
      </Section>

      {/* Contact Information */}
      <Section>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-lightAccent dark:text-darkAccent">
              {pageContent.sectionTitle}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {pageContent.sectionDescription}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactInfo.map((info, index) => {
              // Handle both string icon names and component icons
              const IconComponent = typeof info.icon === 'string' ? getIconComponent(info.icon) : info.icon;
              
              return (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                                     <Card 
                     className="p-6 text-center h-full cursor-pointer hover:shadow-lg transition-shadow"
                   >
                     <div className="flex justify-center mb-4">
                       <div className="w-12 h-12 bg-lightAccent/10 dark:bg-darkAccent/10 rounded-lg flex items-center justify-center">
                         {React.createElement(IconComponent, { className: "text-lightAccent dark:text-darkAccent text-xl" })}
                       </div>
                     </div>
                     <h3 className="text-lg font-semibold mb-2 text-lightAccent dark:text-darkAccent">
                       {info.title}
                     </h3>
                     <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                       {info.value}
                     </p>
                     <p className="text-sm text-gray-500 dark:text-gray-500">
                       {info.description}
                     </p>
                   </Card>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Contact Form */}
      <Section className="bg-white/5 dark:bg-gray-900/20">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card variant="elevated" className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-lightAccent dark:text-darkAccent">
                  {pageContent.formTitle}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {pageContent.formDescription}
                </p>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      icon={FiUser}
                      placeholder="Your full name"
                      error={errors.name}
                      required
                    />
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      icon={FiMail}
                      placeholder="your@email.com"
                      error={errors.email}
                      required
                    />
                  </div>

                  <Input
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    icon={FiTag}
                    placeholder="What's this about?"
                    error={errors.subject}
                    required
                  />

                  <Textarea
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    icon={FiMessageCircle}
                    placeholder="Tell me about your project, timeline, and requirements..."
                    error={errors.message}
                    rows={6}
                    required
                  />

                  <Button
                    type="submit"
                    loading={loading}
                    size="lg"
                    className="w-full"
                  >
                    <FiSend className="mr-2" />
                    Send Message
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 text-lightAccent dark:text-darkAccent">
                  What I Can Help With
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  {pageContent.services.map((service, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-lightAccent dark:bg-darkAccent rounded-full mt-2 flex-shrink-0" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 text-lightAccent dark:text-darkAccent">
                  Response Time
                </h3>
                <div className="space-y-3 text-gray-600 dark:text-gray-400">
                  {pageContent.responseTimes.map((time, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{time.label}</span>
                      <span className="font-medium">{time.time}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 text-lightAccent dark:text-darkAccent">
                  Preferred Communication
                </h3>
                <div className="space-y-3 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-3">
                    <FiMail className="text-lightAccent dark:text-darkAccent" />
                    <span>Email for detailed discussions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiPhone className="text-lightAccent dark:text-darkAccent" />
                    <span>Phone for urgent matters</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiMessageCircle className="text-lightAccent dark:text-darkAccent" />
                    <span>Video calls for complex projects</span>
                  </div>
                </div>
              </Card>
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
                {pageContent.ctaTitle}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                {pageContent.ctaDescription}
              </p>
                             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <Button 
                   size="lg" 
                   onClick={() => {
                     document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                   }}
                 >
                   Start a Project
                 </Button>
                 <Button 
                   variant="outline" 
                   as="a" 
                   href="/about" 
                   size="lg"
                 >
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

export default Contact;
