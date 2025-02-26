import { useState, useEffect } from 'react';
import ChatInput from './ChatInput';
import MessageList from './MessageList';

const Sidebar = ({ isOpen }) => {
  // Note: you must change tailwind accessibility classes aswell for breakpoint, e.g. change 'xl' to 'md'
  const BREAKPOINT = 768; // breakpoint for mobile screen vertical sidebar
  const HEADER_HEIGHT = 88;

  const calcMinWidth = () => Math.min(200, window.innerWidth * 0.2);
  const calcMaxWidth = () => Math.min(1200, window.innerWidth * 0.8);
  const calcMinHeight = () => Math.min(150, window.innerHeight * 0.2);
  const calcMaxHeight = () => Math.min(550, window.innerHeight * 0.8);

  const getDefaultWidth = () =>
    Math.min(window.innerWidth * 0.2, calcMaxWidth());
  const getDefaultHeight = () =>
    Math.min(window.innerHeight * 0.4, calcMaxHeight());

  // Set state with defaults
  const [width, setWidth] = useState(getDefaultWidth());
  const [height, setHeight] = useState(getDefaultHeight());
  const [isLoading, setIsLoading] = useState(false);
  const [isVerticalLayout, setIsVerticalLayout] = useState(
    window.innerWidth < BREAKPOINT
  );

  const [messages, setMessages] = useState([
    {
      content: 'Hello! How can I help you today?',
      isUser: false,
    },
  ]);

  const [userId] = useState(() => crypto.randomUUID());

  useEffect(() => {
    const handleResize = () => {
      const vertical = window.innerWidth < BREAKPOINT;
      setIsVerticalLayout(vertical);

      if (vertical) {
        // Reset to vertical defaults
        setHeight(getDefaultHeight());
        setWidth('100%');
      } else {
        // Reset to horizontal defaults
        setWidth(getDefaultWidth());
        setHeight(window.innerHeight - HEADER_HEIGHT);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // initial resize
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Resizing logic
  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = typeof width === 'number' ? width : window.innerWidth;
    const startHeight =
      typeof height === 'number' ? height : window.innerHeight;

    const onMouseMove = (moveEvent) => {
      if (window.innerWidth >= BREAKPOINT) {
        // Horizontal resizing for large screens
        const delta = moveEvent.clientX - startX;
        const newWidth = Math.min(
          calcMaxWidth(),
          Math.max(calcMinWidth(), startWidth + delta)
        );
        setWidth(newWidth);
      } else {
        // Vertical resizing for small screens
        const delta = startY - moveEvent.clientY;
        const newHeight = Math.min(
          calcMaxHeight(),
          Math.max(calcMinHeight(), startHeight + delta)
        );
        setHeight(newHeight);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleSubmit = async (message) => {
    // Add user message
    setMessages((prev) => [...prev, { content: message, isUser: true }]);

    // Add loading message
    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      { content: '...', isUser: false, isLoading: true },
    ]);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ai/chat`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            user_id: userId,
          }),
        }
      );
      const data = await response.json();

      setMessages((prev) => {
        const filteredMessages = prev.filter((msg) => !msg.isLoading);
        return [
          ...filteredMessages,
          {
            content: data.success ? data.response : `Error: ${data.error}`,
            isUser: false,
          },
        ];
      });
    } catch (err) {
      setMessages((prev) => {
        const filteredMessages = prev.filter((msg) => !msg.isLoading);
        return [
          ...filteredMessages,
          { content: 'Error fetching AI response', isUser: false },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const transformClasses = isVerticalLayout
    ? isOpen
      ? 'translate-y-0'
      : 'translate-y-full'
    : isOpen
      ? 'translate-x-0'
      : '-translate-x-full';

  const sidebarStyle = {
    width: !isVerticalLayout ? `${width}px` : '100%',
    height: !isVerticalLayout
      ? `calc(100vh - ${HEADER_HEIGHT}px)`
      : `${height}px`,
    top: !isVerticalLayout ? `${HEADER_HEIGHT}px` : 'auto',
  };

  return (
    <div
      style={sidebarStyle}
      className={`fixed bottom-0 left-0 z-40 bg-white shadow-lg transition-transform duration-300 ease-in-out ${transformClasses}`}
    >
      <div className="relative h-full">
        <div className="flex h-full flex-col">
          {/* Chat Message */}
          <div className="flex-1 overflow-y-auto p-4">
            <MessageList messages={messages} />
          </div>
          {/* Chat Input */}
          <div className="border-t">
            <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>

        {/* Resizer */}
        <div
          onMouseDown={handleMouseDown}
          className={`group absolute ${
            isVerticalLayout
              ? 'left-0 top-0 flex h-2 w-full cursor-ns-resize items-center hover:bg-orange-200'
              : 'flex h-full w-2 cursor-ew-resize items-center hover:bg-orange-200 md:left-auto md:right-0 md:top-0'
          }`}
        >
          <div
            className={`mx-auto rounded-full bg-orange-300 opacity-0 transition-opacity group-hover:opacity-100 ${
              isVerticalLayout ? 'h-1 w-16' : 'h-16 w-1'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
