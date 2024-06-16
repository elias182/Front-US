import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Importa el hook useParams
import { AuthContext } from './AuthContext';

function Expandir() {
  const { idCancion } = useParams(); // Obtén el parámetro idUsuario de la URL
  const [playlists, setPlaylists] = useState([]);
  const token = localStorage.getItem('accessToken');
  const { userProfile } = useContext(AuthContext);

  useEffect(() => {
    if (userProfile && userProfile.id && token) {
      fetchPlaylists();
    }
  }, [userProfile, token]);

  const fetchPlaylists = () => {
    fetch(`https://backend-us-production-8ae2.up.railway.app/api/biblioteca/${userProfile.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => setPlaylists(data))
      .catch(error => console.error('Error fetching user playlists:', error));
  };

  const handlePlaylistClick = (playlistId) => {
    console.log("idcancion:" + idCancion + " idplaylist:" + playlistId)
    fetch('https://backend-us-production-8ae2.up.railway.app/api/expandirplaylist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        id_cancion: idCancion,
        id_lista: playlistId
      })

    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al añadir la canción a la playlist');
        }
        return response.json();
      })
      .then(data => {
        console.log('Canción añadida a la playlist:', data);
      })
      .catch(error => console.error('Error:', error));
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-playlists">
      <h3>Seleccione Playlist para añadirla</h3>
      {playlists.length > 0 ? (
        <ul>
          {playlists.map(playlist => (
            <li key={playlist.id}>
              <div onClick={() => handlePlaylistClick(playlist.id)} >
                <p><strong>{playlist.nombre}</strong></p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay listas de reproducción disponibles.</p>
      )}
    </div>
  );
}

export default Expandir;
