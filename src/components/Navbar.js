import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSun, FiMoon, FiMenu, FiX, FiHome, FiUser, FiBriefcase, FiMail, FiFileText } from 'react-icons/fi';
import { useTheme } from "../context/ThemeContext";
import { useSettings } from "../context/SettingsContext";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { settings } = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/about', label: 'About', icon: FiUser },
    { path: '/projects', label: 'Projects', icon: FiBriefcase },
    { path: '/contact', label: 'Contact', icon: FiMail },
    { path: '/resume', label: 'Resume', icon: FiFileText }
  ];

  const isActive = (path) => {
    const active = location.pathname === path;
    return active;
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/25 dark:bg-gray-900/25 backdrop-blur-2xl shadow-2xl border-b border-white/20 dark:border-gray-700/40 shadow-white/10 dark:shadow-black/20' 
          : 'bg-white/15 dark:bg-gray-900/15 backdrop-blur-xl shadow-xl border-b border-white/30 dark:border-gray-700/30 shadow-white/5 dark:shadow-black/10'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div>
        <Link 
          to="/" 
          style={{ fontFamily: 'Dancing Script, Poppins, sans-serif' }}
              className="text-3xl font-semibold tracking-wide text-lightAccent dark:text-darkAccent hover:scale-105 transform transition-all duration-300 font-[Poppins] drop-shadow-lg"
        >
          Dhruv's Portfolio
        </Link>
          </div>

          {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 text-lg">
            {navItems.map((item) => (
              <div key={item.path} className="relative">
                <Link
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-white/30 dark:bg-gray-800/30 text-lightAccent dark:text-darkAccent font-semibold shadow-xl backdrop-blur-md border border-white/20 dark:border-gray-700/30'
                      : 'text-gray-800 dark:text-gray-300 hover:text-lightAccent dark:hover:text-darkAccent hover:bg-white/20 dark:hover:bg-gray-800/20 backdrop-blur-md border border-transparent hover:border-white/20 dark:hover:border-gray-700/30'
                  }`}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                  {isActive(item.path) && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-lightAccent dark:bg-darkAccent rounded-full shadow-lg" />
                  )}
                </Link>
              </div>
            ))}
        </div>

          {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-white/25 dark:bg-gray-800/25 hover:bg-white/35 dark:hover:bg-gray-800/35 transition-all duration-300 backdrop-blur-md border border-white/20 dark:border-gray-700/30 shadow-lg hover:shadow-xl"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <FiMoon className="text-darkAccent" size={20} />
              ) : (
                <FiSun className="text-lightAccent" size={20} />
              )}
          </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/25 dark:bg-gray-800/25 hover:bg-white/35 dark:hover:bg-gray-800/35 transition-all duration-300 backdrop-blur-md border border-white/20 dark:border-gray-700/30 shadow-lg hover:shadow-xl"
              aria-label="Toggle mobile menu"
            >
              {menuOpen ? (
                <FiX className="text-lightAccent dark:text-darkAccent" size={24} />
              ) : (
                <FiMenu className="text-lightAccent dark:text-darkAccent" size={24} />
              )}
            </button>
        </div>
      </div>

        {/* Mobile Menu */}
      {menuOpen && (
          <div className="md:hidden mt-4">
            <div className="bg-white/25 dark:bg-gray-800/25 backdrop-blur-2xl rounded-xl p-4 space-y-2 border border-white/30 dark:border-gray-700/40 shadow-2xl shadow-white/10 dark:shadow-black/20">
              {navItems.map((item, index) => (
                <div key={item.path} className="relative">
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive(item.path)
                        ? 'bg-white/40 dark:bg-gray-700/40 text-lightAccent dark:text-darkAccent font-semibold shadow-xl border-l-4 border-lightAccent dark:border-darkAccent backdrop-blur-md'
                        : 'text-gray-800 dark:text-gray-300 hover:text-lightAccent dark:hover:text-darkAccent hover:bg-white/20 dark:hover:bg-gray-800/20 backdrop-blur-md border border-transparent hover:border-white/20 dark:hover:border-gray-700/30'
                    }`}
                  >
                    <item.icon size={18} />
                    <span className="text-lg">{item.label}</span>
                    {isActive(item.path) && (
                      <div className="absolute right-3 w-2 h-2 bg-lightAccent dark:bg-darkAccent rounded-full shadow-lg" />
                    )}
                  </Link>
                </div>
              ))}
            </div>
        </div>
      )}
      </div>
    </nav>
  );
};

export default Navbar;
