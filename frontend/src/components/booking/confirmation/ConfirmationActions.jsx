const ConfirmationActions = ({
  onCancel,
  onConfirm,
  loading,
  apiError,
  errors,
}) => {
  // Show one error message at a time
  const renderError = () => {
    if (apiError) {
      return <p className="mt-2 text-sm text-red-500">{apiError}</p>;
    }
    if (errors.name) {
      return (
        <p className="mt-2 text-sm text-red-500">
          Please enter a valid full name.
        </p>
      );
    }
    if (errors.email) {
      return (
        <p className="mt-2 text-sm text-red-500">
          Please enter a valid email address.
        </p>
      );
    }
    return null;
  };

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-5">
      <div className="flex h-6 items-center justify-center">
        {renderError()}
      </div>
      <div className="flex w-full justify-between">
        <button
          data-screen-reader-text="Cancel"
          className={`rounded-lg px-6 py-2 font-semibold text-white ${
            loading ? 'bg-red-300' : 'bg-red-500 hover:bg-red-600'
          }`}
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          data-screen-reader-text="Confirm"
          className={`rounded-lg px-6 py-2 font-semibold text-white ${
            loading ? 'bg-green-300' : 'bg-green-500 hover:bg-green-600'
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
