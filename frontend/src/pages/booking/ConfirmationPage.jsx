import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";

function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSlots } = location.state || { selectedSlots: [] };

  // Format the booking details
  let formattedDate = "No date selected";
  let formattedTime = "No time selected";

  if (selectedSlots.length) {
    const [dateStr] = selectedSlots[0].split("T");
    const times = selectedSlots
      .map((slot) => parseInt(slot.split("T")[1]))
      .sort((a, b) => a - b);

    const startTime = `${times[0]}:00`;
    const endTime = `${times[times.length - 1] + 1}:00`;

    formattedDate = format(parseISO(dateStr), "EEEE, dd MMM yyyy"); // Format to "Tuesday, 28 Jan 2025"
    formattedTime = `${startTime} - ${endTime}`;
  }

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showEmailError, setShowEmailError] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleConfirm = () => {
    if (!validateEmail(email)) {
      setShowEmailError(true);
    } else {
      setShowEmailError(false);
      // Confirmation logic to be implemented
      console.log("Confirm booking logic should be implemented.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-36 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-center">Confirm Your Booking</h1>

      {/* Booking Details Box */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
        <div className="space-y-2">
          <p>
            <span className="font-bold">Date:</span> {formattedDate}
          </p>
          <p>
            <span className="font-bold">Time:</span> {formattedTime}
          </p>
        </div>
      </div>

      {/* Input Fields */}
      <div className="w-full max-w-md">
        {/* Name and Surname Input */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-lg font-medium mb-1">
            Name and Surname
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name and surname"
            className="w-full border border-gray-300 rounded-lg p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-lg font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email address"
            className={`w-full border ${
              showEmailError ? "border-red-500" : "border-gray-300"
            } rounded-lg p-2`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {showEmailError && (
            <p className="text-red-500 text-sm mt-1">
              Please enter a valid email address.
            </p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between w-full max-w-md mt-6">
        <button
          className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600"
          onClick={() => navigate("/")} // Navigate to homepage
        >
          Cancel
        </button>
        <button
          className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
          onClick={handleConfirm} // Handle confirm logic
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export default ConfirmationPage;
