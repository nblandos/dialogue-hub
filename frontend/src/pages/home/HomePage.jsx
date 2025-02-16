import React, { useState, useRef } from "react";
import { initialMenu } from "./homeData";
import { FaArrowDown } from "react-icons/fa";
import tubeMap from "./images/tube_map.png";


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
    <div className="pt-32 p-8 flex bg-gray-100 border border-gray-300">
      {/* Order Example Column */}
      <div className="w-1/3 text-center pr-8 bg-white border border-gray-300 p-4"> 
        <h1 className="text-3xl font-bold mb-6">How to give an Order</h1>
        <div className="flex flex-col items-center space-y-6"> 
          {[
            { name: "Hello" },
            { name: "Hello-Please-Thank You" },
            { name: "Single Espresso" },
            { name: "Goodbye" }
          ].map((item, index) => (
            <React.Fragment key={item.name}>
              <div
                className="text-center"
                onMouseEnter={() => handleMouseEnter(item.name)}
                onMouseLeave={() => handleMouseLeave(item.name)}
              >
                <p className="text-xl font-semibold mb-4">{item.name}</p>
                <iframe
                  width="300"
                  height="200"
                  ref={(el) => (videoRefs.current[item.name] = el)}
                  src={
                    initialMenu.find(menuItem => menuItem.name === item.name)?.video +
                    "?enablejsapi=1"
                  }
                  title={item.name}
                  className={`border-2 border-black transition-transform ${hoveredVideo === item.name ? "scale-110" : "scale-100"}`}
                  allowFullScreen
                ></iframe>
              </div>
              {index < 3 && <FaArrowDown className="text-6xl text-black fill-black stroke-black inline-flex" />}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Tube Map Image with Text and Placeholder Below */}
      <div className="w-2/3 flex flex-col items-center text-center bg-white border border-gray-300 p-4">
        <header className="text-3xl font-bold mb-4">Map from the Cyprus Tube Station</header>
        <div className="relative flex justify-center">
            <img src={tubeMap} alt="Tube Map" className="w-2/3 border-2 border-black" />
        </div>
        <div className="mt-4 p-4 bg-gray-200 text-center w-full border border-black">
          <p className="text-lg">Placeholder text for additional information or content.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;