import { Link } from 'react-router-dom';
import { useState, useEffect} from 'react';
import { FaAdjust } from "react-icons/fa";
import { Switch } from '@headlessui/react';



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
    <nav className="fixed inset-x-0 top-0 z-10 h-24 bg-orange-500 p-4 px-4 shadow-md md:px-16">
      <div className="flex h-full items-center justify-between">
        <div className="text-4xl font-bold text-white">Dialogue Cafe</div>

        <div className="flex gap-12 pr-8 md:pr-48 items-center">
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
          <div className="flex items-center gap-3">
            <FaAdjust size={36} className="text-white" />
            <Switch
              checked={isHighContrast}
              onChange={setIsHighContrast}
              className={`${
                isHighContrast ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
            >
              <span className="sr-only">Toggle high contrast mode</span>
              <span
                className={`${
                  isHighContrast ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
