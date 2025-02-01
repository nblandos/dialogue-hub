import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BookingDetails from '../../../../components/booking/confirmation/BookingDetails';

describe('BookingDetails', () => {
  const defaultProps = {
    date: 'Monday, 18 Mar 2024',
    time: '9:00 - 11:00',
  };

  it('renders booking details', () => {
    render(<BookingDetails {...defaultProps} />);
    expect(screen.getByText('Booking Details')).toBeInTheDocument();
    expect(screen.getByText(defaultProps.date)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.time)).toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    render(<BookingDetails {...defaultProps} />);
    expect(screen.getByText('Booking Details')).toHaveAttribute(
      'data-screen-reader-text',
      'Booking Details'
    );
    expect(screen.getByText('Date:')).toHaveAttribute(
      'data-screen-reader-text',
      'Date is Monday, 18 Mar 2024'
    );
    expect(screen.getByText('Time:')).toHaveAttribute(
      'data-screen-reader-text',
      'Time is 9:00 - 11:00'
    );
  });

  it('renders with empty details', () => {
    render(<BookingDetails date="" time="" />);
    expect(screen.getByText('Date:')).toBeInTheDocument();
    expect(screen.getByText('Time:')).toBeInTheDocument();
  });
});
