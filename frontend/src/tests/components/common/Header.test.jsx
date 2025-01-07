import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../../components/common/Header';

describe('Header', () => {
  const renderHeader = () => {
    return render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
  };

  it('renders navigation bar', () => {
    renderHeader();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('displays logo text', () => {
    renderHeader();
    expect(screen.getByText('Dialogue Cafe')).toBeInTheDocument();
  });

  it('contains all navigation links', () => {
    renderHeader();
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('has correct navigation text content', () => {
    renderHeader();
    expect(screen.getByText('Book')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('uses correct routing paths', () => {
    renderHeader();
    const [homeLink, menuLink] = screen.getAllByRole('link');
    expect(homeLink).toHaveAttribute('href', '/');
    expect(menuLink).toHaveAttribute('href', '/menu');
  });
});