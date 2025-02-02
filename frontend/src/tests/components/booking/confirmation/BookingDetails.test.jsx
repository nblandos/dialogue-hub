import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BookingDetails from '../../../../components/booking/confirmation/BookingDetails';

describe('BookingDetails', () => {
  const mockDetails = [
    { label: 'Date', value: 'Monday, 18 Mar 2024' },
    { label: 'Time', value: '9:00 - 11:00' },
    { label: 'Email', value: 'test@example.com' },
  ];

  it('renders booking details from array', () => {
    render(<BookingDetails details={mockDetails} />);

    expect(screen.getByText('Booking Details')).toBeInTheDocument();
    expect(screen.getByText('Date:')).toBeInTheDocument();
    expect(screen.getByText('Monday, 18 Mar 2024')).toBeInTheDocument();
    expect(screen.getByText('Time:')).toBeInTheDocument();
    expect(screen.getByText('9:00 - 11:00')).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    render(<BookingDetails details={mockDetails} />);

    expect(screen.getByText('Booking Details')).toHaveAttribute(
      'data-screen-reader-text',
      'Booking Details'
    );

    mockDetails.forEach((detail) => {
      expect(screen.getByText(`${detail.label}:`)).toHaveAttribute(
        'data-screen-reader-text',
        `${detail.label} is ${detail.value}`
      );
    });
  });

  it('renders with empty details array', () => {
    render(<BookingDetails details={[]} />);

    expect(screen.getByText('Booking Details')).toBeInTheDocument();
    expect(screen.queryByText('Date:')).not.toBeInTheDocument();
    expect(screen.queryByText('Time:')).not.toBeInTheDocument();
  });
});
