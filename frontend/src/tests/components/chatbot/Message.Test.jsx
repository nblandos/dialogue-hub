import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Message from '../../../components/chatbot/Message';

describe('Message', () => {
  it('renders a user message with correct styling and content', () => {
    const content = 'Hello, this is a user message';
    render(<Message content={content} isUser={true} isLoading={false} />);

    const container = screen.getByRole('article').parentElement;
    expect(container).toHaveClass('justify-end');

    expect(screen.getByText(content)).toBeInTheDocument();

    const article = screen.getByRole('article');
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

    const animatedElements = article.querySelectorAll('.animate-bounce');
    expect(animatedElements.length).toBeGreaterThan(0);
  });

  it('processes video tags in bot messages', () => {
    const content =
      'Check out this video: [VIDEO:menu:example] and some more text';
    render(<Message content={content} isUser={false} isLoading={false} />);

    expect(
      screen.getByText(/Check out this video:/, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/and some more text/, { exact: false })
    ).toBeInTheDocument();

    const container = screen.getByRole('article').parentElement;
    expect(container).toHaveClass('justify-start');

    const article = screen.getByRole('article');
    expect(article).toHaveAttribute('data-screen-reader-text', content);

    const articleContent = article.textContent;
    if (!articleContent.includes('[VIDEO:menu:example]')) {
      const videoDivs = article.querySelectorAll('.max-w-[250px]');
      expect(videoDivs.length).toBeGreaterThan(0);
    }
  });
});
