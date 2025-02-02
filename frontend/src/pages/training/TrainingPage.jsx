import { useState } from 'react';
import trainingMenu from './trainingData';
import MenuDiv from '../../components/menu/MenuDiv';

const TrainingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('asc');

  const filteredMenu = trainingMenu
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === 'asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortOption === 'desc') {
        return b.name.localeCompare(a.name);
      }
    });

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-32">
      <h1
        className="mb-8 text-center text-3xl font-bold"
        data-screen-reader-text="Training Videos"
      >
        Training Videos
      </h1>
      <div className="mb-6 flex items-center justify-between">
        <label htmlFor="search" className="sr-only">
          Search Training Videos
        </label>
        <input
          id="search"
          type="text"
          placeholder="Search..."
          className="w-1/3 rounded-lg border border-gray-300 p-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search Training Menu"
          data-screen-reader-text="Search Training Menu"
        />

        <label htmlFor="sort" className="sr-only">
          Sort By
        </label>
        <select
          id="sort"
          className="rounded-lg border border-gray-300 p-2"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          aria-label="Sort Alphabetically"
          data-screen-reader-text="Sort Alphabetically"
        >
          <option value="asc">A - Z</option>
          <option value="desc">Z - A</option>
        </select>
      </div>
      <MenuDiv filteredMenu={filteredMenu} />
    </div>
  );
};

export default TrainingPage;
