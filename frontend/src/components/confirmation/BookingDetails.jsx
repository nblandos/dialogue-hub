import React from "react";

const BookingDetails = ({ date, time }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mb-8">
      <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
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
