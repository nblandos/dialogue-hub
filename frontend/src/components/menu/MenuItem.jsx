import React, { useRef, useState } from 'react';

const MenuItem = ({ name, price, video }) => {
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const videoRefs = useRef({});

  const handleMouseEnter = () => {
    setHoveredVideo(name);
    if (videoRefs.current[name]) {
      videoRefs.current[name].contentWindow.postMessage(
        '{"event":"command","func":"playVideo","args":""}',
        '*'
      );
    }
  };

  const handleMouseLeave = () => {
    setHoveredVideo(null);
    if (videoRefs.current[name]) {
      videoRefs.current[name].contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        '*'
      );
    }
  };

  return (
    <div
      className="rounded-lg bg-white p-2 shadow-lg transition-transform duration-300 hover:shadow-xl flex flex-col items-center"
      style={{
        transform: hoveredVideo === name ? 'scale(1.05)' : 'scale(1)', // Scale entire container
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <h2 className="mb-2 text-center text-lg font-semibold" tabIndex="0" data-screen-reader-text={name} >
        {name} {price && <span className="text-sm text-gray-500">({price})</span>}
      </h2>

      <div
        className="relative w-[90vw] sm:w-[45vw] md:w-[30vw] lg:w-[20vw] xl:w-[15vw] aspect-[9/16] flex justify-center items-center rounded-lg"
      >
        <iframe
          loading="lazy"
          ref={(el) => (videoRefs.current[name] = el)}
          src={video}
          title={name}
          className="w-full h-full rounded-lg shadow-md transition-transform duration-300"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default MenuItem;
