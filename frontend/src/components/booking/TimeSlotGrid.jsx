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
                key={`${day.date}-${hour}`}
                onClick={() => onSlotClick(day.date, hour)}
                className={`cursor-pointer rounded-md border p-2 transition-colors ${
                  selectedSlots.includes(`${day.date}T${hour}`)
                    ? 'bg-[#FA9C18] text-white'
                    : 'hover:bg-orange-100'
                }`}
              />
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default TimeSlotGrid;
