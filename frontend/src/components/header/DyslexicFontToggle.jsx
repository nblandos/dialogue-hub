import { FaFont } from 'react-icons/fa';
import ToggleSwitch from '../common/ToggleSwitch';

const DyslexicFontToggle = ({ isDyslexicFont, setIsDyslexicFont }) => {
  return (
    <ToggleSwitch
      iconMobile={
        <FaFont
          size={24}
          className="text-white"
          data-testid="dyslexic-font-icon-mobile"
        />
      }
      iconDesktop={
        <FaFont
          size={32}
          className="text-white"
          data-testid="dyslexic-font-icon-desktop"
        />
      }
      label="Toggle dyslexic font mode"
      checked={isDyslexicFont}
      onChange={setIsDyslexicFont}
    />
  );
};

export default DyslexicFontToggle;
