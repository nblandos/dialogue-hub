import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import VoiceInputButton from '../common/VoiceInputButton';

const ChatInput = ({ onSubmit, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSubmit(message);
      setMessage('');
    }
  };

  const handleVoiceTranscript = (transcript) => {
    setMessage(transcript);
  };

  return (
    <form
      role="form"
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-2"
    >
      <VoiceInputButton
        onTranscript={handleVoiceTranscript}
        buttonStyle="chat"
      />

      <input
        id="messageInput"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask D-Bot"
        className="min-w-0 flex-1 truncate rounded-full border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
        aria-label="Message input"
        data-screen-reader-text="Message input"
      />

      <button
        type="submit"
        disabled={isLoading || !message.trim()}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white transition-colors hover:bg-orange-600 disabled:bg-gray-300"
        aria-label="Send message"
        data-screen-reader-text="Send message"
      >
        <FaPaperPlane />
      </button>
    </form>
  );
};

export default ChatInput;
