import React, { useContext, useEffect, useState, useRef } from 'react';
import { AudioContext } from '../context/AudioContext';
import { 
  PlayIcon, 
  PauseIcon, 
  ForwardIcon, 
  BackwardIcon, 
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from '@heroicons/react/24/solid';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const MusicPlayer = () => {
  const { 
    audioRef,
    currentTrack, 
    isPlaying, 
    duration,
    currentTime,
    volume,
    togglePlay, 
    nextTrack, 
    prevTrack,
    seekTo,
    setVolume,
    toggleFavorite,
    isFavorite
  } = useContext(AudioContext);
  
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const progressBarRef = useRef(null);
  const volumeControlRef = useRef(null);

  // Format time in mm:ss
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle progress bar click to seek
  const handleProgressBarClick = (e) => {
    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newTime = (offsetX / progressBar.offsetWidth) * duration;
    seekTo(newTime);
  };

  // Handle volume control click
  const handleVolumeChange = (e) => {
    const volumeBar = volumeControlRef.current;
    const rect = volumeBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newVolume = Math.max(0, Math.min(1, offsetX / volumeBar.offsetWidth));
    setVolume(newVolume);
  };

  // Close volume control when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (volumeControlRef.current && !volumeControlRef.current.contains(e.target)) {
        setShowVolumeControl(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = currentTime;
    }
  }, [currentTime, audioRef]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2">
        {currentTrack ? (
          <div className="flex flex-col md:flex-row items-center">
            {/* Progress Bar (for all screens) */}
            <div 
              className="w-full h-1 bg-gray-600 rounded-full mb-2 cursor-pointer"
              onClick={handleProgressBarClick}
              ref={progressBarRef}
            >
              <div 
                className="h-full bg-primary rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            
            <div className="flex w-full items-center">
              {/* Track Info */}
              <div className="flex items-center mr-4 w-1/3">
                <div className="h-12 w-12 mr-3 flex-shrink-0">
                  <img 
                    src={currentTrack.coverImage || 'https://via.placeholder.com/80'} 
                    alt={currentTrack.title}
                    className="h-full w-full object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                    }}
                  />
                </div>
                <div className="truncate">
                  <h3 className="text-white text-sm font-medium truncate">{currentTrack.title}</h3>
                  <p className="text-gray-400 text-xs truncate">{currentTrack.artist}</p>
                </div>
                <button 
                  className="ml-3 focus:outline-none"
                  onClick={() => toggleFavorite(currentTrack)}
                >
                  {isFavorite(currentTrack.id) ? (
                    <HeartIconSolid className="h-5 w-5 text-primary" />
                  ) : (
                    <HeartIcon className="h-5 w-5 text-gray-400 hover:text-primary" />
                  )}
                </button>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-center space-x-4 flex-1">
                <button 
                  className="text-gray-400 hover:text-white focus:outline-none"
                  onClick={prevTrack}
                >
                  <BackwardIcon className="h-5 w-5" />
                </button>
                <button 
                  className="bg-white rounded-full p-2 hover:bg-gray-200 focus:outline-none"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <PauseIcon className="h-6 w-6 text-black" />
                  ) : (
                    <PlayIcon className="h-6 w-6 text-black" />
                  )}
                </button>
                <button 
                  className="text-gray-400 hover:text-white focus:outline-none"
                  onClick={nextTrack}
                >
                  <ForwardIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Volume and Time */}
              <div className="flex items-center justify-end w-1/3 space-x-4">
                <div className="hidden md:flex text-xs text-gray-400 space-x-1 min-w-[80px]">
                  <span>{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                </div>
                
                <div className="relative">
                  <button 
                    className="text-gray-400 hover:text-white focus:outline-none"
                    onClick={() => setShowVolumeControl(!showVolumeControl)}
                  >
                    {volume === 0 ? (
                      <SpeakerXMarkIcon className="h-5 w-5" />
                    ) : (
                      <SpeakerWaveIcon className="h-5 w-5" />
                    )}
                  </button>
                  
                  {/* Volume Slider */}
                  {showVolumeControl && (
                    <div 
                      className="absolute bottom-8 left-0 bg-gray-700 p-2 rounded-md w-32"
                      ref={volumeControlRef}
                    >
                      <div 
                        className="h-1 bg-gray-600 rounded-full cursor-pointer"
                        onClick={handleVolumeChange}
                      >
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${volume * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-4">
            <p className="text-gray-400">Select a track to play</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;
