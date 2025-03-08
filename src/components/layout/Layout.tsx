import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      <main className="flex-grow pt-24 px-4 container mx-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 