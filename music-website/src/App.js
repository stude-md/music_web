import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MusicPlayer from './components/MusicPlayer';

// Pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ExplorePage from './pages/ExplorePage';

// Context
import { AudioProvider } from './context/AudioContext';

// Main wrapper to access location
const AppContent = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Toggle sidebar state
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Auto-collapse sidebar when navigating to specific pages
  useEffect(() => {
    // Auto collapse on mobile
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
    };

    // Check path to auto-collapse sidebar
    const checkPathForCollapse = () => {
      // Keep sidebar expanded on homepage, collapse on other pages for cleaner UI
      if (location.pathname !== '/' && window.innerWidth < 1280) {
        setIsSidebarCollapsed(true);
      }
    };

    // Call once on mount
    handleResize();
    checkPathForCollapse();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [location.pathname]);

  return (
    <div className="flex flex-col h-screen">
      <Navbar toggleSidebar={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
        <main className={`flex-1 overflow-y-auto bg-gray-900 pb-24 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'} pt-16`}>
          <div className="container-custom">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/favorites" element={<div className="p-6"><h1 className="text-3xl font-bold text-white">Favorites</h1></div>} />
              <Route path="/recent" element={<div className="p-6"><h1 className="text-3xl font-bold text-white">Recently Played</h1></div>} />
              <Route path="/playlist/:id" element={<div className="p-6"><h1 className="text-3xl font-bold text-white">Playlist</h1></div>} />
              <Route path="/playlists" element={<div className="p-6"><h1 className="text-3xl font-bold text-white">Your Playlists</h1></div>} />
              <Route path="/profile" element={<div className="p-6"><h1 className="text-3xl font-bold text-white">Profile</h1></div>} />
            </Routes>
          </div>
        </main>
      </div>
      <MusicPlayer />
    </div>
  );
};

function App() {
  return (
    <AudioProvider>
      <Router>
        <AppContent />
      </Router>
    </AudioProvider>
  );
}

export default App;
