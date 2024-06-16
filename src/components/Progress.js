import React, { useRef } from "react";
import styles from "./Progress.module.css";

export const Progress = ({
  value,
  onChange,
  onMouseUp,
  onTouchEnd,
  progress,
  audioRef, // Proporciona la referencia al elemento de audio
}) => {
  const handleProgressChange = (e) => {
    const newProgress = e.target.value;
    onChange(e); // Propaga el evento onChange al componente padre
    setAudioTime(newProgress); // Actualiza el tiempo de reproducción del audio
  };

  const setAudioTime = (newProgress) => {
    if (audioRef.current && isFinite(audioRef.current.duration)) {
      const newTime = ((newProgress) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      console.log("Segundo actual:", currentTime); // Imprime el segundo actual en la consola
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="range"
        min="1"
        max="100"
        step="1"
        value={value}
        className={styles.slider}
        id="myRange"
        onChange={handleProgressChange}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
        onTimeUpdate={handleTimeUpdate} // Maneja el evento de actualización de tiempo
        style={{
          background: `linear-gradient(90deg, var(--progressUsed) 0%, var(--progressSlider) ${Math.floor(
            value
          )}%, var(--bufferLoaded) ${Math.floor(
            value
          )}%, var(--bufferLoaded) ${Math.floor(
            progress
          )}%, var(--progressLeft) ${Math.floor(
            progress
          )}%, var(--progressLeft) 100%)`,
        }}
      />
    </div>
  );
};
