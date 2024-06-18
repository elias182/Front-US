import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './AñadirCancion.css';

function AñadirCancion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [letra, setLetra] = useState([]);
  const [idGenero, setIdGenero] = useState('');
  const [archivoAudio, setArchivoAudio] = useState(null);
  const [portada, setPortada] = useState(null);
  const [portadaUrl, setPortadaUrl] = useState(null);
  const [generos, setGeneros] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, userProfile, logout } = useContext(AuthContext);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetch('https://backend-us-production-8ae2.up.railway.app/api/generos')
      .then(response => response.json())
      .then(data => setGeneros(data))
      .catch(error => console.error('Error fetching genres:', error));
  }, []);

  useEffect(() => {
    if (id) {
      fetch(`https://backend-us-production-8ae2.up.railway.app/api/cancion/${id}`)
        .then(response => response.json())
        .then(data => {
          setTitulo(data.titulo);
          setLetra(data.letra);
          setIdGenero(data.id_genero);
          setPortadaUrl(`https://backend-us-production-8ae2.up.railway.app/${data.portada}`);
        })
        .catch(error => console.error('Error fetching song:', error));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
  
    const formData = new FormData();
    formData.append('titulo', titulo);
    if (!id) {
      formData.append('letra', JSON.stringify(letra.split('\n').map((line, index) => ({ [index + 1]: line }))));
    }
    formData.append('id_genero', idGenero);
    if (archivoAudio || !id) formData.append('archivo_audio', archivoAudio || ''); // Ajuste aquí
  
    if (portada) formData.append('portada', portada);
    if (userProfile) formData.append('id_usuario', userProfile.id);
  
    const url = id ? `https://5cf3-85-57-241-122.ngrok-free.app/api/editarcancion/${id}` : 'https://5cf3-85-57-241-122.ngrok-free.app/api/anadircancion';
    const method = 'POST';
  
    try {
      const response = await fetch(url, {
        method: method,
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Error desconocido. Por favor, inténtalo de nuevo más tarde.');
        console.error('Error adding/updating song:', errorData);
        setLoading(false);
        return;
      }
  
      const data = await response.json();
      console.log('Song added/updated successfully:', data);
  
      setLoading(false);
      navigate(`/perfil`);
    } catch (error) {
      console.error('Error processing the request:', error);
      setError('Error procesando la solicitud. Por favor, inténtalo de nuevo más tarde.');
      setLoading(false);
    }
  };

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };
  return (
    <div className="añadir-cancion">
      <h2>{id ? 'Editar Canción' : 'Añadir Canción'}</h2>
      {error && <p className="error-message">Error: {JSON.stringify(error)}</p>}
      {loading && <p>Cargando...</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className='labelform' htmlFor="titulo">Título</label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>
        {!id && (
          <div className="form-group">
            <label className='labelform' htmlFor="letra">Letra</label>
            <textarea
              id="letra"
              value={letra}
              onChange={(e) => setLetra(e.target.value)}
            />
          </div>
        )}
        <div className="form-group">
          <label className='labelform' htmlFor="idGenero">Género</label>
          <select
            id="idGenero"
            value={idGenero}
            onChange={(e) => setIdGenero(e.target.value)}
            required
          >
            <option value="">Selecciona un género</option>
            {generos.map((genero) => (
              <option key={genero.id} value={genero.id}>
                {genero.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className='labelform' htmlFor="archivoAudio">Archivo de Audio</label>
          <input
            type="file"
            id="archivoAudio"
            accept="audio/*"
            onChange={(e) => handleFileChange(e, setArchivoAudio)}
            required={!id}
          />
        </div>
        <div className="form-group">
          <label className='labelform' htmlFor="portada">Portada</label>
          <input
            type="file"
            id="portada"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setPortada)}
          />
          {portadaUrl && <img src={portadaUrl} alt="Portada" style={{ maxWidth: '200px', marginBottom: '10px' }} />}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : id ? 'Guardar Cambios' : 'Añadir Canción'}
        </button>
      </form>
    </div>
  );
}

export default AñadirCancion;
