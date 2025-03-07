import React, { createContext, useState, useEffect, useRef } from 'react';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    // Load saved data from localStorage
    const savedFavorites = localStorage.getItem('favorites');
    const savedRecentlyPlayed = localStorage.getItem('recentlyPlayed');
    const savedVolume = localStorage.getItem('volume');
    
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedRecentlyPlayed) setRecentlyPlayed(JSON.parse(savedRecentlyPlayed));
    if (savedVolume) setVolume(parseFloat(savedVolume));
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  useEffect(() => {
    localStorage.setItem('volume', volume.toString());
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (currentTrack && !recentlyPlayed.some(track => track.id === currentTrack.id)) {
      const updatedRecents = [currentTrack, ...recentlyPlayed.slice(0, 9)];
      setRecentlyPlayed(updatedRecents);
    }
  }, [currentTrack, recentlyPlayed]);

  const playTrack = (track, trackList = []) => {
    setCurrentTrack(track);
    if (trackList.length > 0) {
      setPlaylist(trackList);
      setCurrentIndex(trackList.findIndex(item => item.id === track.id));
    }
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error("Playback failed:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleFavorite = (track) => {
    if (favorites.some(favTrack => favTrack.id === track.id)) {
      setFavorites(favorites.filter(favTrack => favTrack.id !== track.id));
    } else {
      setFavorites([...favorites, track]);
    }
  };

  const isFavorite = (trackId) => {
    return favorites.some(track => track.id === trackId);
  };

  const nextTrack = () => {
    if (playlist.length === 0) return;
    
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    setCurrentTrack(playlist[nextIndex]);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    if (playlist.length === 0) return;
    
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentIndex(prevIndex);
    setCurrentTrack(playlist[prevIndex]);
    setIsPlaying(true);
  };

  const seekTo = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleTrackEnded = () => {
    nextTrack();
  };

  return (
    <AudioContext.Provider
      value={{
        audioRef,
        currentTrack,
        isPlaying,
        duration,
        currentTime,
        volume,
        recentlyPlayed,
        favorites,
        playlist,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        seekTo,
        setVolume,
        toggleFavorite,
        isFavorite,
        handleTimeUpdate,
        handleTrackEnded
      }}
    >
      {children}
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.audioSrc}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleTrackEnded}
          autoPlay={isPlaying}
        />
      )}
    </AudioContext.Provider>
  );
};
