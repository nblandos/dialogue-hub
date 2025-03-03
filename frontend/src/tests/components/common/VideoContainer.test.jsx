import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VideoContainer from '../../../components/common/VideoContainer';

describe('VideoContainer', () => {
  const defaultProps = {
    name: 'Test Video',
    videoUrl: 'https://example.com/video',
    className: 'custom-class',
  };

  const setupPostMessageMock = () => {
    const postMessageMock = vi.fn();
    Object.defineProperty(HTMLIFrameElement.prototype, 'contentWindow', {
      writable: true,
      value: { postMessage: postMessageMock },
    });
    return postMessageMock;
  };

  it('renders iframe with correct src', () => {
    render(<VideoContainer {...defaultProps} />);
    const iframe = screen.getByTitle('Test Video');
    expect(iframe).toBeInTheDocument();
    expect(iframe.getAttribute('src')).toBe(
      'https://example.com/video?enablejsapi=1&mute=1'
    );
  });

  it('appends parameters correctly to URLs with existing parameters', () => {
    render(
      <VideoContainer
        {...defaultProps}
        videoUrl="https://example.com/video?autoplay=1"
      />
    );
    const iframe = screen.getByTitle('Test Video');
    expect(iframe.getAttribute('src')).toBe(
      'https://example.com/video?autoplay=1&enablejsapi=1&mute=1'
    );
  });

  it('handles empty video URL gracefully', () => {
    render(<VideoContainer {...defaultProps} videoUrl="" />);
    const iframe = screen.getByTitle('Test Video');
    expect(iframe.getAttribute('src')).toBe('');
  });

  it('sends play/pause commands on mouse events', () => {
    const postMessageMock = setupPostMessageMock();
    const { container } = render(<VideoContainer {...defaultProps} />);

    const videoContainer = container.querySelector('.video-container');

    fireEvent.mouseEnter(videoContainer);
    expect(postMessageMock).toHaveBeenCalledWith(
      '{"event":"command","func":"playVideo","args":""}',
      '*'
    );

    fireEvent.mouseLeave(videoContainer);
    expect(postMessageMock).toHaveBeenCalledWith(
      '{"event":"command","func":"pauseVideo","args":""}',
      '*'
    );
  });

  it('applies optional styling properties', () => {
    const { container } = render(
      <VideoContainer
        {...defaultProps}
        enableHoverEnlarge={true}
        maxHeight="300px"
      />
    );

    const videoContainer = container.querySelector('.video-container');

    expect(videoContainer).toHaveStyle({
      transform: 'scale(1)',
      maxHeight: '300px',
    });

    fireEvent.mouseEnter(videoContainer);
    expect(videoContainer).toHaveStyle({
      transform: 'scale(1.05)',
    });
  });
});
