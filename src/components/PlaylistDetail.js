import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './PlaylistDetail.css';
import { FaPlay, FaTrashAlt } from 'react-icons/fa';
import './loader.css';

const PlaylistDetail = ({ setCurrentSong }) => {
  const { id } = useParams();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playlistOwner, setPlaylistOwner] = useState(null);
  const { isAuthenticated, userProfile } = useContext(AuthContext);

  useEffect(() => {
    console.log('Playlist ID:', id);
    fetch(`http://backend-us-production-8ae2.up.railway.app/api/listarep/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener la lista de reproducción');
        }
        return response.json();
      })
      .then(data => {
        console.log('Data from API:', data);
        if (userProfile && playlistOwner && userProfile.id === playlistOwner.id)
        console.log('UserProfile ID:', userProfile.id);
        setSongs(data.songs || []); // Asegúrate de que canciones sea un array
        setPlaylistOwner(data.user); // Asigna el objeto usuario completo
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  const handleDeleteSong = async (songId) => {
    try {
      const response = await fetch(`http://backend-us-production-8ae2.up.railway.app/api/eliminarsong/${songId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar la canción');
      }
  
      // Recargar los datos de la lista de reproducción después de eliminar la canción
      const updatedResponse = await fetch(`http://backend-us-production-8ae2.up.railway.app/api/listarep/${id}`);
      const updatedData = await updatedResponse.json();
      setSongs(updatedData.songs || []);
    } catch (error) {
      console.error('Error eliminando la canción:', error);
      setError(error.message);
    }
  };
  

  if (loading) {
    return (
      <div className="loading-spinner">
        <svg height="128px" width="128px" viewBox="0 0 128 128" className="pl1">
          {/* SVG content */}
        </svg>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Detalles de la Lista de Reproducción</h2>
      {songs.length === 0 ? (
        <p>La lista de reproducción no tiene canciones por el momento.</p>
      ) : (
        <ul>
          {songs.map(song => (
            <li key={song.id} className="song-item">
              <FaPlay className="play-button" onClick={() => setCurrentSong(song)} />
              <Link to={`/cancion/${song.id}`} className="song-link">
                {song.titulo}
              </Link>
              {userProfile && playlistOwner && userProfile.id === playlistOwner.id && (
                <FaTrashAlt
                  className="delete-icon"
                  onClick={() => handleDeleteSong(song.pivot.id)}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlaylistDetail;
