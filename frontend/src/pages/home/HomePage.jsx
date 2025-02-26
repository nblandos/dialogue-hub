import React, { useState, useRef } from 'react';
import { initialMenu, popularOrders } from './homeData';
import {
  FaArrowDown,
  FaBook,
  FaCalendarAlt,
  FaGraduationCap,
} from 'react-icons/fa';
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
    <div className="flex flex-col items-center bg-gray-100 p-6 pt-32 lg:flex-row lg:items-start">
      <div className="flex w-full flex-col items-center rounded-lg border-gray-300 bg-white p-4 text-center lg:w-3/4">
        <div className="mb-4 mt-2 w-4/5 text-center">
          <h1
            className="mb-2 text-4xl font-bold text-gray-900"
            data-screen-reader-text="Dialogue Cafe"
          >
            Dialogue Cafe
          </h1>
          <p
            className="mb-6 text-xl text-gray-700"
            data-screen-reader-text="Dialogue Cafe has a very strong commitment to social inclusion and
            change. We encourage our customers to order in British Sign Language
            to spark a conversation between visitors and our deaf or hard of
            hearing baristas."
          >
            Dialogue Cafe has a very strong commitment to social inclusion and
            change. We encourage our customers to order in British Sign Language
            to spark a conversation between visitors and our deaf or hard of
            hearing baristas.
          </p>
        </div>

        {/* Divider */}
        <div className="mb-8 w-full border-b border-gray-300"></div>

        <header
          className="mb-4 text-3xl font-bold"
          data-screen-reader-text="Popular Orders"
        >
          Popular Orders
        </header>

        {/* Popular Orders Videos Grid */}
        <div className="mb-8 grid w-full grid-cols-1 gap-8 px-4 sm:grid-cols-2 lg:grid-cols-3">
          {popularOrders.map((order) => (
            <div
              key={order.name}
              className="flex flex-col items-center text-center"
              onMouseEnter={() => handleMouseEnter(order.name)}
              onMouseLeave={() => handleMouseLeave(order.name)}
              data-screen-reader-text={order.name}
            >
              <p className="mb-2 text-xl font-semibold">{order.name}</p>
              <div className="relative mt-2 w-full pt-[177.77%]">
                <iframe
                  loading="lazy"
                  className="absolute left-0 top-0 h-full w-full rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                  ref={(el) => (videoRefs.current[order.name] = el)}
                  src={order.video}
                  title={order.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ))}
        </div>

        {/* Links */}
        <div className="mb-6 mt-4 flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <a
            href="/book"
            className="flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-blue-700 sm:w-auto"
          >
            <FaCalendarAlt className="text-xl" />
            <span data-screen-reader-text="Book a Table">Book a Table</span>
          </a>
          <a
            href="/menu"
            className="flex w-full items-center justify-center space-x-2 rounded-lg bg-green-600 px-6 py-3 text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-green-700 sm:w-auto"
          >
            <FaBook className="text-xl" />
            <span data-screen-reader-text="View Menu">View Menu</span>
          </a>
          <a
            href="/training"
            className="flex w-full items-center justify-center space-x-2 rounded-lg bg-purple-600 px-6 py-3 text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-purple-700 sm:w-auto"
          >
            <FaGraduationCap className="text-xl" />
            <span data-screen-reader-text="Learn Sign Language">
              Learn Sign Language
            </span>
          </a>
        </div>

        {/* Divider */}
        <div className="my-8 w-full border-b border-gray-300"></div>

        {/* Tube Map Image*/}
        <div className="mt-4 flex w-full flex-col items-center space-y-2">
          <h2
            className="text-3xl font-bold"
            data-screen-reader-text="Getting Here"
          >
            Getting Here
          </h2>
          <div className="flex w-full flex-col items-center justify-between gap-8 px-4 md:flex-row md:items-start">
            <div className="w-full md:w-2/3">
              <img
                src={tubeMap}
                alt="Tube Map"
                className="w-full rounded-lg shadow-md"
              />
            </div>
            <div className="mt-6 w-full space-y-6 text-left md:mt-0 md:w-1/3">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Address</h3>
                <p
                  className="text-gray-700"
                  data-screen-reader-text="Royal Docks Center for Sustainability"
                >
                  Royal Docks Center for Sustainability
                </p>
                <p
                  className="text-gray-700"
                  data-screen-reader-text=" University of East London Docklands Campus"
                >
                  University of East London Docklands Campus
                </p>
                <p
                  className="text-gray-700"
                  data-screen-reader-text="4-6 University Way"
                >
                  4-6 University Way
                </p>
                <p
                  className="text-gray-700"
                  data-screen-reader-text="London E16 2RD"
                >
                  London E16 2RD
                </p>
              </div>

              <div className="space-y-4">
                <h3
                  className="text-xl font-semibold"
                  data-screen-reader-text="Opening Hours"
                >
                  Opening Hours
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span
                      className="text-gray-700"
                      data-screen-reader-text="Monday-Thursday"
                    >
                      Monday-Thursday
                    </span>
                    <span
                      className="text-gray-700"
                      data-screen-reader-text="08:00-17:00"
                    >
                      08:00-17:00
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className="text-gray-700"
                      data-screen-reader-text="Friday"
                    >
                      Friday
                    </span>
                    <span
                      className="text-gray-700"
                      data-screen-reader-text="08:00-13:00"
                    >
                      08:00-13:00
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Example Column */}
      <div className="mt-6 flex w-full flex-col items-center lg:mt-0 lg:w-1/4">
        <h1
          className="mb-6 text-3xl font-bold"
          data-screen-reader-text="How to Order"
        >
          How to Order
        </h1>
        <div className="flex flex-col items-center space-y-6">
          {[
            { name: 'Hello-Please-Thank You' },
            { name: 'Single Espresso' },
            { name: 'Goodbye' },
          ].map((item, index) => (
            <React.Fragment key={item.name}>
              <div
                className="flex w-full flex-col items-center text-center"
                onMouseEnter={() => handleMouseEnter(item.name)}
                onMouseLeave={() => handleMouseLeave(item.name)}
                data-screen-reader-text={item.name}
              >
                <p className="mb-4 text-xl font-semibold">{item.name}</p>
                <div
                  className="relative h-auto w-full"
                  style={{ width: '230px', paddingTop: '177.77%' }}
                >
                  <iframe
                    loading="lazy"
                    ref={(el) => (videoRefs.current[item.name] = el)}
                    src={
                      initialMenu.find(
                        (menuItem) => menuItem.name === item.name
                      )?.video
                    }
                    title={item.name}
                    className="absolute left-0 top-0 h-full w-full rounded-lg shadow-md transition-transform hover:scale-105"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              {index < 2 && (
                <FaArrowDown className="my-4 text-4xl text-black" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
