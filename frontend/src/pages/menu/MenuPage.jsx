import { useState } from 'react';
import initialMenu from './menuData';
import MenuDiv from '../../components/menu/MenuDiv';

const MenuPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name');

  const filteredMenu = initialMenu
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortOption === 'price') {
        return parseFloat(a.price.slice(1)) - parseFloat(b.price.slice(1));
      }
    });

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-32">
      <h1 className="mb-8 text-center text-3xl font-bold">Cafe Menu</h1>
      <div className="mb-6 flex items-center justify-between">
        <label htmlFor="search" className="mb-1 text-sm">
          Search Menu
        </label>
        <input
          id="search"
          type="text"
          placeholder="Search..."
          className="w-1/3 rounded-lg border border-gray-300 p-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label htmlFor="sort" className="mb-1 text-sm">
          Sort By
        </label>
        <select
          id="sort"
          className="rounded-lg border border-gray-300 p-2"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
        </select>
      </div>
      {/* Render CoffeeMenu with filteredMenu passed as props */}
      <MenuDiv filteredMenu={filteredMenu} />
    </div>
  );
};

export default MenuPage;
