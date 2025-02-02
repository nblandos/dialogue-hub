import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router, Routes, Route } from 'react-router-dom';
import BookingSuccessPage from '../../../pages/booking/BookingSuccessPage';

describe('BookingSuccessPage', () => {
  const booking = {
    date: 'Monday, 18 Mar 2024',
    time: '9:00 - 11:00',
    address: 'Dialogue Cafe, London',
    fullName: 'Test User',
    email: 'test@example.com',
  };

  const renderWithRouter = (initialBooking) => {
    const history = createMemoryHistory({
      initialEntries: [
        {
          pathname: '/success',
          state: { booking: initialBooking },
        },
      ],
    });

    return {
      ...render(
        <Router location={history.location} navigator={history}>
          <Routes>
            <Route path="/success" element={<BookingSuccessPage />} />
            <Route path="/" element={<div>Home Page</div>} />
          </Routes>
        </Router>
      ),
      history,
    };
  };

  it('renders header, booking details, and confirmation text with correct line break', () => {
    renderWithRouter(booking);

    expect(screen.getByText('Booking Confirmed')).toBeInTheDocument();

    expect(screen.getByText('Date:')).toBeInTheDocument();
    expect(screen.getByText('Monday, 18 Mar 2024')).toBeInTheDocument();
    expect(screen.getByText('Time:')).toBeInTheDocument();
    expect(screen.getByText('9:00 - 11:00')).toBeInTheDocument();
    expect(screen.getByText('Address:')).toBeInTheDocument();
    expect(screen.getByText('Dialogue Cafe, London')).toBeInTheDocument();
    expect(screen.getByText('Full Name:')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();

    expect(
      screen.getByText('Thank you for booking a visit to the Dialogue Cafe!', {
        exact: false,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText('A confirmation email has been sent to your inbox.', {
        exact: false,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Make Another Booking' })
    ).toBeInTheDocument();
  });

  it('navigates to home page when "Make Another Booking" button is clicked', () => {
    const { history } = renderWithRouter(booking);

    const button = screen.getByRole('button', { name: 'Make Another Booking' });
    fireEvent.click(button);

    expect(history.location.pathname).toBe('/');
  });

  it('renders fallback values when booking state is missing', () => {
    const { history } = renderWithRouter(null);

    // Check that fallback values are displayed
    expect(screen.getByText('No date selected')).toBeInTheDocument();
    expect(screen.getByText('No time selected')).toBeInTheDocument();
    expect(screen.getByText('No address provided')).toBeInTheDocument();
    expect(screen.getByText('No name provided')).toBeInTheDocument();
    expect(screen.getByText('No email provided')).toBeInTheDocument();
  });

  it('renders fallback values for partial booking data', () => {
    const partialBooking = {
      date: 'Monday, 18 Mar 2024',
      // time missing
      address: 'Dialogue Cafe, London',
      // fullName missing
      email: 'test@example.com',
    };

    renderWithRouter(partialBooking);

    expect(screen.getByText('Monday, 18 Mar 2024')).toBeInTheDocument();
    expect(screen.getByText('Dialogue Cafe, London')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();

    expect(screen.getByText('No time selected')).toBeInTheDocument();
    expect(screen.getByText('No name provided')).toBeInTheDocument();
  });
});
