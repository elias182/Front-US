import React, { useState, useEffect, useRef } from 'react';
import { Progress } from './Progress';
import { FaPlay, FaPause } from 'react-icons/fa';
import './Footer.css';

function Footer({ currentSong }) {
  const [progress, setProgress] = useState(0); // Progreso de la canción en porcentaje
  const [volume, setVolume] = useState(50); // Volumen en porcentaje
  const [isPlaying, setIsPlaying] = useState(false); // Estado de reproducción
  const [isDragging, setIsDragging] = useState(false); // Estado de arrastre de la barra de progreso
  const [dragStartProgress, setDragStartProgress] = useState(0); // Progreso de la canción al comenzar a arrastrar
  const audioRef = useRef(null); // Referencia al elemento de audio

  useEffect(() => {
    if (currentSong && audioRef.current) {
      // Reset progress when a new song starts
      setProgress(0);
      setIsPlaying(false);

      const fetchAudio = async () => {
        try {
          const response = await fetch(`https://5cf3-85-57-241-122.ngrok-free.app/${currentSong.archivo_audio}.mp3`, {
            headers: {
              'ngrok-skip-browser-warning': 'true'
            }
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const blob = await response.blob();
          const url = URL.createObjectURL(blob);

          audioRef.current.src = url;
          audioRef.current.load();
        } catch (error) {
          console.error('Audio fetch error:', error);
        }
      };

      // Play the song automatically when it's ready
      const handleCanPlayThrough = () => {
        audioRef.current.play();
        setIsPlaying(true);
        audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
      };

      fetchAudio();
      audioRef.current.addEventListener('canplaythrough', handleCanPlayThrough);

      // Clean up event listeners on component unmount or song change
      return () => {
        audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
      };
    }
  }, [currentSong]);

  const handleProgressChange = (e) => {
    const newProgress = e.target.value;
    setProgress(newProgress);
  };

  const handleProgressCommit = () => {
    setIsDragging(false); // Terminar el arrastre
    if (audioRef.current && isFinite(audioRef.current.duration)) {
      const newTime = (progress / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);

    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false); // Update play state
      } else {
        audioRef.current.play();
        setIsPlaying(true); // Update play state
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && !isDragging) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (isFinite(duration)) {
        setProgress((currentTime / duration) * 100);
      }
    }
  };

  // Define handleAudioError to handle audio errors
  const handleAudioError = (e) => {
    console.error('Audio Error:', e);
  };

  return (
    <div className="footer d-flex justify-content-between align-items-center p-3">
      <div className="playing-now d-flex align-items-center">
        {currentSong && currentSong.portada ? (
          <img src={`https://backend-us-production-8ae2.up.railway.app/${currentSong.portada}`} alt="Album Cover" className="album-cover me-3" />
        ) : (
          <img src={`${process.env.PUBLIC_URL}/avatar_placeholder.jpg`} alt="Album Cover" className="album-cover me-3" />
        )}
        <div className="song-info">
          <span className="song-title">{currentSong ? currentSong.titulo : 'Elija Una Cancion'}</span>
          <span className="artist-name">{currentSong ? currentSong.artista : 'Se reproducira aqui'}</span>
        </div>
      </div>
      <div className="controls d-flex align-items-center">
        <div className="icon" onClick={togglePlayPause}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </div>
        <div className="progress-bar-container position-relative me-3">
          <Progress
            value={isDragging ? dragStartProgress : progress} // Use dragStartProgress if dragging
            onChange={handleProgressChange}
            onMouseDown={() => {
              setIsDragging(true);
              setDragStartProgress(progress);
            }}
            onMouseUp={handleProgressCommit}
            onTouchStart={() => {
              setIsDragging(true);
              setDragStartProgress(progress);
            }}
            onTouchEnd={handleProgressCommit}
            progress={progress}
            audioRef={audioRef} // Pasa audioRef como una prop
          />
        </div>
      </div>
      <div className="volume-control d-flex align-items-center">
        <i className="bi bi-volume-up me-2"></i>
        <input
          type="range"
          className="volume-bar"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
      {currentSong && (
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onError={handleAudioError}
        >
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}

export default Footer;
