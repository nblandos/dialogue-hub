import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaAssistiveListeningSystems } from 'react-icons/fa';
import ToggleSwitch from '../common/ToggleSwitch';

const ScreenReaderToggle = ({ isScreenReaderOn, setIsScreenReaderOn }) => {
  const readText = (text) => {
    if (!isScreenReaderOn || !text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
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
      const elements = document.querySelectorAll('[data-screen-reader-text]');
      elements.forEach((element) => {
        element.addEventListener('mouseover', handleHover);
        element.addEventListener('focus', handleFocus);
      });

      const observer = new MutationObserver(() => {
        elements.forEach((element) => {
          element.removeEventListener('mouseover', handleHover);
          element.removeEventListener('focus', handleFocus);
          element.addEventListener('mouseover', handleHover);
          element.addEventListener('focus', handleFocus);
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });

      return () => {
        observer.disconnect();
        elements.forEach((element) => {
          element.removeEventListener('mouseover', handleHover);
          element.removeEventListener('focus', handleFocus);
        });
      };
    } else {
      window.speechSynthesis.cancel();
    }
  }, [isScreenReaderOn, location]);

  const toggleScreenReader = () => {
    const newState = !isScreenReaderOn;
    setIsScreenReaderOn(newState);
    localStorage.setItem('screenReader', newState);
  };

  return (
    <ToggleSwitch
      iconMobile={
        <FaAssistiveListeningSystems
          size={24}
          className="text-white"
          data-testid="screen-reader-icon-mobile"
        />
      }
      iconDesktop={
        <FaAssistiveListeningSystems
          size={32}
          className="text-white"
          data-testid="screen-reader-icon-desktop"
        />
      }
      label="Toggle screen reader mode"
      checked={isScreenReaderOn}
      onChange={toggleScreenReader}
    />
  );
};

export default ScreenReaderToggle;
