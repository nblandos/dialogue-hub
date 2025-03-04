import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../../../pages/home/HomePage';
import { popularOrders } from '../../../pages/home/homeData';

vi.mock('../../../components/common/VideoContainer', () => ({
  default: ({ name, videoUrl }) => (
    <div data-testid={`video-${name}`} data-url={videoUrl}>
      {name} Video
    </div>
  ),
}));

describe('HomePage', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
  };

  it('displays all popular orders from data', () => {
    renderComponent();
    popularOrders.forEach((order) => {
      const videoElement = screen.getByTestId(`video-${order.name}`);
      expect(videoElement).toBeInTheDocument();
      expect(videoElement).toHaveAttribute('data-url', order.video);
    });
  });
});
