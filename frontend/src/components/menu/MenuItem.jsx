import { useState } from 'react';
import VideoContainer from '../common/VideoContainer';

const MenuItem = ({ name, price, video }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex flex-col items-center rounded-lg bg-white p-2 shadow-lg transition-transform duration-300 hover:shadow-xl"
      style={{
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2
        className="mb-2 text-center text-lg font-semibold"
        tabIndex="0"
        data-screen-reader-text={name}
      >
        {name}{' '}
        {price && <span className="text-sm text-gray-500">({price})</span>}
      </h2>

      <div className="w-full max-w-[350px] sm:max-w-[360px] md:max-w-[300px] lg:max-w-[250px] xl:max-w-[280px]">
        <VideoContainer
          name={name}
          videoUrl={video}
          aspectRatio="9/16"
          enableHoverEnlarge={false}
        />
      </div>
    </div>
  );
};

export default MenuItem;
