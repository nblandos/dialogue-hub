const SelectedTimeDisplay = ({ formattedTime, onCancel, onBook }) => {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <div className="mr-4 flex-grow">
          <h3 className="text-sm font-semibold md:text-base">Selected Time:</h3>
          <div
            tabIndex="0"
            data-screen-reader-text={`Selected times are ${formattedTime}`}
            className="text-xs md:text-sm"
          >
            {formattedTime}
          </div>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
          <button
            tabIndex="0"
            data-screen-reader-text="Cancel Selection"
            onClick={onCancel}
            className="rounded-md bg-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-300 md:text-sm"
          >
            Cancel Selection
          </button>
          <button
            tabIndex="0"
            data-screen-reader-text="Book Selected Slots"
            onClick={onBook}
            className="rounded-md bg-orange-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-orange-600 md:text-sm"
          >
            Book Selected Slots
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectedTimeDisplay;
