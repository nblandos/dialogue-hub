import { Link } from 'react-router-dom';

const NavLinks = ({ isMobile = false }) => {
  const baseClasses =
    'md:text-xl text-base font-medium text-white transition-colors hover:text-orange-200';
  const mobileClasses = 'py-2';

  return (
    <>
      <Link
        to="/"
        className={`${baseClasses} ${isMobile ? mobileClasses : ''}`}
        data-screen-reader-text="Book"
      >
        Book
      </Link>
      <Link
        to="/menu"
        className={`${baseClasses} ${isMobile ? mobileClasses : ''}`}
        data-screen-reader-text="Menu"
      >
        Menu
      </Link>
    </>
  );
};

export default NavLinks;
