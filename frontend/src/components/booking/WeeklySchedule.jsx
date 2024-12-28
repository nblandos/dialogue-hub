import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TimeSlotGrid from './TimeSlotGrid';
import SelectedTimeDisplay from './SelectedTimeDisplay';

const WeeklyTimetable = () => {
  const navigate = useNavigate();
  const daysMap = [
    { full: 'Monday', short: 'Mon' },
    { full: 'Tuesday', short: 'Tue' },
    { full: 'Wednesday', short: 'Wed' },
    { full: 'Thursday', short: 'Thu' },
    { full: 'Friday', short: 'Fri' },
  ];
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
        const daySlots = prev
          .filter((slot) => slot.startsWith(day))
          .map((slot) => parseInt(slot.split('-')[1]))
          .sort((a, b) => a - b);

        const hourIndex = daySlots.indexOf(hour);
        if (hourIndex > 0 && hourIndex < daySlots.length - 1) {
          return prev.filter((slot) => {
            const [slotDay, slotHour] = slot.split('-');
            return slotDay === day && parseInt(slotHour) > hour;
          });
        }

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
        days={daysMap}
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
