import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer
      className="flex flex-col items-center gap-6 bg-white p-5 md:flex-row md:justify-between"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="flex flex-wrap items-center justify-center md:justify-start">
        <Link
          to="/"
          className="font-bold text-gray-700 no-underline transition duration-200 hover:scale-110 hover:text-blue-600"
          data-screen-reader-text="Home page"
          aria-label="Home page"
        >
          Home
        </Link>
        <span className="mx-2 text-gray-400 md:mx-3" aria-hidden="true">
          |
        </span>
        <Link
          to="/book"
          className="font-bold text-gray-700 no-underline transition duration-200 hover:scale-110 hover:text-blue-600"
          data-screen-reader-text="Book"
          aria-label="Book a table"
        >
          Book
        </Link>
        <span className="mx-2 text-gray-400 md:mx-3" aria-hidden="true">
          |
        </span>
        <Link
          to="/menu"
          className="font-bold text-gray-700 no-underline transition duration-200 hover:scale-110 hover:text-blue-600"
          data-screen-reader-text="Menu"
          aria-label="View menu"
        >
          Menu
        </Link>
        <span className="mx-2 text-gray-400 md:mx-3" aria-hidden="true">
          |
        </span>
        <Link
          to="/training"
          className="font-bold text-gray-700 no-underline transition duration-200 hover:scale-110 hover:text-blue-600"
          data-screen-reader-text="Training Videos"
          aria-label="View training videos"
        >
          Training Videos
        </Link>
      </div>

      <div className="order-first flex flex-col items-center md:order-none">
        <img
          src="Logo.png"
          alt="Dialogue Hub Logo"
          className="logo-image mb-4 h-auto w-[250px] md:w-[350px]"
          data-screen-reader-text="Dialogue Hub Logo"
        />
        <nav aria-label="Social media links">
          <div className="flex flex-wrap items-center justify-center">
            <a
              href="https://www.facebook.com/dialoguehublondon"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-gray-700 no-underline transition duration-200 hover:scale-110 hover:text-blue-600"
              data-screen-reader-text="Visit our Facebook page"
              aria-label="Visit our Facebook page"
            >
              Facebook
            </a>
            <span className="mx-2 text-gray-400 md:mx-3" aria-hidden="true">
              |
            </span>
            <a
              href="https://www.instagram.com/dialogue.hub"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-gray-700 no-underline transition duration-200 hover:scale-110 hover:text-blue-600"
              data-screen-reader-text="Visit our Instagram page"
              aria-label="Visit our Instagram page"
            >
              Instagram
            </a>
            <span className="mx-2 text-gray-400 md:mx-3" aria-hidden="true">
              |
            </span>
            <a
              href="https://www.linkedin.com/company/dialogue-hub"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-gray-700 no-underline transition duration-200 hover:scale-110 hover:text-blue-600"
              data-screen-reader-text="Visit our LinkedIn page"
              aria-label="Visit our LinkedIn page"
            >
              LinkedIn
            </a>
            <span className="mx-2 text-gray-400 md:mx-3" aria-hidden="true">
              |
            </span>
            <a
              href="mailto:info@dialoguehub.co.uk"
              className="font-bold text-gray-700 no-underline transition duration-200 hover:scale-110 hover:text-blue-600"
              data-screen-reader-text="Email us at info@dialoguehub.co.uk"
              aria-label="Email us"
            >
              Email
            </a>
          </div>
        </nav>
      </div>

      <div className="text-center font-bold text-gray-600 md:text-right">
        <p>
          <a
            href="https://maps.app.goo.gl/VGoxjPeSubwj8Cga7"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-gray-700 no-underline transition duration-200 hover:scale-110 hover:text-blue-600"
            data-screen-reader-text="View our location on Google Maps"
            aria-label="View our location on Google Maps"
          >
            Royal Docks Centre for Sustainability
            <br />
            University of East London Campus,
            <br />
            4-6 University Way, London, E16 2RD
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
