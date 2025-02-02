import React from 'react';

const TimeSlotGrid = ({ days, hours, selectedSlots, onSlotClick }) => {
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentHour = now.getHours();

  const isSlotPast = (dayDate, hour) => {
    // if day is in the past or today and hour has passed
    return (
      dayDate < currentDate || (dayDate === currentDate && hour <= currentHour)
    );
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
            {/* XS layouts: show one-letter day, no date */}
            <div className="block sm:hidden">
              <div>{day.short.charAt(0)}</div>
            </div>
            {/* S layouts: show short day and date */}
            <div className="hidden flex-col sm:flex xl:hidden">
              <div>{day.short}</div>
              <div className="text-xs text-gray-600">{day.displayDate}</div>
            </div>
            {/* XL layouts: show full day and date */}
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
                  isSlotPast(day.date, hour)
                    ? `Unavailable timeslot, ${hour} o'clock on ${day.date}`
                    : selectedSlots.includes(`${day.date}T${hour}`)
                      ? `Selected ${hour} o'clock on ${day.date}`
                      : `Enter to select ${hour} o'clock on ${day.date}`
                }
                onClick={() =>
                  !isSlotPast(day.date, hour) && onSlotClick(day.date, hour)
                }
                data-testid={`slot-${day.date}-${hour}`}
                className={`relative rounded-md border p-2 transition-colors ${
                  isSlotPast(day.date, hour)
                    ? 'cursor-not-allowed bg-gray-100 opacity-50'
                    : selectedSlots.includes(`${day.date}T${hour}`)
                      ? 'cursor-pointer bg-green-500/80 text-white'
                      : 'cursor-pointer bg-green-100/80 hover:bg-green-300/80'
                }`}
                aria-label={
                  !isSlotPast(day.date, hour)
                    ? selectedSlots.includes(`${day.date}T${hour}`)
                      ? 'Selected timeslot'
                      : 'Bookable timeslot'
                    : 'Past timeslot'
                }
              >
                {isSlotPast(day.date, hour) ? (
                  <span className="sr-only">Past</span>
                ) : (
                  <span className="absolute inset-0 hidden items-center justify-center text-black/70 sm:flex sm:text-sm">
                    {selectedSlots.includes(`${day.date}T${hour}`)
                      ? 'Selected'
                      : 'Book?'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default TimeSlotGrid;
