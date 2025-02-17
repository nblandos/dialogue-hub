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

    const { container, rerender } = render(<MessageList messages={[]} />);
    const messagesEnd = container.lastChild;
    messagesEnd.scrollIntoView = vi.fn();

    const newMessages = [
      { content: 'New message', isUser: false, isLoading: false },
    ];
    rerender(<MessageList messages={newMessages} />);

    vi.advanceTimersByTime(110);
    expect(messagesEnd.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
    });
  });
});
