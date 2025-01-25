import React, { useState } from "react";
import initialMenu from "./menuData";
import MenuDiv from "../../components/menu/MenuDiv";

const MenuPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name");

  const filteredMenu = initialMenu
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortOption === "price") {
        return parseFloat(a.price.slice(1)) - parseFloat(b.price.slice(1));
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-100 pt-32 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Coffee Menu</h1>
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 rounded-lg p-2 w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded-lg p-2"
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
