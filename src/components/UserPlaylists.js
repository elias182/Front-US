import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import './loader.css';
import './UserPlaylists.css';

function UserPlaylists() {
  const { userProfile } = useContext(AuthContext);
  const [playlists, setPlaylists] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ id: null, nombre: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({ nombre: '', descripcion: '' });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (userProfile && token) {
      fetchPlaylists();
    }
  }, [userProfile, token]);

  const fetchPlaylists = () => {
    setLoading(true);
    fetch(`http://localhost:8000/api/biblioteca/${userProfile.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setPlaylists(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user playlists:', error);
        setLoading(false);
      });
  };

  const handleEditClick = (playlist) => {
    setIsEditing(true);
    setEditData({ id: playlist.id, nombre: playlist.nombre });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value
    });
  };

  const handleSaveClick = () => {
    fetch(`http://localhost:8000/api/actualizarlist/${editData.id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre: editData.nombre })
    })
      .then(response => response.json())
      .then(data => {
        setIsEditing(false);
        fetchPlaylists();
      })
      .catch(error => console.error('Error updating playlist:', error));
  };

  const handleDeleteClick = (id) => {
    fetch(`http://localhost:8000/api/eliminarlist/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.ok) {
          fetchPlaylists();
        }
      })
      .catch(error => console.error('Error deleting playlist:', error));
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditData({ id: null, nombre: '' });
  };

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlaylist({
      ...newPlaylist,
      [name]: value
    });
  };

  const handleAddSaveClick = () => {
    fetch(`http://localhost:8000/api/crearlist`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: newPlaylist.nombre,
        descripcion: newPlaylist.descripcion,
        privada: 0,
        id_usuario: userProfile.id
      })
    })
      .then(response => response.json())
      .then(data => {
        setIsAdding(false);
        setNewPlaylist({ nombre: '', descripcion: '' });
        fetchPlaylists();
      })
      .catch(error => console.error('Error creating playlist:', error));
  };

  const handleAddCancelClick = () => {
    setIsAdding(false);
    setNewPlaylist({ nombre: '', descripcion: '' });
  };

  if (!userProfile) {
    return (
      <main>
        <svg height="128px" width="128px" viewBox="0 0 128 128" className="pl1">
          <defs>
            <linearGradient y2="1" x2="1" y1="0" x1="0" id="pl-grad">
              <stop stopColor="#000" offset="0%"></stop>
              <stop stopColor="#fff" offset="100%"></stop>
            </linearGradient>
            <mask id="pl-mask">
              <rect fill="url(#pl-grad)" height="128" width="128" y="0" x="0"></rect>
            </mask>
          </defs>
          <g fill="var(--primary)">
            <g className="pl1__g">
              <g transform="translate(20,20) rotate(0,44,44)">
                <g className="pl1__rect-g">
                  <rect height="40" width="40" ry="8" rx="8" className="pl1__rect"></rect>
                  <rect transform="translate(0,48)" height="40" width="40" ry="8" rx="8" className="pl1__rect"></rect>
                </g>
                <g transform="rotate(180,44,44)" className="pl1__rect-g">
                  <rect height="40" width="40" ry="8" rx="8" className="pl1__rect"></rect>
                  <rect transform="translate(0,48)" height="40" width="40" ry="8" rx="8" className="pl1__rect"></rect>
                </g>
              </g>
            </g>
          </g>
          <g mask="url(#pl-mask)" fill="hsl(343,90%,50%)">
            <g className="pl1__g">
              <g transform="translate(20,20) rotate(0,44,44)">
                <g className="pl1__rect-g">
                  <rect height="40" width="40" ry="8" rx="8" className="pl1__rect"></rect>
                  <rect transform="translate(0,48)" height="40" width="40" ry="8" rx="8" className="pl1__rect"></rect>
                </g>
                <g transform="rotate(180,44,44)" className="pl1__rect-g">
                  <rect height="40" width="40" ry="8" rx="8" className="pl1__rect"></rect>
                  <rect transform="translate(0,48)" height="40" width="40" ry="8" rx="8" className="pl1__rect"></rect>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </main>
    );
  }

  return (
    <div className="user-playlists">
      <h3>Mis Listas de Reproducción</h3>
      <button onClick={handleAddClick} className="add-playlist-button">
        <FontAwesomeIcon icon={faPlusCircle} /> Añadir Lista de Reproducción
      </button>
      {isAdding && (
        <div className="add-playlist-form">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre de la lista"
            value={newPlaylist.nombre}
            onChange={handleNewInputChange}
          />
          <button onClick={handleAddSaveClick}>Guardar</button>
          <button onClick={handleAddCancelClick}>Cancelar</button>
        </div>
      )}
      {loading ? (
        <main>
          <svg height="128px" width="128px" viewBox="0 0 128 128" className="pl1">
            <defs>
              <linearGradient y2="1" x2="1" y1="0" x1="0" id="pl-grad">
                <stop stopColor="#000" offset="0%"></stop>
                <stop stopColor="#fff" offset="100%"></stop>
              </linearGradient>
              <mask id="pl-mask">
                <rect fill="url(#pl-grad)" height="128" width="128" y="0" x="0"></rect>
              </mask>
            </defs>
            <g fill="var(--primary)">
              <g className="pl1__g">
                <g transform="translate(20,20) rotate(0,44,44)">
                  <g className="pl1__rect-g">
                    <rect height="40" width="40" ry="8" rx="8" className="pl1__rect"></rect>
                    <rect transform="translate(0,48)" height="40" width="40" ry="8" rx="8" className="pl1__rect"></rect>
                  </g>
                  <g transform="rotate(180,44,44)" className="pl1__rect-g">
                    <rect height="40" width="40" ry="8" rx="8" className="pl1__rect"></rect>
                    <rect transform="translate(0,48)" height="40" width="40" ry="8" rx="8" className="pl1__rect"></rect>
                  </g>
                </g>
              </g>
            </g>
            <g mask="url(#pl-mask)" fill="hsl(343,90%,50%)">
              <g className="pl1__g">
                <g transform="translate(20,20) rotate(0,44,44)">
                  <g className="pl1__rect-g">
                    <rect height="40" width="40" ry="8" rx="8" className="pl1__rect"></rect>
                    <rect transform="translate(0,48)" height="40" width="40" ry="8" rx="8" className="pl1__rect"></rect>
                  </g>
                  <g transform="rotate(180,44,44)" className="pl1__rect-g">
                    <rect height="40" width="40" ry="8" rx="8" className="pl1__rect"></rect>
                    <rect transform="translate(0,48)" height="40" width="40" ry="8" rx="8" className="pl1__rect"></rect>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </main>
      ) : (
        <>
          {playlists.length > 0 ? (
            <ul>
              {playlists.map(playlist => (
                <li key={playlist.id}>
                  {isEditing && editData.id === playlist.id ? (
                    <div>
                      <input
                        type="text"
                        name="nombre"
                        value={editData.nombre}
                        onChange={handleInputChange}
                      />
                      <button onClick={handleSaveClick}>Guardar</button>
                      <button onClick={handleCancelClick}>Cancelar</button>
                    </div>
                  ) : (
                    <div>
                      <Link className={"song-link"} to={`/playlist/${playlist.id}`}>
                        <p><strong>{playlist.nombre}</strong></p>
                      </Link>
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="edit-icon"
                        onClick={() => handleEditClick(playlist)}
                        role="button"
                        tabIndex="0"
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="delete-icon"
                        onClick={() => handleDeleteClick(playlist.id)}
                        role="button"
                        tabIndex="0"
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No tienes listas de reproducción.</p>
          )}
        </>
      )}
    </div>
  );
}

export default UserPlaylists;
