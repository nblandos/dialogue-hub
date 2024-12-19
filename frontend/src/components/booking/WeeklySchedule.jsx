import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TimeSlotGrid from './TimeSlotGrid';
import SelectedTimeDisplay from './SelectedTimeDisplay';

const WeeklyTimetable = () => {
  const navigate = useNavigate();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const hours = Array.from({ length: 9 }, (_, i) => i + 8);
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
    navigate('/confirmation', {
      state: {
        selectedSlots,
      },
    });
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
      <TimeSlotGrid
        days={days}
        hours={hours}
        selectedSlots={selectedSlots}
        onSlotClick={handleSlotClick}
      />

      {selectedSlots.length > 0 && (
        <SelectedTimeDisplay
          formattedTime={formatSelectedSlots(selectedSlots)}
          onCancel={handleCancelSelection}
          onBook={handleBookSlots}
        />
      )}
    </div>
  );
};

export default WeeklyTimetable;
