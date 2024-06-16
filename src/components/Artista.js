import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Importa el hook useParams


function Artista() {
    const { id } = useParams();
  const [artistaInfo, setArtistaInfo] = useState(null);
  const [canciones, setCanciones] = useState([]);
  const [previewPhoto, setPreviewPhoto] = useState(`${process.env.PUBLIC_URL}/avatar_placeholder.jpg`);

  useEffect(() => {
    fetch(`https://backend-us-production-8ae2.up.railway.app/api/artista/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener la lista de reproducción');
        }
        return response.json();
      })
      .then(data => {
        setArtistaInfo(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
}, [id]);
   
useEffect(() => {
    // Verifica que tengamos la información del artista antes de realizar la solicitud
    if (id && artistaInfo) {
      fetch(`https://backend-us-production-8ae2.up.railway.app/api/usersongs/${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al obtener las canciones del artista');
          }
          return response.json();
        })
        .then(data => {
          // Actualiza el estado con las canciones obtenidas
          setCanciones(data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, [id, artistaInfo]);
  
  useEffect(() => {
    if (artistaInfo && artistaInfo.foto) {
      setPreviewPhoto(`https://backend-us-production-8ae2.up.railway.app/${artistaInfo.foto}`);
    }
  }, [artistaInfo]);

  if (!artistaInfo) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="artista">
      <div className="artista-header">
        <img 
          src={previewPhoto}
          alt="Avatar" 
          className="artista-avatar" 
        />
        <div className="artista-name">
          <h2>{artistaInfo.name}</h2>
        </div>
      </div>
      <div className="artista-info">
        <p><strong>Email:</strong> {artistaInfo.email}</p>
      </div>
      <div className="artista-canciones">
        <h3>Mis Canciones</h3>
        {canciones.length > 0 ? (
          <ul>
            {canciones.map(cancion => (
              <li key={cancion.id}>
                <p><strong>{cancion.titulo}</strong> - {cancion.artista}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay canciones disponibles.</p>
        )}
      </div>
    </div>
  );
}

export default Artista;
