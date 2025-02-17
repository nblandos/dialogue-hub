import { useNavigate, useLocation } from 'react-router-dom';
import BookingDetails from '../../components/booking/confirmation/BookingDetails';

const BookingSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking || {};

  const details = [
    { label: 'Date', value: booking.date || 'No date selected' },
    { label: 'Time', value: booking.time || 'No time selected' },
    { label: 'Address', value: booking.address || 'No address provided' },
    { label: 'Full Name', value: booking.fullName || 'No name provided' },
    { label: 'Email', value: booking.email || 'No email provided' },
  ];

  const handleNewBooking = () => {
    navigate('/booking');
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 p-6 pt-36">
      <h1
        className="mb-8 text-center text-3xl font-bold"
        data-screen-reader-text="Booking Confirmed"
      >
        Booking Confirmed
      </h1>
      <BookingDetails details={details} />
      <p
        className="mb-4 w-full max-w-md text-center"
        data-screen-reader-text="Thank you for booking a visit to the Dialogue Cafe!
                                 A confirmation email has been sent to your inbox."
      >
        Thank you for booking a visit to the Dialogue Cafe!
        <br />A confirmation email has been sent to your inbox.
      </p>
      <button
        onClick={handleNewBooking}
        data-screen-reader-text="Make Another Booking"
        className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
      >
        Make Another Booking
      </button>
    </div>
  );
};

export default BookingSuccessPage;
