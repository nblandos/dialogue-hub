import WeeklyTimetable from '../../components/booking/WeeklySchedule';

const SchedulePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-8 pt-36">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Schedule a Cafe Visit
          </h1>
          <p className="mt-2 text-gray-600">
            Select available time slots for your Dialogue Cafe visit. Please
            note that you can only book continuous time slots for a single day.
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <WeeklyTimetable />
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
