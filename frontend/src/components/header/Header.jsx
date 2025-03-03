import { useState, useEffect } from 'react';
import { FaUniversalAccess, FaTimes, FaRobot } from 'react-icons/fa';
import NavLinks from './NavLinks';
import HighContrastToggle from './HighContrastToggle';
import DyslexicFontToggle from './DyslexicFontToggle';
import FontSizeAdjuster from './FontSizeAdjuster';
import ScreenReaderToggle from './ScreenReaderToggle';
import Sidebar from '../chatbot/Sidebar';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isHighContrast, setIsHighContrast] = useState(() => {
    return localStorage.getItem('highContrast') === 'true';
  });
  const [isDyslexicFont, setIsDyslexicFont] = useState(() => {
    return localStorage.getItem('dyslexicFont') === 'true';
  });
  const [isScreenReaderOn, setIsScreenReaderOn] = useState(() => {
    return localStorage.getItem('screenReader') === 'true';
  });
  const [fontSize, setFontSize] = useState(() => {
    const storedSize = localStorage.getItem('fontSize');
    return storedSize ? parseInt(storedSize, 10) : 16;
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', isHighContrast);
    localStorage.setItem('highContrast', isHighContrast);
  }, [isHighContrast]);

  useEffect(() => {
    document.documentElement.classList.toggle('dyslexic-font', isDyslexicFont);
    localStorage.setItem('dyslexicFont', isDyslexicFont);
  }, [isDyslexicFont]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-10 bg-orange-500 pl-6 pr-2 shadow-xl sm:pr-4 xl:pr-16">
        <div className="flex min-h-[4.5rem] flex-wrap items-center justify-between px-2 py-2 sm:min-h-[5.5rem] sm:px-4 md:px-6">
          <div className="flex items-center gap-2 sm:gap-4 xl:gap-10">
            {/* Chatbot Toggle Button*/}
            <button
              className="shrink-0 rounded-full p-1 text-white hover:bg-orange-600 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                setIsChatbotOpen(!isChatbotOpen);
              }}
              aria-label={
                isChatbotOpen ? 'Close AI Assistant' : 'Open AI Assistant'
              }
              data-screen-reader-text={
                isChatbotOpen ? 'Close AI Assistant' : 'Open AI Assistant'
              }
            >
              <FaRobot className="h-7 w-7 sm:h-9 sm:w-9" />
            </button>

            <Link
              to="/"
              className="mr-1 truncate text-base font-bold text-white sm:mr-6 sm:text-2xl xl:text-4xl"
              aria-label="Dialogue Cafe"
              data-screen-reader-text="Dialogue Cafe"
            >
              <span className="whitespace-nowrap">Dialogue Cafe</span>
            </Link>
          </div>

          <div className="flex items-center justify-end gap-2 sm:gap-4 xl:gap-6">
            {/* Nav Links */}
            <div className="flex items-center justify-end gap-2 sm:gap-6 xl:mr-16 xl:gap-12">
              <NavLinks />
            </div>

            {/* Desktop Accessibility Toggles */}
            <div className="hidden shrink-0 items-center gap-2 xl:flex">
              <HighContrastToggle
                isHighContrast={isHighContrast}
                setIsHighContrast={setIsHighContrast}
              />
              <DyslexicFontToggle
                isDyslexicFont={isDyslexicFont}
                setIsDyslexicFont={setIsDyslexicFont}
              />
              <ScreenReaderToggle
                isScreenReaderOn={isScreenReaderOn}
                setIsScreenReaderOn={setIsScreenReaderOn}
              />
              <FontSizeAdjuster fontSize={fontSize} setFontSize={setFontSize} />
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              className="shrink-0 rounded-full p-1 text-white hover:bg-orange-600 focus:outline-none xl:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={
                isMobileMenuOpen
                  ? 'Close accessibility menu'
                  : 'Open accessibility menu'
              }
              aria-expanded={isMobileMenuOpen}
              data-screen-reader-text={
                isMobileMenuOpen
                  ? 'Close accessibility menu'
                  : 'Open accessibility menu'
              }
            >
              {isMobileMenuOpen ? (
                <FaTimes className="h-6 w-6 sm:h-8 sm:w-8" />
              ) : (
                <FaUniversalAccess className="h-6 w-6 sm:h-8 sm:w-8" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown: Accessibility Menu */}
        <div
          className={`absolute left-0 right-0 top-full flex flex-col border-t border-orange-400 bg-orange-500 p-4 transition-all duration-300 xl:hidden ${
            isMobileMenuOpen
              ? 'pointer-events-auto max-h-screen opacity-100'
              : 'pointer-events-none max-h-0 overflow-hidden opacity-0'
          }`}
        >
          <div className="flex justify-center gap-6">
            <HighContrastToggle
              isHighContrast={isHighContrast}
              setIsHighContrast={setIsHighContrast}
            />
            <DyslexicFontToggle
              isDyslexicFont={isDyslexicFont}
              setIsDyslexicFont={setIsDyslexicFont}
            />
            <ScreenReaderToggle
              isScreenReaderOn={isScreenReaderOn}
              setIsScreenReaderOn={setIsScreenReaderOn}
            />
          </div>
          <div className="mt-4 flex justify-center">
            <FontSizeAdjuster fontSize={fontSize} setFontSize={setFontSize} />
          </div>
        </div>
      </nav>

      <Sidebar isOpen={isChatbotOpen} />
    </>
  );
};

export default Header;
