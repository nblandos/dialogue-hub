import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="bg-[#FA9C18] px-16 p-4 shadow-md fixed top-0 inset-x-0 h-24 z-10">
      <div className="flex items-center justify-between h-full">
        <div className="text-white text-4xl font-bold">Dialogue Cafe</div>

        <div className="flex gap-12 pr-48">
          <Link
            to="/"
            className="text-white text-xl hover:text-orange-200 font-medium transition-colors"
          >
            Book
          </Link>
          <Link
            to="/menu"
            className="text-white text-xl hover:text-orange-200 font-medium transition-colors"
          >
            Menu
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
