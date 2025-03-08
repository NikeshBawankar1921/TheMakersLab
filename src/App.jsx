import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import { ProductProvider } from './contexts/ProductContext';
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CoursesPage from './pages/CoursesPage';
import LearningKitsPage from './pages/LearningKitsPage';
import ComponentsPage from './pages/ComponentsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminPage from './pages/AdminPage';

// Constants
const ADMIN_EMAIL = 'nikeshbawankar1921@gmail.com';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <ProductProvider>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Admin Routes - Protected by the AdminPage component itself */}
              <Route path="/admin" element={<AdminPage />} />
              
              {/* Main Routes with Layout */}
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/about" element={<Layout><AboutPage /></Layout>} />
              <Route path="/courses" element={<Layout><CoursesPage /></Layout>} />
              <Route path="/learning-kits" element={<Layout><LearningKitsPage /></Layout>} />
              <Route path="/components" element={<Layout><ComponentsPage /></Layout>} />
              
              {/* 404 Route */}
              <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
            </Routes>
          </ProductProvider>
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
