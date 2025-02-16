import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TimeSlotGrid from '../../../../components/booking/schedule/TimeSlotGrid';

function formatDisplayDate(dateObj) {
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
}

describe('TimeSlotGrid', () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const mockDays = [
    {
      full: 'Monday',
      short: 'Mon',
      date: tomorrow.toISOString().split('T')[0],
      displayDate: formatDisplayDate(tomorrow),
    },
    {
      full: 'Tuesday',
      short: 'Tue',
      date: yesterday.toISOString().split('T')[0],
      displayDate: formatDisplayDate(yesterday),
    },
  ];

  // Mark the first day, hour 9 as selected
  const mockSelectedSlots = [`${mockDays[0].date}T9`];
  const mockHours = [9, 10];
  const mockOnSlotClick = vi.fn();

  const renderComponent = (props = {}) =>
    render(
      <TimeSlotGrid
        days={mockDays}
        hours={mockHours}
        selectedSlots={mockSelectedSlots}
        onSlotClick={mockOnSlotClick}
        {...props}
      />
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders time column and correct day headers', () => {
    renderComponent();
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Monday')).toBeInTheDocument();
    expect(screen.getByText('Tuesday')).toBeInTheDocument();
  });

  it('renders all provided hours', () => {
    renderComponent();
    expect(screen.getByText('9:00')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  it('displays correct accessibility labels for selected and past slots', () => {
    renderComponent();

    // For the selected slot on tomorrow at 9:00,
    // expected count is 0 from availability plus 1 for selection: "1 of 3"
    const selectedSlot = screen.getByTestId(`slot-${mockDays[0].date}-9`);
    expect(selectedSlot).toHaveAttribute(
      'aria-label',
      `Selected timeslot, 9 o'clock on ${mockDays[0].date}, 1 of 3 bookings`
    );

    // For the past slot (yesterday) the accessibility label shows it as unavailable
    const pastSlot = screen.getByTestId(`slot-${mockDays[1].date}-9`);
    expect(pastSlot).toHaveAttribute(
      'aria-label',
      `Unavailable timeslot, 9 o'clock on ${mockDays[1].date}`
    );
  });

  it('calls onSlotClick handler for an available slot', () => {
    renderComponent();
    // Pick an available slot: tomorrow at 10 is not selected and not past.
    const availableSlot = screen.getByTestId(`slot-${mockDays[0].date}-10`);
    fireEvent.click(availableSlot);
    expect(mockOnSlotClick).toHaveBeenCalledTimes(1);
  });

  it('does not allow clicking past slots', () => {
    // Create a custom day in the far past for testing
    const oldDate = new Date(today);
    oldDate.setDate(today.getDate() - 30);
    const customDays = [
      { ...mockDays[0] },
      { ...mockDays[1], date: oldDate.toISOString().split('T')[0] },
    ];
    renderComponent({ days: customDays });
    const pastSlot = screen.getByTestId(`slot-${customDays[1].date}-9`);
    fireEvent.click(pastSlot);
    expect(mockOnSlotClick).not.toHaveBeenCalled();
  });

  it('marks the slot as past if it is the current hour on the current day', () => {
    const now = new Date();
    const customDay = {
      full: 'Today',
      short: 'Today',
      date: now.toISOString().split('T')[0],
      displayDate: 'Today',
    };
    const currentHour = now.getHours();

    renderComponent({
      days: [customDay],
      hours: [currentHour],
      selectedSlots: [],
    });

    const slotElement = screen.getByTestId(
      `slot-${customDay.date}-${currentHour}`
    );
    expect(slotElement).toHaveAttribute(
      'aria-label',
      `Unavailable timeslot, ${currentHour} o'clock on ${customDay.date}`
    );
    fireEvent.click(slotElement);
    expect(mockOnSlotClick).not.toHaveBeenCalled();
  });
});
