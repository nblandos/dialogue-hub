import React from 'react';

const BookingDetails = ({ date, time }) => {
  return (
    <div className="mb-8 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold">Booking Details</h2>
      <div className="space-y-2">
        <p>
          <span className="font-bold">Date:</span> {date}
        </p>
        <p>
          <span className="font-bold">Time:</span> {time}
        </p>
      </div>
    </div>
  );
};

export default BookingDetails;
