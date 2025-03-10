import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Header from './Header';
import KidDecor from '../ui/KidDecor';

interface LayoutProps {
  children: ReactNode;
  disableDecor?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, disableDecor = false }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {!disableDecor && <KidDecor type="all" density="medium" />}
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