// src/pages/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import NotFoundAnim from '../assets/404-animation.json'; // ← download & save in src/assets

export default function NotFound() {
  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden bg-gradient-to-r from-lightBgFrom via-lightBgVia to-lightBgTo dark:from-darkBgFrom dark:via-darkBgVia dark:to-darkBgTo text-lightText dark:text-darkText px-4">

      {/* Lottie animation background */}
      <div className="relative top-0     pointer-events-none">
        <Lottie animationData={NotFoundAnim} loop />
      </div>

      {/* Content */}
      <motion.h1
        className="relative text-7xl md:text-9xl font-bold mb-4 text-lightAccent dark:text-darkAccent"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        404
      </motion.h1>

      <motion.p
        className="relative text-lg md:text-xl mb-6 text-center max-w-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </motion.p>

      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <Link
          to="/"
          className="inline-block px-6 py-3 rounded-full text-base md:text-lg font-semibold bg-lightAccent text-darkText dark:bg-darkAccent dark:text-lightText hover:scale-105 transform transition shadow"
        >
          ← Go back home
        </Link>
      </motion.div>
    </div>
  );
}
