import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Message from '../../../components/chatbot/Message';

vi.mock('../../../pages/menu/menuData', () => ({
  default: [
    {
      name: 'Test Menu Video',
      video: 'https://example.com/menu-video',
    },
    'Simple Menu String',
  ],
}));

vi.mock('../../../pages/training/trainingData', () => ({
  default: [
    {
      name: 'Test Training Video',
      video: 'https://example.com/training-video',
    },
    'Simple Training String',
  ],
}));

vi.mock('../../../components/common/VideoContainer', () => ({
  default: ({ name, videoUrl }) => (
    <div data-testid="video-container" data-name={name} data-url={videoUrl}>
      Video Container
    </div>
  ),
}));

describe('Message', () => {
  it('renders user message content correctly', () => {
    render(<Message content="Hello world" isUser={true} isLoading={false} />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders bot message content correctly', () => {
    render(<Message content="Bot response" isUser={false} isLoading={false} />);
    expect(screen.getByText('Bot response')).toBeInTheDocument();
  });

  it('renders loading state when isLoading is true', () => {
    render(<Message content="" isUser={false} isLoading={true} />);

    expect(document.getElementsByClassName('animate-bounce').length).toBe(3);

    expect(screen.getByRole('article')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByRole('article')).toHaveAttribute(
      'data-screen-reader-text',
      'AI is typing...'
    );
  });

  it('processes video tags in bot messages (menu category)', async () => {
    render(
      <Message
        content="Check out this video: [VIDEO:menu:Test Menu Video]"
        isUser={false}
        isLoading={false}
      />
    );

    const videoContainer = await screen.findByTestId('video-container');
    expect(videoContainer).toBeInTheDocument();
    expect(videoContainer).toHaveAttribute('data-name', 'Test Menu Video');
    expect(videoContainer).toHaveAttribute(
      'data-url',
      'https://example.com/menu-video'
    );

    expect(screen.getByText('Test Menu Video (BSL):')).toBeInTheDocument();
  });

  it('processes video tags in bot messages (training category)', async () => {
    render(
      <Message
        content="Check out this video: [VIDEO:training:Test Training Video]"
        isUser={false}
        isLoading={false}
      />
    );

    const videoContainer = await screen.findByTestId('video-container');
    expect(videoContainer).toBeInTheDocument();
    expect(videoContainer).toHaveAttribute('data-name', 'Test Training Video');
    expect(videoContainer).toHaveAttribute(
      'data-url',
      'https://example.com/training-video'
    );
  });

  it('processes video tags with default category (training)', async () => {
    render(
      <Message
        content="Check out this video: [VIDEO:Test Training Video]"
        isUser={false}
        isLoading={false}
      />
    );

    const videoContainer = await screen.findByTestId('video-container');
    expect(videoContainer).toBeInTheDocument();
    expect(videoContainer).toHaveAttribute('data-name', 'Test Training Video');
  });

  it('processes string-based videos in menu category', async () => {
    render(
      <Message
        content="Check out this video: [VIDEO:menu:Simple Menu String]"
        isUser={false}
        isLoading={false}
      />
    );

    const videoContainer = await screen.findByTestId('video-container');
    expect(videoContainer).toBeInTheDocument();
    expect(videoContainer).toHaveAttribute('data-name', 'Simple Menu String');
  });

  it('processes string-based videos in training category', async () => {
    render(
      <Message
        content="Check out this video: [VIDEO:training:Simple Training String]"
        isUser={false}
        isLoading={false}
      />
    );

    const videoContainer = await screen.findByTestId('video-container');
    expect(videoContainer).toBeInTheDocument();
    expect(videoContainer).toHaveAttribute(
      'data-name',
      'Simple Training String'
    );
  });

  it('handles text before and after video tags', async () => {
    render(
      <Message
        content="Before text [VIDEO:menu:Test Menu Video] After text"
        isUser={false}
        isLoading={false}
      />
    );

    expect(screen.getByText('Before text')).toBeInTheDocument();
    expect(screen.getByText('After text')).toBeInTheDocument();
    expect(await screen.findByTestId('video-container')).toBeInTheDocument();
  });

  it('handles multiple video tags in one message', async () => {
    render(
      <Message
        content="[VIDEO:menu:Test Menu Video] and [VIDEO:training:Test Training Video]"
        isUser={false}
        isLoading={false}
      />
    );

    const videoContainers = await screen.findAllByTestId('video-container');
    expect(videoContainers.length).toBe(2);
    expect(screen.getByText('and')).toBeInTheDocument();
  });

  it('displays the raw tag when video is not found in collection', () => {
    render(
      <Message
        content="Check out this video: [VIDEO:menu:Non-Existent Video]"
        isUser={false}
        isLoading={false}
      />
    );

    expect(screen.queryByTestId('video-container')).not.toBeInTheDocument();
    expect(screen.getByText('Check out this video:')).toBeInTheDocument();
    expect(
      screen.getByText('[VIDEO:menu:Non-Existent Video]')
    ).toBeInTheDocument();
  });

  it('does not process video tags in user messages', () => {
    render(
      <Message
        content="[VIDEO:menu:Test Menu Video]"
        isUser={true}
        isLoading={false}
      />
    );

    expect(screen.queryByTestId('video-container')).not.toBeInTheDocument();
    expect(
      screen.getByText('[VIDEO:menu:Test Menu Video]')
    ).toBeInTheDocument();
  });
});
