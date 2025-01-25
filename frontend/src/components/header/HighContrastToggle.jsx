import { FaAdjust } from "react-icons/fa";
import { Switch } from '@headlessui/react';

const HighContrastToggle = ({ isHighContrast, setIsHighContrast }) => {
  return (
    <div className="flex items-center gap-2">
      <FaAdjust 
        size={24} 
        className="text-white md:hidden" 
        data-testid="high-contrast-icon-mobile" 
      />
      <FaAdjust 
        size={32} 
        className="text-white hidden md:block" 
        data-testid="high-contrast-icon-desktop" 
      />
      <Switch
        checked={isHighContrast}
        onChange={setIsHighContrast}
        className={`${
          isHighContrast ? 'bg-fuchsia-500' : 'bg-gray-200'
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
  );
};

export default HighContrastToggle;