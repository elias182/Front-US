import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import Content from './components/Content';
import AñadirCancion from './components/AñadirCancion';
import LoginComponent from './components/LoginComponent';
import Register from './components/Register';
import PlaylistDetail from './components/PlaylistDetail';
import Search from './components/Search';
import Perfil from './components/Perfil';
import UserPlaylists from './components/UserPlaylists';
import SongDetails from './components/SongDetail';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Artista from './components/Artista';
import Expandir from './components/Expandirplaylist';
import Error404 from './components/Error404'; // Import the Error404 component
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute component
import { AuthProvider } from './components/AuthContext'; // Ensure AuthProvider is imported

function App() {
  const [currentSong, setCurrentSong] = useState(null);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Sidebar />
          <div className="main">
            <Header />
            <div className="content">
              <Routes>
                <Route path="/" element={<Content />} />
                <Route path="/add-cancion" element={<PrivateRoute element={AñadirCancion} />} />
                <Route path="/editarcancion/:id" element={<PrivateRoute element={AñadirCancion} />} />
                <Route path="/login" element={<LoginComponent />} />
                <Route path="/register" element={<Register />} />
                <Route path="/playlist/:id" element={<PlaylistDetail setCurrentSong={setCurrentSong} />} />
                <Route path="/buscar" element={<Search setCurrentSong={setCurrentSong} />} />
                <Route path="/perfil" element={<PrivateRoute element={Perfil} />} />
                <Route path="/artista/:id" element={<Artista />} />
                <Route path="/biblioteca" element={<PrivateRoute element={UserPlaylists} />} />
                <Route path="/cancion/:id" element={<SongDetails />} />
                <Route path="/artista/:id" element={<Artista />} />
                <Route path="/anadir-a-playlist/:idCancion" element={<Expandir />} />
                <Route path="/*" element={<Error404 />} /> {/* Catch-all route for 404 */}
              </Routes>
            </div>
            <Footer currentSong={currentSong} />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
