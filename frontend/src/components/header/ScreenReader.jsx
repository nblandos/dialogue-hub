import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaAssistiveListeningSystems } from 'react-icons/fa'; // Import icon
import { Switch } from '@headlessui/react'; // Import headless UI switch

const ScreenReaderToggle = () => {
  const [isScreenReaderOn, setIsScreenReaderOn] = useState(() => {
    return localStorage.getItem('screenReader') === 'true';
  });

  const readText = (text) => {
    if (!isScreenReaderOn || !text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.cancel(); // Stop ongoing speech
    window.speechSynthesis.speak(utterance); // Start new speech
  };

  const handleHover = (event) => {
    const text = event.target.getAttribute('data-screen-reader-text');
    readText(text);
  };

  const handleFocus = (event) => {
    const text = event.target.getAttribute('data-screen-reader-text');
    readText(text);
  };

  const location = useLocation();

  useEffect(() => {
    if (isScreenReaderOn) {
      const attachListeners = () => {
        const elements = document.querySelectorAll('[data-screen-reader-text]');

        // Attach hover and focus listeners
        elements.forEach((element) => {
          element.addEventListener('mouseover', handleHover);
          element.addEventListener('focus', handleFocus);
        });
      };

      const detachListeners = () => {
        const elements = document.querySelectorAll('[data-screen-reader-text]');

        // Cleanup listeners when screen reader is turned off
        elements.forEach((element) => {
          element.removeEventListener('mouseover', handleHover);
          element.removeEventListener('focus', handleFocus);
        });
      };

      attachListeners();

      // re-attach listeners upon DOM changes
      const observer = new MutationObserver(() => {
        detachListeners();
        attachListeners();
      });

      observer.observe(document.body, { childList: true, subtree: true });

      return () => {
        observer.disconnect();
        detachListeners();
      };
    } else {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
    }
  }, [isScreenReaderOn, location]);

  const toggleScreenReader = () => {
    const newState = !isScreenReaderOn;
    setIsScreenReaderOn(newState);
    localStorage.setItem('screenReader', newState);
  };

  return (
    <div className="flex items-center gap-2">
      <FaAssistiveListeningSystems
        size={24}
        className="text-white md:hidden"
        data-testid="screen-reader-icon-mobile"
      />
      <FaAssistiveListeningSystems
        size={32}
        className="hidden text-white md:block"
        data-testid="screen-reader-icon-desktop"
      />
      <Switch
        data-screen-reader-text="Toggle screen reader mode"
        checked={isScreenReaderOn}
        onChange={toggleScreenReader}
        className={`${
          isScreenReaderOn ? 'bg-blue-600' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
      >
        <span className="sr-only">Toggle screen reader mode</span>
        <span
          className={`${
            isScreenReaderOn ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
    </div>
  );
};

export default ScreenReaderToggle;
