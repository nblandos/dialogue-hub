import { useState, useEffect } from 'react';
import menuVideos from '../../pages/menu/menuData';
import trainingVideos from '../../pages/training/trainingData';

const LoadingDots = () => (
  <div className="flex space-x-1">
    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
  </div>
);

const Message = ({ content, isUser, isLoading }) => {
  const [processedContent, setProcessedContent] = useState(content);

  useEffect(() => {
    if (!isLoading && !isUser && content) {
      const processContent = () => {
        // Regular expression to match [VIDEO:category:name] or [VIDEO:name]
        const videoRegex =
          /\[VIDEO:(menu|training):([^\]]+)\]|\[VIDEO:([^\]]+)\]/g;

        let lastIndex = 0;
        let parts = [];
        let match;

        while ((match = videoRegex.exec(content)) !== null) {
          // Add text before the match
          if (match.index > lastIndex) {
            parts.push(content.substring(lastIndex, match.index));
          }

          const category = match[1] || 'training';
          const videoName = match[2] || match[3];

          const videoCollection =
            category === 'menu' ? menuVideos : trainingVideos;

          const videoItem = videoCollection.find(
            (v) =>
              (v.name && v.name.toLowerCase() === videoName.toLowerCase()) ||
              (typeof v === 'string' &&
                v.toLowerCase() === videoName.toLowerCase())
          );

          if (videoItem) {
            parts.push(`###VIDEO:${category}:${videoName}###`);
          } else {
            parts.push(match[0]);
          }

          lastIndex = match.index + match[0].length;
        }

        if (lastIndex < content.length) {
          parts.push(content.substring(lastIndex));
        }

        return parts;
      };

      setProcessedContent(processContent());
    } else {
      setProcessedContent(content);
    }
  }, [content, isUser, isLoading]);

  const renderContent = () => {
    if (isLoading) return <LoadingDots />;
    if (typeof processedContent === 'string') return processedContent;

    return processedContent.map((part, index) => {
      if (typeof part === 'string' && part.startsWith('###VIDEO:')) {
        // Extract video details
        const [, category, videoName] = part.match(
          /###VIDEO:(menu|training):(.+)###/
        );
        const videoCollection =
          category === 'menu' ? menuVideos : trainingVideos;

        const videoItem = videoCollection.find(
          (v) =>
            (v.name && v.name.toLowerCase() === videoName.toLowerCase()) ||
            (typeof v === 'string' &&
              v.toLowerCase() === videoName.toLowerCase())
        );

        if (videoItem) {
          const videoUrl = videoItem.video;

          const displayName = videoItem.name || videoName;

          return (
            <div key={index} className="video-container my-2">
              <p className="mb-1 font-medium">{displayName} (BSL):</p>
              <iframe
                width="100%"
                height="200"
                src={videoUrl}
                title={displayName}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          );
        }
        return <span key={index}>{part}</span>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2 ${
          isUser ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-800'
        }`}
        data-screen-reader-text={
          isLoading
            ? 'AI is typing...'
            : typeof processedContent === 'string'
              ? processedContent
              : processedContent.join('')
        }
        role="article"
        aria-live={isLoading ? 'polite' : 'off'}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default Message;
