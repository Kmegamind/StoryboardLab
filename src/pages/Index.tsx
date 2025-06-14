
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Overview from '@/components/Overview';
import Features from '@/components/Features';
import Technology from '@/components/Technology';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Overview />
        <Features />
        <Technology />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
