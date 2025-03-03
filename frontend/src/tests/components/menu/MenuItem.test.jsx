import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MenuItem from '../../../components/menu/MenuItem';

// Mock the VideoContainer component to simplify tests
vi.mock('../../../components/common/VideoContainer', () => ({
  default: ({ name, videoUrl }) => (
    <div data-testid="video-container" data-name={name} data-url={videoUrl}>
      Video Container Mock
    </div>
  ),
}));

describe('MenuItem', () => {
  const defaultProps = {
    name: 'Test Coffee',
    video: 'https://example.com/video',
  };

  it('renders the name correctly', () => {
    render(<MenuItem {...defaultProps} />);
    expect(screen.getByText('Test Coffee')).toBeInTheDocument();
  });

  it('renders the name and price when price is provided', () => {
    render(<MenuItem {...defaultProps} price="£3.50" />);
    expect(screen.getByText('Test Coffee')).toBeInTheDocument();
    expect(screen.getByText('(£3.50)')).toBeInTheDocument();
  });

  it('does not render price when not provided', () => {
    render(<MenuItem {...defaultProps} />);
    expect(screen.queryByText(/\(.*\)/)).not.toBeInTheDocument();
  });

  it('renders the VideoContainer with correct props', () => {
    render(<MenuItem {...defaultProps} />);
    const videoContainer = screen.getByTestId('video-container');
    expect(videoContainer).toBeInTheDocument();
    expect(videoContainer).toHaveAttribute('data-name', 'Test Coffee');
    expect(videoContainer).toHaveAttribute(
      'data-url',
      'https://example.com/video'
    );
  });

  it('applies hover transformation when mouse enters and leaves', () => {
    const { container } = render(<MenuItem {...defaultProps} />);
    const menuItem = container.firstChild;

    expect(menuItem).toHaveStyle('transform: scale(1)');

    fireEvent.mouseEnter(menuItem);
    expect(menuItem).toHaveStyle('transform: scale(1.05)');

    fireEvent.mouseLeave(menuItem);
    expect(menuItem).toHaveStyle('transform: scale(1)');
  });
});
