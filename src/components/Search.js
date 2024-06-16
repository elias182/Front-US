import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';
import './Search.css';

const Search = ({ setCurrentSong }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleSearch = async () => {
            if (query.trim() === '') {
                setResults(null);
                return;
            }

            setLoading(true);
            setError(null);
            setResults(null);

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/search/${query}`);
                if (!response.ok) {
                    throw new Error('Error al realizar la búsqueda');
                }
                const data = await response.json();
                setResults(data);
            } catch (error) {
                console.error('Error searching:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            handleSearch();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    return (
        <div className='searchdiv'>
            <div className="searchBox">
                <input
                    className="searchInput"
                    value={query}
                    type="text"
                    placeholder="Inicia tu Aventura"
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyUp={() => setQuery(query)}
                />
                <button className="searchButton" onClick={() => setQuery(query)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
                        <g clipPath="url(#clip0_2_17)">
                            <g filter="url(#filter0_d_2_17)">
                                <path d="M23.7953 23.9182L19.0585 19.1814M19.0585 19.1814C19.8188 18.4211 20.4219 17.5185 20.8333 16.5251C21.2448 15.5318 21.4566 14.4671 21.4566 13.3919C21.4566 12.3167 21.2448 11.252 20.8333 10.2587C20.4219 9.2653 19.8188 8.36271 19.0585 7.60242C18.2982 6.84214 17.3956 6.23905 16.4022 5.82759C15.4089 5.41612 14.3442 5.20435 13.269 5.20435C12.1938 5.20435 11.1291 5.41612 10.1358 5.82759C9.1424 6.23905 8.23981 6.84214 7.47953 7.60242C5.94407 9.13789 5.08145 11.2204 5.08145 13.3919C5.08145 15.5634 5.94407 17.6459 7.47953 19.1814C9.01499 20.7168 11.0975 21.5794 13.269 21.5794C15.4405 21.5794 17.523 20.7168 19.0585 19.1814Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" shapeRendering="crispEdges"></path>
                            </g>
                        </g>
                        <defs>
                            <filter id="filter0_d_2_17" x="-0.418549" y="3.70435" width="29.7139" height="29.7139" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                                <feOffset dy="4"></feOffset>
                                <feGaussianBlur stdDeviation="2"></feGaussianBlur>
                                <feComposite in2="hardAlpha" operator="out"></feComposite>
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix>
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_17"></feBlend>
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_17" result="shape"></feBlend>
                            </filter>
                            <clipPath id="clip0_2_17">
                                <rect width="28.0702" height="28.0702" fill="white" transform="translate(0.403503 0.526367)"></rect>
                            </clipPath>
                        </defs>
                    </svg>
                </button>
            </div>

            {loading && (
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
            )}

            {error && <div>Error: {error}</div>}

            {results && (
                <div>
                    {results.users && (
                        <div>
                            <h2>Usuarios</h2>
                            <ul>
                                {results.users.map(user => (
                                    <NavLink key={user.id} to={`/artista/${user.id}`} className={"song-link"} activeClassName="active">
                                        <li>{user.name}</li>
                                    </NavLink>
                                ))}
                            </ul>
                        </div>
                    )}
                    <h2>Listas de Reproducción</h2>
                    <ul>
                        {results.playlists.map(playlist => (
                            
                            <li key={playlist.id}>
                                <NavLink to={`/playlist/${playlist.id}`} className={"song-link"} activeClassName="active">{playlist.nombre}</NavLink></li>
                        ))}
                    </ul>
                    <h2>Canciones</h2>
                    <ul>
                        {results.songs.map(song => (
                            <li key={song.id}>
                                <FaPlay onClick={() => setCurrentSong(song)} style={{ cursor: 'pointer', marginRight: '10px' }} />
                                <NavLink to={`/cancion/${song.id}`} className={"song-link"} activeClassName="active">
                                    {song.titulo}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Search;
