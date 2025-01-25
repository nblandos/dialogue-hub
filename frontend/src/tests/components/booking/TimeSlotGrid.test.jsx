import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TimeSlotGrid from '../../../components/booking/TimeSlotGrid';

describe('TimeSlotGrid', () => {
  const mockDays = [
    {
      full: 'Monday',
      short: 'Mon',
      date: '2024-03-18',
      displayDate: '18/03',
      isPast: false
    },
    {
      full: 'Tuesday',
      short: 'Tue',
      date: '2024-03-19',
      displayDate: '19/03',
      isPast: true
    }
  ];

  const mockHours = [9, 10];
  const mockSelectedSlots = ['2024-03-18T9'];
  const mockOnSlotClick = vi.fn();

  const renderComponent = (props = {}) => {
    return render(
      <TimeSlotGrid
        days={mockDays}
        hours={mockHours}
        selectedSlots={mockSelectedSlots}
        onSlotClick={mockOnSlotClick}
        {...props}
      />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the time column and day headers', () => {
    renderComponent();
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Monday')).toBeInTheDocument();
    expect(screen.getByText('Tuesday')).toBeInTheDocument();
  });

  it('renders time slots', () => {
    renderComponent();
    expect(screen.getByText('9:00')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  it('shows correct slot states', () => {
    renderComponent();
    expect(screen.getByText('Selected')).toBeInTheDocument();
    expect(screen.getAllByText('Book?').length).toBeGreaterThan(0);
  });

  it('handles slot selection', () => {
    renderComponent();
    const availableSlot = screen.getAllByText('Book?')[0];
    fireEvent.click(availableSlot);
    expect(mockOnSlotClick).toHaveBeenCalled();
  });

  it('renders with correct accessibility labels', () => {
    renderComponent();
    expect(screen.getByLabelText('Selected timeslot')).toBeInTheDocument();
    expect(screen.getByLabelText('Bookable timeslot')).toBeInTheDocument();
  });
});