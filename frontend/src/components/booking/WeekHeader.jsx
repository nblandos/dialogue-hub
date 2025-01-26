import { format } from 'date-fns';
import WeekNavigation from './WeekNavigation';

const WeekHeader = ({ weekStart, onPrevWeek, onNextWeek, onCurrentWeek }) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div tabindex="0" data-screen-reader-text={`Week of ${format(weekStart, 'dd MMM yyyy')}`} className="text-m font-medium">
        Week of {format(weekStart, 'dd MMM yyyy')}
      </div>
      <WeekNavigation
        onPrevWeek={onPrevWeek}
        onNextWeek={onNextWeek}
        onCurrentWeek={onCurrentWeek}
      />
    </div>
  );
};

export default WeekHeader;
