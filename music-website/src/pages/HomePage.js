import React from 'react';
import { Link } from 'react-router-dom';
import { musicData, playlists, genres } from '../data/musicData';
import { useContext } from 'react';
import { AudioContext } from '../context/AudioContext';

const HomePage = () => {
  const { playTrack } = useContext(AudioContext);

  return (
    <div className="py-8">
      {/* Hero Section */}
      <section className="relative h-96 mb-12 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-70"></div>
        <img 
          src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1470&q=80" 
          alt="Music Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            SonicStream Music
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl">
            Stream unlimited music, create playlists, and discover new artists. 
            Free for a limited time.
          </p>
          <div className="flex gap-4">
            <Link to="/explore" className="btn btn-primary">
              Start Exploring
            </Link>
            <Link to="/dashboard" className="btn bg-white text-primary hover:bg-gray-100">
              My Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Tracks */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Popular Tracks</h2>
          <Link to="/explore" className="text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {musicData.slice(0, 5).map((track) => (
            <div 
              key={track.id} 
              className="card p-3 hover:bg-gray-800 transition-colors cursor-pointer"
              onClick={() => playTrack(track, musicData)}
            >
              <div className="mb-3 aspect-square rounded-md overflow-hidden">
                <img 
                  src={track.albumArt} 
                  alt={track.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-white font-semibold truncate">{track.title}</h3>
              <p className="text-gray-400 text-sm truncate">{track.artist}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Playlists */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Featured Playlists</h2>
          <Link to="/playlists" className="text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <Link 
              key={playlist.id}
              to={`/playlist/${playlist.id}`}
              className="card overflow-hidden group"
            >
              <div className="relative h-48">
                <img 
                  src={playlist.coverImage} 
                  alt={playlist.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-4">
                  <div>
                    <h3 className="text-white text-xl font-bold">{playlist.name}</h3>
                    <p className="text-gray-200 text-sm">{playlist.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Genres */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Explore Genres</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {genres.map((genre, index) => (
            <Link 
              key={index}
              to={`/genre/${genre}`}
              className={`px-4 py-2 rounded-full ${
                genre === 'All' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {genre}
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Why Choose SonicStream?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card p-6 flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">High Quality Audio</h3>
            <p className="text-gray-400">
              Enjoy crystal clear sound quality with our premium audio streaming technology.
            </p>
          </div>
          <div className="card p-6 flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Free Downloads</h3>
            <p className="text-gray-400">
              Download your favorite tracks for offline listening, free for a limited time.
            </p>
          </div>
          <div className="card p-6 flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Personalized Experience</h3>
            <p className="text-gray-400">
              Get recommendations based on your listening history and preferences.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
