const Message = ({ content, isUser }) => {
  return (
    <div
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2 ${
          isUser ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-800'
        }`}
        data-screen-reader-text={content}
      >
        {content}
      </div>
    </div>
  );
};

export default Message;
