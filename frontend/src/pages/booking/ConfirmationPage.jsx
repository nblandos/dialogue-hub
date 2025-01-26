import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSlots } = location.state || { selectedSlots: [] };

  // Format the booking details
  let formattedDate = 'No date selected';
  let formattedTime = 'No time selected';

  if (selectedSlots.length) {
    const [dateStr] = selectedSlots[0].split('T');
    const times = selectedSlots
      .map((slot) => parseInt(slot.split('T')[1]))
      .sort((a, b) => a - b);

    const startTime = `${times[0]}:00`;
    const endTime = `${times[times.length - 1] + 1}:00`;

    formattedDate = format(parseISO(dateStr), 'EEEE, dd MMM yyyy'); // Format to "Tuesday, 28 Jan 2025"
    formattedTime = `${startTime} - ${endTime}`;
  }

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showEmailError, setShowEmailError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // const validateFullName = (name) => {
  //   return name.trim().length > 0;
  // };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleConfirm = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!validateEmail(email)) {
      setShowEmailError(true);
      return;
    }

    setShowEmailError(false);
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/create-booking`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: {
              email: email,
              full_name: name,
            },
            timeslots: selectedSlots.map((slot) => ({
              start_time: slot,
            })),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Booking failed');
      }

      // navigate to success page - not yet implemented so navigate to homepage
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 p-6 pt-36">
      <h1 className="mb-8 text-center text-3xl font-bold">
        Confirm Your Booking
      </h1>

      {/* Booking Details Box */}
      <div className="mb-8 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Booking Details</h2>
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
        {/* Full Name Input */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-1 block text-lg font-medium">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your Full Name"
            className="w-full rounded-lg border border-gray-300 p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-1 block text-lg font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email address"
            className={`w-full border ${
              showEmailError ? 'border-red-500' : 'border-gray-300'
            } rounded-lg p-2`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {showEmailError && (
            <p className="mt-1 text-sm text-red-500">
              Please enter a valid email address.
            </p>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* Buttons */}
      <div className="mt-6 flex w-full max-w-md justify-between">
        <button
          className="rounded-lg bg-red-500 px-6 py-2 text-white hover:bg-red-600"
          onClick={() => navigate('/')}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          className="rounded-lg bg-green-500 px-6 py-2 text-white hover:bg-green-600 disabled:bg-gray-400"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Confirm'}
        </button>
      </div>
    </div>
  );
}

export default ConfirmationPage;
