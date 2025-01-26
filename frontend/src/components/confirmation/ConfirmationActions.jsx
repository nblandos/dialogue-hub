import React from "react";

const ConfirmationActions = ({ onCancel, onConfirm, showEmailError }) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mt-6">
      {showEmailError && (
        <p className="text-red-500 text-sm">
          Please enter a valid email address.
        </p>
      )}
      <div className="flex justify-between w-full">
        <button
          className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
          onClick={onConfirm}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmationActions;
