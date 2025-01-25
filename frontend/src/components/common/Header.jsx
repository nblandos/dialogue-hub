import { Link } from 'react-router-dom';
import { useState, useEffect} from 'react';


const Header = () => {
  const [isHighContrast, setIsHighContrast] = useState(() => {
    return localStorage.getItem('highContrast') === 'true';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', isHighContrast);
    localStorage.setItem('highContrast', isHighContrast);
  }, [isHighContrast]);

  const toggleHighContrast = () => {
    setIsHighContrast(!isHighContrast);
  };

  return (
    
    // The header colour has insufficient contrast with the text colour in Lighthouse Accessibility Audit
    // This should be fixed when adding the 'High Contrast Mode' feature
    <nav className="fixed inset-x-0 top-0 z-10 h-24 bg-orange-500 p-4 px-4 shadow-md md:px-16">
      <div className="flex h-full items-center justify-between">
        <div className="text-4xl font-bold text-white">Dialogue Cafe</div>

        <div className="flex gap-12 pr-8 md:pr-48">
          <Link
            to="/"
            className="text-xl font-medium text-white transition-colors hover:text-orange-200"
          >
            Book
          </Link>
          <Link
            to="/menu"
            className="text-xl font-medium text-white transition-colors hover:text-orange-200"
          >
            Menu
          </Link>
          <button
            onClick={toggleHighContrast}
            className="text-xl font-medium text-white transition-colors hover:text-orange-200"
          >
            Toggle High Contrast
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
