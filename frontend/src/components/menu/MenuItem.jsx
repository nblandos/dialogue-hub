const MenuItem = ({ name, price, video }) => {
  return (
    <div className="rounded-lg bg-white p-4 shadow-lg transition-shadow hover:shadow-xl">
      <h2
        className="mb-2 text-center text-xl font-semibold"
        tabIndex="0"
        data-screen-reader-text={`${name}`}
      >
        {name}{' '}
        {price && <span className="text-sm text-gray-500">({price})</span>}
      </h2>
      <div className="relative h-72 w-full">
        <iframe
          loading="lazy"
          src={video}
          title={name}
          className="h-full w-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onMouseOver={(e) =>
            e.target.contentWindow.postMessage(
              '{"event":"command","func":"playVideo","args":""}',
              '*'
            )
          }
          onMouseOut={(e) =>
            e.target.contentWindow.postMessage(
              '{"event":"command","func":"pauseVideo","args":""}',
              '*'
            )
          }
        ></iframe>
      </div>
    </div>
  );
};

export default MenuItem;
