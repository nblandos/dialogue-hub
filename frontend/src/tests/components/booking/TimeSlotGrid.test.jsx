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

  it('renders the time column header', () => {
    renderComponent();
    expect(screen.getByText('Time')).toBeInTheDocument();
  });

  it('renders day headers with correct format', () => {
    renderComponent();
    expect(screen.getByText('Monday')).toBeInTheDocument();
    expect(screen.getByText('Tuesday')).toBeInTheDocument();
  });

  it('renders time slots for each hour', () => {
    renderComponent();
    expect(screen.getByText('9:00')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  it('shows "Selected" text for selected slots', () => {
    renderComponent();
    const selectedSlot = screen.getByText('Selected');
    expect(selectedSlot).toBeInTheDocument();
  });

  it('shows "Book?" text for available slots', () => {
    renderComponent();
    const bookableSlots = screen.getAllByText('Book?');
    expect(bookableSlots.length).toBeGreaterThan(0);
  });

  it('applies correct styling for selected slots', () => {
    renderComponent();
    const selectedSlot = screen.getByText('Selected').closest('div');
    expect(selectedSlot).toHaveClass('bg-green-500/80');
  });

  it('applies correct styling for past slots', () => {
    renderComponent();
    const pastSlots = screen.getAllByLabelText('Unavailable timeslot');
    expect(pastSlots[0]).toHaveClass('cursor-not-allowed', 'bg-gray-100', 'opacity-50');
  });

  it('calls onSlotClick when clicking an available slot', () => {
    renderComponent();
    const availableSlot = screen.getAllByText('Book?')[0].closest('div');
    fireEvent.click(availableSlot);
    expect(mockOnSlotClick).toHaveBeenCalled();
  });

  it('does not call onSlotClick when clicking a past slot', () => {
    renderComponent();
    const pastSlot = screen.getAllByLabelText('Unavailable timeslot')[0];
    fireEvent.click(pastSlot);
    expect(mockOnSlotClick).not.toHaveBeenCalled();
  });

  it('renders correct aria-labels for different slot states', () => {
    renderComponent();
    expect(screen.getByLabelText('Selected timeslot')).toBeInTheDocument();
    const unavailableSlots = screen.getAllByLabelText('Unavailable timeslot');
    expect(unavailableSlots).toHaveLength(2);
    expect(screen.getByLabelText('Bookable timeslot')).toBeInTheDocument();
  });

  it('renders mobile view with short day names', () => {
    renderComponent();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
  });
});