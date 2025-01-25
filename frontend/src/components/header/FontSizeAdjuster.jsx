import React, { useState, useEffect } from "react";

const FontSizeAdjuster = () => {
  const [fontSize, setFontSize] = useState(() => {
    const storedSize = localStorage.getItem("fontSize");
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
    localStorage.setItem("fontSize", fontSize); // Persist in localStorage
  }, [fontSize]);

  return (
    <div className="flex items-center gap-4">
      <button
        className={`bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 ${
          fontSize <= minFontSize ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={decreaseFontSize}
        disabled={fontSize <= minFontSize}
      >
        -
      </button>
      <span className="text-xl font-bold">{fontSize}px</span>
      <button
        className={`bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 ${
          fontSize >= maxFontSize ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={increaseFontSize}
        disabled={fontSize >= maxFontSize}
      >
        +
      </button>
    </div>
  );
};

export default FontSizeAdjuster;
