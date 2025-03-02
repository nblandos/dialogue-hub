import { useRef, useState } from 'react';

const VideoContainer = ({
  name,
  videoUrl,
  className = '',
  enableHoverEnlarge = false,
  maxHeight = null,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.contentWindow.postMessage(
        '{"event":"command","func":"playVideo","args":""}',
        '*'
      );
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        '*'
      );
    }
  };

  const getVideoUrl = (url) => {
    if (!url) return '';
    const hasParams = url.includes('?');
    const connector = hasParams ? '&' : '?';
    return `${url}${connector}enablejsapi=1&mute=1`;
  };

  return (
    <div
      className={`video-container relative ${className}`}
      style={{
        width: '100%',
        transform: enableHoverEnlarge && isHovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.3s ease',
        maxHeight: maxHeight,
        overflow: 'hidden',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-screen-reader-text={`BSL video for ${name}`}
    >
      <div className="relative w-full pt-[177.77%]">
        {' '}
        {/* 16:9 aspect ratio */}
        <iframe
          loading="lazy"
          ref={videoRef}
          src={getVideoUrl(videoUrl)}
          title={name}
          className="absolute inset-0 h-full w-full rounded-lg shadow-md"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default VideoContainer;
