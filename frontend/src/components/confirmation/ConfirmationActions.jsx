const ConfirmationActions = ({ onCancel, onConfirm, loading, errors }) => {
  return (
    <div className="mt-6 flex w-full max-w-md flex-col items-center gap-4">
      {errors?.email && (
        <p className="text-sm text-red-500">
          Please enter a valid email address.
        </p>
      )}
      {errors?.name && (
        <p className="text-sm text-red-500">Please enter your full name.</p>
      )}
      <div className="flex w-full justify-between">
        <button
          className="rounded-lg bg-red-500 px-6 py-2 text-white hover:bg-red-600"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          className={`rounded-lg px-6 py-2 text-white ${
            loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
          }`}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Confirm'}
        </button>
      </div>
    </div>
  );
};

export default ConfirmationActions;
