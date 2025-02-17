import React, { useState, useRef } from 'react';
import { initialMenu } from './homeData';
import { FaArrowDown } from 'react-icons/fa';
import tubeMap from './images/tube_map.png';

const HomePage = () => {
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const videoRefs = useRef({});

  const handleMouseEnter = (name) => {
    setHoveredVideo(name);
    if (videoRefs.current[name]) {
      videoRefs.current[name].contentWindow.postMessage(
        '{"event":"command","func":"playVideo","args":""}',
        '*'
      );
    }
  };

  const handleMouseLeave = (name) => {
    setHoveredVideo(null);
    if (videoRefs.current[name]) {
      videoRefs.current[name].contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        '*'
      );
    }
  };

  return (
    <div className="flex border border-gray-300 bg-gray-100 p-8 pt-32">
      {/* Order Example Column */}
      <div className="w-1/3 border border-gray-300 bg-white p-4 pr-8 text-center">
        <h1 className="mb-6 text-3xl font-bold">How to give an Order</h1>
        <div className="flex flex-col items-center space-y-6">
          {[
            { name: 'Hello' },
            { name: 'Hello-Please-Thank You' },
            { name: 'Single Espresso' },
            { name: 'Goodbye' },
          ].map((item, index) => (
            <React.Fragment key={item.name}>
              <div
                className="text-center"
                onMouseEnter={() => handleMouseEnter(item.name)}
                onMouseLeave={() => handleMouseLeave(item.name)}
              >
                <p className="mb-4 text-xl font-semibold">{item.name}</p>
                <iframe
                  width="300"
                  height="200"
                  ref={(el) => (videoRefs.current[item.name] = el)}
                  src={
                    initialMenu.find((menuItem) => menuItem.name === item.name)
                      ?.video + '?enablejsapi=1'
                  }
                  title={item.name}
                  className={`border-2 border-black transition-transform ${hoveredVideo === item.name ? 'scale-110' : 'scale-100'}`}
                  allowFullScreen
                ></iframe>
              </div>
              {index < 3 && (
                <FaArrowDown className="inline-flex fill-black stroke-black text-6xl text-black" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Tube Map Image with Text and Placeholder Below */}
      <div className="flex w-2/3 flex-col items-center border border-gray-300 bg-white p-4 text-center">
        <header className="mb-4 text-3xl font-bold">
          Map from the Cyprus Tube Station
        </header>
        <div className="relative flex justify-center">
          <img
            src={tubeMap}
            alt="Tube Map"
            className="w-2/3 border-2 border-black"
          />
        </div>
        <div className="mt-4 w-full border border-black bg-gray-200 p-4 text-center">
          <p className="text-lg">
            Placeholder text for additional information or content.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
