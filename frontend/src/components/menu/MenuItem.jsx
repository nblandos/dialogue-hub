import React from "react";

const MenuItem = ({ name, price, video }) => {
  return (
    <div className="bg-white shadow-lg p-4 rounded-lg hover:shadow-xl transition-shadow">
      <h2 className="text-xl font-semibold text-center mb-2">
        {name} <span className="text-gray-500 text-sm">({price})</span>
      </h2>
      <div className="relative w-full h-72">
        <iframe
          src={video}
          title={name}
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
  );
};

export default MenuItem;
