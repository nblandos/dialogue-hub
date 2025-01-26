import React from 'react';

const TimeSlotGrid = ({ days, hours, selectedSlots, onSlotClick }) => {
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
          <div key={day.full} className="text-center font-semibold">
            <div className="hidden md:block">
              <div>{day.full}</div>
              <div className="text-sm text-gray-600">{day.displayDate}</div>
            </div>
            <div className="md:hidden">
              <div>{day.short}</div>
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
                tabindex="0"
                data-screen-reader-text={
                  selectedSlots.includes(`${day.date}T${hour}`)
                    ? `Selected ${hour} o'clock on ${day.date}`
                    : `Enter to select ${hour} o'clock on ${day.date}`
                }
                key={`${day.date}-${hour}`}
                onClick={() => !day.isPast && onSlotClick(day.date, hour)}
                className={`relative rounded-md border p-2 transition-colors ${
                  selectedSlots.includes(`${day.date}T${hour}`)
                    ? 'cursor-pointer bg-green-500/80 text-white'
                    : day.isPast
                      ? 'cursor-not-allowed bg-gray-100 opacity-50'
                      : 'cursor-pointer bg-green-100/80 hover:bg-green-300/80'
                }`}
                aria-label={
                  !day.isPast
                    ? selectedSlots.includes(`${day.date}T${hour}`)
                      ? 'Selected timeslot'
                      : 'Bookable timeslot'
                    : undefined
                }
              >
                {!day.isPast && (
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-black/70 sm:text-sm">
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
