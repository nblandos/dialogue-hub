import { useState } from 'react';
import { FaMicrophone, FaPaperPlane } from 'react-icons/fa';

const ChatInput = ({ onSubmit }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSubmit(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2">
      {/* Voice Input */}
      {/* Here we should create a common component for InputFieldWithMic from confirmation that we can reuse*/}
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
        aria-label="Voice input"
        data-screen-reader-text="Voice input"
      >
        <FaMicrophone />
      </button>

      {/* Message Input */}
      <input
        id="messageInput"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message..."
        className="min-w-0 flex-1 truncate rounded-full border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
        aria-label="Message input"
        data-screen-reader-text="Message input"
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!message.trim()}
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
