import React, { useState } from "react";
import initialMenu from "./menuData";

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
    <div className="min-h-screen bg-gray-100 pt-32 p-6"> {/* Adjusted padding */}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenu.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-lg p-4 rounded-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-semibold text-center mb-2">
              {item.name} <span className="text-gray-500 text-sm">({item.price})</span>
            </h2>
            <div className="relative w-full h-72">
              <iframe
                src={item.video}
                title={item.name}
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onMouseOver={(e) =>
                  e.target.contentWindow.postMessage(
                    '{"event":"command","func":"playVideo","args":""}',
                    "*"
                  )
                }
                onMouseOut={(e) =>
                  e.target.contentWindow.postMessage(
                    '{"event":"command","func":"pauseVideo","args":""}',
                    "*"
                  )
                }
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
