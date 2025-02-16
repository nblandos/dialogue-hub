import VoiceInputButton from '../../common/VoiceInputButton';

const InputFieldWithMic = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  preprocessor,
  autoComplete,
}) => {
  const handleVoiceTranscript = (transcript) => {
    onChange({ target: { value: transcript } });
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-1 block text-lg font-medium">
        {label}
      </label>
      <div className="flex items-center gap-4">
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
        <div className="flex-shrink-0">
          <VoiceInputButton
            onTranscript={handleVoiceTranscript}
            preprocessor={preprocessor}
            buttonStyle="form"
          />
        </div>
      </div>
    </div>
  );
};

export default InputFieldWithMic;
