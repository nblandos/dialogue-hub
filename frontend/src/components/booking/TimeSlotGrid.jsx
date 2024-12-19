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
          <div key={day} className="text-center font-semibold">
            {day}
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
                key={`${day}-${hour}`}
                onClick={() => onSlotClick(day, hour)}
                className={`cursor-pointer rounded-md border p-2 transition-colors ${
                  selectedSlots.includes(`${day}-${hour}`)
                    ? 'bg-orange-400 text-white'
                    : 'hover:bg-orange-100'
                } `}
              />
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default TimeSlotGrid;
