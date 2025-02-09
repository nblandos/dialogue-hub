import Message from './Message';

const MessageList = ({ messages }) => {
  return (
    <div className="flex flex-col space-y-2">
      {messages.map((message, index) => (
        <Message
          key={index}
          content={message.content}
          isUser={message.isUser}
        />
      ))}
    </div>
  );
};

export default MessageList;
