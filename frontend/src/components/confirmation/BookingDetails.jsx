import React from "react";

const BookingDetails = ({ date, time }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mb-8">
      <h2 tabindex="0" className="text-xl font-semibold mb-4" data-screen-reader-text="Booking Details">Booking Details</h2>
      <div className="space-y-2">
        <p>
          <span className="font-bold" tabindex="0" data-screen-reader-text={`Date is ${date}`}>Date:</span> {date}
        </p>
        <p>
          <span className="font-bold" tabindex="0" data-screen-reader-text={`Time is ${time}`}>Time:</span> {time}
        </p>
      </div>
    </div>
  );
};

export default BookingDetails;
