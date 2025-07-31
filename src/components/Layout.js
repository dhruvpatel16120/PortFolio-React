import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-[70px]"> {/* padding top ≈ navbar height */}
        {children}
      </main>
      <Footer />
    </div>
  );
}
