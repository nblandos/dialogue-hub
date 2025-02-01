const FontSizeAdjuster = ({
  fontSize,
  setFontSize,
  minFontSize = 12,
  maxFontSize = 20,
}) => {
  const increaseFontSize = () => {
    if (fontSize < maxFontSize) {
      const newSize = fontSize + 1;
      setFontSize(newSize);
      localStorage.setItem('fontSize', newSize);
      document.documentElement.style.fontSize = `${newSize}px`;
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > minFontSize) {
      const newSize = fontSize - 1;
      setFontSize(newSize);
      localStorage.setItem('fontSize', newSize);
      document.documentElement.style.fontSize = `${newSize}px`;
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        className={`rounded-lg bg-gray-500 px-3 py-2 text-white hover:bg-gray-600 ${fontSize <= minFontSize ? 'cursor-not-allowed opacity-50' : ''}`}
        onClick={decreaseFontSize}
        disabled={fontSize <= minFontSize}
        data-screen-reader-text="Decrease Font Size"
      >
        -
      </button>
      <span
        className="text-xl font-bold text-white"
        tabIndex="0"
        data-screen-reader-text={`Current font size is ${fontSize}px`}
      >
        {fontSize}px
      </span>
      <button
        className={`rounded-lg bg-gray-500 px-3 py-2 text-white hover:bg-gray-600 ${fontSize >= maxFontSize ? 'cursor-not-allowed opacity-50' : ''}`}
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
