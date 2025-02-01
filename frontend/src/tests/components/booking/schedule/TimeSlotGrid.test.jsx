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

  // Mark the first day as selected
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

  it('displays selected slots and available slots', () => {
    renderComponent();
    expect(screen.getByText('Selected')).toBeInTheDocument();
    expect(screen.getAllByText('Book?').length).toBeGreaterThan(0);
  });

  it('calls onSlotClick handler for an available slot', () => {
    renderComponent();
    const bookableSlots = screen.getAllByText('Book?');
    fireEvent.click(bookableSlots[0]);
    expect(mockOnSlotClick).toHaveBeenCalledTimes(1);
  });

  it('does not allow clicking past slots', () => {
    const oldDate = new Date(today);
    oldDate.setDate(today.getDate() - 30);

    const customDays = [
      { ...mockDays[0] },
      { ...mockDays[1], date: oldDate.toISOString().split('T')[0] },
    ];
    renderComponent({ days: customDays });
    const slotTestId = `slot-${customDays[1].date}-9`;
    const pastSlot = screen.getByTestId(slotTestId);
    fireEvent.click(pastSlot);
    expect(mockOnSlotClick).not.toHaveBeenCalled();
  });

  it('has correct accessibility attributes', () => {
    renderComponent();
    expect(screen.getByLabelText('Selected timeslot')).toBeInTheDocument();
    expect(screen.getByLabelText('Bookable timeslot')).toBeInTheDocument();
  });

  it('correctly renders screen-reader text for a slot', () => {
    renderComponent();
    const slot = screen.getByTestId(`slot-${mockDays[0].date}-9`);
    expect(slot).toHaveAttribute(
      'data-screen-reader-text',
      `Selected 9 o'clock on ${mockDays[0].date}`
    );
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

    const slotTestId = `slot-${customDay.date}-${currentHour}`;
    const slotElement = screen.getByTestId(slotTestId);
    expect(slotElement).toHaveTextContent('Past');
  });
});
