import React, { useState, useEffect } from 'react';

const TimeSlotGrid = ({
  days,
  hours,
  selectedSlots,
  onSlotClick,
  maxBookings = 3,
  busyThreshold = 0.3,
}) => {
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentHour = now.getHours();
  const [availability, setAvailability] = useState({});

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const startDate = days[0].date;
        const endDate = days[days.length - 1].date;
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/timeslots/availability?` +
            `start_date=${startDate}T00:00:00Z&end_date=${endDate}T23:59:59Z`
        );
        const data = await response.json();
        if (data.status === 'success') {
          setAvailability(data.data);
        }
      } catch (error) {
        alert('Failed to fetch availability. Please try again later.');
      }
    };

    fetchAvailability();
  }, [days]);

  const getSlotDisplay = (date, hour) => {
    const timeStr = `${date}T${hour.toString().padStart(2, '0')}:00:00`;
    const count = availability[timeStr] || 0;
    const displayCount = selectedSlots.includes(`${date}T${hour}`)
      ? count + 1
      : count;
    return `${displayCount}/${maxBookings}`;
  };

  const getSlotClass = (date, hour) => {
    const timeStr = `${date}T${hour.toString().padStart(2, '0')}:00:00`;
    const count = availability[timeStr] || 0;
    const isSelected = selectedSlots.includes(`${date}T${hour}`);

    if (isSlotPast(date, hour)) {
      return 'cursor-not-allowed bg-gray-100 opacity-70';
    }
    if (isSelected) {
      return 'cursor-pointer bg-green-500/80 text-white hover:bg-green-600/80';
    }
    if (count >= maxBookings) {
      return 'cursor-not-allowed bg-red-100 opacity-80';
    }
    if (count > maxBookings * busyThreshold) {
      return 'cursor-pointer bg-yellow-100/80 hover:bg-yellow-200/80';
    }
    return 'cursor-pointer bg-green-100/80 hover:bg-green-300/80';
  };

  const isSlotPast = (dayDate, hour) => {
    return (
      dayDate < currentDate || (dayDate === currentDate && hour <= currentHour)
    );
  };

  const isSlotFull = (date, hour) => {
    const timeStr = `${date}T${hour.toString().padStart(2, '0')}:00:00`;
    const count = availability[timeStr] || 0;
    return count >= maxBookings;
  };

  const getAccessibilityText = (date, hour) => {
    const timeStr = `${date}T${hour.toString().padStart(2, '0')}:00:00`;
    const count = availability[timeStr] || 0;

    if (isSlotPast(date, hour)) {
      return `Unavailable timeslot, ${hour} o'clock on ${date}`;
    }

    if (isSlotFull(date, hour)) {
      return `Fully booked timeslot, ${hour} o'clock on ${date}, ${maxBookings} of ${maxBookings} bookings`;
    }

    if (selectedSlots.includes(`${date}T${hour}`)) {
      return `Selected timeslot, ${hour} o'clock on ${date}, ${count + 1} of ${maxBookings} bookings`;
    }

    return `Available timeslot, ${hour} o'clock on ${date}, ${count} of ${maxBookings} bookings`;
  };

  return (
    <div
      className="grid grid-cols-[100px_auto] gap-1"
      role="grid"
      aria-label="Weekly booking timetable"
    >
      <div
        className="font-semibold"
        role="columnheader"
        data-screen-reader-text="Time Column"
      >
        Time
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))`,
        }}
        className="gap-1"
        role="row"
      >
        {days.map((day) => (
          <div
            key={day.full}
            className="text-center text-sm font-semibold md:text-base"
          >
            <div className="block sm:hidden">
              <div>{day.short.charAt(0)}</div>
            </div>
            <div className="hidden flex-col sm:flex xl:hidden">
              <div>{day.short}</div>
              <div className="text-xs text-gray-600">{day.displayDate}</div>
            </div>
            <div className="hidden flex-col xl:flex">
              <div>{day.full}</div>
              <div className="text-sm text-gray-600">{day.displayDate}</div>
            </div>
          </div>
        ))}
      </div>

      {hours.map((hour) => (
        <React.Fragment key={hour}>
          <div className="py-2 text-sm">{`${hour}:00`}</div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))`,
            }}
            className="gap-1"
          >
            {days.map((day) => (
              <div
                tabIndex="0"
                key={`${day.date}-${hour}`}
                data-screen-reader-text={
                  getAccessibilityText(day.date, hour) +
                  (!isSlotPast(day.date, hour) && !isSlotFull(day.date, hour)
                    ? '. Enter to select'
                    : '')
                }
                onClick={() =>
                  !isSlotPast(day.date, hour) &&
                  !isSlotFull(day.date, hour) &&
                  onSlotClick(day.date, hour)
                }
                data-testid={`slot-${day.date}-${hour}`}
                className={`relative rounded-md border p-2 transition-colors ${getSlotClass(
                  day.date,
                  hour
                )}`}
                aria-label={getAccessibilityText(day.date, hour)}
              >
                <span className="absolute inset-0 hidden items-center justify-center text-black/70 sm:flex sm:text-sm">
                  {isSlotPast(day.date, hour)
                    ? ''
                    : getSlotDisplay(day.date, hour)}
                </span>
              </div>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default TimeSlotGrid;
