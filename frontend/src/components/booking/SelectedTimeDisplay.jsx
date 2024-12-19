const SelectedTimeDisplay = ({ formattedTime, onCancel, onBook }) => {
  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-grow">
          <h3 className="font-semibold">Selected Time:</h3>
          <div className="text-sm">{formattedTime}</div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onCancel}
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
          >
            Cancel Selection
          </button>
          <button
            onClick={onBook}
            className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
          >
            Book Selected Slots
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectedTimeDisplay;
