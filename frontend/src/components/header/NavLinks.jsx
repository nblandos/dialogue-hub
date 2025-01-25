import { Link } from 'react-router-dom';

const NavLinks = ({ isMobile = false }) => {
  const baseClasses = "text-xl font-medium text-white transition-colors hover:text-orange-200";
  const mobileClasses = "py-2";

  return (
    <>
      <Link to="/" className={`${baseClasses} ${isMobile ? mobileClasses : ''}`}>
        Book
      </Link>
      <Link to="/menu" className={`${baseClasses} ${isMobile ? mobileClasses : ''}`}>
        Menu
      </Link>
    </>
  );
};

export default NavLinks;