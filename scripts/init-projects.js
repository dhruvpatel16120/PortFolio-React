const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, doc, setDoc } = require('firebase/firestore');
require('dotenv').config();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample projects data
const sampleProjects = [
  {
    title: 'Personal Portfolio',
    description: 'Modern portfolio website built with React, Tailwind CSS & Framer Motion. Features dark mode, responsive design, and smooth animations.',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop&crop=center',
    github: 'https://github.com/yourusername/portfolio',
    live: 'https://yourportfolio.com',
    technologies: ['React', 'Tailwind CSS', 'Framer Motion', 'JavaScript'],
    category: 'web',
    featured: true,
    year: '2024',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Agani Jyot Gas',
    description: 'Full‑stack gas agency management system with Django backend & React frontend. Includes inventory management, customer tracking, and payment processing.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop&crop=center',
    github: 'https://github.com/yourusername/gas-system',
    live: 'https://aganijyotgas.com',
    technologies: ['Django', 'React', 'PostgreSQL', 'Docker'],
    category: 'fullstack',
    featured: true,
    year: '2023',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Task Master',
    description: 'Advanced to‑do application with Firebase authentication, dark mode, reminders, and real-time synchronization across devices.',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&fit=crop&crop=center',
    github: 'https://github.com/yourusername/task-master',
    live: 'https://taskmaster.app',
    technologies: ['React', 'Firebase', 'Tailwind CSS', 'JavaScript'],
    category: 'web',
    featured: false,
    year: '2023',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'E‑Commerce Dashboard',
    description: 'Admin dashboard with analytics, payment integration, inventory management, and customer relationship tools.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=center',
    github: 'https://github.com/yourusername/ecommerce-dashboard',
    live: 'https://dashboard.example.com',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    category: 'fullstack',
    featured: true,
    year: '2023',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Blog Platform',
    description: 'Modern blog platform with markdown editor, comments system, SEO optimization, and content management.',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop&crop=center',
    github: 'https://github.com/yourusername/blog-platform',
    live: 'https://blog.example.com',
    technologies: ['Next.js', 'MongoDB', 'Tailwind CSS', 'Vercel'],
    category: 'web',
    featured: false,
    year: '2023',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'AI Chatbot',
    description: 'Conversational AI chatbot powered by OpenAI API with natural language processing and context awareness.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&crop=center',
    github: 'https://github.com/yourusername/ai-chatbot',
    live: 'https://chatbot.example.com',
    technologies: ['Python', 'OpenAI API', 'React', 'FastAPI'],
    category: 'ai',
    featured: true,
    year: '2024',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Sample page content
const pageContent = {
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

async function initializeProjects() {
  try {
    console.log('🚀 Initializing projects collection...');
    
    // Add sample projects
    for (const project of sampleProjects) {
      await addDoc(collection(db, 'projects'), project);
      console.log(`✅ Added project: ${project.title}`);
    }
    
    // Add page content
    await setDoc(doc(db, 'content', 'projects'), pageContent);
    console.log('✅ Added projects page content');
    
    console.log('🎉 Projects initialization completed successfully!');
  } catch (error) {
    console.error('❌ Error initializing projects:', error);
  }
}

// Run the initialization
initializeProjects(); 