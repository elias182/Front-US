import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { FaPlus, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Importamos el icono de FaChevronDown
import './SongDetails.css';

const SongDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [selectedLyricIndex, setSelectedLyricIndex] = useState(null);
  const [notes, setNotes] = useState([]);
  const [visibleNotes, setVisibleNotes] = useState({});
  const { userProfile } = useContext(AuthContext);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetch(`https://backend-us-production-8ae2.up.railway.app/cancion/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener la canción');
        }
        return response.json();
      })
      .then(data => {
        setSong(data);
        setLoading(false);

        if (userProfile && userProfile.id) {
          // Based on song creator, fetch notes
          const fetchUrl = data.id_usuario === userProfile.id 
            ? 'https://backend-us-production-8ae2.up.railway.app/notasuserpropietario'
            : 'https://backend-us-production-8ae2.up.railway.app/notasuser';

          fetch(fetchUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              cancion_id: id,
              usuario_id: userProfile.id,
            }),
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Error al obtener las notas');
            }
            return response.json();
          })
          .then(data => {
            setNotes(data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setError(error.message);
        setLoading(false);
      });

  }, [id, userProfile, token]);

  const handleLyricClick = (partNumber, index) => {
    console.log(`Clicked on lyric part number ${partNumber}`);
    setSelectedLyricIndex(index);
    setShowNoteForm(true);
  };

  const handleNoteChange = (e) => {
    setNoteText(e.target.value);
  };

  const handleNoteSubmit = () => {
    const newNote = {
      nota: noteText,
      id_cancion: id,
      id_usuario: userProfile.id,
      part_letra: selectedLyricIndex + 1
    };

    fetch('https://backend-us-production-8ae2.up.railway.app/api/notas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newNote),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al guardar la nota');
        }
        return response.json();
      })
      .then(data => {
        console.log('Nota guardada:', data);
        setNotes([...notes, data]);
        setNoteText('');
        setShowNoteForm(false);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleDeleteNote = (noteId) => {
    fetch(`https://backend-us-production-8ae2.up.railway.app/api/borrarnota/${noteId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al eliminar la nota');
        }
        setNotes(notes.filter(note => note.id !== noteId));
      })
      .catch(error => {
        console.error('Error eliminando la nota:', error);
      });
  };

  const toggleNotesVisibility = (index) => {
    setVisibleNotes(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  const handleEditClick = () => {
    navigate(`/editarcancion/${id}`);
  };

  const renderLyrics = () => {
    if (!song.letra) {
      return <p>No hay letra disponible para esta canción.</p>;
    }

    const lyricsArray = JSON.parse(song.letra);
    return (
      <div>
        {lyricsArray.map((part, index) => (
          <div key={index} className="lyric-container">
            
            <div className="note-actions">
            <p
              className="lyric-item"
              onClick={() => handleLyricClick(index + 1, index)}
            >
              {`${Object.values(part)[0]}`}
            </p>
              {notes.some(note => note.part_letra === index + 1) && (
                <button className="note-toggle-button" onClick={() => toggleNotesVisibility(index)}>
                  {visibleNotes[index] ? <FaChevronUp className="chevron-icon" />  : <FaChevronDown className="chevron-icon" />}
                </button>
              )}
              <button className="note-button" onClick={() => handleLyricClick(index + 1, index)}> {/* Botón para agregar nota */}
                <FaPlus></FaPlus>
              </button>
            </div>
            {visibleNotes[index] && notes
              .filter(note => note.part_letra === index + 1)
              .map(note => (
                <div key={note.id} className="note-item">
                  {note.nota}
                  {userProfile.id === song.id_usuario && (
                    <FaTrash className="delete-icon" onClick={() => handleDeleteNote(note.id)} />
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="song-details-container">
      
      <button className={"playlist-button"} onClick={() => navigate(`/anadir-a-playlist/${song.id}`)}> {/* Botón para añadir a playlist */}
        Añadir a Playlist
      </button>
      <img src={`https://backend-us-production-8ae2.up.railway.app/${song.portada}`} alt="Portada" style={{ maxWidth: '200px', marginBottom: '10px' }} />
      {userProfile && userProfile.id === song.id_usuario && (
        <button className={"playlistedit-button"} onClick={handleEditClick}>Editar Canción</button>
      )}

      <h2 className="song-title">{song.titulo}</h2>
      <p className="song-artist">Artista: {song.artista}</p>
      <h3>Letra:</h3>
      {userProfile ? (
        renderLyrics()
      ) : (
        <p>Para ver la letra, por favor inicia sesión.</p>
      )}
      
      {userProfile && showNoteForm && (
        <div className="note-form">
          <textarea
            className="note-textarea"
            value={noteText}
            onChange={handleNoteChange}
          ></textarea>
          <button  className="note-guardar" onClick={handleNoteSubmit}>Guardar Nota</button>
          <button onClick={() => setShowNoteForm(false)}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default SongDetails;
