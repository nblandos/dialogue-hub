import { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import NavLinks from './NavLinks';
import HighContrastToggle from './HighContrastToggle';
import DyslexicFontToggle from './DyslexicFontToggle';
import FontSizeAdjuster from './FontSizeAdjuster';

const Header = () => {
  const [isHighContrast, setIsHighContrast] = useState(() => {
    return localStorage.getItem('highContrast') === 'true';
  });
  const [isDyslexicFont, setIsDyslexicFont] = useState(() => {
    return localStorage.getItem('dyslexicFont') === 'true';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Apply high contrast mode
    document.documentElement.classList.toggle('high-contrast', isHighContrast);
    localStorage.setItem('highContrast', isHighContrast);
  }, [isHighContrast]);

  useEffect(() => {
    // Apply dyslexic font mode
    document.documentElement.classList.toggle('dyslexic-font', isDyslexicFont);
    localStorage.setItem('dyslexicFont', isDyslexicFont);
  }, [isDyslexicFont]);

  return (
    <nav className="fixed inset-x-0 top-0 z-10 h-24 bg-orange-500 p-4 px-4 shadow-md md:px-16">
      <div className="flex h-full items-center justify-between">
        <div className="text-2xl font-bold text-white md:text-4xl">
          Dialogue Cafe
        </div>

        <div className="flex items-center gap-4 md:gap-6 md:pr-36">
          {/* Desktop Header Links */}
          <div className="hidden items-center gap-12 md:mr-16 md:flex">
            <NavLinks />
          </div>

          {/* Accessibility Toggles */}
          <HighContrastToggle
            isHighContrast={isHighContrast}
            setIsHighContrast={setIsHighContrast}
          />
          <DyslexicFontToggle
            isDyslexicFont={isDyslexicFont}
            setIsDyslexicFont={setIsDyslexicFont}
          />
          <FontSizeAdjuster />

          {/* Mobile Menu Button */}
          <button
            className="text-white md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Links */}
      <div
        data-testid="mobile-menu"
        className={`${
          isMobileMenuOpen ? 'flex' : 'hidden'
        } absolute left-0 right-0 top-24 flex-col bg-orange-500 p-4 shadow-md md:hidden`}
      >
        <NavLinks isMobile />
      </div>
    </nav>
  );
};

export default Header;
