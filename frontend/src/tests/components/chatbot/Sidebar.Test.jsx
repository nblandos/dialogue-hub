import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Sidebar from '../../../components/chatbot/Sidebar';

describe('Sidebar', () => {
  let originalInnerWidth;
  let originalInnerHeight;
  let originalFetch;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;
    originalFetch = global.fetch;
  });

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
    window.innerHeight = originalInnerHeight;
    global.fetch = originalFetch;
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('renders initial ChatInput and default greeting message', () => {
    render(<Sidebar isOpen={true} />);
    expect(
      screen.getByText('Hello! How can I help you today?')
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ask D-Bot')).toBeInTheDocument();
  });

  it('updates layout styles on window resize for vertical layout', () => {
    // Set window width below breakpoint (768)
    window.innerWidth = 500;
    window.innerHeight = 800;
    render(<Sidebar isOpen={true} />);
    window.dispatchEvent(new Event('resize'));

    const sidebar = document.querySelector('div.fixed');
    expect(sidebar.style.width).toBe('100%');
    expect(sidebar.className).toMatch(/translate-y-0/);
  });

  it('updates layout styles on window resize for horizontal layout', () => {
    // set window width above breakpoint (768)
    window.innerWidth = 1024;
    window.innerHeight = 900;
    render(<Sidebar isOpen={true} />);
    window.dispatchEvent(new Event('resize'));

    const sidebar = document.querySelector('div.fixed');

    expect(sidebar.style.width).toBe('204.8px');
    expect(sidebar.style.height).toBe(`calc(100vh - 96px)`);
    expect(sidebar.className).toMatch(/translate-x-0/);
  });

  it('handles message submission and updates chat messages', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            success: true,
            response: 'AI Response',
          }),
      })
    );

    render(<Sidebar isOpen={true} />);

    const input = screen.getByPlaceholderText('Ask D-Bot');
    const sendButton = screen.getByRole('button', { name: /send message/i });

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByText('...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('AI Response')).toBeInTheDocument();
    });
    expect(screen.queryByText('...')).not.toBeInTheDocument();
  });

  it('handles horizontal resizing via mouse drag', () => {
    window.innerWidth = 1024;
    window.innerHeight = 900;
    render(<Sidebar isOpen={true} />);
    window.dispatchEvent(new Event('resize'));

    const sidebar = document.querySelector('div.fixed');

    const resizer = document.querySelector('.cursor-ew-resize');
    expect(resizer).toBeDefined();

    const startX = 200;
    const startY = 100;
    fireEvent.mouseDown(resizer, {
      clientX: startX,
      clientY: startY,
      preventDefault: () => {},
    });

    fireEvent.mouseMove(document, { clientX: startX + 100, clientY: startY });
    fireEvent.mouseUp(document);

    expect(sidebar.style.width).toBe('304.8px');
  });
});
