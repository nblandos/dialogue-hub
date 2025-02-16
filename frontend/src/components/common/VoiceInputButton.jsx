import { FaMicrophone } from 'react-icons/fa';
import { useVoiceInput } from '../../hooks/useVoiceInput';

const VoiceInputButton = ({
  onTranscript,
  preprocessor,
  className = '',
  buttonStyle = 'chat', // 'chat' or 'form'
}) => {
  const { isRecording, isProcessing, startRecording, stopRecording } =
    useVoiceInput(onTranscript, preprocessor);

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const getButtonClasses = () => {
    const baseClasses =
      'flex h-10 w-10 items-center justify-center rounded-full';

    if (buttonStyle === 'form') {
      return `${baseClasses} ${
        isRecording
          ? 'bg-red-500 text-white'
          : 'bg-gray-400 text-white hover:bg-gray-500'
      } ${className}`;
    }

    return `${baseClasses} ${
      isRecording
        ? 'bg-red-500 text-white'
        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
    } ${className}`;
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={getButtonClasses()}
      aria-label="Voice input"
      data-screen-reader-text="Voice input"
    >
      <FaMicrophone className={isProcessing ? 'animate-pulse' : ''} />
    </button>
  );
};

export default VoiceInputButton;
