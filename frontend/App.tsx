
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import JournalListing from './pages/JournalListing';
import JournalDetail from './pages/JournalDetail';
import Activity from './pages/Activity';
import ActivityDetail from './pages/ActivityDetail';
import Profile from './pages/Profile';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Login from './pages/Login';
import { Category } from './types';
import { socketService } from './src/services/socketService';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  React.useEffect(() => {
    socketService.connect();
  }, []);
  React.useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, hash]);
  return null;
};

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isLogin = location.pathname === '/login';

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdmin && !isLogin && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAdmin && !isLogin && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aktivitas-berita" element={<Activity />} />
          <Route path="/aktivitas-berita/:id" element={<ActivityDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/karya/riset" element={<JournalListing title="Arsip Riset" forcedCategory={Category.JURNAL} />} />
          <Route path="/karya/dokumenter" element={<JournalListing title="Arsip Dokumenter" forcedCategory={Category.DOKUMENTER} />} />
          <Route path="/books" element={<JournalListing title="Perpustakaan Buku" forcedCategory={Category.BUKU} />} />
          <Route path="/artikel/ilmiah" element={<JournalListing title="Artikel Ilmiah Populer" forcedCategory={Category.ARTIKEL_POPULER} />} />
          <Route path="/artikel/opini" element={<JournalListing title="Opini & Refleksi" forcedCategory={Category.ESSAI} />} />
          <Route path="/journals/:slug" element={<JournalDetail />} />
          <Route path="/tentang-kami" element={<Profile />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
