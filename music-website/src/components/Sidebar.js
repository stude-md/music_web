import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  MagnifyingGlassIcon, 
  HeartIcon, 
  ClockIcon,
  MusicalNoteIcon,
  QueueListIcon,
  RectangleStackIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`fixed top-0 left-0 z-20 h-full transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'} pt-16`}>
      <div className="flex flex-col min-h-0 h-full bg-gray-800 overflow-hidden relative">
        {/* Toggle button */}
        <button 
          className="absolute top-2 right-2 p-1 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-4 w-4" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4" />
          )}
        </button>

        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className={`flex items-center flex-shrink-0 px-4 ${isCollapsed ? 'justify-center' : ''}`}>
            {isCollapsed ? (
              <MusicalNoteIcon className="h-8 w-8 text-primary" />
            ) : (
              <span className="text-xl font-semibold text-white">SonicStream</span>
            )}
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {/* Main Navigation */}
            <div className="space-y-2 mb-6">
              {!isCollapsed && (
                <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Main
                </h3>
              )}
              <Link
                to="/"
                className={`group flex items-center py-2 text-sm font-medium rounded-md ${
                  isCollapsed ? 'justify-center px-2' : 'px-2'
                } ${
                  isActive('/') 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <HomeIcon 
                  className={`${isCollapsed ? 'h-6 w-6' : 'mr-3 h-6 w-6'} ${
                    isActive('/') ? 'text-primary' : 'text-gray-400 group-hover:text-gray-300'
                  }`}
                />
                {!isCollapsed && <span>Home</span>}
              </Link>

              <Link
                to="/explore"
                className={`group flex items-center py-2 text-sm font-medium rounded-md ${
                  isCollapsed ? 'justify-center px-2' : 'px-2'
                } ${
                  isActive('/explore') 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <MagnifyingGlassIcon 
                  className={`${isCollapsed ? 'h-6 w-6' : 'mr-3 h-6 w-6'} ${
                    isActive('/explore') ? 'text-primary' : 'text-gray-400 group-hover:text-gray-300'
                  }`}
                />
                {!isCollapsed && <span>Explore</span>}
              </Link>
            </div>

            {/* Your Library */}
            <div className="space-y-2">
              {!isCollapsed && (
                <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Your Library
                </h3>
              )}
              <Link
                to="/dashboard"
                className={`group flex items-center py-2 text-sm font-medium rounded-md ${
                  isCollapsed ? 'justify-center px-2' : 'px-2'
                } ${
                  isActive('/dashboard') 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <RectangleStackIcon 
                  className={`${isCollapsed ? 'h-6 w-6' : 'mr-3 h-6 w-6'} ${
                    isActive('/dashboard') ? 'text-primary' : 'text-gray-400 group-hover:text-gray-300'
                  }`}
                />
                {!isCollapsed && <span>Dashboard</span>}
              </Link>

              <Link
                to="/favorites"
                className={`group flex items-center py-2 text-sm font-medium rounded-md ${
                  isCollapsed ? 'justify-center px-2' : 'px-2'
                } ${
                  isActive('/favorites') 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <HeartIcon 
                  className={`${isCollapsed ? 'h-6 w-6' : 'mr-3 h-6 w-6'} ${
                    isActive('/favorites') ? 'text-primary' : 'text-gray-400 group-hover:text-gray-300'
                  }`}
                />
                {!isCollapsed && <span>Favorites</span>}
              </Link>

              <Link
                to="/recent"
                className={`group flex items-center py-2 text-sm font-medium rounded-md ${
                  isCollapsed ? 'justify-center px-2' : 'px-2'
                } ${
                  isActive('/recent') 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <ClockIcon 
                  className={`${isCollapsed ? 'h-6 w-6' : 'mr-3 h-6 w-6'} ${
                    isActive('/recent') ? 'text-primary' : 'text-gray-400 group-hover:text-gray-300'
                  }`}
                />
                {!isCollapsed && <span>Recently Played</span>}
              </Link>
            </div>

            {/* Playlists */}
            {!isCollapsed && (
              <div className="space-y-2 mt-6">
                <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Playlists
                </h3>
                
                <Link
                  to="/playlist/1"
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <QueueListIcon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
                  My Playlist #1
                </Link>

                <Link
                  to="/playlist/2"
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <QueueListIcon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
                  Workout Mix
                </Link>

                <Link
                  to="/playlist/3"
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <QueueListIcon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
                  Chill Vibes
                </Link>
              </div>
            )}
            
            {/* Collapsed Playlist Icon */}
            {isCollapsed && (
              <div className="flex justify-center mt-6">
                <Link
                  to="/playlists"
                  className="group p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <QueueListIcon className="h-6 w-6 text-gray-400 group-hover:text-gray-300" />
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
