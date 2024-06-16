import React, { useState } from 'react';
import './App.css';

function cancion() {
  const [reproduciendo, setReproduciendo] = useState(false);
  const [cancion, setCancion] = useState(null);

  const handleReproducir = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/cancion/1');
      const data = await response.json();
      console.log(data)
      // Verificar si se obtuvo la canción correctamente
      if (response.ok) {
        const url = `http://127.0.0.1:8000/audio/${data.titulo}.mp3`; // Construir la URL completa del archivo de audio
        console.log(url)
        setCancion({ ...data, archivo_audio: url });
        setReproduciendo(true);
      } else {
        console.error('Error al obtener la canción:', data.message);
      }
    } catch (error) {
      console.error('Error al obtener la canción:', error);
    }
  };

  const handlePausar = () => {
    setReproduciendo(false);
  };

  return (
    <div>
      {cancion && (
        <div>
          <h2>{cancion.titulo}</h2>
          <p>Género: {cancion.genero_musical}</p>
          <p>Año de lanzamiento: {cancion.ano_lanzamiento}</p>
          <audio src={cancion.archivo_audio} controls autoPlay={reproduciendo} />
        </div>
      )}
      <button onClick={handleReproducir} disabled={reproduciendo}>
        Reproducir
      </button>
      <button onClick={handlePausar} disabled={!reproduciendo}>
        Pausar
      </button>
    </div>
  );
}

export default cancion;
