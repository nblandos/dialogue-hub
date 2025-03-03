import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Message from '../../../components/chatbot/Message';

vi.mock('../../../pages/menu/menuData', () => ({
  default: [
    { name: 'Coffee', video: 'https://example.com/coffee-video' },
    { name: 'Sandwich', video: 'https://example.com/sandwich-video' },
  ],
}));

vi.mock('../../../pages/training/trainingData', () => ({
  default: [
    { name: 'Hello', video: 'https://example.com/hello-video' },
    { name: 'Bye', video: 'https://example.com/bye-video' },
  ],
}));

vi.mock('../../../components/common/VideoContainer', () => ({
  default: ({ name, videoUrl }) => (
    <div data-testid="video-container">
      <div data-testid="video-name">{name}</div>
      <div data-testid="video-url">{videoUrl}</div>
    </div>
  ),
}));

describe('Message', () => {
  it('renders a user message with correct styling and content', () => {
    const content = 'Hello, this is a user message';
    render(<Message content={content} isUser={true} isLoading={false} />);

    const container = screen.getByRole('article').parentElement;
    expect(container).toHaveClass('justify-end');

    expect(screen.getByText(content)).toBeInTheDocument();

    const article = screen.getByRole('article');
    expect(article).toHaveClass('bg-orange-500');
    expect(article).toHaveClass('text-white');
    expect(article).toHaveAttribute('aria-live', 'off');
    expect(article).toHaveAttribute('data-screen-reader-text', content);
  });

  it('renders a bot message with correct styling and content', () => {
    const content = 'Hello, this is a bot message';
    render(<Message content={content} isUser={false} isLoading={false} />);

    const container = screen.getByRole('article').parentElement;
    expect(container).toHaveClass('justify-start');

    expect(screen.getByText(content)).toBeInTheDocument();

    const article = screen.getByRole('article');
    expect(article).toHaveClass('bg-gray-100');
    expect(article).toHaveClass('text-gray-800');
    expect(article).toHaveAttribute('aria-live', 'off');
    expect(article).toHaveAttribute('data-screen-reader-text', content);
  });

  it('renders loading state with LoadingDots when isLoading is true', () => {
    render(
      <Message content="Ignored content" isUser={false} isLoading={true} />
    );

    const article = screen.getByRole('article');
    expect(article).toHaveAttribute('aria-live', 'polite');
    expect(article).toHaveAttribute(
      'data-screen-reader-text',
      'AI is typing...'
    );

    const animatedElements = document.querySelectorAll('.animate-bounce');
    expect(animatedElements.length).toBe(3);
  });

  it('processes menu video tags in bot messages', () => {
    const content = 'Check out this video: [VIDEO:menu:Coffee] in our menu';
    render(<Message content={content} isUser={false} isLoading={false} />);

    expect(
      screen.getByText('Check out this video:', { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByText('in our menu')).toBeInTheDocument();
    expect(screen.getByText('Coffee (BSL):')).toBeInTheDocument();

    const videoContainer = screen.getByTestId('video-container');
    expect(videoContainer).toBeInTheDocument();
    expect(screen.getByTestId('video-name')).toHaveTextContent('Coffee');
    expect(screen.getByTestId('video-url')).toHaveTextContent(
      'https://example.com/coffee-video'
    );
  });

  it('processes training video tags in bot messages', () => {
    const content =
      'This is a help video: [VIDEO:training:Hello] for beginners';
    render(<Message content={content} isUser={false} isLoading={false} />);

    expect(
      screen.getByText('This is a help video:', { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByText('for beginners')).toBeInTheDocument();
    expect(screen.getByText('Hello (BSL):')).toBeInTheDocument();

    const videoContainer = screen.getByTestId('video-container');
    expect(videoContainer).toBeInTheDocument();
    expect(screen.getByTestId('video-name')).toHaveTextContent('Hello');
    expect(screen.getByTestId('video-url')).toHaveTextContent(
      'https://example.com/hello-video'
    );
  });

  it('processes video tags without category specification (defaults to training)', () => {
    const content = 'This is a video: [VIDEO:Bye]';
    render(<Message content={content} isUser={false} isLoading={false} />);

    expect(screen.getByText('This is a video:')).toBeInTheDocument();
    expect(screen.getByText('Bye (BSL):')).toBeInTheDocument();

    const videoContainer = screen.getByTestId('video-container');
    expect(videoContainer).toBeInTheDocument();
    expect(screen.getByTestId('video-name')).toHaveTextContent('Bye');
    expect(screen.getByTestId('video-url')).toHaveTextContent(
      'https://example.com/bye-video'
    );
  });

  // it('keeps the text unchanged if video item is not found', () => {
  //   const content = 'Unknown video: [VIDEO:menu:Unknown]';
  //   render(<Message content={content} isUser={false} isLoading={false} />);

  //   expect(
  //     screen.getByText('Unknown video: [VIDEO:menu:Unknown]')
  //   ).toBeInTheDocument();
  //   expect(screen.queryByTestId('video-container')).not.toBeInTheDocument();
  // });

  it('handles multiple video tags in the same message', () => {
    const content = 'Videos: [VIDEO:menu:Coffee] and [VIDEO:training:Hello]';
    render(<Message content={content} isUser={false} isLoading={false} />);

    expect(screen.getByText('Videos:')).toBeInTheDocument();
    expect(screen.getByText('and')).toBeInTheDocument();
    expect(screen.getByText('Coffee (BSL):')).toBeInTheDocument();
    expect(screen.getByText('Hello (BSL):')).toBeInTheDocument();

    const videoContainers = screen.getAllByTestId('video-container');
    expect(videoContainers.length).toBe(2);
  });

  it('does not process video tags in user messages', () => {
    const content = 'I want to see [VIDEO:menu:Coffee]';
    render(<Message content={content} isUser={true} isLoading={false} />);

    expect(screen.getByText(content)).toBeInTheDocument();
    expect(screen.queryByTestId('video-container')).not.toBeInTheDocument();
  });
});
