import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiGithub, FiLinkedin, FiMail, FiMapPin, 
  FiExternalLink, FiArrowUp, FiInstagram
} from 'react-icons/fi';

const Footer = () => {
  const [currentYear] = useState(new Date().getFullYear());

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    pages: [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
      { name: 'Projects', path: '/projects' },
      { name: 'Contact', path: '/contact' },
      { name: 'Resume', path: '/resume' }
    ],
    services: [
      { name: 'Web Development', href: '#' },
      { name: 'Mobile Development', href: '#' },
      { name: 'UI/UX Design', href: '#' },
      { name: 'Consulting', href: '#' }
    ]
  };

  const socialLinks = [
    { name: 'GitHub', icon: FiGithub, href: 'https://github.com/dhruvpatel16120' },
    { name: 'LinkedIn', icon: FiLinkedin, href: 'https://linkedin.com/in/dhruvpatel16120' },
    { name: 'Instagram', icon: FiInstagram, href: 'https://instagram.com/dhruv_patel_16120' },
    { name: 'Email', icon: FiMail, href: 'mailto:dhruvpatel16120@gmail.com' }
  ];

  const contactInfo = [
    { icon: FiMapPin, text: 'Gujarat, India' },
    { icon: FiInstagram, text: '@dhruv_patel_16120' },
    { icon: FiMail, text: 'dhruvpatel16120@gmail.com' }
  ];

  return (
    <footer className="relative bg-gradient-to-r from-lightBgFrom via-lightBgVia to-lightBgTo dark:from-darkBgFrom dark:via-darkBgVia dark:to-darkBgTo border-t border-white/20 dark:border-gray-700/30 backdrop-blur-2xl">
      <div className="relative container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="rounded-xl p-6 border border-white/20 dark:border-gray-700/30 shadow-lg backdrop-blur-xl">
              <div className="mb-4">
                <Link 
                  to="/" 
                  style={{ fontFamily: 'Dancing Script, Poppins, sans-serif' }}
                  className="text-2xl font-semibold text-lightAccent dark:text-darkAccent hover:scale-105 transform transition-all duration-300 font-[Poppins] drop-shadow-lg"
                >
                  Dhruv's Portfolio
                </Link>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Full-stack developer passionate about creating innovative web solutions and delivering exceptional user experiences.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg border border-white/20 dark:border-gray-700/30 shadow-lg hover:shadow-xl text-lightAccent dark:text-darkAccent hover:scale-110 transition-all duration-300 backdrop-blur-xl"
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <div className="rounded-xl p-6 border border-white/20 dark:border-gray-700/30 shadow-lg backdrop-blur-xl">
              <h3 className="text-xl font-semibold text-lightAccent dark:text-darkAccent mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {footerLinks.pages.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-700 dark:text-gray-300 hover:text-lightAccent dark:hover:text-darkAccent transition-all duration-300 hover:translate-x-1 flex items-center gap-2 group"
                    >
                      <FiExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Services */}
          <div className="lg:col-span-1">
            <div className="rounded-xl p-6 border border-white/20 dark:border-gray-700/30 shadow-lg backdrop-blur-xl">
              <h3 className="text-xl font-semibold text-lightAccent dark:text-darkAccent mb-4">Services</h3>
              <ul className="space-y-3">
                {footerLinks.services.map((service) => (
                  <li key={service.name}>
                    <a
                      href={service.href}
                      className="text-gray-700 dark:text-gray-300 hover:text-lightAccent dark:hover:text-darkAccent transition-all duration-300 hover:translate-x-1 flex items-center gap-2 group"
                    >
                      <FiExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {service.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="rounded-xl p-6 border border-white/20 dark:border-gray-700/30 shadow-lg backdrop-blur-xl">
              <h3 className="text-xl font-semibold text-lightAccent dark:text-darkAccent mb-4">Contact Info</h3>
              <ul className="space-y-3">
                {contactInfo.map((contact, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <div className="p-2 rounded-lg border border-white/20 dark:border-gray-700/30 shadow-lg backdrop-blur-xl">
                      <contact.icon size={16} className="text-lightAccent dark:text-darkAccent" />
                    </div>
                    <span className="text-sm">{contact.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 dark:border-gray-700/30 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2">
              <span className="text-xl font-semibold">©</span>
              <span 
                style={{ fontFamily: 'Dancing Script, Poppins, sans-serif' }}
                className="text-gray-700 dark:text-gray-300 font-[Poppins]"
              >
                {currentYear} Dhruv Patel. All Rights Reserved.
              </span>
            </div>

            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 dark:border-gray-700/30 shadow-lg hover:shadow-xl text-lightAccent dark:text-darkAccent hover:scale-105 transition-all duration-300 backdrop-blur-xl"
              aria-label="Back to top"
            >
              <span className="text-sm font-medium">Back to Top</span>
              <FiArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
