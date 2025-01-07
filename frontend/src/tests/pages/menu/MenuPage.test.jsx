import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MenuPage from '../../../pages/menu/MenuPage';

describe('MenuPage', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <MenuPage />
      </BrowserRouter>
    );
  };

  it('renders without crashing', () => {
    renderComponent();
    expect(screen.getByText('Menu Page')).toBeInTheDocument();
  });

  it('renders a heading', () => {
    renderComponent();
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});