import React from 'react';
import './Undersounds.css';

const Undersounds = () => {
  return (
    <div className="landing-page">
      <header className="header">
        <h1>Undersounds</h1>
        <nav>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="hero">
        <h2>Experience Music Like Never Before</h2>
        <p>Discover, listen, and enjoy your favorite tracks with Undersounds.</p>
        <button>Get Started</button>
      </section>

      <section id="features" className="features">
        <h3>Features</h3>
        <div className="feature">
          <h4>High Quality Audio</h4>
          <p>Enjoy music in the best quality available.</p>
        </div>
        <div className="feature">
          <h4>Personalized Playlists</h4>
          <p>Create and share your own playlists with ease.</p>
        </div>
        <div className="feature">
          <h4>Offline Mode</h4>
          <p>Listen to your favorite tracks even without an internet connection.</p>
        </div>
      </section>

      <section id="about" className="about">
        <h3>About Us</h3>
        <p>Undersounds is dedicated to bringing you the best musical experience. Whether you're at home, on the go, or at a party, Undersounds provides the perfect soundtrack for every moment.</p>
      </section>

      <section id="contact" className="contact">
        <h3>Contact Us</h3>
        <p>Have any questions? Feel free to reach out to us at <a href="mailto:info@undersounds.com">info@undersounds.com</a>.</p>
      </section>

      <footer className="footer">
        <p>&copy; 2024 Undersounds. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Undersounds;
