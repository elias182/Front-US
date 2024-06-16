import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Content.css';
import './loader.css'

function Content() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/listsprin')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener las listas de reproducción');
        }
        return response.json();
      })
      .then(data => {
        setPlaylists(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  

  if (loading) {
    return <main>
    <svg height="128px" width="128px" viewBox="0 0 128 128" class="pl1">
      <defs>
        <linearGradient y2="1" x2="1" y1="0" x1="0" id="pl-grad">
          <stop stop-color="#000" offset="0%"></stop>
          <stop stop-color="#fff" offset="100%"></stop>
        </linearGradient>
        <mask id="pl-mask">
          <rect fill="url(#pl-grad)" height="128" width="128" y="0" x="0"></rect>
        </mask>
      </defs>
      <g fill="var(--primary)">
        <g class="pl1__g">
          <g transform="translate(20,20) rotate(0,44,44)">
            <g class="pl1__rect-g">
              <rect height="40" width="40" ry="8" rx="8" class="pl1__rect"></rect>
              <rect transform="translate(0,48)" height="40" width="40" ry="8" rx="8" class="pl1__rect"></rect>
            </g>
            <g transform="rotate(180,44,44)" class="pl1__rect-g">
              <rect height="40" width="40" ry="8" rx="8" class="pl1__rect"></rect>
              <rect transform="translate(0,48)" height="40" width="40" ry="8" rx="8" class="pl1__rect"></rect>
            </g>
          </g>
        </g>
      </g>
      <g mask="url(#pl-mask)" fill="hsl(343,90%,50%)">
        <g class="pl1__g">
          <g transform="translate(20,20) rotate(0,44,44)">
            <g class="pl1__rect-g">
              <rect height="40" width="40" ry="8" rx="8" class="pl1__rect"></rect>
              <rect transform="translate(0,48)" height="40" width="40" ry="8" rx="8" class="pl1__rect"></rect>
            </g>
            <g transform="rotate(180,44,44)" class="pl1__rect-g">
              <rect height="40" width="40" ry="8" rx="8" class="pl1__rect"></rect>
              <rect transform="translate(0,48)" height="40" width="40" ry="8" rx="8" class="pl1__rect"></rect>
            </g>
          </g>
        </g>
      </g>
    </svg>
  </main>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="content">
      <div className="playlists">
        <h2>Playlists</h2>
        <ul className='all'>
          {playlists.map(playlist => (
            <li className='listeach' key={playlist.id}>
              <Link className='playl' to={`/playlist/${playlist.id}`}>
                <h3>{playlist.nombre}</h3>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="episodes">
        <h2>Episodios para ti</h2>
        {/* Listado de episodios */}
      </div>
    </div>
  );
}

export default Content;
