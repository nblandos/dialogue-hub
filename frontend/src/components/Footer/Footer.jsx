import { Link } from 'react-router-dom';
import '../../index.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/" className="footer-link">
          Home
        </Link>{' '}
        <Link to="/menu" className="footer-link">
          | Menu
        </Link>{' '}
        <Link to="/book" className="footer-link">
          | Book
        </Link>{' '}
        <Link to="/training" className="footer-link">
          | Training Videos
        </Link>
      </div>
      <div className="footer-center">
        <img src="Logo.png" alt="Dialogue Hub Logo" className="footer-logo" />
        <div className="footer-socials">
          <a
            href="https://www.facebook.com/dialoguehublondon"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link"
          >
            Facebook
          </a>{' '}
          <a
            href="https://www.instagram.com/dialogue.hub"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link"
          >
            | Instagram
          </a>{' '}
          <a
            href="https://www.linkedin.com/company/dialogue-hub"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link"
          >
            | LinkedIn
          </a>{' '}
          <a
            href="mailto:info@dialoguehub.co.uk"
            className="footer-social-link"
          >
            | Email
          </a>
        </div>
      </div>
      <div className="footer-address">
        <p>
          <a
            href="https://maps.app.goo.gl/VGoxjPeSubwj8Cga7"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-address-link"
          >
            Royal Docks Centre for Sustainability (RDCS)
            <br />
            University of East London (UEL) Docklands Campus,
            <br />
            4-6 University Way, London, E16 2RD
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
