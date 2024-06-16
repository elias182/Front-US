import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './Perfil.css';

function Perfil() {
  const { userProfile, setUserProfile } = useContext(AuthContext);
  const [canciones, setCanciones] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingSongs, setLoadingSongs] = useState(true);
  const token = localStorage.getItem('accessToken');
  const [editData, setEditData] = useState({
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    photo: null,
  });
  const [previewPhoto, setPreviewPhoto] = useState(`${process.env.PUBLIC_URL}/avatar_placeholder.jpg`);

  useEffect(() => {
    if (userProfile?.foto) {
      setPreviewPhoto(`https://backend-us-production-8ae2.up.railway.app/${userProfile.foto}`);
    }
  }, [userProfile]);

  useEffect(() => {
    if (userProfile && token) {
      setLoadingSongs(true);
      fetch(`https://backend-us-production-8ae2.up.railway.app/api/usersongs/${userProfile.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(data => {
          setCanciones(data);
          setLoadingSongs(false);
        })
        .catch(error => {
          console.error('Error fetching user songs:', error);
          setLoadingSongs(false);
        });
    }
  }, [userProfile, token]);

  useEffect(() => {
    if (userProfile) {
      setLoadingProfile(false);
    }
  }, [userProfile]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      const file = files[0];
      setEditData({
        ...editData,
        photo: file
      });
      setPreviewPhoto(URL.createObjectURL(file));
    } else {
      setEditData({
        ...editData,
        [name]: value
      });
    }
  };

  const handleSaveClick = () => {
    const formData = new FormData();
    formData.append('name', editData.name);
    formData.append('email', editData.email);
    if (editData.photo) {
      formData.append('photo', editData.photo);
    }

    fetch(`https://backend-us-production-8ae2.up.railway.app/api/useredit/${userProfile.id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        setUserProfile(prevProfile => ({
          ...prevProfile,
          name: data.name,
          email: data.email,
          foto: data.foto ? data.foto : prevProfile.foto
        }));
        setIsEditing(false);
      })
      .catch(error => console.error('Error updating profile:', error));
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditData({
      name: userProfile?.name || '',
      email: userProfile?.email || '',
      photo: null,
    });
    setPreviewPhoto(userProfile?.foto ? `https://backend-us-production-8ae2.up.railway.app/${userProfile.foto}` : `${process.env.PUBLIC_URL}/avatar_placeholder.jpg`);
  };

  const handleDeleteClick = (cancionId) => {
    fetch(`https://backend-us-production-8ae2.up.railway.app/api/borrarcancion/${cancionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al eliminar la canción');
        }
        return response.text(); // Cambiar a .text() para manejar respuestas vacías
      })
      .then(() => {
        setCanciones(canciones.filter(cancion => cancion.id !== cancionId));
      })
      .catch(error => console.error('Error eliminando la canción:', error));
  };

  if (loadingProfile || loadingSongs) {
    return (
      <div className="loading-spinner">
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
      </div>
    );
  }

  return (
    <div className="perfil">
      <div className="perfil-header">
        <img 
          src={previewPhoto}
          alt="Avatar" 
          className="perfil-avatar" 
        />
        {isEditing && (
          <input 
            type="file" 
            name="photo" 
            accept="image/*" 
            onChange={handleInputChange} 
          />
        )}
        <div className="perfil-name-edit">
          {isEditing ? (
            <input 
              type="text" 
              name="name" 
              value={editData.name} 
              onChange={handleInputChange} 
            />
          ) : (
            <h2>{userProfile.name}</h2>
          )}
          {!isEditing && (
            <FontAwesomeIcon 
              icon={faEdit} 
              className="edit-icon" 
              onClick={handleEditClick} 
              role="button" 
              tabIndex="0" 
            />
          )}
        </div>
      </div>
      <div className="perfil-info">
        {isEditing ? (
          <>
            <div>
              <label>Email: </label>
              <input 
                type="email" 
                name="email" 
                value={editData.email} 
                onChange={handleInputChange} 
              />
            </div>
            <button onClick={handleSaveClick}>Save</button>
            <button onClick={handleCancelClick}>Cancel</button>
          </>
        ) : (
          <>
            <p><strong>Email:</strong> {userProfile.email}</p>
          </>
        )}
      </div>
      <div className="perfil-canciones">
        <h3>Mis Canciones</h3>
        {canciones.length > 0 ? (
          <ul>
            {canciones.map(cancion => (
              <li key={cancion.id}>
                <Link to={`/cancion/${cancion.id}`} className={"song-link"}>
                  <p><strong>{cancion.titulo}</strong></p>
                </Link>
                <FontAwesomeIcon
                  icon={faTrash}
                  className="delete-icon"
                  onClick={() => handleDeleteClick(cancion.id)}
                  role="button"
                  tabIndex="0"
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>Hazte Artista</p>
        )}
      </div>
    </div>
  );
}

export default Perfil;
