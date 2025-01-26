const BookingDetails = ({ date, time }) => {
  return (
    <div className="mb-8 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
      <h2
        tabIndex="0"
        className="mb-4 text-xl font-semibold"
        data-screen-reader-text="Booking Details"
      >
        Booking Details
      </h2>
      <div className="space-y-2">
        <p>
          <span
            className="font-bold"
            tabIndex="0"
            data-screen-reader-text={`Date is ${date}`}
          >
            Date:
          </span>{' '}
          {date}
        </p>
        <p>
          <span
            className="font-bold"
            tabIndex="0"
            data-screen-reader-text={`Time is ${time}`}
          >
            Time:
          </span>{' '}
          {time}
        </p>
      </div>
    </div>
  );
};

export default BookingDetails;
