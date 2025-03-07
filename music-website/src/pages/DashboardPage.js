import React, { useContext } from 'react';
import { AudioContext } from '../context/AudioContext';
import { HeartIcon, ClockIcon, MusicalNoteIcon, PlayIcon } from '@heroicons/react/24/solid';

const DashboardPage = () => {
  const { recentlyPlayed, favorites, playTrack } = useContext(AudioContext);

  return (
    <div className="py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Your Dashboard</h1>
        <p className="text-gray-400">
          Track your music journey and manage your favorite songs
        </p>
      </header>

      {/* Recently Played */}
      <section className="mb-10">
        <div className="flex items-center mb-6">
          <ClockIcon className="h-6 w-6 text-primary mr-2" />
          <h2 className="text-2xl font-bold text-white">Recently Played</h2>
        </div>
        
        {recentlyPlayed.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <MusicalNoteIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">You haven't played any songs yet</p>
            <p className="text-gray-500">Start listening to see your history here</p>
          </div>
        ) : (
          <div className="bg-dark rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-400 font-medium">#</th>
                  <th className="py-3 px-4 text-left text-gray-400 font-medium">Title</th>
                  <th className="py-3 px-4 text-left text-gray-400 font-medium hidden md:table-cell">Artist</th>
                  <th className="py-3 px-4 text-left text-gray-400 font-medium hidden lg:table-cell">Genre</th>
                  <th className="py-3 px-4 text-left text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentlyPlayed.map((track, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-300">{index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded overflow-hidden mr-3">
                          <img 
                            src={track.albumArt} 
                            alt={track.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="text-white">{track.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-400 hidden md:table-cell">{track.artist}</td>
                    <td className="py-3 px-4 text-gray-400 hidden lg:table-cell">{track.genre}</td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={() => playTrack(track)}
                        className="p-2 text-gray-400 hover:text-primary transition-colors"
                      >
                        <PlayIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Favorites */}
      <section>
        <div className="flex items-center mb-6">
          <HeartIcon className="h-6 w-6 text-primary mr-2" />
          <h2 className="text-2xl font-bold text-white">Your Favorites</h2>
        </div>
        
        {favorites.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <HeartIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">No favorite songs yet</p>
            <p className="text-gray-500">Heart the songs you love to see them here</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favorites.map((track) => (
              <div 
                key={track.id} 
                className="card p-3 hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => playTrack(track, favorites)}
              >
                <div className="mb-3 aspect-square rounded-md overflow-hidden relative group">
                  <img 
                    src={track.albumArt} 
                    alt={track.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayIcon className="h-12 w-12 text-white" />
                  </div>
                </div>
                <h3 className="text-white font-semibold truncate">{track.title}</h3>
                <p className="text-gray-400 text-sm truncate">{track.artist}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
