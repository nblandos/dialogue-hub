import React from "react";

const InputFieldWithMic = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  onMicClick,
  recordingField,
  isProcessing,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-lg font-medium mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type={id === "email" ? "email" : "text"}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-lg p-2"
          value={value}
          onChange={onChange}
        />
        <button
          onClick={onMicClick}
          className={`${
            recordingField === id ? "bg-red-500" : "bg-blue-500"
          } text-white px-4 py-2 rounded-lg flex items-center gap-2`}
        >
          {recordingField === id ? "Stop" : "Mic"}
          {isProcessing && recordingField === id && (
            <span className="animate-spin">⏳</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputFieldWithMic;
