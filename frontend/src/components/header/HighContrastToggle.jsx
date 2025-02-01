import { FaAdjust } from 'react-icons/fa';
import ToggleSwitch from '../common/ToggleSwitch';

const HighContrastToggle = ({ isHighContrast, setIsHighContrast }) => {
  return (
    <ToggleSwitch
      iconMobile={
        <FaAdjust
          size={24}
          className="text-white"
          data-testid="high-contrast-icon-mobile"
        />
      }
      iconDesktop={
        <FaAdjust
          size={32}
          className="text-white"
          data-testid="high-contrast-icon-desktop"
        />
      }
      label="Toggle high contrast mode"
      checked={isHighContrast}
      onChange={setIsHighContrast}
    />
  );
};

export default HighContrastToggle;
