
import React from 'react';
// Navbar and Footer are now handled by AppLayout
import Hero from '@/components/Hero';
import Overview from '@/components/Overview';
import Features from '@/components/Features';
import Technology from '@/components/Technology';
import Contact from '@/components/Contact';

const Index = () => {
  return (
    <>
      {/* Navbar is removed from here, handled by AppLayout */}
      <main>
        <Hero />
        <Overview />
        <Features />
        <Technology />
        <Contact />
      </main>
      {/* Footer is removed from here, handled by AppLayout */}
    </>
  );
};

export default Index;
