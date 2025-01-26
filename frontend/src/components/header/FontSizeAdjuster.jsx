import { useState, useEffect } from 'react';

const FontSizeAdjuster = () => {
  const [fontSize, setFontSize] = useState(() => {
    const storedSize = localStorage.getItem('fontSize');
    return storedSize ? parseInt(storedSize, 10) : 16; // Default size is 16px
  });

  const minFontSize = 12; //change as needed
  const maxFontSize = 20; //change as needed

  const increaseFontSize = () => {
    if (fontSize < maxFontSize) {
      setFontSize((prev) => prev + 1);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > minFontSize) {
      setFontSize((prev) => prev - 1);
    }
  };

  useEffect(() => {
    // Apply the font size globally
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem('fontSize', fontSize); // Persist in localStorage
  }, [fontSize]);

  return (
    <div className="flex items-center gap-4">
      <button
        className={`rounded-lg bg-gray-500 px-3 py-2 text-white hover:bg-gray-600 ${
          fontSize <= minFontSize ? 'cursor-not-allowed opacity-50' : ''
        }`}
        onClick={decreaseFontSize}
        disabled={fontSize <= minFontSize}
        data-screen-reader-text="Decrease Font Size"
      >
        -
      </button>
      <span
        className="text-xl font-bold text-white"
        tabindex="0"
        data-screen-reader-text={`Current font size is ${fontSize}px`}
      >
        {fontSize}px
      </span>
      <button
        className={`rounded-lg bg-gray-500 px-3 py-2 text-white hover:bg-gray-600 ${
          fontSize >= maxFontSize ? 'cursor-not-allowed opacity-50' : ''
        }`}
        onClick={increaseFontSize}
        disabled={fontSize >= maxFontSize}
        data-screen-reader-text="Increase Font Size"
      >
        +
      </button>
    </div>
  );
};

export default FontSizeAdjuster;
