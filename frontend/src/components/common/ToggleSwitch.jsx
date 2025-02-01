import { Switch } from '@headlessui/react';

const ToggleSwitch = ({
  iconMobile,
  iconDesktop,
  label,
  checked,
  onChange,
  ...props
}) => {
  return (
    <div className="flex items-center gap-2" data-screen-reader-text={label}>
      <span className="md:hidden">{iconMobile}</span>
      <span className="hidden md:block">{iconDesktop}</span>
      <Switch
        checked={checked}
        onChange={onChange}
        className={`${
          checked ? 'bg-blue-600' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
        {...props}
      >
        <span className="sr-only">{label}</span>
        <span
          className={`${
            checked ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
    </div>
  );
};

export default ToggleSwitch;
