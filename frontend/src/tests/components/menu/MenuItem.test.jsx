import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MenuItem from '../../../components/menu/MenuItem';

describe('MenuItem', () => {
  it('renders the name and price', () => {
    render(<MenuItem name="Test Coffee" price="£2.50" video="https://example.com" />);
    expect(screen.getByText('Test Coffee')).toBeInTheDocument();
    expect(screen.getByText('(£2.50)')).toBeInTheDocument();
  });

  it('sets the iframe src to the provided video link', () => {
    const testUrl = 'https://www.youtube.com/embed/TEST?enablejsapi=1';
    render(<MenuItem name="Video Test" price="£1.00" video={testUrl} />);
    const iframe = screen.getByTitle('Video Test');
    expect(iframe.getAttribute('src')).toBe(testUrl);
  });

  it('sends play command on mouse over', () => {
    // mock contentWindow.postMessage method
    const postMessageMock = vi.fn();
    Object.defineProperty(window.HTMLIFrameElement.prototype, 'contentWindow', {
      writable: true,
      value: { postMessage: postMessageMock },
    });

    render(<MenuItem name="Hover Test" price="£2.00" video="https://example.com" />);
    const iframe = screen.getByTitle('Hover Test');
    fireEvent.mouseOver(iframe);
    expect(postMessageMock).toHaveBeenCalledWith(
      '{"event":"command","func":"playVideo","args":""}',
      '*'
    );
  });

  it('sends pause command on mouse out', () => {
    const postMessageMock = vi.fn();
    Object.defineProperty(window.HTMLIFrameElement.prototype, 'contentWindow', {
      writable: true,
      value: { postMessage: postMessageMock },
    });

    render(<MenuItem name="Hover Test" price="£2.00" video="https://example.com" />);
    const iframe = screen.getByTitle('Hover Test');
    fireEvent.mouseOut(iframe);
    expect(postMessageMock).toHaveBeenCalledWith(
      '{"event":"command","func":"pauseVideo","args":""}',
      '*'
    );
  });
});