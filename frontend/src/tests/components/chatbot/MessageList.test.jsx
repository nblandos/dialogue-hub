import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import MessageList from '../../../components/chatbot/MessageList';

describe('MessageList', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders a list of messages', () => {
    const messages = [
      { content: 'Hello from user', isUser: true, isLoading: false },
      { content: 'Hi there!', isUser: false, isLoading: false },
    ];

    const { getByText } = render(<MessageList messages={messages} />);

    expect(getByText('Hello from user')).toBeInTheDocument();
    expect(getByText('Hi there!')).toBeInTheDocument();
  });

  it('calls scrollIntoView when messages are updated', () => {
    vi.useFakeTimers();

    const scrollIntoViewMock = vi.fn();
    const originalScrollIntoView = HTMLElement.prototype.scrollIntoView;
    HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    try {
      const { rerender } = render(<MessageList messages={[]} />);

      const newMessages = [
        { content: 'New message', isUser: false, isLoading: false },
      ];
      rerender(<MessageList messages={newMessages} />);

      vi.advanceTimersByTime(110);
      expect(scrollIntoViewMock).toHaveBeenCalledWith({
        behavior: 'smooth',
      });
    } finally {
      HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
    }
  });
});
