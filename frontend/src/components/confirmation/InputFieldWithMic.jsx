const InputFieldWithMic = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  onMicClick,
  recordingField,
  isProcessing,
  autoComplete,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-1 block text-lg font-medium">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          data-screen-reader-text={`${placeholder}`}
          id={id}
          type={id === 'email' ? 'email' : 'text'}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 p-2"
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
        />
        <button
          data-screen-reader-text={`Voice input for ${label}`}
          onClick={onMicClick}
          className={`${
            recordingField === id ? 'bg-red-500' : 'bg-blue-500'
          } flex items-center gap-2 rounded-lg px-4 py-2 text-white`}
        >
          {recordingField === id ? 'Stop' : 'Mic'}
          {isProcessing && recordingField === id && (
            <span className="animate-spin">⏳</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputFieldWithMic;
