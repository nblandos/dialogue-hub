import { Switch } from '@headlessui/react';
import { FaFont } from 'react-icons/fa';

const DyslexicFontToggle = ({ isDyslexicFont, setIsDyslexicFont }) => {
  return (
    <div className="flex items-center gap-2">
      <FaFont
        size={24}
        className="text-white md:hidden"
        data-testid="dyslexic-font-icon-mobile"
      />
      <FaFont
        size={32}
        className="hidden text-white md:block"
        data-testid="dyslexic-font-icon-desktop"
      />
      <Switch
        checked={isDyslexicFont}
        onChange={setIsDyslexicFont}
        className={`${
          isDyslexicFont ? 'bg-blue-600' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
      >
        <span className="sr-only">Toggle dyslexic font mode</span>
        <span
          className={`${
            isDyslexicFont ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
    </div>
  );
};

export default DyslexicFontToggle;
