import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Sidebar from '../../../components/chatbot/Sidebar';
import React from 'react';

vi.mock('../../../components/chatbot/MessageList', () => ({
  default: ({ messages }) => (
    <div data-testid="message-list">
      {messages.map((msg, i) => (
        <div
          key={i}
          data-testid={`message-${i}`}
          className={msg.isUser ? 'user' : 'bot'}
        >
          {msg.content}
        </div>
      ))}
    </div>
  ),
}));

vi.mock('../../../components/chatbot/ChatInput', () => ({
  default: ({ onSubmit, isLoading }) => (
    <div data-testid="chat-input">
      <button
        onClick={() => onSubmit('Test message')}
        disabled={isLoading}
        data-testid="send-button"
      >
        Send
      </button>
    </div>
  ),
}));

global.fetch = vi.fn();

describe('Sidebar', () => {
  const mockUuid = '123e4567-e89b-12d3-a456-426614174000';
  let resizeObserverCallback;

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(crypto, 'randomUUID').mockImplementation(() => mockUuid);

    global.fetch.mockResolvedValue({
      json: async () => ({ success: true, response: 'Bot response' }),
    });

    global.ResizeObserver = vi.fn().mockImplementation((callback) => {
      resizeObserverCallback = callback;
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    });

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      value: 768,
    });
  });

  it('updates sidebar position when header height changes', async () => {
    const mockHeader = document.createElement('nav');
    Object.defineProperty(mockHeader, 'offsetHeight', {
      value: 60,
      configurable: true,
    });
    document.body.appendChild(mockHeader);

    try {
      render(<Sidebar isOpen={true} />);

      const sidebar = document.querySelector('div[style*="top: 60px"]');
      expect(sidebar).toBeInTheDocument();

      Object.defineProperty(mockHeader, 'offsetHeight', {
        value: 80,
        configurable: true,
      });

      if (resizeObserverCallback) {
        resizeObserverCallback([{ target: mockHeader }]);
      }

      await waitFor(() => {
        const updatedSidebar = document.querySelector(
          'div[style*="top: 80px"]'
        );
        expect(updatedSidebar).toBeInTheDocument();
      });
    } finally {
      document.body.removeChild(mockHeader);
    }
  });

  it('renders correctly when closed', () => {
    render(<Sidebar isOpen={false} />);

    const sidebar = document.querySelector('div[class*="translate-x-full"]');
    expect(sidebar).toBeInTheDocument();
  });

  it('renders correctly when open', () => {
    render(<Sidebar isOpen={true} />);

    const sidebar = document.querySelector('div[class*="translate-x-0"]');
    expect(sidebar).toBeInTheDocument();
    expect(screen.getByTestId('message-list')).toBeInTheDocument();
    expect(screen.getByTestId('chat-input')).toBeInTheDocument();
  });

  it('renders initial welcome message', () => {
    render(<Sidebar isOpen={true} />);

    expect(screen.getByText(/Hi, I am D-Bot/)).toBeInTheDocument();
  });

  it('sends message and displays bot response', async () => {
    render(<Sidebar isOpen={true} />);

    fireEvent.click(screen.getByTestId('send-button'));

    expect(screen.getByText('...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Bot response')).toBeInTheDocument();
      expect(screen.getByText('Test message')).toBeInTheDocument();
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.any(String),
      })
    );

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining(mockUuid),
      })
    );
  });

  it('handles API error gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<Sidebar isOpen={true} />);

    fireEvent.click(screen.getByTestId('send-button'));

    await waitFor(() => {
      expect(
        screen.getByText('Error fetching AI response')
      ).toBeInTheDocument();
    });
  });

  it('switches to vertical layout on small screens', () => {
    Object.defineProperty(window, 'innerWidth', { value: 500 });

    // Trigger resize event
    render(<Sidebar isOpen={true} />);
    fireEvent(window, new Event('resize'));

    const sidebar = document.querySelector('div[style*="width: 100%"]');
    expect(sidebar).toBeInTheDocument();
  });

  it('handles mouse resize interaction', () => {
    render(<Sidebar isOpen={true} />);

    const resizer = document.querySelector('div[class*="cursor-ew-resize"]');
    expect(resizer).toBeInTheDocument();

    fireEvent.mouseDown(resizer, { clientX: 200, clientY: 200 });

    fireEvent.mouseMove(document, { clientX: 300, clientY: 200 });

    fireEvent.mouseUp(document);
  });

  it('renders correctly when closed on mobile screens', () => {
    Object.defineProperty(window, 'innerWidth', { value: 500 });

    render(<Sidebar isOpen={false} />);

    fireEvent(window, new Event('resize'));

    const sidebar = document.querySelector('div[class*="translate-y-full"]');
    expect(sidebar).toBeInTheDocument();
  });

  it('handles vertical resize on mobile screens', () => {
    Object.defineProperty(window, 'innerWidth', { value: 500 });

    render(<Sidebar isOpen={true} />);

    fireEvent(window, new Event('resize'));

    const resizer = document.querySelector('div[class*="cursor-ns-resize"]');
    expect(resizer).toBeInTheDocument();

    const initialSidebar = document.querySelector('div[style*="height:"]');
    const initialHeight = initialSidebar.style.height;

    fireEvent.mouseDown(resizer, { clientX: 100, clientY: 300 });
    fireEvent.mouseMove(document, { clientX: 100, clientY: 200 }); // Moving up by 100px
    fireEvent.mouseUp(document);

    const updatedSidebar = document.querySelector('div[style*="height:"]');
    const updatedHeight = updatedSidebar.style.height;

    expect(updatedHeight).not.toBe(initialHeight);
  });

  it('displays specific error message when API returns error', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ success: false, error: 'Invalid request format' }),
    });

    render(<Sidebar isOpen={true} />);

    fireEvent.click(screen.getByTestId('send-button'));

    await waitFor(() => {
      expect(
        screen.getByText('Error: Invalid request format')
      ).toBeInTheDocument();
    });
  });
});
