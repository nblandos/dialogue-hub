const LoadingDots = () => (
  <div className="flex space-x-1">
    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
  </div>
);

const Message = ({ content, isUser, isLoading }) => {
  return (
    <div
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2 ${
          isUser ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-800'
        }`}
        data-screen-reader-text={isLoading ? 'AI is typing...' : content}
        role="article"
        aria-live={isLoading ? 'polite' : 'off'}
      >
        {isLoading ? <LoadingDots /> : content}
      </div>
    </div>
  );
};

export default Message;
