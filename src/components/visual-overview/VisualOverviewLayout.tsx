
import React from 'react';
import Navbar from '@/components/Navbar';

interface VisualOverviewLayoutProps {
  children: React.ReactNode;
}

const VisualOverviewLayout: React.FC<VisualOverviewLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        {children}
      </div>
    </div>
  );
};

export default VisualOverviewLayout;
