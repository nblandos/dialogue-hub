import WeeklyTimetable from '../../components/booking/WeeklyTimetable';

const SchedulePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 pb-8 pt-36">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <h1
            tabindex="0"
            data-screen-reader-text="Schedule a Cafe Visit"
            className="text-3xl font-bold text-gray-900"
          >
            Schedule a Cafe Visit
          </h1>
          <p
            tabindex="0"
            data-screen-reader-text="Select available time slots for your Dialogue Cafe visit. Please
            note that you can only book consecutive time slots for one day at a
            time."
            className="mt-2 text-gray-600"
          >
            Select available time slots for your Dialogue Cafe visit. Please
            note that you can only book consecutive time slots for one day at a
            time.
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
