import { format } from 'date-fns';
import WeekNavigation from './WeekNavigation';

const WeekHeader = ({ weekStart, onPrevWeek, onNextWeek, onCurrentWeek }) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="text-m font-medium">
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
