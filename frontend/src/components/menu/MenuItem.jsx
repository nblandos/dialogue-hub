import { useRef, useState } from 'react';

const MenuItem = ({ name, price, video }) => {
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const videoRefs = useRef({});

  const getVideoUrl = (videoUrl) => {
    return `${videoUrl}&mute=1`;
  };

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
      className="flex flex-col items-center rounded-lg bg-white p-2 shadow-lg transition-transform duration-300 hover:shadow-xl"
      style={{
        transform: hoveredVideo === name ? 'scale(1.05)' : 'scale(1)', // Scale entire container
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <h2
        className="mb-2 text-center text-lg font-semibold"
        tabIndex="0"
        data-screen-reader-text={name}
      >
        {name}{' '}
        {price && <span className="text-sm text-gray-500">({price})</span>}
      </h2>

      <div className="relative flex aspect-[9/16] w-full max-w-[350px] items-center justify-center rounded-lg sm:max-w-[360px] md:max-w-[300px] lg:max-w-[250px] xl:max-w-[280px]">
        <iframe
          loading="lazy"
          ref={(el) => (videoRefs.current[name] = el)}
          src={getVideoUrl(video)}
          title={name}
          className="h-full w-full rounded-lg shadow-md transition-transform duration-300"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default MenuItem;
