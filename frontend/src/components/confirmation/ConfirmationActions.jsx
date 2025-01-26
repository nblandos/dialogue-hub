const ConfirmationActions = ({ onCancel, onConfirm }) => {
  return (
    <div className="mt-6 flex w-full max-w-md flex-col items-center gap-4">
      <div className="flex w-full justify-between">
        <button
          className="rounded-lg bg-red-500 px-6 py-2 text-white hover:bg-red-600"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="rounded-lg bg-green-500 px-6 py-2 text-white hover:bg-green-600"
          onClick={onConfirm}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmationActions;
