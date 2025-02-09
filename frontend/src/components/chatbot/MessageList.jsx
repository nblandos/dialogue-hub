import { useEffect, useRef } from 'react';
import Message from './Message';

const MessageList = ({ messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col space-y-2">
      {messages.map((message, index) => (
        <Message
          key={index}
          content={message.content}
          isUser={message.isUser}
          isLoading={message.isLoading}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
