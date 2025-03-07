import React, { useState, useEffect, useContext } from 'react';
import { AudioContext } from '../context/AudioContext';
import axios from 'axios';
import baseURL from '../config/api';

const ExplorePage = () => {
  const { playTrack } = useContext(AudioContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [trendingTracks, setTrendingTracks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreTracks, setGenreTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('trending');

  // Fetch trending tracks when component mounts
  useEffect(() => {
    const fetchTrendingTracks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseURL}/search/trending`);
        setTrendingTracks(response.data.tracks || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trending tracks:', error);
        setLoading(false);
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${baseURL}/search/genres`);
        setGenres(response.data.genres || []);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchTrendingTracks();
    fetchGenres();
  }, []);

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/search/tracks?query=${searchQuery}`);
      setSearchResults(response.data.tracks || []);
      setActiveTab('search');
      setLoading(false);
    } catch (error) {
      console.error('Error searching tracks:', error);
      setLoading(false);
    }
  };

  // Handle genre selection
  const handleGenreSelect = async (genreId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/search/genres/${genreId}/tracks`);
      setGenreTracks(response.data.tracks || []);
      setSelectedGenre(genreId);
      setActiveTab('genre');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching genre tracks:', error);
      setLoading(false);
    }
  };

  // Format duration
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Handle play track
  const handlePlayTrack = (track) => {
    const formattedTrack = {
      id: track.id,
      title: track.title,
      artist: track.artist,
      coverImage: track.coverImage,
      audioSrc: track.audioSrc,
      duration: track.duration
    };
    
    // If we have multiple tracks, pass them as a playlist
    let trackList = [];
    if (activeTab === 'trending') {
      trackList = trendingTracks.map(t => ({
        id: t.id,
        title: t.title,
        artist: t.artist,
        coverImage: t.coverImage,
        audioSrc: t.audioSrc,
        duration: t.duration
      }));
    } else if (activeTab === 'search') {
      trackList = searchResults.map(t => ({
        id: t.id,
        title: t.title,
        artist: t.artist,
        coverImage: t.coverImage,
        audioSrc: t.audioSrc,
        duration: t.duration
      }));
    } else if (activeTab === 'genre') {
      trackList = genreTracks.map(t => ({
        id: t.id,
        title: t.title,
        artist: t.artist,
        coverImage: t.coverImage,
        audioSrc: t.audioSrc,
        duration: t.duration
      }));
    }
    
    playTrack(formattedTrack, trackList);
  };

  return (
    <div className="p-6 h-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-white">Explore Music</h1>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center mb-6">
          <input
            type="text"
            placeholder="Search for songs, artists, or albums..."
            className="bg-gray-800 text-white border-none rounded-l-lg py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-primary hover:bg-green-600 text-white py-3 px-6 rounded-r-lg transition-colors duration-300"
          >
            Search
          </button>
        </form>
        
        {/* Genre Pills */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {genres.map(genre => (
              <button
                key={genre.id}
                onClick={() => handleGenreSelect(genre.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors duration-300 ${
                  selectedGenre === genre.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('trending')}
            className={`pb-2 px-1 font-medium transition-colors duration-300 ${
              activeTab === 'trending'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Trending
          </button>
          {searchResults.length > 0 && (
            <button
              onClick={() => setActiveTab('search')}
              className={`pb-2 px-1 font-medium transition-colors duration-300 ${
                activeTab === 'search'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Search Results
            </button>
          )}
          {genreTracks.length > 0 && (
            <button
              onClick={() => setActiveTab('genre')}
              className={`pb-2 px-1 font-medium transition-colors duration-300 ${
                activeTab === 'genre'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Genre
            </button>
          )}
        </div>
        
        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        {/* Track List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {activeTab === 'trending' &&
            trendingTracks.map(track => (
              <div
                key={track.id}
                className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors duration-300 cursor-pointer group"
                onClick={() => handlePlayTrack(track)}
              >
                <div className="relative">
                  <img
                    src={track.coverImage || 'https://via.placeholder.com/300?text=No+Image'}
                    alt={track.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg truncate">{track.title}</h3>
                  <p className="text-gray-400 truncate">{track.artist}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">{formatDuration(track.duration)}</span>
                    <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-300">
                      {track.position ? `#${track.position}` : 'Trending'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
          {activeTab === 'search' &&
            searchResults.map(track => (
              <div
                key={track.id}
                className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors duration-300 cursor-pointer group"
                onClick={() => handlePlayTrack(track)}
              >
                <div className="relative">
                  <img
                    src={track.coverImage || 'https://via.placeholder.com/300?text=No+Image'}
                    alt={track.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg truncate">{track.title}</h3>
                  <p className="text-gray-400 truncate">{track.artist}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">{formatDuration(track.duration)}</span>
                    <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-300">
                      {track.album}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
          {activeTab === 'genre' &&
            genreTracks.map(track => (
              <div
                key={track.id}
                className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors duration-300 cursor-pointer group"
                onClick={() => handlePlayTrack(track)}
              >
                <div className="relative">
                  <img
                    src={track.coverImage || 'https://via.placeholder.com/300?text=No+Image'}
                    alt={track.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg truncate">{track.title}</h3>
                  <p className="text-gray-400 truncate">{track.artist}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">{formatDuration(track.duration)}</span>
                    <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-300">
                      {genres.find(g => g.id === selectedGenre)?.name || 'Genre'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
