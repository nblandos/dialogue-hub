import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  startOfWeek,
  addDays,
  format,
  parseISO,
  setHours,
  addWeeks,
} from 'date-fns';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';

import TimeSlotGrid from './TimeSlotGrid';
import SelectedTimeDisplay from './SelectedTimeDisplay';

const WeeklyTimetable = () => {
  const navigate = useNavigate();
  const [weekOffset, setWeekOffset] = useState(0);

  const today = new Date();
  const weekStart = addWeeks(
    startOfWeek(today, { weekStartsOn: 1 }),
    weekOffset
  );

  const handlePrevWeek = () => setWeekOffset((prev) => prev - 1);
  const handleNextWeek = () => setWeekOffset((prev) => prev + 1);
  const handleCurrentWeek = () => setWeekOffset(0);

  const daysMap = Array.from({ length: 5 }, (_, index) => {
    const date = addDays(weekStart, index);
    return {
      full: format(date, 'EEEE'),
      short: format(date, 'EEE'),
      date: format(date, 'yyyy-MM-dd'),
      displayDate: format(date, 'dd/MM'),
    };
  });
  const hours = Array.from({ length: 9 }, (_, i) => i + 8);
  const [selectedSlots, setSelectedSlots] = useState([]);

  const isValidSelection = (slots, newSlot) => {
    const [newDate, newHour] = newSlot.split('T');
    const newHourNum = parseInt(newHour);

    if (slots.length === 0) return true;

    const existingDates = slots.map((slot) => slot.split('T')[0]);
    if (!existingDates.every((date) => date === newDate)) {
      return false;
    }

    const hours = slots
      .map((slot) => parseInt(slot.split('T')[1]))
      .sort((a, b) => a - b);

    return hours.some((hour) => Math.abs(hour - newHourNum) === 1);
  };

  const handleSlotClick = (date, hour) => {
    const slotKey = `${date}T${hour}`;

    setSelectedSlots((prev) => {
      if (prev.includes(slotKey)) {
        const dateSlots = prev
          .filter((slot) => slot.startsWith(date))
          .map((slot) => parseInt(slot.split('T')[1]))
          .sort((a, b) => a - b);

        const hourIndex = dateSlots.indexOf(hour);
        if (hourIndex > 0 && hourIndex < dateSlots.length - 1) {
          return prev.filter((slot) => {
            const [slotDate, slotHour] = slot.split('T');
            return slotDate === date && parseInt(slotHour) < hour;
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
    if (slots.length === 0) return '';

    const [dateStr] = slots[0].split('T');
    const date = parseISO(dateStr);

    const hours = slots
      .map((slot) => parseInt(slot.split('T')[1]))
      .sort((a, b) => a - b);

    const startTime = setHours(new Date(date), hours[0]);
    const endTime = setHours(new Date(date), hours[hours.length - 1] + 1);

    return `${format(startTime, 'HH:00')} - ${format(endTime, 'HH:00')}, ${format(date, 'EEEE')}, ${format(date, 'dd MMM yyyy')}`;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-medium">
          Week of {format(weekStart, 'dd MMM yyyy')}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrevWeek}
            className="rounded-md bg-gray-200 p-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
            aria-label="Previous Week"
          >
            <FaCaretLeft size={20} />
          </button>
          <button
            onClick={handleCurrentWeek}
            className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
          >
            Current Week
          </button>
          <button
            onClick={handleNextWeek}
            className="rounded-md bg-gray-200 p-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
            aria-label="Next Week"
          >
            <FaCaretRight size={20} />
          </button>
        </div>
      </div>

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
