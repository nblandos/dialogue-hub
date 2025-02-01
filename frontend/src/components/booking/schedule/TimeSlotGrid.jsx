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
    <div className="grid grid-cols-[100px_auto] gap-1">
      <div className="font-semibold">Time</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))`,
        }}
        className="gap-1"
      >
        {days.map((day) => (
          <div
            key={day.full}
            className="text-center text-sm font-semibold md:text-base"
          >
            <div className="hidden md:block">
              <div>{day.full}</div>
              <div className="text-sm text-gray-600">{day.displayDate}</div>
            </div>
            <div className="md:hidden">
              <div>{day.short}</div>
              <div className="text-xs text-gray-600">{day.displayDate}</div>
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
                    : undefined
                }
              >
                {!isSlotPast(day.date, hour) && (
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
