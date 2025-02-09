import { useState } from 'react';
import ChatInput from './ChatInput';
import MessageList from './MessageList';

const Sidebar = ({ isOpen }) => {
  const MIN_WIDTH = 200;
  const MAX_WIDTH = 1200;
  const [width, setWidth] = useState(300); // Default width in px
  const [messages, setMessages] = useState([
    {
      content: 'Hello! How can I help you today?',
      isUser: false,
    },
  ]);

  // Resizing logic
  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = width;

    const onMouseMove = (moveEvent) => {
      const delta = moveEvent.clientX - startX;
      const newWidth = Math.min(
        MAX_WIDTH,
        Math.max(MIN_WIDTH, startWidth + delta)
      );
      setWidth(newWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleSubmit = async (message) => {
    // Add user message to chat
    setMessages((prev) => [...prev, { content: message, isUser: true }]);

    // Fetch AI response
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { content: data.response, isUser: false },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { content: `Error: ${data.error}`, isUser: false },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { content: 'Error fetching AI response', isUser: false },
      ]);
    }
  };

  return (
    <div
      style={{ width: `${width}px`, top: '96px' }}
      className={`fixed left-0 z-40 h-[calc(100vh-96px)] bg-white shadow-lg transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="relative h-full">
        <div className="flex h-full flex-col">
          {/* Chat Message */}
          <div className="flex-1 overflow-y-auto p-4">
            <MessageList messages={messages} />
          </div>
          {/* Chat Input */}
          <div className="border-t">
            <ChatInput onSubmit={handleSubmit} />
          </div>
        </div>

        {/* Resizer */}
        <div
          onMouseDown={handleMouseDown}
          className="group absolute -right-1 top-0 flex h-full w-2 cursor-ew-resize items-center hover:bg-orange-200"
        >
          <div className="h-16 w-1 rounded-full bg-orange-300 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
