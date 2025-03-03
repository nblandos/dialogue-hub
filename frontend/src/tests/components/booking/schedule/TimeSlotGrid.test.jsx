import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

  const mockSelectedSlots = [`${mockDays[0].date}T9`];
  const mockHours = [9, 10];
  const mockOnSlotClick = vi.fn();

  // Default config for production is maxBookings=3, busyThreshold=0.3.
  // In tests we can pass alternative values for flexibility.
  const defaultConfig = { maxBookings: 3, busyThreshold: 0.3 };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            status: 'success',
            data: {}, // default: no bookings
          }),
      })
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderComponent = (config = {}, props = {}) =>
    render(
      <TimeSlotGrid
        days={mockDays}
        hours={mockHours}
        selectedSlots={mockSelectedSlots}
        onSlotClick={mockOnSlotClick}
        {...defaultConfig}
        {...config}
        {...props}
      />
    );

  it('renders time column and correct day headers', async () => {
    renderComponent();
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Monday')).toBeInTheDocument();
    expect(screen.getByText('Tuesday')).toBeInTheDocument();
  });

  it('renders all provided hours', async () => {
    renderComponent();
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(screen.getByText('9:00')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  it('displays correct accessibility labels reflecting availability (default config)', async () => {
    renderComponent();
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    const selectedSlot = screen.getByTestId(`slot-${mockDays[0].date}-9`);
    expect(selectedSlot).toHaveAttribute(
      'aria-label',
      `Selected timeslot, 9 o'clock on ${mockDays[0].date}, ${1} of ${defaultConfig.maxBookings} bookings`
    );

    const availableSlot = screen.getByTestId(`slot-${mockDays[0].date}-10`);
    expect(availableSlot).toHaveAttribute(
      'aria-label',
      `Available timeslot, 10 o'clock on ${mockDays[0].date}, ${0} of ${defaultConfig.maxBookings} bookings`
    );

    const pastSlot = screen.getByTestId(`slot-${mockDays[1].date}-9`);
    expect(pastSlot).toHaveAttribute(
      'aria-label',
      `Unavailable timeslot, 9 o'clock on ${mockDays[1].date}`
    );
  });

  it('calls onSlotClick handler for an available slot', async () => {
    renderComponent();
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const availableSlot = screen.getByTestId(`slot-${mockDays[0].date}-10`);
    fireEvent.click(availableSlot);
    expect(mockOnSlotClick).toHaveBeenCalledTimes(1);
  });

  it('does not allow clicking past slots', async () => {
    // Set a day 30 days in the past
    const oldDate = new Date(today);
    oldDate.setDate(today.getDate() - 30);
    const customDays = [
      { ...mockDays[0] },
      { ...mockDays[1], date: oldDate.toISOString().split('T')[0] },
    ];
    renderComponent({}, { days: customDays });
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const pastSlot = screen.getByTestId(`slot-${customDays[1].date}-9`);
    fireEvent.click(pastSlot);
    expect(mockOnSlotClick).not.toHaveBeenCalled();
  });

  it('marks the slot as past if it is the current hour on the current day', async () => {
    const now = new Date();
    const customDay = {
      full: 'Today',
      short: 'Today',
      date: now.toISOString().split('T')[0],
      displayDate: 'Today',
    };
    const currentHour = now.getHours();
    renderComponent(
      {},
      { days: [customDay], hours: [currentHour], selectedSlots: [] }
    );
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
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

  it('displays fully booked slot and does not allow clicking', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            status: 'success',
            data: {
              [`${mockDays[0].date}T10:00:00`]: defaultConfig.maxBookings,
            },
          }),
      })
    );
    renderComponent();
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const fullSlot = screen.getByTestId(`slot-${mockDays[0].date}-10`);
    expect(fullSlot).toHaveAttribute(
      'aria-label',
      `Fully booked timeslot, 10 o'clock on ${mockDays[0].date}, ${defaultConfig.maxBookings} of ${defaultConfig.maxBookings} bookings`
    );
    fireEvent.click(fullSlot);
    expect(mockOnSlotClick).not.toHaveBeenCalled();
  });

  it('applies busy style when availability count is above busy threshold (custom config)', async () => {
    // Use custom config: maxBookings = 5 and busyThreshold = 0.5
    const customConfig = { maxBookings: 5, busyThreshold: 0.5 };
    // Simulate that tomorrow at 10:00 has a count that is above busy threshold
    const busyCount = 3; // For maxBookings 5, busy if count > 2.5
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            status: 'success',
            data: {
              [`${mockDays[0].date}T10:00:00`]: busyCount,
            },
          }),
      })
    );
    renderComponent(customConfig);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const busySlot = screen.getByTestId(`slot-${mockDays[0].date}-10`);
    expect(busySlot.className).toContain('bg-yellow-100/80');
    fireEvent.click(busySlot);
    expect(mockOnSlotClick).toHaveBeenCalledTimes(1);
  });

  it('continues when fetching availability fails', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

    renderComponent();
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  it('marks slots as unavailable after 1pm on Fridays', async () => {
    const today = new Date();
    const fridayDate = new Date(today);
    const daysUntilFriday = (5 + 7 - fridayDate.getDay()) % 7;
    fridayDate.setDate(
      fridayDate.getDate() + (daysUntilFriday === 0 ? 7 : daysUntilFriday)
    );

    const fridayDay = {
      full: 'Friday',
      short: 'Fri',
      date: fridayDate.toISOString().split('T')[0],
      displayDate: formatDisplayDate(fridayDate),
    };

    const fridayHours = [12, 13, 14]; // 12pm (available), 1pm and 2pm (should be unavailable)

    renderComponent(
      {},
      {
        days: [fridayDay],
        hours: fridayHours,
        selectedSlots: [],
      }
    );

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    const noonSlot = screen.getByTestId(`slot-${fridayDay.date}-12`);
    expect(noonSlot).toHaveAttribute(
      'aria-label',
      expect.stringContaining('Available timeslot')
    );
    fireEvent.click(noonSlot);
    expect(mockOnSlotClick).toHaveBeenCalledTimes(1);

    const slot1pm = screen.getByTestId(`slot-${fridayDay.date}-13`);
    expect(slot1pm).toHaveAttribute(
      'aria-label',
      `Unavailable timeslot, 13 o'clock on ${fridayDay.date}`
    );
    fireEvent.click(slot1pm);
    expect(mockOnSlotClick).toHaveBeenCalledTimes(1);

    const slot2pm = screen.getByTestId(`slot-${fridayDay.date}-14`);
    expect(slot2pm).toHaveAttribute(
      'aria-label',
      `Unavailable timeslot, 14 o'clock on ${fridayDay.date}`
    );
    fireEvent.click(slot2pm);
    expect(mockOnSlotClick).toHaveBeenCalledTimes(1);
  });
});
