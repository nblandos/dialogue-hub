import React, { useState } from 'react';

const WeeklyTimetable = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const hours = Array.from({ length: 9 }, (_, i) => i + 8); // 8:00 - 16:00
  const [selectedSlots, setSelectedSlots] = useState([]);

  const isValidSelection = (slots, newSlot) => {
    const [newDay, newHour] = newSlot.split('-');
    const newHourNum = parseInt(newHour);

    if (slots.length === 0) return true;

    const existingDays = slots.map((slot) => slot.split('-')[0]);
    if (!existingDays.every((day) => day === newDay)) {
      return false;
    }

    const hours = slots
      .map((slot) => parseInt(slot.split('-')[1]))
      .sort((a, b) => a - b);

    return hours.some((hour) => Math.abs(hour - newHourNum) === 1);
  };

  const handleSlotClick = (day, hour) => {
    const slotKey = `${day}-${hour}`;

    setSelectedSlots((prev) => {
      if (prev.includes(slotKey)) {
        return prev.filter((slot) => slot !== slotKey);
      }

      if (isValidSelection(prev, slotKey)) {
        return [...prev, slotKey];
      }

      return [slotKey];
    });
  };

  const handleCancelSelection = () => {
    setSelectedSlots([]);
  };

  const handleBookSlots = () => {
    // TODO: Progress to confirmation page
    console.log('Booking slots:', selectedSlots);
  };

  const formatSelectedSlots = (slots) => {
    if (slots.length === 0) return [];

    const [day] = slots[0].split('-');

    const hours = slots
      .map((slot) => parseInt(slot.split('-')[1]))
      .sort((a, b) => a - b);

    const startTime = `${hours[0]}:00`;
    const endTime = `${hours[hours.length - 1] + 1}:00`;

    return `${day} ${startTime} - ${endTime}`;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-1">
        {/* Time column */}
        <div className="font-semibold">Time</div>
        {/* Days header */}
        {days.map((day) => (
          <div key={day} className="text-center font-semibold">
            {day}
          </div>
        ))}

        {/* Time slots */}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className="py-2 text-sm">{`${hour}:00`}</div>
            {days.map((day) => (
              <div
                key={`${day}-${hour}`}
                onClick={() => handleSlotClick(day, hour)}
                className={`cursor-pointer rounded-md border p-2 transition-colors ${
                  selectedSlots.includes(`${day}-${hour}`)
                    ? 'bg-orange-400 text-white'
                    : 'hover:bg-orange-100'
                } `}
              />
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Selected slots and buttons display */}
      {selectedSlots.length > 0 && (
        <div className="mt-4 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-grow">
              <h3 className="font-semibold">Selected Time:</h3>
              <div className="text-sm">
                {formatSelectedSlots(selectedSlots)}
              </div>
            </div>

            {/* Cancel and Book buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleCancelSelection}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
              >
                Cancel Selection
              </button>
              <button
                onClick={handleBookSlots}
                className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
              >
                Book Selected Slots
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyTimetable;
