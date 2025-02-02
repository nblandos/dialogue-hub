const BookingDetails = ({ details = [] }) => {
  return (
    <div className="mb-8 w-full max-w-md space-y-2 rounded-lg bg-white p-6 shadow-lg">
      <h2
        className="mb-4 text-xl font-bold"
        tabIndex="0"
        data-screen-reader-text="Booking Details"
      >
        Booking Details
      </h2>
      {details.map((item, index) => (
        <p key={index}>
          <span
            className="font-bold"
            tabIndex="0"
            data-screen-reader-text={`${item.label} is ${item.value}`}
          >
            {item.label}:
          </span>{' '}
          {item.value}
        </p>
      ))}
    </div>
  );
};

export default BookingDetails;
