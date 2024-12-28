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
            <span className="hidden md:inline">{day.full}</span>
            <span className="md:hidden">{day.short}</span>
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
                key={`${day.full}-${hour}`}
                onClick={() => onSlotClick(day.full, hour)}
                className={`cursor-pointer rounded-md border p-2 transition-colors ${
                  selectedSlots.includes(`${day.full}-${hour}`)
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
