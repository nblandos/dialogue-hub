import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="fixed inset-x-0 top-0 z-10 h-24 bg-[#FA9C18] p-4 px-16 shadow-md">
      <div className="flex h-full items-center justify-between">
        <div className="text-4xl font-bold text-white">Dialogue Cafe</div>

        <div className="flex gap-12 pr-48">
          <Link
            to="/"
            className="text-xl font-medium text-white transition-colors hover:text-orange-200"
          >
            Book
          </Link>
          <Link
            to="/menu"
            className="text-xl font-medium text-white transition-colors hover:text-orange-200"
          >
            Menu
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
