import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  UserCircleIcon, 
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { MusicalNoteIcon } from '@heroicons/react/24/solid';

const Navbar = ({ toggleSidebar, isSidebarCollapsed }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search
      console.log('Searching for:', searchQuery);
      // Reset search
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-gray-900 border-b border-gray-800 h-16">
      <div className="flex items-center justify-between h-full px-4">
        {/* Logo Section */}
        <div className="flex items-center">
          <button 
            className="mr-4 lg:hidden text-gray-400 hover:text-white"
            onClick={toggleSidebar}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          <Link to="/" className="flex items-center gap-2">
            <MusicalNoteIcon className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-white hidden xs:block">SonicStream</span>
          </Link>
        </div>

        {/* Search */}
        <div className={`absolute left-1/2 transform -translate-x-1/2 transition-all w-1/2 max-w-md ${showSearch ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for songs, artists..."
                className="w-full py-2 px-4 pr-10 rounded-full bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Menu */}
        <div className="flex items-center gap-2">
          {!showSearch && (
            <button 
              className="p-2 text-gray-400 hover:text-white"
              onClick={handleSearchToggle}
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
          )}
          {showSearch && (
            <button 
              className="p-2 text-gray-400 hover:text-white"
              onClick={handleSearchToggle}
              aria-label="Close search"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          )}
          
          <Link to="/profile" className="p-2 text-gray-400 hover:text-white">
            <UserCircleIcon className="h-6 w-6" />
          </Link>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="lg:hidden bg-gray-800 absolute top-full left-0 right-0 shadow-lg z-50">
          <div className="py-2 px-4">
            <Link to="/" className="block py-2 text-white hover:text-primary" onClick={toggleMobileMenu}>
              Home
            </Link>
            <Link to="/explore" className="block py-2 text-white hover:text-primary" onClick={toggleMobileMenu}>
              Explore
            </Link>
            <Link to="/dashboard" className="block py-2 text-white hover:text-primary" onClick={toggleMobileMenu}>
              Dashboard
            </Link>
            <Link to="/favorites" className="block py-2 text-white hover:text-primary" onClick={toggleMobileMenu}>
              Favorites
            </Link>
            <Link to="/profile" className="block py-2 text-white hover:text-primary" onClick={toggleMobileMenu}>
              Profile
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
